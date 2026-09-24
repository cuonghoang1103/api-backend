/**
 * Docker — Chương 15 (MỚI 09/2026): Nâng cao — build, bảo mật & vượt khỏi một máy.
 * BuildKit nâng cao · rootless/userns-remap/Podman · Docker Swarm · từ Compose tới Kubernetes · quiz.
 * LUẬT: backtick → &#96;; ${ → &#36;{; < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>.
 * KHÔNG dùng <svg>. Gạch chéo ngược PHẢI viết đôi (\\), xem scripts/course-content-check.mjs.
 *
 * Output CHẠY THẬT 24/09/2026 trên Docker Desktop 4.91 / Engine 29.8 (Mac M1, arm64, buildx 0.37) và Docker
 * Engine 29.6 (Fedora 44, amd64, user thường không sudo). Swarm một nút chạy trên máy Mac sau khi kiểm
 * LocalNodeState = inactive, xong thì leave --force. Kubernetes = kind 0.33 (kindest/node v1.37.0) + kubectl 1.34,
 * kubeconfig riêng. Podman 5.8.7 và Docker rootless chạy LỒNG trong container (quay.io/podman/stable,
 * docker:29-dind-rootless) — không cài, không đổi cấu hình dockerd nào. Tên thật trong lúc đo mang tiền tố dk15-.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 15 — Advanced: builds, security & beyond one host|||Chương 15 — Nâng cao: build, bảo mật & vượt khỏi một máy',
  description: 'Khi một lệnh docker build và một máy chủ không còn đủ: builder BuildKit riêng, dựng đa nền tảng bằng máy thật, bake, bí mật và khoá SSH lúc build, SBOM/provenance; rootless, userns-remap và Podman; Docker Swarm; và con đường từ Compose tới Kubernetes — kèm câu trả lời thật thà khi nào KHÔNG cần nó.',
  lessons: [
    /* ─────────────────────────── 15.0 ─────────────────────────── */
    {
      title: '15.0 — Chapter 15 slides: beyond one command, one user, one host|||15.0 — Slide Chương 15: vượt khỏi một lệnh, một người, một máy',
      slug: 'dk-15-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 29 slide của Chương 15: builder docker-container gắn thêm máy Linux thật, giả lập chậm gấp 3, bake, --secret không làm vỡ cache, --ssh, # check=error=true, SBOM/provenance; nhóm docker = root, rootless, userns-remap, Podman; Swarm tự lành và cập nhật cuốn chiếu; Compose ↔ Kubernetes, kind, Kompose và khi nào không cần K8s.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Slides</span>
<h2>The whole chapter in 29 slides</h2>
<p class="lead">Everything so far has fitted on one laptop or one VPS: one person runs <code>docker build</code>, one daemon runs the containers. This chapter is about the moment that stops being enough — the image must run on two CPU architectures, the build needs a private token, several people share one Linux server, or one machine is no longer allowed to be a single point of failure.</p>
<p>Slides 3–8 belong to Lesson 15.1 (BuildKit beyond the basics), 9–14 to 15.2 (deeper security: root, rootless, Podman), 15–20 to 15.3 (Docker Swarm) and 21–26 to 15.4 (from Compose to Kubernetes). The last three are the chapter's common mistakes, a cheat sheet and a 45-minute practice session. Every terminal on the slides is real output recorded on 24 September 2026: a Mac M1 with Docker Desktop 4.91 and a Linux machine (Fedora, Docker Engine 29.6, amd64) that joined the Mac's builder as a native amd64 node. The swarm and the Kubernetes cluster were created for the chapter and deleted afterwards.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Slide</span>
<h2>Cả chương trong 29 slide</h2>
<p class="lead">Tới giờ mọi thứ đều nằm gọn trong một laptop hoặc một VPS: một người gõ <code>docker build</code>, một daemon (tiến trình nền) chạy các container. Chương này nói về lúc điều đó không còn đủ nữa — ảnh phải chạy trên hai kiến trúc CPU, bản dựng cần một token riêng tư, nhiều người dùng chung một server Linux, hoặc một máy không được phép là điểm chết duy nhất của cả hệ thống.</p>
<p>Slide 3–8 thuộc Bài 15.1 (BuildKit vượt mức cơ bản), 9–14 thuộc 15.2 (bảo mật sâu hơn: root, rootless, Podman), 15–20 thuộc 15.3 (Docker Swarm) và 21–26 thuộc 15.4 (từ Compose tới Kubernetes). Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi ngày 24/09/2026: một máy Mac M1 chạy Docker Desktop 4.91 và một máy Linux (Fedora, Docker Engine 29.6, amd64) được gắn vào builder của máy Mac làm node amd64 thật. Cụm Swarm và cụm Kubernetes đều được dựng riêng cho chương rồi xoá đi.</p>
</div>
${gallery('dk-15', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Builder riêng, gắn thêm máy thật'], [4, 'Giả lập chậm gấp ~3 lần'], [5, 'bake: một file HCL'],
  [6, '--secret: dùng được, không nằm lại'], [7, '--ssh và # check=error=true'], [8, 'Attestation: SBOM + provenance'],
  [9, 'Nhóm docker = root'], [10, 'Rootless: root trong = uid 1000 ngoài'], [11, 'Rootless và userns-remap đổi lấy gì'],
  [12, 'seccomp và --cap-drop ALL'], [13, 'Podman: không daemon, có pod'], [14, 'Chọn gì khi nào'],
  [15, 'swarm init: một máy thành cụm'], [16, 'service và routing mesh'], [17, 'Swarm tự dựng lại task'],
  [18, 'Cập nhật cuốn chiếu và rollback'], [19, 'Secret của Swarm'], [20, 'stack deploy bỏ qua những gì'],
  [21, 'Compose ↔ Kubernetes'], [22, 'kind: cụm K8s trong một container'], [23, 'Deployment + Service'],
  [24, 'Tự lành, rollout, Secret base64'], [25, 'Kompose và ba cái hố'], [26, 'Khi nào KHÔNG cần Kubernetes'],
  [27, 'Sai lầm hay gặp'], [28, 'Bảng tra nhanh'], [29, 'Thực hành chương 15'],
])}
`,
    },
    /* ─────────────────────────── 15.1 ─────────────────────────── */
    {
      title: '15.1 — BuildKit beyond the basics: builders, native multi-platform, bake, secrets|||15.1 — BuildKit nâng cao: builder riêng, đa nền tảng, bake, bí mật lúc build',
      slug: 'dk-15-1-buildx-bake',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Builder docker-container và node từ xa qua ssh://, đo giả lập so với máy amd64 thật, docker-bake.hcl cho nhiều ảnh, --secret (env/file) và cái bẫy cache, --ssh, # check=error=true, SBOM và provenance đọc bằng imagetools.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1</span>
<h2>BuildKit beyond the basics</h2>
<p class="lead">Chapter 3 built an image for two architectures with one command, Chapter 5 made builds fast with cache, Chapter 6 attached an SBOM in passing. What they left out is what happens when a project grows: the arm64 half of the build takes three times longer because it is emulated, the build command has grown to eight flags that everyone types differently, a private npm token must reach <code>npm ci</code> without ending up in the image, and someone asks "what exactly is inside the image we shipped last Tuesday?". This lesson answers all four with real measurements.</p>
<p>Nothing here replaces what you already know — it is the same BuildKit, driven more deliberately. Where Chapter 3, 5 or 6 already explained something, this lesson points back instead of repeating it.</p>

<h3>A builder of your own: the docker-container driver</h3>
${slide('dk-15', 3, 'Builder riêng: BuildKit trong container, gắn thêm máy thật')}
<p>Every <code>docker build</code> goes through a <em>builder</em>. By default it is the one called <code>desktop-linux</code> (or <code>default</code> on Linux), using the <code>docker</code> driver: BuildKit embedded inside the Docker daemon. It is convenient and, with Docker 29's containerd image store, it can already build multi-platform images (Lesson 3.4). A <code>docker-container</code> builder runs BuildKit in a container of its own instead:</p>
<pre><code class="language-bash">docker buildx create --name dk15-builder --driver docker-container
docker buildx inspect dk15-builder --bootstrap | head -12</code></pre>
<div class="out">dk15-builder
#1 [internal] booting buildkit
#1 pulling image moby/buildkit:buildx-stable-1
#1 creating container buildx_buildkit_dk15-builder0
#1 DONE 2.5s
Name:          dk15-builder
Driver:        docker-container
…
BuildKit version:      v0.32.2
Platforms:             linux/arm64, linux/amd64, linux/amd64/v2, linux/riscv64, linux/ppc64le, linux/s390x, linux/386, linux/arm/v7, linux/arm/v6</div>
<table>
<tr><th></th><th><code>docker</code> driver (default)</th><th><code>docker-container</code> driver</th></tr>
<tr><td>Where BuildKit runs</td><td>inside dockerd</td><td>in its own container <code>buildx_buildkit_&lt;name&gt;0</code></td></tr>
<tr><td>BuildKit version</td><td>whatever the daemon ships</td><td>any image you choose (<code>--driver-opt image=…</code>)</td></tr>
<tr><td>Cache</td><td>shared with the daemon</td><td>its own, in a volume <code>…_state</code>; removed with the builder</td></tr>
<tr><td>Result</td><td>lands in <code>docker images</code> automatically</td><td>stays in the build cache unless you say <code>--load</code> or <code>--push</code></td></tr>
<tr><td>Extra nodes on other machines</td><td>no</td><td>yes — <code>--append</code></td></tr>
<tr><td>Cache export modes (<code>mode=max</code>, registry cache)</td><td>limited</td><td>all of them (Lesson 5.4)</td></tr>
</table>
<p>The "result stays in the cache" row trips everyone up once. Building with the new builder without an output prints exactly this warning:</p>
<div class="out">WARNING: No output specified with docker-container driver. Build result will only remain in the build cache. To push result image into registry use --push or to load image into docker use --load</div>

<h3>Emulation versus a real amd64 machine, measured</h3>
${slide('dk-15', 4, 'Giả lập chậm gấp ~3 lần — một node amd64 thật thì không')}
<p>Lesson 3.4 showed that a Mac can build an amd64 image by emulating the CPU. What it costs depends on what the build does. A small Dockerfile whose second step installs a C compiler (<code>RUN apk add --no-cache gcc musl-dev</code>), built with <code>--no-cache</code> for one platform at a time on the course Mac:</p>
<table>
<tr><th>Platform</th><th>How it ran</th><th><code>apk add gcc musl-dev</code></th></tr>
<tr><td>linux/arm64</td><td>native on the M1</td><td>28.9 s</td></tr>
<tr><td>linux/amd64</td><td>emulated inside the Docker Desktop VM</td><td>96.1 s</td></tr>
<tr><td>linux/amd64</td><td>native, on the Linux machine at home</td><td>20.2 s</td></tr>
</table>
<p>Most of the arm64 time is downloading packages; the emulated run downloads the same packages and then spends another minute executing every install script through a translated CPU. <code>COPY</code> steps are not affected at all; <code>RUN</code> steps that execute programs (package installs, <code>npm ci</code> with native modules, compilers) are.</p>
<p>The fix is to let each platform be built by a machine that has that CPU. A <code>docker-container</code> builder can have several <em>nodes</em>, and a node can be any Docker engine you can reach — including one over SSH, using the host alias from <code>~/.ssh/config</code>:</p>
<pre><code class="language-bash">docker buildx create --name dk15-builder --append \\
  --node dk15-nha --platform linux/amd64 ssh://linux-nha
docker buildx ls</code></pre>
<div class="out">NAME/NODE           DRIVER/ENDPOINT       STATUS    BUILDKIT   PLATFORMS
dk15-builder        docker-container
 \\_ dk15-builder0    \\_ desktop-linux     running   v0.32.2    linux/amd64 (+2), linux/arm64, linux/arm (+2), linux/ppc64le, (3 more)
 \\_ dk15-nha         \\_ ssh://linux-nha   running   v0.32.2    linux/amd64* (+3), linux/386</div>
<p>The asterisk on <code>linux/amd64*</code> means "set by the user": buildx now sends amd64 work to that node and everything else to the Mac. The first <code>inspect --bootstrap</code> after appending ended in <code>DeadlineExceeded</code> — the remote node was still pulling the BuildKit image; a few seconds later it was <code>running</code>. Then one build for both platforms:</p>
<pre><code class="language-bash">docker buildx build --builder dk15-builder --no-cache \\
  --platform linux/amd64,linux/arm64 -t dk15-hash:1 --load .
docker image ls --tree dk15-hash:1
docker run --rm --platform linux/amd64 dk15-hash:1</code></pre>
<div class="out">#10 [linux/amd64 build 2/4] RUN apk add --no-cache gcc musl-dev
#10 DONE 20.2s
#11 [linux/arm64 build 2/4] RUN apk add --no-cache gcc musl-dev
#11 DONE 23.6s
#18 exporting manifest list sha256:9efd3eb6f3c37b96e48b67bec6571d369107a0d61062045fdc6f1a681bea5907 done
IMAGE                ID             DISK USAGE   CONTENT SIZE   EXTRA
dk15-hash:1          9efd3eb6f3c3       17.2MB         7.93MB
├─ linux/amd64       5da75715fb2d        3.8MB          3.8MB
└─ linux/arm64       ec5c614cc326       13.4MB         4.13MB
arch=x86_64 hash=7499008179331740677</div>
<p>28 seconds for both platforms, in parallel, with no emulation anywhere — and the two binaries compute the same hash, which is the point. This is exactly how the "build at home" pipeline of a student project could stop emulating its amd64 half: the Mac keeps building arm64, the Linux box builds amd64. In CI the same idea is "one runner per architecture" (GitHub now has ARM runners), merged into one index; the course <code>/courses/github-actions</code> shows the workflow.</p>
<div class="callout warn"><strong>Leaving a node does not clean the remote machine.</strong> <code>docker buildx create --name dk15-builder --leave --node dk15-nha</code> removes the node from the builder's list, but the container <code>buildx_buildkit_dk15-nha</code> and its volume <code>…_state</code> keep running on the Linux machine — measured. Remove the whole builder with <code>docker buildx rm dk15-builder</code> while the node is still attached, or clean the remote side by name afterwards.</div>

<h3>bake: one file instead of a long build command per image</h3>
${slide('dk-15', 5, 'bake: một file HCL thay cho nhiều lệnh build dài')}
<p>A real project has several images — API, web, a worker — each with its own context, tags, platforms and build arguments. Written as shell commands, those settings drift between a teammate's notes, the README and CI. <code>docker buildx bake</code> reads them from a file, <code>docker-bake.hcl</code>, and builds every target in parallel:</p>
<pre><code class="language-hcl">variable "TAG" {
  default = "dev"
}
variable "REGISTRY" {
  default = "localhost:18150"
}

group "default" {
  targets = ["api", "web"]
}

target "_common" {
  platforms = ["linux/amd64", "linux/arm64"]
  labels    = { "dkhoc" = "15" }
}

target "api" {
  inherits = ["_common"]
  context  = "api"
  tags     = ["&#36;{REGISTRY}/dk15-api:&#36;{TAG}"]
}

target "web" {
  inherits = ["_common"]
  context  = "web"
  args     = { APP_VERSION = TAG }
  tags     = ["&#36;{REGISTRY}/dk15-web:&#36;{TAG}"]
}</code></pre>
<table>
<tr><th>Block</th><th>Meaning</th></tr>
<tr><td><code>variable "TAG"</code></td><td>A value with a default; an environment variable of the same name overrides it (<code>TAG=1.0 docker buildx bake</code>)</td></tr>
<tr><td><code>group "default"</code></td><td>What <code>docker buildx bake</code> builds when you name no target</td></tr>
<tr><td><code>target "_common"</code></td><td>A template; the leading underscore is only a convention for "not built on its own"</td></tr>
<tr><td><code>inherits</code></td><td>Copy every attribute of another target, then override</td></tr>
<tr><td><code>context</code>, <code>args</code>, <code>tags</code>, <code>platforms</code></td><td>Exactly the build context, <code>--build-arg</code>, <code>-t</code> and <code>--platform</code> of <code>docker build</code></td></tr>
</table>
<p>Before trusting a bake file, ask it what it resolved to. <code>--print</code> builds nothing:</p>
<pre><code class="language-bash">TAG=1.0 docker buildx bake --print web</code></pre>
<div class="out">      "args": {
        "APP_VERSION": "1.0"
      },
…
      "tags": [
        "localhost:18150/dk15-web:1.0"
      ],</div>
<p>Then the real thing — two targets, two platforms each, loaded into the local image store, and <code>--check</code> for both Dockerfiles in one go:</p>
<pre><code class="language-bash">TAG=1.0 docker buildx bake --builder dk15-builder --load
docker buildx bake --builder dk15-builder --check</code></pre>
<div class="out">api
Check complete, no warnings found.
web
Check complete, no warnings found.</div>
<p>The build took 25 seconds for four image variants. In CI the same file is used by the official <code>docker/bake-action</code>, so the settings live in one place.</p>

<h3>Build secrets, one step further than Chapter 4</h3>
${slide('dk-15', 6, '--secret: dùng được trong RUN, không nằm lại trong ảnh')}
<p>Chapter 4 introduced <code>--secret id=npmrc,src=…</code> with <code>RUN --mount=type=secret</code>. Two more forms are worth knowing: a secret taken from an <em>environment variable</em> of your shell, and a secret exposed to the <code>RUN</code> step <em>as</em> an environment variable rather than a file:</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM alpine:3.22
RUN --mount=type=secret,id=npm_token,env=NPM_TOKEN \\
    echo "token dai &#36;{#NPM_TOKEN} ky tu, 4 ky tu dau: &#36;{NPM_TOKEN%&#36;{NPM_TOKEN#????}}"
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \\
    ls -l /root/.npmrc &amp;&amp; echo "(dung .npmrc de tai goi rieng)"</code></pre>
<pre><code class="language-bash">export NPM_TOKEN=npm_SECRETdk15xyz
docker buildx build --builder dk15-builder \\
  --secret id=npm_token,env=NPM_TOKEN \\
  --secret id=npmrc,src=./npmrc \\
  -t dk15-sec:1 --load --progress=plain .</code></pre>
<div class="out">#7 0.037 token dai 17 ky tu, 4 ky tu dau: npm_
#8 0.046 -r--------    1 root     root            51 Sep 24 01:09 /root/.npmrc
#8 0.047 (dung .npmrc de tai goi rieng)</div>
<p>Both forms work inside their step. Now prove the image does not keep them — not by trusting the documentation, but by looking in three places: the history, the filesystem of a container, and every byte of the saved image:</p>
<pre><code class="language-bash">docker history --no-trunc --format '{{.CreatedBy}}' dk15-sec:1 | head -2
docker run --rm dk15-sec:1 ls -l /root/
docker save dk15-sec:1 -o sec.tar &amp;&amp; mkdir x &amp;&amp; tar -xf sec.tar -C x
for f in $(find x -type f); do (gzip -dc $f 2&gt;/dev/null || cat $f) | grep -c SECRETdk15; done | sort | uniq -c</code></pre>
<div class="out">RUN /bin/sh -c ls -l /root/.npmrc &amp;&amp; echo "(dung .npmrc de tai goi rieng)" # buildkit
RUN /bin/sh -c echo "token dai &#36;{#NPM_TOKEN} ky tu, 4 ky tu dau: &#36;{NPM_TOKEN%&#36;{NPM_TOKEN#????}}" # buildkit
total 0
   5 0</div>
<p>The history records the <em>command</em> (with the variable name, not its value), <code>/root</code> is empty, and none of the five files in the saved image contains the token. Compare with <code>--build-arg NPM_TOKEN=…</code>, which Chapter 4 showed printed in plain text by <code>docker history</code>.</p>
<div class="pitfall co-tieu-de"><strong>Changing the secret does not invalidate the cache.</strong> Run the same build again with <code>NPM_TOKEN=npm_OTHERvalue999</code> and both steps print <code>CACHED</code> — measured. Secrets are deliberately left out of the cache key, so they never leak through it. The consequence: rotate an expired token and the step that used it does not run again; if it downloaded private packages, you keep the old result. When a secret change must re-run a step, add <code>--no-cache-filter &lt;stage&gt;</code> for that stage, or put an <code>ARG TOKEN_VERSION</code> right before the step and bump it.</div>

<h3>--ssh: lend the build your SSH agent, not your key</h3>
${slide('dk-15', 7, '--ssh cho mượn khoá qua agent; --check chặn Dockerfile ẩu')}
<p>Some builds must <code>git clone</code> a private repository or <code>npm install</code> a dependency from <code>git+ssh://</code>. Copying the private key into the image is the classic leak. <code>RUN --mount=type=ssh</code> forwards only the <em>socket</em> of an ssh-agent for the duration of one step. To show it without touching the real agent, the course used a throw-away key in a separate agent started in the scratch folder:</p>
<pre><code class="language-bash">ssh-keygen -q -t ed25519 -N '' -C dk15-deploy-key -f ./dk15_key
eval $(ssh-agent -a agent.sock) &amp;&amp; ssh-add ./dk15_key
docker buildx build --builder dk15-builder --ssh default=agent.sock -t dk15-ssh:1 --load --progress=plain .</code></pre>
<pre><code class="language-dockerfile">RUN apk add --no-cache openssh-client
RUN --mount=type=ssh echo "SSH_AUTH_SOCK=$SSH_AUTH_SOCK" &amp;&amp; ssh-add -l
RUN ssh-add -l; echo "exit=$?"</code></pre>
<div class="out">#8 0.032 SSH_AUTH_SOCK=/run/buildkit/ssh_agent.0
#8 0.037 256 SHA256:IRy0eqGz6kFj3s1xMfKHihzcTAvG2YozdtqSPg6DsZ8 dk15-deploy-key (ED25519)
#9 0.033 Could not open a connection to your authentication agent.
#9 0.033 exit=2</div>
<p>Step 8 sees the key's fingerprint through the forwarded socket; step 9, without the mount, sees nothing; and the finished image has no <code>SSH_AUTH_SOCK</code> and no <code>/run/buildkit</code>. One real accident on the way is worth telling: the first attempt used an absolute socket path in the long scratch folder, macOS refused it (<em>"too long for Unix domain socket"</em>), <code>ssh-agent</code> did not start, and <code>ssh-add</code> silently added the test key to the user's <em>everyday</em> agent instead — it had to be removed with <code>ssh-add -d</code>. When a command's first line fails, stop before running the second.</p>

<h3>Turning build checks into a gate</h3>
<p>Lesson 5.5 introduced <code>docker build --check</code>. Two directives at the top of a Dockerfile make it strict for everyone, without anyone remembering a flag:</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
# check=skip=JSONArgsRecommended;error=true
FROM alpine:3.22 as base
ENV APP_ENV production
CMD node server.js</code></pre>
<pre><code class="language-bash">docker build --builder dk15-builder --check . ; echo "exit=$?"</code></pre>
<div class="out">Check complete, 2 warnings have been found!
WARNING: FromAsCasing - https://docs.docker.com/go/dockerfile/rule/from-as-casing/
WARNING: LegacyKeyValueFormat - https://docs.docker.com/go/dockerfile/rule/legacy-key-value-format/
ERROR: lint violation found for rules: FromAsCasing, LegacyKeyValueFormat
exit=1</div>
<p><code>error=true</code> makes a normal <code>docker build</code> fail too (without it the same warnings scroll past); <code>skip=</code> silences a rule the team decided to accept — here <code>JSONArgsRecommended</code>, which is why only two of the three problems are reported. After fixing <code>AS</code> and <code>ENV APP_ENV=production</code> the result is <code>Check complete, no warnings found.</code> and exit 0.</p>

<h3>Attestations you can actually read: SBOM and provenance</h3>
${slide('dk-15', 8, 'Attestation: SBOM và provenance đi KÈM ảnh')}
<p>Lesson 6.5 showed the flags and generated an SBOM with Trivy. Here BuildKit generates both attestations itself and we read them back from a registry (a local <code>registry:2</code> on port 18150):</p>
<pre><code class="language-bash">docker buildx build --builder dk15-builder --platform linux/amd64,linux/arm64 \\
  --attest type=sbom --attest type=provenance,mode=max \\
  --build-arg APP_VERSION=1.1 -t localhost:18150/dk15-web:1.1 --load web
docker push -q localhost:18150/dk15-web:1.1
docker buildx imagetools inspect localhost:18150/dk15-web:1.1 --format '{{json .SBOM}}' &gt; sbom.json
jq -r '."linux/amd64".SPDX.packages | length' sbom.json
jq -r '."linux/amd64".SPDX.packages[] | select(.name|test("^(nginx|libssl3|busybox|musl|curl)&#36;")) | "\\(.name) \\(.versionInfo)"' sbom.json</code></pre>
<div class="out">#17 [linux/amd64] generating sbom using docker.io/docker/buildkit-syft-scanner:stable-1
localhost:18150/dk15-web:1.1
69
busybox 1.37.0-r12
curl 8.12.1-r1
libssl3 3.3.3-r0
musl 1.2.5-r9
nginx 1.27.5-r1</div>
<pre><code class="language-bash">docker buildx imagetools inspect localhost:18150/dk15-web:1.1 --format '{{json .Provenance}}' &gt; prov.json
jq -r '."linux/amd64".SLSA.buildDefinition.resolvedDependencies[] | "\\(.uri) \\(.digest.sha256[0:12])"' prov.json
jq -r '."linux/amd64".SLSA.buildDefinition.internalParameters.builderPlatform' prov.json</code></pre>
<div class="out">pkg:docker/docker/buildkit-syft-scanner@stable-1?platform=linux%2Farm64 ae4f3b554449
pkg:docker/docker/dockerfile@1 ecfaec9ed6d8
pkg:docker/nginx@1.27-alpine?platform=linux%2Famd64 65645c7bb6a0
linux/arm64</div>
<p>The SBOM answers "which OpenSSL did we ship?" without rebuilding or rescanning (<code>libssl3 3.3.3-r0</code>). The provenance answers "how was it built?": the exact digest of the base image behind the moving tag <code>nginx:1.27-alpine</code>, the Dockerfile frontend, the build arguments (<code>build-arg:APP_VERSION: 1.1</code>) and that it was built on an arm64 machine for amd64. <code>mode=max</code> includes the full build request; the default <code>mode=min</code> keeps less. Both sit in the index as the <code>unknown/unknown</code> entries Lesson 3.4 met — <code>docker pull</code> ignores them.</p>

<h3>Try it step by step</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · a builder of your own</span><span class="lz-t">docker buildx create --name mybuilder --driver docker-container --bootstrap</span><span class="lz-d">docker ps shows a buildx_buildkit_mybuilder0 container.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · measure emulation</span><span class="lz-t">time docker buildx build --builder mybuilder --no-cache --platform linux/amd64 -o type=cacheonly .</span><span class="lz-d">Repeat with linux/arm64 on an Apple Silicon Mac; compare the RUN steps.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · one bake file</span><span class="lz-t">docker buildx bake --print</span><span class="lz-d">Check the resolved tags and args before building anything.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · a secret that leaves no trace</span><span class="lz-t">docker buildx build --secret id=tok,env=TOK …</span><span class="lz-d">docker save … | grep -c your-token must print 0 for every file.</span></div>
  <div class="lz-step"><span class="lz-k">Step 5 · clean up</span><span class="lz-t">docker buildx rm mybuilder</span><span class="lz-d">Removes the builder container and its cache volume.</span></div>
</div>

<h3>When to reach for these — and when not</h3>
<table>
<tr><th>Tool</th><th>Worth it when…</th><th>Not needed when…</th></tr>
<tr><td><code>docker-container</code> builder</td><td>you need cache export modes, a newer BuildKit, or remote nodes</td><td>one developer, one platform, default builder is fast enough</td></tr>
<tr><td>Native nodes per platform</td><td>RUN steps are heavy and you ship both amd64 and arm64</td><td>the image is <code>COPY</code> + a prebuilt binary; emulation costs seconds</td></tr>
<tr><td><code>bake</code></td><td>two or more images, or the same build in CI and on laptops</td><td>one image with two flags</td></tr>
<tr><td><code>--secret</code> / <code>--ssh</code></td><td>any credential the build needs — always</td><td>never "not needed": the alternative is leaking</td></tr>
<tr><td>SBOM + provenance</td><td>you deploy images others must trust, or answer security questions later</td><td>throw-away images on your laptop</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your group's API must run on the school's amd64 server and on the M1 laptops, and it installs a private npm package with a token the teacher gave the team.</p><ol>
<li>In <code>~/thu-docker/buildx</code>, create a builder <code>nhom-builder</code> with the <code>docker-container</code> driver and bootstrap it.</li>
<li>Write a two-target <code>docker-bake.hcl</code> (api and web, a shared <code>_common</code> with both platforms) and check it with <code>--print</code>.</li>
<li>Pass a fake token with <code>--secret id=npm_token,env=NPM_TOKEN</code>, print only its length in a <code>RUN</code> step, and build with <code>--load</code>.</li>
<li>Prove the token is not in the image with <code>docker history</code> and <code>docker save</code> + <code>grep -c</code>. Then change the token and rebuild: note which steps say <code>CACHED</code>.</li>
<li>Remove the builder with <code>docker buildx rm nhom-builder</code>.</li></ol>
<p><strong>Done when:</strong> <code>docker image ls --tree</code> shows both platforms, every file of the saved image gives <code>0</code> for the token, you can explain why the second build was <code>CACHED</code>, and <code>docker ps -a</code> no longer lists <code>buildx_buildkit_nhom-builder0</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Builder</span><span class="v">The BuildKit instance a build runs on; <code>docker buildx ls</code> lists them, <code>*</code> marks the one in use.</span></div>
  <div class="kv"><span class="k">Driver</span><span class="v">How the builder runs: <code>docker</code> (inside dockerd), <code>docker-container</code>, <code>kubernetes</code>, <code>remote</code>.</span></div>
  <div class="kv"><span class="k">Node</span><span class="v">One BuildKit behind a builder; a builder with several nodes sends each platform to a matching one.</span></div>
  <div class="kv"><span class="k">Emulation</span><span class="v">Running another CPU's instructions through a translator (QEMU or Rosetta); correct but slow for RUN steps.</span></div>
  <div class="kv"><span class="k">Bake file</span><span class="v"><code>docker-bake.hcl</code>: targets, groups and variables describing several builds.</span></div>
  <div class="kv"><span class="k">Build secret</span><span class="v">A value mounted into one <code>RUN</code> step only, never written to a layer, and not part of the cache key.</span></div>
  <div class="kv"><span class="k">Attestation</span><span class="v">A signed-off statement attached to an image index: SBOM (what is inside) or provenance (how it was built).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A <code>docker-container</code> builder is BuildKit in its own container, with its own cache; add <code>--load</code> or <code>--push</code> or the result stays in the cache.</li>
<li>Emulated RUN steps were about three times slower (96 s vs 29 s); a real amd64 node over <code>ssh://</code> did the same step in 20 s.</li>
<li><code>docker-bake.hcl</code> keeps tags, platforms and args in one file; always look at <code>bake --print</code> first.</li>
<li><code>--secret</code> (as file or as env) and <code>--ssh</code> leave nothing in the image — but a changed secret does not re-run a cached step.</li>
<li><code># check=error=true</code> turns Dockerfile warnings into a failing build for the whole team.</li>
<li><code>--attest type=sbom</code> and <code>type=provenance,mode=max</code> attach what-is-inside and how-it-was-built to the image; read them with <code>imagetools inspect --format</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/builders/drivers/docker-container/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Docker container driver</span><span class="lc-sub">What the <code>docker-container</code> driver adds, its options, and how results are exported.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/multi-platform/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Multi-platform builds</span><span class="lc-sub">Emulation, multiple native nodes and cross-compilation, compared.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/bake/" target="_blank" rel="noopener">
  <span class="lc-ico">🍞</span>
  <span class="lc-body"><span class="lc-title">Bake</span><span class="lc-sub">Targets, groups, variables, inheritance — and the full file reference.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/secrets/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Build secrets</span><span class="lc-sub"><code>--secret</code> from files and environment variables, and SSH mounts.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/metadata/attestations/" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">Build attestations</span><span class="lc-sub">SBOM and provenance: how they are generated, stored and read.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab</span><span class="lc-sub">Docker exercises with automatic grading.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Build each platform on a machine that has that CPU when RUN steps are heavy — emulation is correct but slow. Credentials go through <code>--secret</code> and <code>--ssh</code>, and a changed secret does not bust the cache. One <code>docker-bake.hcl</code> plus attestations turns "how did we build this?" into a file you can read.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1</span>
<h2>BuildKit nâng cao</h2>
<p class="lead">Chương 3 đã dựng một ảnh cho hai kiến trúc bằng một lệnh, Chương 5 làm bản dựng nhanh nhờ cache, Chương 6 gắn SBOM kèm theo trong một đoạn ngắn. Phần chúng để lại là chuyện xảy ra khi dự án lớn dần: nửa arm64 của bản dựng mất gấp ba thời gian vì bị giả lập, lệnh build dài ra tám cờ mà mỗi người gõ một kiểu, một token npm riêng tư phải tới được <code>npm ci</code> mà không nằm lại trong ảnh, và ai đó hỏi "cái ảnh mình đem lên hôm thứ Ba tuần trước rốt cuộc chứa gì?". Bài này trả lời cả bốn câu, bằng số đo thật.</p>
<p>Không có gì ở đây thay thế điều bạn đã biết — vẫn là BuildKit đó, chỉ được điều khiển có chủ đích hơn. Chỗ nào Chương 3, 5 hay 6 đã giải thích rồi thì bài này trỏ về đó thay vì nói lại.</p>

<h3>Một builder của riêng mình: driver docker-container</h3>
${slide('dk-15', 3, 'Builder riêng: BuildKit trong container, gắn thêm máy thật')}
<p>Mọi lệnh <code>docker build</code> đều đi qua một <em>builder</em> (bộ dựng). Mặc định là builder tên <code>desktop-linux</code> (trên Linux là <code>default</code>), dùng driver (trình điều khiển) <code>docker</code>: BuildKit nằm ngay trong tiến trình Docker daemon. Nó tiện, và với kho ảnh containerd của Docker 29 thì nó đã dựng được ảnh đa nền tảng (Bài 3.4). Một builder <code>docker-container</code> thì chạy BuildKit trong một container riêng của nó:</p>
<pre><code class="language-bash">docker buildx create --name dk15-builder --driver docker-container
docker buildx inspect dk15-builder --bootstrap | head -12</code></pre>
<div class="out">dk15-builder
#1 [internal] booting buildkit
#1 pulling image moby/buildkit:buildx-stable-1
#1 creating container buildx_buildkit_dk15-builder0
#1 DONE 2.5s
Name:          dk15-builder
Driver:        docker-container
…
BuildKit version:      v0.32.2
Platforms:             linux/arm64, linux/amd64, linux/amd64/v2, linux/riscv64, linux/ppc64le, linux/s390x, linux/386, linux/arm/v7, linux/arm/v6</div>
<table>
<tr><th></th><th>Driver <code>docker</code> (mặc định)</th><th>Driver <code>docker-container</code></th></tr>
<tr><td>BuildKit chạy ở đâu</td><td>bên trong dockerd</td><td>trong container riêng <code>buildx_buildkit_&lt;tên&gt;0</code></td></tr>
<tr><td>Phiên bản BuildKit</td><td>daemon đi kèm bản nào dùng bản đó</td><td>ảnh nào bạn chọn (<code>--driver-opt image=…</code>)</td></tr>
<tr><td>Cache</td><td>dùng chung với daemon</td><td>của riêng nó, trong volume <code>…_state</code>; mất cùng builder</td></tr>
<tr><td>Kết quả</td><td>tự vào <code>docker images</code></td><td>chỉ nằm trong cache build, trừ khi bạn nói <code>--load</code> hoặc <code>--push</code></td></tr>
<tr><td>Thêm node ở máy khác</td><td>không</td><td>có — <code>--append</code></td></tr>
<tr><td>Các kiểu xuất cache (<code>mode=max</code>, cache lên registry)</td><td>hạn chế</td><td>đủ cả (Bài 5.4)</td></tr>
</table>
<p>Dòng "kết quả chỉ nằm trong cache" làm ai cũng vấp một lần. Dựng bằng builder mới mà không chỉ đầu ra thì nhận đúng cảnh báo này:</p>
<div class="out">WARNING: No output specified with docker-container driver. Build result will only remain in the build cache. To push result image into registry use --push or to load image into docker use --load</div>

<h3>Giả lập so với một máy amd64 thật, đo thật</h3>
${slide('dk-15', 4, 'Giả lập chậm gấp ~3 lần — một node amd64 thật thì không')}
<p>Bài 3.4 cho thấy máy Mac dựng được ảnh amd64 bằng cách giả lập (emulation) CPU. Cái giá phụ thuộc vào việc bản dựng làm gì. Một Dockerfile nhỏ có bước thứ hai cài trình biên dịch C (<code>RUN apk add --no-cache gcc musl-dev</code>), dựng với <code>--no-cache</code>, mỗi lần một nền tảng, trên máy Mac của khoá:</p>
<table>
<tr><th>Nền tảng</th><th>Chạy thế nào</th><th><code>apk add gcc musl-dev</code></th></tr>
<tr><td>linux/arm64</td><td>gốc (native) trên chip M1</td><td>28,9 giây</td></tr>
<tr><td>linux/amd64</td><td>giả lập trong máy ảo của Docker Desktop</td><td>96,1 giây</td></tr>
<tr><td>linux/amd64</td><td>gốc, trên máy Linux ở nhà</td><td>20,2 giây</td></tr>
</table>
<p>Phần lớn thời gian của arm64 là tải gói; lượt giả lập tải đúng những gói đó rồi mất thêm cả phút chạy từng script cài đặt qua một CPU được "phiên dịch". Bước <code>COPY</code> không hề bị ảnh hưởng; bước <code>RUN</code> nào chạy chương trình (cài gói, <code>npm ci</code> có mô-đun native, biên dịch) thì bị.</p>
<p>Cách chữa là để mỗi nền tảng được dựng bởi một máy có đúng CPU đó. Builder <code>docker-container</code> có thể có nhiều <em>node</em> (nút), và một node có thể là bất kỳ Docker Engine nào bạn với tới được — kể cả qua SSH, dùng tên máy khai trong <code>~/.ssh/config</code>:</p>
<pre><code class="language-bash">docker buildx create --name dk15-builder --append \\
  --node dk15-nha --platform linux/amd64 ssh://linux-nha
docker buildx ls</code></pre>
<div class="out">NAME/NODE           DRIVER/ENDPOINT       STATUS    BUILDKIT   PLATFORMS
dk15-builder        docker-container
 \\_ dk15-builder0    \\_ desktop-linux     running   v0.32.2    linux/amd64 (+2), linux/arm64, linux/arm (+2), linux/ppc64le, (3 more)
 \\_ dk15-nha         \\_ ssh://linux-nha   running   v0.32.2    linux/amd64* (+3), linux/386</div>
<table>
<tr><th>Cờ</th><th>Nghĩa</th></tr>
<tr><td><code>--name dk15-builder --append</code></td><td>thêm node vào builder ĐÃ CÓ thay vì tạo builder mới</td></tr>
<tr><td><code>--node dk15-nha</code></td><td>tên của node mới (container bên kia sẽ là <code>buildx_buildkit_dk15-nha</code>)</td></tr>
<tr><td><code>--platform linux/amd64</code></td><td>"node này lo amd64" — hiện ra thành dấu <code>*</code></td></tr>
<tr><td><code>ssh://linux-nha</code></td><td>endpoint (điểm kết nối): Docker Engine của máy kia, qua SSH, không mở cổng TCP nào</td></tr>
</table>
<p>Dấu sao ở <code>linux/amd64*</code> nghĩa là "do người dùng đặt": từ giờ buildx gửi việc amd64 sang node đó, còn lại cho máy Mac. Lần <code>inspect --bootstrap</code> đầu tiên sau khi thêm node kết thúc bằng <code>DeadlineExceeded</code> — node bên kia còn đang kéo ảnh BuildKit về; vài giây sau nó <code>running</code>. Rồi một lượt dựng cho cả hai nền tảng:</p>
<pre><code class="language-bash">docker buildx build --builder dk15-builder --no-cache \\
  --platform linux/amd64,linux/arm64 -t dk15-hash:1 --load .
docker image ls --tree dk15-hash:1
docker run --rm --platform linux/amd64 dk15-hash:1</code></pre>
<div class="out">#10 [linux/amd64 build 2/4] RUN apk add --no-cache gcc musl-dev
#10 DONE 20.2s
#11 [linux/arm64 build 2/4] RUN apk add --no-cache gcc musl-dev
#11 DONE 23.6s
#18 exporting manifest list sha256:9efd3eb6f3c37b96e48b67bec6571d369107a0d61062045fdc6f1a681bea5907 done
IMAGE                ID             DISK USAGE   CONTENT SIZE   EXTRA
dk15-hash:1          9efd3eb6f3c3       17.2MB         7.93MB
├─ linux/amd64       5da75715fb2d        3.8MB          3.8MB
└─ linux/arm64       ec5c614cc326       13.4MB         4.13MB
arch=x86_64 hash=7499008179331740677</div>
<p>28 giây cho cả hai nền tảng, chạy song song, không giả lập ở đâu cả — và hai chương trình tính ra cùng một mã băm, đúng điều cần chứng minh. Đây chính là cách đường "dựng ở máy nhà" của một dự án sinh viên có thể thôi giả lập nửa amd64: máy Mac tiếp tục dựng arm64, máy Linux dựng amd64. Trong CI, cùng ý đó là "mỗi kiến trúc một runner" (GitHub giờ có runner ARM) rồi ghép lại thành một chỉ mục; khoá <code>/courses/github-actions</code> có workflow đầy đủ.</p>
<div class="callout warn"><strong>Rời node không dọn máy bên kia.</strong> <code>docker buildx create --name dk15-builder --leave --node dk15-nha</code> gỡ node khỏi danh sách của builder, nhưng container <code>buildx_buildkit_dk15-nha</code> và volume <code>…_state</code> của nó vẫn chạy tiếp trên máy Linux — đo thật. Hãy xoá cả builder bằng <code>docker buildx rm dk15-builder</code> khi node còn gắn, hoặc dọn phía bên kia theo tên sau đó.</div>

<h3>bake: một file thay cho một lệnh build dài cho mỗi ảnh</h3>
${slide('dk-15', 5, 'bake: một file HCL thay cho nhiều lệnh build dài')}
<p>Một dự án thật có vài ảnh — API, web, một worker — mỗi cái một ngữ cảnh (context), tag, nền tảng và tham số dựng. Viết thành lệnh shell thì những thiết lập đó trôi dạt giữa ghi chú của bạn cùng nhóm, README và CI. <code>docker buildx bake</code> đọc chúng từ một file, <code>docker-bake.hcl</code> (HCL là ngôn ngữ cấu hình của HashiCorp, giống JSON nhưng dễ viết tay), và dựng mọi target song song:</p>
<pre><code class="language-hcl">variable "TAG" {
  default = "dev"
}
variable "REGISTRY" {
  default = "localhost:18150"
}

group "default" {
  targets = ["api", "web"]
}

target "_common" {
  platforms = ["linux/amd64", "linux/arm64"]
  labels    = { "dkhoc" = "15" }
}

target "api" {
  inherits = ["_common"]
  context  = "api"
  tags     = ["&#36;{REGISTRY}/dk15-api:&#36;{TAG}"]
}

target "web" {
  inherits = ["_common"]
  context  = "web"
  args     = { APP_VERSION = TAG }
  tags     = ["&#36;{REGISTRY}/dk15-web:&#36;{TAG}"]
}</code></pre>
<table>
<tr><th>Khối</th><th>Nghĩa</th></tr>
<tr><td><code>variable "TAG"</code></td><td>một giá trị có mặc định; biến môi trường cùng tên sẽ đè lên (<code>TAG=1.0 docker buildx bake</code>)</td></tr>
<tr><td><code>group "default"</code></td><td>thứ <code>docker buildx bake</code> dựng khi bạn không nêu tên target nào</td></tr>
<tr><td><code>target "_common"</code></td><td>một cái khuôn; dấu gạch dưới đầu tên chỉ là quy ước "không dựng riêng"</td></tr>
<tr><td><code>inherits</code></td><td>chép mọi thuộc tính của target khác, rồi đè những gì cần đổi</td></tr>
<tr><td><code>context</code>, <code>args</code>, <code>tags</code>, <code>platforms</code></td><td>đúng là ngữ cảnh, <code>--build-arg</code>, <code>-t</code> và <code>--platform</code> của <code>docker build</code></td></tr>
</table>
<p>Trước khi tin một file bake, hỏi nó đã hiểu thành cái gì. <code>--print</code> không dựng gì cả:</p>
<pre><code class="language-bash">TAG=1.0 docker buildx bake --print web</code></pre>
<div class="out">      "args": {
        "APP_VERSION": "1.0"
      },
…
      "tags": [
        "localhost:18150/dk15-web:1.0"
      ],</div>
<p>Rồi làm thật — hai target, mỗi cái hai nền tảng, nạp vào kho ảnh cục bộ, và <code>--check</code> cả hai Dockerfile trong một lệnh:</p>
<pre><code class="language-bash">TAG=1.0 docker buildx bake --builder dk15-builder --load
docker buildx bake --builder dk15-builder --check</code></pre>
<div class="out">api
Check complete, no warnings found.
web
Check complete, no warnings found.</div>
<p>Lượt dựng mất 25 giây cho bốn biến thể ảnh. Trong CI, chính file đó được action chính thức <code>docker/bake-action</code> dùng, nên thiết lập chỉ sống ở một chỗ.</p>

<h3>Bí mật lúc build, đi xa hơn Chương 4 một bước</h3>
${slide('dk-15', 6, '--secret: dùng được trong RUN, không nằm lại trong ảnh')}
<p>Chương 4 đã giới thiệu <code>--secret id=npmrc,src=…</code> đi với <code>RUN --mount=type=secret</code>. Còn hai dạng đáng biết nữa: bí mật lấy từ một <em>biến môi trường</em> của shell, và bí mật được đưa vào bước <code>RUN</code> <em>dưới dạng</em> biến môi trường thay vì một file:</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM alpine:3.22
RUN --mount=type=secret,id=npm_token,env=NPM_TOKEN \\
    echo "token dai &#36;{#NPM_TOKEN} ky tu, 4 ky tu dau: &#36;{NPM_TOKEN%&#36;{NPM_TOKEN#????}}"
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \\
    ls -l /root/.npmrc &amp;&amp; echo "(dung .npmrc de tai goi rieng)"</code></pre>
<pre><code class="language-bash">export NPM_TOKEN=npm_SECRETdk15xyz
docker buildx build --builder dk15-builder \\
  --secret id=npm_token,env=NPM_TOKEN \\
  --secret id=npmrc,src=./npmrc \\
  -t dk15-sec:1 --load --progress=plain .</code></pre>
<div class="out">#7 0.037 token dai 17 ky tu, 4 ky tu dau: npm_
#8 0.046 -r--------    1 root     root            51 Sep 24 01:09 /root/.npmrc
#8 0.047 (dung .npmrc de tai goi rieng)</div>
<table>
<tr><th>Viết ở đâu</th><th>Phần</th><th>Nghĩa</th></tr>
<tr><td>lệnh build</td><td><code>--secret id=npm_token,env=NPM_TOKEN</code></td><td>lấy giá trị từ biến <code>NPM_TOKEN</code> của shell, đặt tên là <code>npm_token</code></td></tr>
<tr><td>lệnh build</td><td><code>--secret id=npmrc,src=./npmrc</code></td><td>lấy từ một file trên máy</td></tr>
<tr><td>Dockerfile</td><td><code>--mount=type=secret,id=npm_token,env=NPM_TOKEN</code></td><td>trong RIÊNG bước này, bí mật hiện ra thành biến <code>NPM_TOKEN</code></td></tr>
<tr><td>Dockerfile</td><td><code>…,id=npmrc,target=/root/.npmrc</code></td><td>trong RIÊNG bước này, bí mật hiện ra thành file (quyền <code>-r--------</code>)</td></tr>
</table>
<p>Cả hai dạng đều dùng được trong bước của nó. Giờ chứng minh ảnh không giữ chúng lại — không phải bằng cách tin tài liệu, mà bằng cách nhìn vào ba chỗ: lịch sử ảnh, hệ file của một container, và từng byte của ảnh đã xuất ra:</p>
<pre><code class="language-bash">docker history --no-trunc --format '{{.CreatedBy}}' dk15-sec:1 | head -2
docker run --rm dk15-sec:1 ls -l /root/
docker save dk15-sec:1 -o sec.tar &amp;&amp; mkdir x &amp;&amp; tar -xf sec.tar -C x
for f in $(find x -type f); do (gzip -dc $f 2&gt;/dev/null || cat $f) | grep -c SECRETdk15; done | sort | uniq -c</code></pre>
<div class="out">RUN /bin/sh -c ls -l /root/.npmrc &amp;&amp; echo "(dung .npmrc de tai goi rieng)" # buildkit
RUN /bin/sh -c echo "token dai &#36;{#NPM_TOKEN} ky tu, 4 ky tu dau: &#36;{NPM_TOKEN%&#36;{NPM_TOKEN#????}}" # buildkit
total 0
   5 0</div>
<p>Lịch sử chỉ ghi <em>câu lệnh</em> (có tên biến, không có giá trị), <code>/root</code> trống trơn, và cả năm file trong ảnh xuất ra đều cho <code>0</code> lần xuất hiện của token. So với <code>--build-arg NPM_TOKEN=…</code> — thứ mà Chương 4 cho thấy <code>docker history</code> in ra nguyên văn.</p>
<div class="pitfall co-tieu-de"><strong>Đổi giá trị bí mật KHÔNG làm vỡ cache.</strong> Chạy lại đúng lượt dựng đó với <code>NPM_TOKEN=npm_OTHERvalue999</code> thì cả hai bước đều in <code>CACHED</code> — đo thật. Bí mật được cố ý loại khỏi khoá cache (cache key) để nó không bao giờ rò ra qua đó. Hệ quả: bạn thay một token đã hết hạn và bước dùng nó KHÔNG chạy lại; nếu bước đó tải gói riêng tư, bạn giữ nguyên kết quả cũ. Khi đổi bí mật mà cần chạy lại một bước, thêm <code>--no-cache-filter &lt;stage&gt;</code> cho stage đó, hoặc đặt <code>ARG TOKEN_VERSION</code> ngay trước bước ấy và tăng nó lên.</div>

<h3>--ssh: cho bản dựng mượn ssh-agent, không phải mượn khoá</h3>
${slide('dk-15', 7, '--ssh cho mượn khoá qua agent; --check chặn Dockerfile ẩu')}
<p>Có những bản dựng phải <code>git clone</code> một kho riêng tư hay <code>npm install</code> một thư viện từ <code>git+ssh://</code>. Chép khoá riêng (private key) vào ảnh là cách rò rỉ kinh điển. <code>RUN --mount=type=ssh</code> chỉ chuyển tiếp cái <em>socket</em> của ssh-agent (chương trình giữ khoá trong bộ nhớ) trong đúng một bước. Để minh hoạ mà không đụng tới agent thật, khoá dùng một khoá vứt-đi trong một agent riêng, chạy trong thư mục nháp:</p>
<pre><code class="language-bash">ssh-keygen -q -t ed25519 -N '' -C dk15-deploy-key -f ./dk15_key
eval $(ssh-agent -a agent.sock) &amp;&amp; ssh-add ./dk15_key
docker buildx build --builder dk15-builder --ssh default=agent.sock -t dk15-ssh:1 --load --progress=plain .</code></pre>
<pre><code class="language-dockerfile">RUN apk add --no-cache openssh-client
RUN --mount=type=ssh echo "SSH_AUTH_SOCK=$SSH_AUTH_SOCK" &amp;&amp; ssh-add -l
RUN ssh-add -l; echo "exit=$?"</code></pre>
<div class="out">#8 0.032 SSH_AUTH_SOCK=/run/buildkit/ssh_agent.0
#8 0.037 256 SHA256:IRy0eqGz6kFj3s1xMfKHihzcTAvG2YozdtqSPg6DsZ8 dk15-deploy-key (ED25519)
#9 0.033 Could not open a connection to your authentication agent.
#9 0.033 exit=2</div>
<p>Bước 8 thấy dấu vân tay của khoá qua socket được chuyển tiếp; bước 9, không có mount, chẳng thấy gì; và ảnh hoàn chỉnh không có <code>SSH_AUTH_SOCK</code> lẫn <code>/run/buildkit</code>. Có một tai nạn thật trên đường làm đáng kể lại: lần đầu dùng đường dẫn tuyệt đối tới socket trong thư mục nháp dài, macOS từ chối (<em>"too long for Unix domain socket"</em> — quá dài cho socket Unix), <code>ssh-agent</code> không khởi động, và <code>ssh-add</code> lặng lẽ thêm khoá thử vào agent <em>hằng ngày</em> của người dùng — phải gỡ ra bằng <code>ssh-add -d</code>. Khi dòng đầu của một chuỗi lệnh báo lỗi, dừng lại trước khi chạy dòng thứ hai.</p>

<h3>Biến bộ kiểm Dockerfile thành cổng chặn</h3>
<p>Bài 5.5 đã giới thiệu <code>docker build --check</code>. Hai chỉ thị ở đầu Dockerfile làm nó nghiêm với mọi người trong nhóm, không cần ai nhớ thêm cờ:</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
# check=skip=JSONArgsRecommended;error=true
FROM alpine:3.22 as base
ENV APP_ENV production
CMD node server.js</code></pre>
<pre><code class="language-bash">docker build --builder dk15-builder --check . ; echo "exit=$?"</code></pre>
<div class="out">Check complete, 2 warnings have been found!
WARNING: FromAsCasing - https://docs.docker.com/go/dockerfile/rule/from-as-casing/
WARNING: LegacyKeyValueFormat - https://docs.docker.com/go/dockerfile/rule/legacy-key-value-format/
ERROR: lint violation found for rules: FromAsCasing, LegacyKeyValueFormat
exit=1</div>
<p><code>error=true</code> làm cả lệnh <code>docker build</code> bình thường cũng thất bại (thiếu nó thì mấy cảnh báo đó chỉ trôi qua màn hình); <code>skip=</code> tắt một luật mà nhóm đã quyết định chấp nhận — ở đây là <code>JSONArgsRecommended</code>, nên chỉ hai trong ba lỗi được báo. Sửa thành <code>AS</code> và <code>ENV APP_ENV=production</code> thì kết quả là <code>Check complete, no warnings found.</code> với mã thoát 0.</p>

<h3>Attestation đọc được thật: SBOM và provenance</h3>
${slide('dk-15', 8, 'Attestation: SBOM và provenance đi KÈM ảnh')}
<p>Bài 6.5 đã cho thấy các cờ và sinh SBOM (danh sách thành phần phần mềm) bằng Trivy. Ở đây BuildKit tự sinh cả hai loại attestation (bản chứng thực đính kèm) và ta đọc lại chúng từ registry (một <code>registry:2</code> cục bộ ở cổng 18150):</p>
<pre><code class="language-bash">docker buildx build --builder dk15-builder --platform linux/amd64,linux/arm64 \\
  --attest type=sbom --attest type=provenance,mode=max \\
  --build-arg APP_VERSION=1.1 -t localhost:18150/dk15-web:1.1 --load web
docker push -q localhost:18150/dk15-web:1.1
docker buildx imagetools inspect localhost:18150/dk15-web:1.1 --format '{{json .SBOM}}' &gt; sbom.json
jq -r '."linux/amd64".SPDX.packages | length' sbom.json
jq -r '."linux/amd64".SPDX.packages[] | select(.name|test("^(nginx|libssl3|busybox|musl|curl)&#36;")) | "\\(.name) \\(.versionInfo)"' sbom.json</code></pre>
<div class="out">#17 [linux/amd64] generating sbom using docker.io/docker/buildkit-syft-scanner:stable-1
localhost:18150/dk15-web:1.1
69
busybox 1.37.0-r12
curl 8.12.1-r1
libssl3 3.3.3-r0
musl 1.2.5-r9
nginx 1.27.5-r1</div>
<pre><code class="language-bash">docker buildx imagetools inspect localhost:18150/dk15-web:1.1 --format '{{json .Provenance}}' &gt; prov.json
jq -r '."linux/amd64".SLSA.buildDefinition.resolvedDependencies[] | "\\(.uri) \\(.digest.sha256[0:12])"' prov.json
jq -r '."linux/amd64".SLSA.buildDefinition.internalParameters.builderPlatform' prov.json</code></pre>
<div class="out">pkg:docker/docker/buildkit-syft-scanner@stable-1?platform=linux%2Farm64 ae4f3b554449
pkg:docker/docker/dockerfile@1 ecfaec9ed6d8
pkg:docker/nginx@1.27-alpine?platform=linux%2Famd64 65645c7bb6a0
linux/arm64</div>
<p>SBOM trả lời câu "mình đã đem đi bản OpenSSL nào?" mà không cần dựng lại hay quét lại (<code>libssl3 3.3.3-r0</code>). Provenance (nguồn gốc) trả lời câu "nó được dựng thế nào?": digest chính xác của ảnh nền đứng sau cái tag hay dịch chuyển <code>nginx:1.27-alpine</code>, bộ frontend của Dockerfile, các tham số dựng (<code>build-arg:APP_VERSION: 1.1</code>) và việc nó được dựng trên máy arm64 cho amd64. <code>mode=max</code> ghi trọn yêu cầu dựng; mặc định <code>mode=min</code> ghi ít hơn. Cả hai nằm trong chỉ mục dưới dạng những mục <code>unknown/unknown</code> mà Bài 3.4 đã gặp — <code>docker pull</code> bỏ qua chúng.</p>

<h3>Chạy thử từng bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · builder của riêng bạn</span><span class="lz-t">docker buildx create --name mybuilder --driver docker-container --bootstrap</span><span class="lz-d">docker ps thấy container buildx_buildkit_mybuilder0.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · đo giả lập</span><span class="lz-t">time docker buildx build --builder mybuilder --no-cache --platform linux/amd64 -o type=cacheonly .</span><span class="lz-d">Lặp lại với linux/arm64 trên Mac chip Apple; so các bước RUN.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · một file bake</span><span class="lz-t">docker buildx bake --print</span><span class="lz-d">Xem tag và args đã giải ra trước khi dựng bất cứ gì.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · bí mật không để lại dấu vết</span><span class="lz-t">docker buildx build --secret id=tok,env=TOK …</span><span class="lz-d">docker save … | grep -c token-của-bạn phải ra 0 ở mọi file.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 5 · dọn dẹp</span><span class="lz-t">docker buildx rm mybuilder</span><span class="lz-d">Xoá container của builder cùng volume cache của nó.</span></div>
</div>

<h3>Khi nào dùng — và khi nào KHÔNG</h3>
<table>
<tr><th>Công cụ</th><th>Đáng dùng khi…</th><th>Không cần khi…</th></tr>
<tr><td>Builder <code>docker-container</code></td><td>cần các kiểu xuất cache, BuildKit mới hơn, hay node từ xa</td><td>một người, một nền tảng, builder mặc định đủ nhanh</td></tr>
<tr><td>Node gốc cho từng nền tảng</td><td>bước RUN nặng và bạn phát hành cả amd64 lẫn arm64</td><td>ảnh chỉ là <code>COPY</code> + một chương trình dựng sẵn; giả lập chỉ tốn vài giây</td></tr>
<tr><td><code>bake</code></td><td>từ hai ảnh trở lên, hay cùng một bản dựng ở CI và trên laptop</td><td>một ảnh với hai cờ</td></tr>
<tr><td><code>--secret</code> / <code>--ssh</code></td><td>mọi thông tin đăng nhập mà bản dựng cần — luôn luôn</td><td>không bao giờ "không cần": phương án kia là rò rỉ</td></tr>
<tr><td>SBOM + provenance</td><td>bạn triển khai ảnh mà người khác phải tin, hay sau này phải trả lời câu hỏi bảo mật</td><td>ảnh dùng-xong-vứt trên laptop</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> API của nhóm phải chạy trên server amd64 của trường lẫn các laptop M1, và nó cài một gói npm riêng tư bằng token mà thầy đưa cho nhóm.</p><ol>
<li>Trong <code>~/thu-docker/buildx</code>, tạo builder <code>nhom-builder</code> với driver <code>docker-container</code> và khởi động nó (<code>--bootstrap</code>).</li>
<li>Viết một <code>docker-bake.hcl</code> hai target (api và web, chung một khuôn <code>_common</code> có cả hai nền tảng) và kiểm bằng <code>--print</code>.</li>
<li>Đưa một token giả vào bằng <code>--secret id=npm_token,env=NPM_TOKEN</code>, trong một bước <code>RUN</code> chỉ in độ dài của nó, rồi dựng với <code>--load</code>.</li>
<li>Chứng minh token không nằm trong ảnh bằng <code>docker history</code> và <code>docker save</code> + <code>grep -c</code>. Rồi đổi token và dựng lại: ghi lại bước nào báo <code>CACHED</code>.</li>
<li>Xoá builder bằng <code>docker buildx rm nhom-builder</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>docker image ls --tree</code> có đủ hai nền tảng, mọi file của ảnh xuất ra đều cho <code>0</code> với token, bạn giải thích được vì sao lượt dựng thứ hai <code>CACHED</code>, và <code>docker ps -a</code> không còn <code>buildx_buildkit_nhom-builder0</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Builder (bộ dựng)</span><span class="v">Phiên bản BuildKit mà một lượt dựng chạy trên đó; <code>docker buildx ls</code> liệt kê, dấu <code>*</code> đánh dấu cái đang dùng.</span></div>
  <div class="kv"><span class="k">Driver (trình điều khiển)</span><span class="v">Cách builder chạy: <code>docker</code> (trong dockerd), <code>docker-container</code>, <code>kubernetes</code>, <code>remote</code>.</span></div>
  <div class="kv"><span class="k">Node (nút)</span><span class="v">Một BuildKit đứng sau builder; builder nhiều node gửi mỗi nền tảng tới node hợp với nó.</span></div>
  <div class="kv"><span class="k">Emulation (giả lập)</span><span class="v">Chạy lệnh máy của CPU khác qua bộ phiên dịch (QEMU hay Rosetta); đúng nhưng chậm với bước RUN.</span></div>
  <div class="kv"><span class="k">Bake file (file bake)</span><span class="v"><code>docker-bake.hcl</code>: target, group và biến mô tả nhiều lượt dựng.</span></div>
  <div class="kv"><span class="k">Build secret (bí mật lúc dựng)</span><span class="v">Giá trị chỉ được gắn vào một bước <code>RUN</code>, không ghi vào tầng nào và không nằm trong khoá cache.</span></div>
  <div class="kv"><span class="k">Attestation (bản chứng thực)</span><span class="v">Tài liệu đính kèm chỉ mục ảnh: SBOM (bên trong có gì) hoặc provenance (được dựng thế nào).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Builder <code>docker-container</code> là BuildKit trong container riêng, cache riêng; thêm <code>--load</code> hoặc <code>--push</code> kẻo kết quả chỉ nằm trong cache.</li>
<li>Bước RUN chạy giả lập chậm khoảng ba lần (96 giây so với 29); một node amd64 thật qua <code>ssh://</code> làm cùng bước đó trong 20 giây.</li>
<li><code>docker-bake.hcl</code> giữ tag, nền tảng và tham số ở một chỗ; luôn xem <code>bake --print</code> trước.</li>
<li><code>--secret</code> (dạng file hay env) và <code>--ssh</code> không để lại gì trong ảnh — nhưng đổi bí mật không làm chạy lại bước đã cache.</li>
<li><code># check=error=true</code> biến cảnh báo Dockerfile thành bản dựng thất bại cho cả nhóm.</li>
<li><code>--attest type=sbom</code> và <code>type=provenance,mode=max</code> gắn "bên trong có gì" và "dựng thế nào" vào ảnh; đọc bằng <code>imagetools inspect --format</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/builders/drivers/docker-container/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Driver docker-container</span><span class="lc-sub">Driver <code>docker-container</code> thêm được gì, các tuỳ chọn, và cách xuất kết quả.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/multi-platform/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Dựng đa nền tảng</span><span class="lc-sub">Giả lập, nhiều node gốc và biên dịch chéo, đặt cạnh nhau.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/bake/" target="_blank" rel="noopener">
  <span class="lc-ico">🍞</span>
  <span class="lc-body"><span class="lc-title">Bake</span><span class="lc-sub">Target, group, biến, kế thừa — và tham chiếu đầy đủ của file.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/secrets/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Bí mật lúc build</span><span class="lc-sub"><code>--secret</code> từ file và từ biến môi trường, và mount SSH.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/metadata/attestations/" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">Attestation của bản dựng</span><span class="lc-sub">SBOM và provenance: sinh ra thế nào, lưu ở đâu, đọc ra sao.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab</span><span class="lc-sub">Bài tập Docker có chấm tự động.</span></span>
</a>

<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Bước RUN nặng thì dựng mỗi nền tảng trên một máy có đúng CPU đó — giả lập đúng nhưng chậm. Thông tin đăng nhập đi qua <code>--secret</code> và <code>--ssh</code>, và đổi bí mật không làm vỡ cache. Một <code>docker-bake.hcl</code> cộng với attestation biến câu hỏi "mình đã dựng cái này thế nào?" thành một file đọc được.</p>
</div>
`,
    },
    /* ─────────────────────────── 15.2 ─────────────────────────── */
    {
      title: '15.2 — Deeper security: the docker group, rootless Docker, userns-remap and Podman|||15.2 — Bảo mật sâu hơn: nhóm docker, Docker rootless, userns-remap và Podman',
      slug: 'dk-15-2-rootless-podman',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Chứng minh nhóm docker tương đương root, Docker rootless (root trong container = uid 1000 ngoài máy) và cái giá của nó, userns-remap, seccomp và capability mặc định, Podman không daemon với pod và kube generate, và bảng chọn khi nào dùng cái nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2</span>
<h2>Deeper security: who is really root?</h2>
<p class="lead">Chapter 6 hardened the <em>container</em>: a non-root user, a read-only filesystem, dropped capabilities. This lesson looks one level down, at the <em>daemon</em>. The classic Docker Engine runs as root, and anyone who can talk to it can make it do anything root can. On your own laptop that is fine. On the Linux server your project group shares, or the lab machine where the teacher adds every student to the <code>docker</code> group "so it just works", it is not.</p>
<p>Three answers exist — rootless Docker, user-namespace remapping, and Podman — and each trades a little convenience for a smaller blast radius. Everything below was run for real, without installing anything or changing any daemon's configuration: rootless Docker and Podman ran <em>inside</em> containers on the course Mac, and the root-equivalence test ran as an ordinary user on the Linux machine.</p>

<h3>Being in the docker group is being root</h3>
${slide('dk-15', 9, 'Ai vào được nhóm docker là có quyền root trên máy')}
<p>On the course Linux machine the user has no sudo, but is in the <code>docker</code> group. <code>/etc/shadow</code> — the file with every account's password hash — is readable only by root:</p>
<pre><code class="language-bash">id -nG
cat /etc/shadow
docker run --rm -v /etc/shadow:/s:ro alpine:3 sh -c "id; wc -l &lt; /s"</code></pre>
<div class="out">Cuong03dx wheel dialout docker
cat: /etc/shadow: Permission denied
uid=0(root) gid=0(root) groups=0(root),0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
54</div>
<p>No exploit, no bug: the user asked <code>dockerd</code>, which runs as root, to bind-mount a root-only file into a container whose process is uid 0 — and uid 0 in a normal container is uid 0 on the host (Chapter 1). The test only counted the 54 lines; it could just as well have printed the hashes, or mounted <code>/</code> read-write and added a user. The socket that grants this is <code>/var/run/docker.sock</code>, owned by <code>root:docker</code> with mode <code>srw-rw----</code>: anyone in the group can write to it, and writing to it is issuing commands to root.</p>
<div class="pitfall co-tieu-de"><strong>"Just add everyone to the docker group" on a shared server.</strong> It is the fix every tutorial gives for <code>permission denied while trying to connect to the Docker daemon socket</code>, and on a machine shared by a project group it silently hands every member root — including the ability to read each other's SSH keys and database files. The same applies to mounting <code>/var/run/docker.sock</code> into a container (a CI job, a dashboard like Portainer): that container now controls the host. On shared machines use rootless Docker or Podman per user, and treat the socket like a root password.</div>

<h3>Rootless Docker: the daemon itself runs as you</h3>
${slide('dk-15', 10, 'Rootless: "root" trong container chỉ là uid 1000 ngoài máy')}
<p>In rootless mode the whole engine — <code>dockerd</code>, containerd, the containers — runs as an ordinary user. It uses a <em>user namespace</em>: a table that maps user IDs inside to different user IDs outside. The official <code>docker:29-dind-rootless</code> image lets you see this without installing anything (it needs <code>--privileged</code> only to create the nested namespaces):</p>
<pre><code class="language-bash">docker run -d --name dk15-rootless --privileged docker:29-dind-rootless
docker exec dk15-rootless ps -o user,pid,args</code></pre>
<div class="out">rootless     1 rootlesskit --net=slirp4netns --mtu=1500 --disable-host-loopback --port-driver=builtin --copy-u…
rootless    77 /proc/self/exe --net=slirp4netns --mtu=1500 --disable-host-loopback --port-driver=builtin --cop…
rootless   104 docker-init -- dockerd --host=unix:///run/user/1000/docker.sock --host=tcp://0.0.0.0:2376 --tls…
rootless   108 dockerd --host=unix:///run/user/1000/docker.sock --host=tcp://0.0.0.0:2376 --tlsverify --tlscac…</div>
<p>Every process belongs to the user <code>rootless</code> (uid 1000). <code>rootlesskit</code> creates the user namespace, <code>slirp4netns</code> gives containers a network without root, and the socket lives in <code>/run/user/1000/</code> instead of <code>/var/run/</code>. Now talk to that daemon and do what just broke the Linux machine:</p>
<pre><code class="language-bash">export DOCKER_HOST=unix:///run/user/1000/docker.sock     # inside dk15-rootless
docker info --format '{{json .SecurityOptions}}'
docker run --rm alpine:3 sh -c "id; cat /proc/self/uid_map"
docker run --rm -v /tmp:/h alpine:3 sh -c "touch /h/tao-boi-root; ls -ln /h/tao-boi-root"
ls -ln /tmp/tao-boi-root                                 # the same file, seen from the "host"</code></pre>
<div class="out">["name=seccomp,profile=builtin","name=rootless","name=cgroupns"]
uid=0(root) gid=0(root) groups=0(root),0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
         0       1000          1
         1     100000      65536
-rw-r--r--    1 0        0                0 Sep 24 01:12 /h/tao-boi-root
-rw-r--r--    1 1000     1000             0 Sep 24 01:12 /tmp/tao-boi-root</div>
<p>Read <code>uid_map</code> as three columns: <em>first uid inside</em>, <em>first uid outside</em>, <em>how many</em>. Line one: uid 0 inside is uid 1000 outside, one id only. Line two: uids 1–65536 inside are 100000–165535 outside — the range granted to the user in <code>/etc/subuid</code> (<code>rootless:100000:65536</code>). So the container's "root" created a file that, outside, belongs to uid 1000: an ordinary user who cannot read <code>/etc/shadow</code>. A container escape now lands you as that ordinary user, not as root.</p>

<h3>Installing it for real, and what you give up</h3>
${slide('dk-15', 11, 'Rootless và userns-remap đổi an toàn lấy vài giới hạn')}
<p>On a real Linux server each user installs their own rootless engine with the script Docker ships. The docs list two prerequisites: <code>newuidmap</code>/<code>newgidmap</code> installed, and at least 65,536 subordinate ids for the user in <code>/etc/subuid</code> and <code>/etc/subgid</code>. The course Linux machine has both — and the script's read-only <code>check</code> stops for a different reason:</p>
<pre><code class="language-bash">which newuidmap dockerd-rootless-setuptool.sh; grep "$USER" /etc/subuid
dockerd-rootless-setuptool.sh check</code></pre>
<div class="out">/usr/bin/newuidmap
/usr/bin/dockerd-rootless-setuptool.sh
Cuong03dx:524288:65536
[ERROR] Aborting because rootful Docker (/var/run/docker.sock) is running and accessible. Set --force to ignore.</div>
<p>It refuses because this user can already reach a root daemon — installing a rootless one next to it would add no protection. On a server where users are <em>not</em> in the docker group, the steps from the documentation are <code>dockerd-rootless-setuptool.sh install</code>, then <code>systemctl --user start docker</code>, then pointing the client at <code>unix://$XDG_RUNTIME_DIR/docker.sock</code> (via <code>DOCKER_HOST</code> or <code>docker context use rootless</code>). The course did not run the install: it would change the machine.</p>
<table>
<tr><th>Rootless limitation (docs)</th><th>What it means for a student project</th></tr>
<tr><td>Ports below 1024 need <code>net.ipv4.ip_unprivileged_port_start=0</code></td><td>publish 8080 instead of 80, or let a root-owned proxy take 80/443. (The Docker Desktop VM already sets this to 0 — that is why <code>-p 80:80</code> worked inside <code>dk15-rootless</code>; the Linux machine has 1024.)</td></tr>
<tr><td>AppArmor, checkpoint, overlay network and SCTP ports are not supported</td><td>no Swarm overlay networks (Lesson 15.3) under rootless</td></tr>
<tr><td>Resource limits need cgroup v2 + systemd</td><td>on older distributions <code>--memory</code> is ignored</td></tr>
<tr><td>Network via slirp4netns/pasta</td><td>somewhat slower than a root bridge; fine for development</td></tr>
</table>
<p><strong>userns-remap</strong> is the middle road: the daemon still runs as root, but containers run in a user namespace. One line in <code>/etc/docker/daemon.json</code>, <code>"userns-remap": "default"</code>, makes Docker create a user <code>dockremap</code> and map container uid 0 to the start of its subordinate range (the docs' example: <code>dockremap:231072:65536</code>, so root inside is 231072 outside). Two warnings from the documentation matter: enabling it "effectively masks existing image and container layers" — <code>docker image ls</code> comes back empty until you turn it off — and it is incompatible with <code>--pid=host</code>, <code>--network=host</code> and <code>--privileged</code> (unless the container opts out with <code>--userns=host</code>). It also needs a daemon restart, which stops every container on the machine; the course did not enable it.</p>

<h3>The protections you already have: seccomp, capabilities, LSMs</h3>
${slide('dk-15', 12, 'seccomp đã bật sẵn; --cap-drop ALL còn chặt hơn')}
<p>Even a plain rootful container is not "root with a different filesystem". Three layers are on by default, and you can see them from inside:</p>
<pre><code class="language-bash">docker run --rm alpine:3 grep -E "^(CapEff|NoNewPrivs|Seccomp):" /proc/self/status
docker run --rm alpine:3 unshare -U id
docker run --rm --security-opt seccomp=unconfined alpine:3 unshare -U id
docker run --rm --cap-drop ALL alpine:3 sh -c "chown nobody /tmp"</code></pre>
<div class="out">CapEff:	00000000a80425fb
NoNewPrivs:	0
Seccomp:	2
unshare: unshare(0x10000000): Operation not permitted
uid=65534(nobody) gid=65534(nobody) groups=65534(nobody),…
chown: /tmp: Operation not permitted</div>
<table>
<tr><th>Line</th><th>What it tells you</th></tr>
<tr><td><code>Seccomp: 2</code></td><td>a seccomp filter is active (0 = none, 2 = filter). Docker's default profile "disables around 44 system calls out of 300+"</td></tr>
<tr><td><code>unshare … Operation not permitted</code></td><td>creating a new user namespace is one of them — blocked by seccomp, not by permissions</td></tr>
<tr><td><code>seccomp=unconfined</code> ⇒ it works</td><td>the proof that the filter, not the kernel, refused it. Never ship with <code>unconfined</code></td></tr>
<tr><td><code>CapEff: 00000000a80425fb</code></td><td>the default capability set: 14 bits set out of 41 — root inside, but with most powers removed (Lesson 6.4)</td></tr>
<tr><td><code>--cap-drop ALL</code> ⇒ <code>chown</code> fails</td><td>without <code>CAP_CHOWN</code> even root cannot change a file's owner</td></tr>
</table>
<p>The third layer is a Linux Security Module: AppArmor's <code>docker-default</code> profile on Ubuntu (so on a typical VPS), SELinux on Fedora/RHEL. <code>docker info --format '{{json .SecurityOptions}}'</code> on both course machines printed <code>["name=seccomp,profile=builtin","name=cgroupns"]</code> — the Fedora machine has SELinux but Docker is not configured to use it there, and Docker Desktop's VM has no LSM. On your Ubuntu VPS you would also see <code>name=apparmor</code>. None of these layers stops the docker-group problem: they limit what a <em>container</em> can do, not what the person talking to the daemon can ask for.</p>

<h3>Podman: the same commands, no daemon</h3>
${slide('dk-15', 13, 'Podman: không có tiến trình nền, chạy rootless mặc định, có "pod"')}
<p>Podman, from Red Hat, runs OCI containers with a CLI that copies Docker's (<code>podman run</code>, <code>podman build</code>, <code>podman ps</code>…), but with no long-running daemon: each container is started directly and watched by a tiny <code>conmon</code> process. Run as an ordinary user it is rootless by default. Inside the official <code>quay.io/podman/stable</code> image, as its user <code>podman</code> (uid 1000):</p>
<pre><code class="language-bash">docker run -d --name dk15-podman --privileged quay.io/podman/stable sleep 900
docker exec -u podman dk15-podman sh -c '
  podman info --format "rootless={{.Host.Security.Rootless}} runtime={{.Host.OCIRuntime.Name}} driver={{.Store.GraphDriverName}}"
  podman run --rm docker.io/library/alpine:3 sh -c "id; cat /proc/self/uid_map"'</code></pre>
<div class="out">rootless=true runtime=crun driver=overlay
uid=0(root) gid=0(root) groups=1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video),0(root)
         0       1000          1
         1          1        999
      1000       1001      64535</div>
<p>The same user-namespace idea as rootless Docker, with a slightly different map (Podman keeps ids 1–999 and maps the rest from <code>/etc/subuid</code>). Note the fully qualified <code>docker.io/library/alpine:3</code>: Podman does not assume Docker Hub, so short names may prompt or fail depending on configuration.</p>
<p>What Docker does not have is the <strong>pod</strong>: a group of containers sharing one network namespace, exactly like a Kubernetes Pod (Lesson 15.4):</p>
<pre><code class="language-bash">podman pod create --name nhom -p 8080:80
podman run -d --pod nhom --name web docker.io/library/nginx:alpine
podman run -d --pod nhom --name kiemtra docker.io/library/alpine:3 sleep 600
podman exec kiemtra wget -qO- http://localhost:80 | grep -o "&lt;title&gt;.*&lt;/title&gt;"
podman kube generate nhom | grep -E "^kind|    name:"
for p in /proc/[0-9]*; do cat $p/comm; done | sort | uniq -c | sort -rn | head -4</code></pre>
<div class="out">&lt;title&gt;Welcome to nginx!&lt;/title&gt;
kind: Pod
    name: web
    name: kiemtra
     11 nginx
      4 conmon
      2 sleep
      2 sh</div>
<p><code>kiemtra</code> reaches nginx at <code>localhost</code> because they share a network; <code>podman kube generate</code> writes a Kubernetes Pod manifest from what is running; and the process list shows nginx, the <code>conmon</code> monitors and nothing resembling <code>dockerd</code>. Two honest caveats. First, this Podman ran nested inside a container, so the pod reported <code>Degraded</code> (its infra container stayed <code>Created</code>) and the generated YAML contained <code>hostNetwork: true</code> — artefacts of nesting, not of Podman on a real machine. Second, <code>podman compose</code> is only a wrapper:</p>
<div class="out">Error: looking up compose provider failed
7 errors occurred:
	* exec: "/home/podman/.docker/cli-plugins/docker-compose": stat /home/podman/.docker/cli-plugins/docker-compose: no such file or directory</div>
<p>It runs an external provider — <code>docker-compose</code> or <code>podman-compose</code> — which you install separately. On Fedora/RHEL servers Podman's native way to keep services running is systemd integration (Quadlet), not Compose.</p>

<h3>Try it step by step: what am I running as?</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · who can reach the daemon</span><span class="lz-t">id -nG; ls -l /var/run/docker.sock</span><span class="lz-d">In the docker group ⇒ you are effectively root on this machine.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · which protections are on</span><span class="lz-t">docker info --format '{{json .SecurityOptions}}'</span><span class="lz-d">seccomp always; apparmor on Ubuntu; rootless / userns if configured.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · look from inside</span><span class="lz-t">docker run --rm alpine:3 grep -E "^(CapEff|Seccomp):" /proc/self/status</span><span class="lz-d">Seccomp: 2 and a reduced CapEff.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · see a user namespace</span><span class="lz-t">docker run -d --name t --privileged docker:29-dind-rootless</span><span class="lz-d">Then exec with DOCKER_HOST=unix:///run/user/1000/docker.sock and cat /proc/self/uid_map.</span></div>
  <div class="lz-step"><span class="lz-k">Step 5 · clean up, volumes included</span><span class="lz-t">docker rm -f -v t</span><span class="lz-d">The dind image declares VOLUMEs: -v removes them with the container.</span></div>
</div>
<div class="callout warn"><strong>Images with <code>VOLUME</code> leave anonymous volumes behind.</strong> Both <code>docker:29-dind-rootless</code> and <code>quay.io/podman/stable</code> declare volumes for their storage. Removing their containers with plain <code>docker rm -f</code> left four anonymous volumes (about 155 MB) on the course Mac — found afterwards with <code>docker volume ls</code>. Use <code>docker rm -f -v</code>, or run them with <code>--rm</code>, or note the volume names with <code>docker inspect -f '{{range .Mounts}}{{.Name}} {{end}}'</code> before removing the container.</div>

<h3>Which one when</h3>
${slide('dk-15', 14, 'Chọn gì khi nào')}
<table>
<tr><th>Situation</th><th>Choose</th><th>Why</th></tr>
<tr><td>Your own Mac/Windows laptop</td><td>Docker Desktop as it is</td><td>the daemon already lives in a VM; the docker socket does not give root of macOS</td></tr>
<tr><td>A Linux server shared by a group or a lab</td><td>rootless Docker per user, or Podman</td><td>members run containers without anyone becoming root</td></tr>
<tr><td>Your own VPS, you are the only admin</td><td>normal Docker + hardened containers (Chapter 6)</td><td>simplest; the real risks are open ports and unknown images</td></tr>
<tr><td>A company RHEL/Fedora machine</td><td>Podman</td><td>preinstalled, supported, systemd-native</td></tr>
<tr><td>You need host networking, overlay networks, Swarm</td><td>not rootless / userns-remap</td><td>both modes do not support them</td></tr>
<tr><td>CI that builds images inside containers</td><td>rootless BuildKit or a remote builder</td><td>never mount <code>docker.sock</code> into a CI job</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your group got one Linux VM from the school for the SWP391 project. A teammate proposes adding all five of you to the docker group. Before agreeing, you want evidence.</p><ol>
<li>On any Linux machine where you are in the docker group, run <code>cat /etc/shadow</code>, then the <code>docker run … -v /etc/shadow:/s:ro … wc -l</code> test. Write down both results.</li>
<li>On your Mac, start <code>docker:29-dind-rootless</code> with <code>--privileged</code>, and inside it compare <code>id</code> with <code>/proc/self/uid_map</code> of a nested container.</li>
<li>Inside it, create a file from a container in a bind-mounted <code>/tmp</code> and compare <code>ls -ln</code> inside and outside.</li>
<li>Run the four seccomp/capability commands above and explain each line in one sentence.</li>
<li>Remove the dind container with <code>docker rm -f -v</code>, and check <code>docker volume ls</code> has no new anonymous volume.</li></ol>
<p><strong>Done when:</strong> you have one paragraph for your group, backed by your outputs, explaining why the docker group equals root and which option (rootless or Podman) you recommend for the VM — and no container or volume from the exercise remains.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rootful / rootless</span><span class="v">Whether the Docker daemon runs as root or as an ordinary user.</span></div>
  <div class="kv"><span class="k">docker.sock</span><span class="v">The Unix socket the CLI talks to; write access to it equals root on a rootful host.</span></div>
  <div class="kv"><span class="k">User namespace</span><span class="v">A kernel feature mapping uids inside to other uids outside; root inside becomes an ordinary uid outside.</span></div>
  <div class="kv"><span class="k">subuid / subgid</span><span class="v">Ranges of extra ids a user may use for mapping, listed in <code>/etc/subuid</code> and <code>/etc/subgid</code>.</span></div>
  <div class="kv"><span class="k">userns-remap</span><span class="v">A rootful daemon that runs containers in a user namespace owned by <code>dockremap</code>.</span></div>
  <div class="kv"><span class="k">seccomp</span><span class="v">A filter on system calls; Docker's default blocks about 44 risky ones.</span></div>
  <div class="kv"><span class="k">Podman / pod</span><span class="v">A daemonless, Docker-compatible engine; a pod is several containers sharing one network.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Membership of the docker group is root: an ordinary user read <code>/etc/shadow</code> through one <code>docker run</code>.</li>
<li>Rootless Docker runs the whole engine as a user; container uid 0 became uid 1000 on the host, measured.</li>
<li>Rootless costs privileged ports, overlay networks, AppArmor and (on old systems) resource limits; userns-remap hides existing images and needs a daemon restart.</li>
<li>Every container already has seccomp (<code>Seccomp: 2</code>) and a reduced capability set; <code>--cap-drop ALL</code> tightens it further.</li>
<li>Podman gives the same commands with no daemon, rootless by default, plus pods and <code>kube generate</code>; <code>podman compose</code> needs a separate provider.</li>
<li>Laptop: keep Docker Desktop. Shared Linux server: rootless or Podman. Own VPS: normal Docker, hardened containers.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/security/rootless/" target="_blank" rel="noopener">
  <span class="lc-ico">🧑‍💻</span>
  <span class="lc-body"><span class="lc-title">Rootless mode</span><span class="lc-sub">Prerequisites, installation and the known limitations of running the daemon as a user.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/userns-remap/" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">Isolate containers with a user namespace</span><span class="lc-sub"><code>userns-remap</code>, the <code>dockremap</code> user and its restrictions.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/seccomp/" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Seccomp security profiles</span><span class="lc-sub">What the default profile blocks and how to supply your own.</span></span>
</a>
<a class="link-card" href="https://podman.io/docs" target="_blank" rel="noopener">
  <span class="lc-ico">🦭</span>
  <span class="lc-body"><span class="lc-title">Podman documentation</span><span class="lc-sub">Installation, rootless setup, pods and Quadlet.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab</span><span class="lc-sub">Docker exercises with automatic grading.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Access to a rootful daemon's socket is root, whatever the container settings. Rootless Docker and Podman move root into a user namespace, so an escape lands on an ordinary user — at the cost of a few features. The defaults (seccomp, capabilities, AppArmor/SELinux) protect you from containers, not from the people who can command the daemon.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2</span>
<h2>Bảo mật sâu hơn: ai mới thật sự là root?</h2>
<p class="lead">Chương 6 đã siết <em>container</em>: chạy bằng user thường, hệ file chỉ-đọc, bỏ bớt capability. Bài này nhìn xuống một tầng, vào <em>daemon</em>. Docker Engine kiểu cổ điển chạy bằng root, và ai nói chuyện được với nó là bắt nó làm được mọi thứ root làm được. Trên laptop của chính bạn thì chẳng sao. Trên server Linux mà cả nhóm đồ án dùng chung, hay máy phòng lab nơi thầy thêm mọi sinh viên vào nhóm <code>docker</code> "cho chạy được", thì có sao.</p>
<p>Có ba câu trả lời — Docker rootless (không cần root), ánh xạ user namespace (userns-remap), và Podman — mỗi cái đổi một chút tiện lợi lấy vùng thiệt hại nhỏ hơn. Mọi thứ dưới đây đều chạy thật, không cài gì và không đổi cấu hình daemon nào: Docker rootless và Podman chạy <em>lồng bên trong</em> container trên máy Mac của khoá, còn phép thử "tương đương root" chạy bằng user thường trên máy Linux.</p>

<h3>Ở trong nhóm docker là làm root</h3>
${slide('dk-15', 9, 'Ai vào được nhóm docker là có quyền root trên máy')}
<p>Trên máy Linux của khoá, user không có sudo nhưng nằm trong nhóm <code>docker</code>. <code>/etc/shadow</code> — file chứa mã băm mật khẩu của mọi tài khoản — chỉ root đọc được:</p>
<pre><code class="language-bash">id -nG
cat /etc/shadow
docker run --rm -v /etc/shadow:/s:ro alpine:3 sh -c "id; wc -l &lt; /s"</code></pre>
<div class="out">Cuong03dx wheel dialout docker
cat: /etc/shadow: Permission denied
uid=0(root) gid=0(root) groups=0(root),0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
54</div>
<p>Không lỗ hổng, không lỗi phần mềm: user đã nhờ <code>dockerd</code>, vốn chạy bằng root, bind mount (gắn) một file chỉ-root-đọc-được vào một container có tiến trình uid 0 — mà uid 0 trong container thường chính là uid 0 trên máy chủ (Chương 1). Phép thử chỉ đếm 54 dòng; nó hoàn toàn có thể in các mã băm ra, hoặc gắn cả <code>/</code> ở chế độ đọc-ghi rồi thêm một user mới. Thứ trao quyền này là socket <code>/var/run/docker.sock</code>, chủ sở hữu <code>root:docker</code>, quyền <code>srw-rw----</code>: ai trong nhóm cũng ghi vào được, và ghi vào nó nghĩa là ra lệnh cho root.</p>
<div class="pitfall co-tieu-de"><strong>"Cứ thêm cả nhóm vào group docker" trên một server dùng chung.</strong> Đó là cách chữa mà hướng dẫn nào cũng đưa cho lỗi <code>permission denied while trying to connect to the Docker daemon socket</code>, và trên một máy cả nhóm đồ án dùng chung, nó lặng lẽ trao root cho mọi thành viên — kể cả quyền đọc khoá SSH và file CSDL của nhau. Chuyện y hệt với việc gắn <code>/var/run/docker.sock</code> vào một container (một job CI, một bảng điều khiển như Portainer): container đó giờ điều khiển cả máy chủ. Trên máy dùng chung, dùng Docker rootless hoặc Podman cho từng người, và coi cái socket như một mật khẩu root.</div>

<h3>Docker rootless: chính daemon chạy bằng user của bạn</h3>
${slide('dk-15', 10, 'Rootless: "root" trong container chỉ là uid 1000 ngoài máy')}
<p>Ở chế độ rootless, cả bộ máy — <code>dockerd</code>, containerd, các container — chạy bằng một user thường. Nó dùng <em>user namespace</em> (không gian tên người dùng): một bảng ánh xạ mã user bên trong sang mã user khác bên ngoài. Ảnh chính thức <code>docker:29-dind-rootless</code> cho bạn thấy điều này mà không phải cài gì (nó cần <code>--privileged</code> chỉ để tạo được các namespace lồng nhau):</p>
<pre><code class="language-bash">docker run -d --name dk15-rootless --privileged docker:29-dind-rootless
docker exec dk15-rootless ps -o user,pid,args</code></pre>
<div class="out">rootless     1 rootlesskit --net=slirp4netns --mtu=1500 --disable-host-loopback --port-driver=builtin --copy-u…
rootless    77 /proc/self/exe --net=slirp4netns --mtu=1500 --disable-host-loopback --port-driver=builtin --cop…
rootless   104 docker-init -- dockerd --host=unix:///run/user/1000/docker.sock --host=tcp://0.0.0.0:2376 --tls…
rootless   108 dockerd --host=unix:///run/user/1000/docker.sock --host=tcp://0.0.0.0:2376 --tlsverify --tlscac…</div>
<p>Mọi tiến trình thuộc user <code>rootless</code> (uid 1000). <code>rootlesskit</code> tạo user namespace, <code>slirp4netns</code> cho container có mạng mà không cần root, và socket nằm ở <code>/run/user/1000/</code> chứ không ở <code>/var/run/</code>. Giờ nói chuyện với daemon đó và làm lại đúng việc vừa phá được máy Linux:</p>
<pre><code class="language-bash">export DOCKER_HOST=unix:///run/user/1000/docker.sock     # bên trong dk15-rootless
docker info --format '{{json .SecurityOptions}}'
docker run --rm alpine:3 sh -c "id; cat /proc/self/uid_map"
docker run --rm -v /tmp:/h alpine:3 sh -c "touch /h/tao-boi-root; ls -ln /h/tao-boi-root"
ls -ln /tmp/tao-boi-root                                 # cùng file đó, nhìn từ "máy chủ"</code></pre>
<div class="out">["name=seccomp,profile=builtin","name=rootless","name=cgroupns"]
uid=0(root) gid=0(root) groups=0(root),0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
         0       1000          1
         1     100000      65536
-rw-r--r--    1 0        0                0 Sep 24 01:12 /h/tao-boi-root
-rw-r--r--    1 1000     1000             0 Sep 24 01:12 /tmp/tao-boi-root</div>
<table>
<tr><th>Cột của <code>uid_map</code></th><th>Dòng 1</th><th>Dòng 2</th></tr>
<tr><td>uid đầu tiên BÊN TRONG</td><td>0 (root)</td><td>1</td></tr>
<tr><td>uid đầu tiên BÊN NGOÀI</td><td>1000 (chính user rootless)</td><td>100000</td></tr>
<tr><td>bao nhiêu uid</td><td>1</td><td>65536 — đúng dải <code>rootless:100000:65536</code> trong <code>/etc/subuid</code></td></tr>
</table>
<p>Vậy "root" của container đã tạo ra một file mà ở ngoài thuộc về uid 1000: một user thường, không đọc nổi <code>/etc/shadow</code>. Một lần thoát khỏi container (container escape) giờ chỉ đưa kẻ tấn công tới user thường đó, không phải root.</p>

<h3>Cài thật thì cần gì, và phải bỏ lại gì</h3>
${slide('dk-15', 11, 'Rootless và userns-remap đổi an toàn lấy vài giới hạn')}
<p>Trên một server Linux thật, mỗi user tự cài engine rootless của mình bằng script Docker đi kèm. Tài liệu nêu hai điều kiện: có <code>newuidmap</code>/<code>newgidmap</code>, và user có ít nhất 65.536 id phụ trong <code>/etc/subuid</code> lẫn <code>/etc/subgid</code>. Máy Linux của khoá có đủ cả hai — và lệnh <code>check</code> (chỉ đọc) của script dừng vì một lý do khác:</p>
<pre><code class="language-bash">which newuidmap dockerd-rootless-setuptool.sh; grep "$USER" /etc/subuid
dockerd-rootless-setuptool.sh check</code></pre>
<div class="out">/usr/bin/newuidmap
/usr/bin/dockerd-rootless-setuptool.sh
Cuong03dx:524288:65536
[ERROR] Aborting because rootful Docker (/var/run/docker.sock) is running and accessible. Set --force to ignore.</div>
<p>Nó từ chối vì user này đã với tới được một daemon root rồi — cài thêm một cái rootless bên cạnh chẳng bảo vệ thêm được gì. Trên server mà user <em>không</em> ở trong nhóm docker, các bước theo tài liệu là <code>dockerd-rootless-setuptool.sh install</code>, rồi <code>systemctl --user start docker</code>, rồi trỏ client vào <code>unix://$XDG_RUNTIME_DIR/docker.sock</code> (qua <code>DOCKER_HOST</code> hoặc <code>docker context use rootless</code>). Khoá không chạy bước cài: nó thay đổi máy.</p>
<table>
<tr><th>Giới hạn của rootless (theo docs)</th><th>Với đồ án sinh viên nghĩa là</th></tr>
<tr><td>Cổng dưới 1024 cần <code>net.ipv4.ip_unprivileged_port_start=0</code></td><td>công bố 8080 thay vì 80, hoặc để một proxy chạy bằng root giữ 80/443. (Máy ảo của Docker Desktop đã đặt sẵn giá trị 0 — nên <code>-p 80:80</code> vẫn chạy trong <code>dk15-rootless</code>; máy Linux của khoá là 1024.)</td></tr>
<tr><td>Không hỗ trợ AppArmor, checkpoint, overlay network, cổng SCTP</td><td>không có mạng overlay của Swarm (Bài 15.3) khi chạy rootless</td></tr>
<tr><td>Giới hạn tài nguyên cần cgroup v2 + systemd</td><td>trên bản phân phối cũ, <code>--memory</code> bị bỏ qua</td></tr>
<tr><td>Mạng đi qua slirp4netns/pasta</td><td>chậm hơn bridge của root một chút; đủ cho phát triển</td></tr>
</table>
<p><strong>userns-remap</strong> là đường ở giữa: daemon vẫn chạy bằng root, nhưng container chạy trong một user namespace. Một dòng trong <code>/etc/docker/daemon.json</code>, <code>"userns-remap": "default"</code>, khiến Docker tạo user <code>dockremap</code> và ánh xạ uid 0 của container vào đầu dải id phụ của user đó (ví dụ trong docs: <code>dockremap:231072:65536</code>, tức root bên trong là 231072 bên ngoài). Hai cảnh báo của tài liệu đáng nhớ: bật nó lên "effectively masks existing image and container layers" (thực tế che mất các tầng ảnh và container đang có) — <code>docker image ls</code> ra rỗng cho tới khi bạn tắt nó — và nó không đi được với <code>--pid=host</code>, <code>--network=host</code>, <code>--privileged</code> (trừ khi container xin ra ngoài bằng <code>--userns=host</code>). Nó còn cần khởi động lại daemon, tức dừng mọi container trên máy; khoá không bật nó.</p>

<h3>Những lớp bảo vệ bạn đã có sẵn: seccomp, capability, LSM</h3>
${slide('dk-15', 12, 'seccomp đã bật sẵn; --cap-drop ALL còn chặt hơn')}
<p>Ngay cả một container thường chạy dưới daemon root cũng không phải "root với một hệ file khác". Ba lớp được bật sẵn, và bạn nhìn thấy chúng từ bên trong:</p>
<pre><code class="language-bash">docker run --rm alpine:3 grep -E "^(CapEff|NoNewPrivs|Seccomp):" /proc/self/status
docker run --rm alpine:3 unshare -U id
docker run --rm --security-opt seccomp=unconfined alpine:3 unshare -U id
docker run --rm --cap-drop ALL alpine:3 sh -c "chown nobody /tmp"</code></pre>
<div class="out">CapEff:	00000000a80425fb
NoNewPrivs:	0
Seccomp:	2
unshare: unshare(0x10000000): Operation not permitted
uid=65534(nobody) gid=65534(nobody) groups=65534(nobody),…
chown: /tmp: Operation not permitted</div>
<table>
<tr><th>Dòng</th><th>Nó nói gì</th></tr>
<tr><td><code>Seccomp: 2</code></td><td>đang có bộ lọc seccomp (0 = không có, 2 = đang lọc). Hồ sơ mặc định của Docker "disables around 44 system calls out of 300+" (chặn khoảng 44 trên hơn 300 lời gọi hệ thống)</td></tr>
<tr><td><code>unshare … Operation not permitted</code></td><td>tạo user namespace mới là một trong số đó — bị seccomp chặn, không phải do quyền file</td></tr>
<tr><td><code>seccomp=unconfined</code> ⇒ chạy được</td><td>bằng chứng rằng chính bộ lọc, không phải nhân Linux, đã từ chối. Đừng bao giờ đem <code>unconfined</code> lên production</td></tr>
<tr><td><code>CapEff: 00000000a80425fb</code></td><td>bộ capability mặc định: 14 bit bật trên 41 — là root bên trong, nhưng bị tước phần lớn quyền năng (Bài 6.4)</td></tr>
<tr><td><code>--cap-drop ALL</code> ⇒ <code>chown</code> hỏng</td><td>thiếu <code>CAP_CHOWN</code> thì đến root cũng không đổi được chủ của file</td></tr>
</table>
<p>Lớp thứ ba là một Linux Security Module (mô-đun bảo mật của Linux, LSM): hồ sơ AppArmor <code>docker-default</code> trên Ubuntu (tức trên VPS thông thường), SELinux trên Fedora/RHEL. <code>docker info --format '{{json .SecurityOptions}}'</code> trên cả hai máy của khoá in ra <code>["name=seccomp,profile=builtin","name=cgroupns"]</code> — máy Fedora có SELinux nhưng Docker ở đó không được cấu hình để dùng nó, còn máy ảo của Docker Desktop không có LSM nào. Trên VPS Ubuntu của bạn sẽ thấy thêm <code>name=apparmor</code>. Không lớp nào trong số này giải được chuyện nhóm docker: chúng giới hạn thứ một <em>container</em> làm được, chứ không giới hạn thứ mà người ra lệnh cho daemon được phép đòi.</p>

<h3>Podman: cùng câu lệnh, không có daemon</h3>
${slide('dk-15', 13, 'Podman: không có tiến trình nền, chạy rootless mặc định, có "pod"')}
<p>Podman, của Red Hat, chạy container OCI với một CLI chép theo Docker (<code>podman run</code>, <code>podman build</code>, <code>podman ps</code>…), nhưng không có daemon chạy thường trực: mỗi container được khởi động trực tiếp và được một tiến trình tí hon <code>conmon</code> trông chừng. Chạy bằng user thường thì mặc định là rootless. Trong ảnh chính thức <code>quay.io/podman/stable</code>, bằng user <code>podman</code> của nó (uid 1000):</p>
<pre><code class="language-bash">docker run -d --name dk15-podman --privileged quay.io/podman/stable sleep 900
docker exec -u podman dk15-podman sh -c '
  podman info --format "rootless={{.Host.Security.Rootless}} runtime={{.Host.OCIRuntime.Name}} driver={{.Store.GraphDriverName}}"
  podman run --rm docker.io/library/alpine:3 sh -c "id; cat /proc/self/uid_map"'</code></pre>
<div class="out">rootless=true runtime=crun driver=overlay
uid=0(root) gid=0(root) groups=1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video),0(root)
         0       1000          1
         1          1        999
      1000       1001      64535</div>
<p>Cùng ý tưởng user namespace như Docker rootless, với bảng ánh xạ hơi khác (Podman giữ nguyên id 1–999 và ánh xạ phần còn lại từ <code>/etc/subuid</code>). Để ý tên ảnh đầy đủ <code>docker.io/library/alpine:3</code>: Podman không mặc định Docker Hub, nên tên ngắn có thể bị hỏi lại hoặc báo lỗi tuỳ cấu hình.</p>
<p>Thứ Docker không có là <strong>pod</strong>: một nhóm container dùng chung một network namespace (không gian mạng), y như Pod của Kubernetes (Bài 15.4):</p>
<pre><code class="language-bash">podman pod create --name nhom -p 8080:80
podman run -d --pod nhom --name web docker.io/library/nginx:alpine
podman run -d --pod nhom --name kiemtra docker.io/library/alpine:3 sleep 600
podman exec kiemtra wget -qO- http://localhost:80 | grep -o "&lt;title&gt;.*&lt;/title&gt;"
podman kube generate nhom | grep -E "^kind|    name:"
for p in /proc/[0-9]*; do cat $p/comm; done | sort | uniq -c | sort -rn | head -4</code></pre>
<div class="out">&lt;title&gt;Welcome to nginx!&lt;/title&gt;
kind: Pod
    name: web
    name: kiemtra
     11 nginx
      4 conmon
      2 sleep
      2 sh</div>
<p><code>kiemtra</code> gọi được nginx qua <code>localhost</code> vì chúng chung mạng; <code>podman kube generate</code> viết ra một manifest Pod của Kubernetes từ thứ đang chạy; và danh sách tiến trình có nginx, các <code>conmon</code> và không có gì giống <code>dockerd</code>. Hai lưu ý thật thà. Thứ nhất, Podman này chạy lồng trong một container, nên pod báo <code>Degraded</code> (container hạ tầng của nó nằm ở <code>Created</code>) và YAML sinh ra có <code>hostNetwork: true</code> — là dấu vết của việc chạy lồng, không phải của Podman trên máy thật. Thứ hai, <code>podman compose</code> chỉ là một cái vỏ:</p>
<div class="out">Error: looking up compose provider failed
7 errors occurred:
	* exec: "/home/podman/.docker/cli-plugins/docker-compose": stat /home/podman/.docker/cli-plugins/docker-compose: no such file or directory</div>
<p>Nó gọi một chương trình bên ngoài — <code>docker-compose</code> hoặc <code>podman-compose</code> — mà bạn phải cài riêng. Trên server Fedora/RHEL, cách "gốc" của Podman để giữ dịch vụ luôn chạy là tích hợp systemd (Quadlet), không phải Compose.</p>

<h3>Chạy thử từng bước: mình đang chạy với quyền gì?</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · ai với tới được daemon</span><span class="lz-t">id -nG; ls -l /var/run/docker.sock</span><span class="lz-d">Có nhóm docker ⇒ bạn thực chất là root trên máy này.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · lớp bảo vệ nào đang bật</span><span class="lz-t">docker info --format '{{json .SecurityOptions}}'</span><span class="lz-d">Luôn có seccomp; Ubuntu có apparmor; rootless / userns nếu đã cấu hình.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · nhìn từ bên trong</span><span class="lz-t">docker run --rm alpine:3 grep -E "^(CapEff|Seccomp):" /proc/self/status</span><span class="lz-d">Seccomp: 2 và một CapEff đã rút gọn.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · tận mắt thấy user namespace</span><span class="lz-t">docker run -d --name t --privileged docker:29-dind-rootless</span><span class="lz-d">Rồi exec với DOCKER_HOST=unix:///run/user/1000/docker.sock và cat /proc/self/uid_map.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 5 · dọn sạch, kể cả volume</span><span class="lz-t">docker rm -f -v t</span><span class="lz-d">Ảnh dind khai báo VOLUME: -v xoá chúng cùng container.</span></div>
</div>
<div class="callout warn"><strong>Ảnh có <code>VOLUME</code> để lại volume vô danh.</strong> Cả <code>docker:29-dind-rootless</code> lẫn <code>quay.io/podman/stable</code> đều khai báo volume cho kho lưu trữ của chúng. Xoá container của chúng bằng <code>docker rm -f</code> trơn đã để lại bốn volume vô danh (khoảng 155 MB) trên máy Mac của khoá — phát hiện sau đó bằng <code>docker volume ls</code>. Hãy dùng <code>docker rm -f -v</code>, hoặc chạy chúng với <code>--rm</code>, hoặc ghi lại tên volume bằng <code>docker inspect -f '{{range .Mounts}}{{.Name}} {{end}}'</code> trước khi xoá container.</div>

<h3>Chọn cái nào, khi nào</h3>
${slide('dk-15', 14, 'Chọn gì khi nào')}
<table>
<tr><th>Tình huống</th><th>Chọn</th><th>Vì sao</th></tr>
<tr><td>Laptop Mac/Windows của bạn</td><td>Docker Desktop như đang dùng</td><td>daemon đã nằm trong máy ảo; socket docker không trao root của macOS</td></tr>
<tr><td>Server Linux dùng chung của nhóm hay phòng lab</td><td>Docker rootless cho từng người, hoặc Podman</td><td>thành viên chạy container mà không ai thành root</td></tr>
<tr><td>VPS riêng, chỉ bạn quản trị</td><td>Docker thường + container đã siết (Chương 6)</td><td>đơn giản nhất; rủi ro thật nằm ở cổng mở và ảnh lạ</td></tr>
<tr><td>Máy RHEL/Fedora của công ty</td><td>Podman</td><td>cài sẵn, được hỗ trợ, gắn liền systemd</td></tr>
<tr><td>Cần mạng host, overlay network, Swarm</td><td>không dùng rootless / userns-remap</td><td>cả hai chế độ đều không hỗ trợ</td></tr>
<tr><td>CI dựng ảnh bên trong container</td><td>BuildKit rootless hoặc builder từ xa</td><td>đừng bao giờ gắn <code>docker.sock</code> vào job CI</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm bạn được trường cấp một máy ảo Linux cho đồ án SWP391. Một bạn đề nghị thêm cả năm người vào nhóm docker. Trước khi đồng ý, bạn muốn có bằng chứng.</p><ol>
<li>Trên một máy Linux bất kỳ mà bạn ở trong nhóm docker, chạy <code>cat /etc/shadow</code>, rồi phép thử <code>docker run … -v /etc/shadow:/s:ro … wc -l</code>. Ghi lại cả hai kết quả.</li>
<li>Trên Mac, chạy <code>docker:29-dind-rootless</code> với <code>--privileged</code>, và bên trong đó so <code>id</code> với <code>/proc/self/uid_map</code> của một container lồng.</li>
<li>Bên trong nó, dùng một container tạo file trong <code>/tmp</code> đã gắn vào rồi so <code>ls -ln</code> bên trong và bên ngoài.</li>
<li>Chạy bốn lệnh seccomp/capability ở trên và giải thích mỗi dòng bằng một câu.</li>
<li>Xoá container dind bằng <code>docker rm -f -v</code>, và kiểm <code>docker volume ls</code> không có volume vô danh mới nào.</li></ol>
<p><strong>Đạt khi:</strong> bạn có một đoạn văn gửi nhóm, dựa trên output của chính mình, giải thích vì sao nhóm docker bằng root và bạn đề xuất phương án nào (rootless hay Podman) cho máy ảo — và không còn container hay volume nào của bài tập.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rootful / rootless (chạy bằng root / không cần root)</span><span class="v">Docker daemon chạy bằng root hay bằng một user thường.</span></div>
  <div class="kv"><span class="k">docker.sock (socket của Docker)</span><span class="v">Cổng giao tiếp dạng file mà CLI nói chuyện với daemon; ghi được vào nó = root trên máy rootful.</span></div>
  <div class="kv"><span class="k">User namespace (không gian tên người dùng)</span><span class="v">Tính năng của nhân ánh xạ uid bên trong sang uid khác bên ngoài; root bên trong thành user thường bên ngoài.</span></div>
  <div class="kv"><span class="k">subuid / subgid (dải id phụ)</span><span class="v">Những dải id mà một user được dùng để ánh xạ, ghi trong <code>/etc/subuid</code> và <code>/etc/subgid</code>.</span></div>
  <div class="kv"><span class="k">userns-remap (ánh xạ lại user namespace)</span><span class="v">Daemon vẫn chạy bằng root nhưng chạy container trong namespace của user <code>dockremap</code>.</span></div>
  <div class="kv"><span class="k">seccomp (lọc lời gọi hệ thống)</span><span class="v">Bộ lọc system call; hồ sơ mặc định của Docker chặn khoảng 44 cái nguy hiểm.</span></div>
  <div class="kv"><span class="k">Podman / pod (nhóm container chung mạng)</span><span class="v">Engine không daemon, tương thích Docker; pod là vài container dùng chung một mạng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ở trong nhóm docker là root: một user thường đã đọc được <code>/etc/shadow</code> chỉ bằng một lệnh <code>docker run</code>.</li>
<li>Docker rootless chạy cả bộ máy bằng một user; uid 0 trong container thành uid 1000 trên máy chủ, đo thật.</li>
<li>Rootless phải bỏ cổng dưới 1024, overlay network, AppArmor và (trên hệ cũ) giới hạn tài nguyên; userns-remap che mất ảnh đang có và cần khởi động lại daemon.</li>
<li>Container nào cũng đã có seccomp (<code>Seccomp: 2</code>) và bộ capability rút gọn; <code>--cap-drop ALL</code> siết thêm.</li>
<li>Podman cho cùng câu lệnh mà không có daemon, mặc định rootless, thêm pod và <code>kube generate</code>; <code>podman compose</code> cần cài chương trình riêng.</li>
<li>Laptop: giữ Docker Desktop. Server Linux dùng chung: rootless hoặc Podman. VPS riêng: Docker thường, container đã siết.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/security/rootless/" target="_blank" rel="noopener">
  <span class="lc-ico">🧑‍💻</span>
  <span class="lc-body"><span class="lc-title">Chế độ rootless</span><span class="lc-sub">Điều kiện, cách cài, và các giới hạn đã biết khi chạy daemon bằng user thường.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/userns-remap/" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">Cô lập container bằng user namespace</span><span class="lc-sub"><code>userns-remap</code>, user <code>dockremap</code> và các hạn chế của nó.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/seccomp/" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Hồ sơ bảo mật seccomp</span><span class="lc-sub">Hồ sơ mặc định chặn những gì và cách đưa hồ sơ của riêng bạn.</span></span>
</a>
<a class="link-card" href="https://podman.io/docs" target="_blank" rel="noopener">
  <span class="lc-ico">🦭</span>
  <span class="lc-body"><span class="lc-title">Tài liệu Podman</span><span class="lc-sub">Cài đặt, thiết lập rootless, pod và Quadlet.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab</span><span class="lc-sub">Bài tập Docker có chấm tự động.</span></span>
</a>

<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Với tới được socket của một daemon chạy root là có root, bất kể container được siết thế nào. Docker rootless và Podman đẩy root vào một user namespace, nên thoát khỏi container chỉ đưa tới một user thường — đổi lại mất vài tính năng. Các lớp mặc định (seccomp, capability, AppArmor/SELinux) bảo vệ bạn khỏi container, không khỏi những người ra lệnh được cho daemon.</p>
</div>
`,
    },
    /* ─────────────────────────── 15.3 ─────────────────────────── */
    {
      title: '15.3 — Several machines, lightly: Docker Swarm|||15.3 — Nhiều máy ở mức nhẹ: Docker Swarm',
      slug: 'dk-15-3-swarm',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Swarm một nút chạy thật: kiểm inactive trước, swarm init, service với replicas và routing mesh, tự dựng lại task, cập nhật cuốn chiếu và rollback không rớt request, secret dạng tmpfs, stack deploy từ file compose và những khoá bị bỏ qua, rồi rời swarm sạch sẽ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3</span>
<h2>Several machines, lightly: Docker Swarm</h2>
<p class="lead">Compose runs your stack on one machine. If that machine reboots for a kernel update, the site is down; if the API container crashes, <code>restart: always</code> brings it back on the same machine or not at all; and updating the image means a few seconds where the old container is gone and the new one is not ready. Swarm mode — built into every Docker Engine — answers those three problems with the file format you already know, before you ever need Kubernetes.</p>
<p>The documentation is explicit that this is "Docker Swarm mode", built into the engine, and not the old "Docker Classic Swarm", which "is no longer actively developed". Everything below ran on the course Mac as a one-node swarm, which is enough to see every mechanism; a real cluster simply adds machines with <code>docker swarm join</code>.</p>

<h3>Check first, then one command</h3>
${slide('dk-15', 15, 'Swarm có sẵn trong Docker Engine: một lệnh biến máy thành cụm')}
<p>Turning a machine into a swarm manager changes the engine's state, and <code>docker swarm leave --force</code> at the end is only safe on a machine that was not in a swarm before. So the first command is a check:</p>
<pre><code class="language-bash">docker info --format '{{.Swarm.LocalNodeState}}'
docker swarm init
docker node ls
docker network ls --filter driver=overlay</code></pre>
<div class="out">inactive
Swarm initialized: current node (xhcje1fvesbn9kx7qm4mmnqr1) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-…(token)… 192.168.65.3:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
ID                            HOSTNAME         STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
xhcje1fvesbn9kx7qm4mmnqr1 *   docker-desktop   Ready     Active         Leader           29.8.0
ingress overlay swarm</div>
<p>Four ideas are hiding in that output:</p>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td>manager</td><td>A node that stores the cluster's desired state (replicated with the Raft algorithm) and accepts commands. Use 1, 3 or 5 managers — an odd number, so a majority survives one or two failures.</td></tr>
<tr><td>worker</td><td>A node that only runs tasks. A manager is also a worker unless you drain it.</td></tr>
<tr><td>join token</td><td>The password for joining; anyone with the worker token can add a machine to your cluster. Treat it as a secret (it was masked above).</td></tr>
<tr><td><code>ingress</code> overlay network</td><td>Created automatically; carries the routing mesh described below.</td></tr>
</table>
<p>Between real machines, Swarm needs TCP 2377 (cluster management), TCP/UDP 7946 (node-to-node) and UDP 4789 (overlay traffic) open between the nodes — and closed to the Internet. <code>192.168.65.3</code> is the address of the Docker Desktop VM, so a second physical machine could not join this particular swarm; on Linux servers you would pass <code>--advertise-addr</code> with the private IP.</p>

<h3>A service is a desired state, not a container</h3>
${slide('dk-15', 16, 'service = "tôi muốn 3 bản chạy"; routing mesh chia đều request')}
<pre><code class="language-bash">docker network create -d overlay dk15-net
docker service create --name dk15-web --replicas 3 --network dk15-net \\
  -p 18151:80 traefik/whoami:v1.10
docker service ls
for i in 1 2 3 4 5 6; do curl -s localhost:18151 | grep Hostname; done</code></pre>
<div class="out">verify: Service egfj88m3u4tlfud7zdbktffjn converged
ID             NAME       MODE         REPLICAS   IMAGE                  PORTS
egfj88m3u4tl   dk15-web   replicated   3/3        traefik/whoami:v1.10   *:18151-&gt;80/tcp
Hostname: b005bd33a10c
Hostname: 53b2cf9b51e0
Hostname: 14b4d12eae49
Hostname: b005bd33a10c
Hostname: 53b2cf9b51e0
Hostname: 14b4d12eae49</div>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Compose equivalent</th></tr>
<tr><td><code>--replicas 3</code></td><td>keep three tasks running, always</td><td><code>deploy.replicas: 3</code></td></tr>
<tr><td><code>--network dk15-net</code></td><td>attach to an overlay network spanning all nodes</td><td><code>networks:</code> with <code>driver: overlay</code></td></tr>
<tr><td><code>-p 18151:80</code></td><td>publish through the routing mesh on <em>every</em> node</td><td><code>ports:</code></td></tr>
<tr><td><code>traefik/whoami:v1.10</code></td><td>a tiny server that answers with its own hostname — ideal for seeing load balancing</td><td><code>image:</code></td></tr>
</table>
<p>The six requests went round-robin over the three containers. This is the <strong>routing mesh</strong>: port 18151 is opened on every node of the swarm, and whichever node receives a request forwards it to some healthy task, even one on another machine. Notice <code>*:18151</code> in the PORTS column — published on all interfaces. Like any published port, on a Linux server it is opened in iptables ahead of ufw (Lesson 14.3), so put databases on overlay networks without <code>-p</code>, never on the mesh.</p>

<h3>Kill a task and watch it come back</h3>
${slide('dk-15', 17, 'Giết một task: swarm tự dựng lại, không ai phải gõ gì')}
<pre><code class="language-bash">docker ps --filter name=dk15-web --format '{{.Names}}'
docker rm -f $(docker ps -q --filter name=dk15-web.2.)
sleep 6; docker service ps dk15-web --format '{{.Name}}\\t{{.CurrentState}}\\t{{.Error}}'</code></pre>
<div class="out">dk15-web.2.7kfapmbnmnksb0vq6xnpsu9ig
dk15-web.3.yn4yn0io2wczpy9z075g7j0tr
dk15-web.1.fnipy1bslbt11go4q7xvhs85z
dk15-web.1	Running 19 seconds ago
dk15-web.2	Running less than a second ago
dk15-web.2	Failed 5 seconds ago	"task: non-zero exit (137)"
dk15-web.3	Running 19 seconds ago</div>
<p>Each task is a container named <code>&lt;service&gt;.&lt;slot&gt;.&lt;task id&gt;</code>. Killing slot 2 produced exit 137 (SIGKILL, Chapter 2); the manager noticed that "3 wanted, 2 running" and scheduled a <em>new</em> task — new id, same slot — within seconds. That is different from Compose's <code>restart: always</code>, which restarts the same container on the same machine; if a whole node dies, Swarm reschedules its tasks elsewhere. The failed task stays in the history (by default five per slot), and its <code>ERROR</code> column is the first place to look when a service keeps flapping.</p>

<h3>Rolling update and rollback, measured</h3>
${slide('dk-15', 18, 'Cập nhật cuốn chiếu: 150 request, không rớt cái nào')}
<pre><code class="language-bash">docker service update --image traefik/whoami:v1.11 \\
  --update-parallelism 1 --update-delay 5s \\
  --update-failure-action rollback dk15-web
docker service ps dk15-web --format '{{.Name}}\\t{{.Image}}\\t{{.DesiredState}}\\t{{.CurrentState}}'</code></pre>
<div class="out">verify: Service dk15-web converged
dk15-web.1	traefik/whoami:v1.11	Running	Running 13 seconds ago
dk15-web.1	traefik/whoami:v1.10	Shutdown	Shutdown 14 seconds ago
dk15-web.2	traefik/whoami:v1.11	Running	Running 22 seconds ago
dk15-web.2	traefik/whoami:v1.10	Shutdown	Shutdown 23 seconds ago
dk15-web.2	traefik/whoami:v1.10	Shutdown	Failed 48 seconds ago
dk15-web.3	traefik/whoami:v1.11	Running	Running 5 seconds ago
dk15-web.3	traefik/whoami:v1.10	Shutdown	Shutdown 5 seconds ago</div>
<table>
<tr><th>Flag</th><th>Meaning</th></tr>
<tr><td><code>--update-parallelism 1</code></td><td>replace one task at a time</td></tr>
<tr><td><code>--update-delay 5s</code></td><td>wait 5 s between batches (the whole update took 27 s)</td></tr>
<tr><td><code>--update-failure-action rollback</code></td><td>if new tasks fail to start, go back to the previous spec automatically (default is <code>pause</code>)</td></tr>
<tr><td><code>--update-order</code></td><td><code>stop-first</code> (default, shown by <code>service inspect</code>) or <code>start-first</code> — start the new task before stopping the old, at the cost of briefly running one extra</td></tr>
</table>
<p>Read the history by the timestamps: slot 2 first (22 s ago), slot 1 (13 s), slot 3 (5 s). While one was being replaced the other two kept serving. To measure that rather than believe it, the rollback ran while 150 requests were sent, one every 0.1 s:</p>
<pre><code class="language-bash">( ok=0; bad=0; for i in $(seq 1 150); do
    c=$(curl -s -o /dev/null -m 2 -w '%{http_code}' localhost:18151)
    [ "$c" = 200 ] &amp;&amp; ok=$((ok+1)) || bad=$((bad+1)); sleep 0.1
  done; echo "200=$ok loi=$bad" ) &amp;
docker service rollback dk15-web; wait</code></pre>
<div class="out">verify: Service dk15-web converged
200=150 loi=0</div>
<p>All three tasks went back to <code>v1.10</code> and not a single request failed. Compare with <code>docker compose up -d</code> after changing an image tag on a single machine: the old container stops, the new one starts, and for those seconds the site answers 502.</p>

<h3>Swarm secrets: a read-only file in memory</h3>
${slide('dk-15', 19, 'Secret của Swarm: file tmpfs chỉ-đọc, không bao giờ là biến môi trường')}
<pre><code class="language-bash">printf 'MatKhau#2026' | docker secret create dk15-db-pass -
docker secret inspect dk15-db-pass --format '{{json .Spec}}'
docker service create -d --name dk15-sdemo --secret dk15-db-pass alpine:3 sh -c \\
  'ls -l /run/secrets; mount | grep secrets; echo "doc duoc: $(cat /run/secrets/dk15-db-pass | wc -c) byte"; env | grep -ci matkhau; sleep 3600'
docker service logs --raw dk15-sdemo</code></pre>
<div class="out">odvg42wbph6zmm8ku07m8tyjm
{"Name":"dk15-db-pass","Labels":{"dkhoc":"15"}}
total 4
-r--r--r--    1 root     root            12 Sep 24 01:18 dk15-db-pass
tmpfs on /run/secrets/dk15-db-pass type tmpfs (ro,relatime)
doc duoc: 12 byte
0</div>
<p>The secret is stored encrypted in the managers' Raft log, <code>inspect</code> never shows its value, and only tasks that were granted it see it — as a file on a read-only <code>tmpfs</code> (memory, never disk) at <code>/run/secrets/&lt;name&gt;</code>. It is not an environment variable (<code>env | grep</code> found 0 matches), so it does not show up in <code>docker inspect</code> or crash dumps. Official images read such files through <code>_FILE</code> variables: <code>POSTGRES_PASSWORD_FILE=/run/secrets/db_pass</code>. Secrets exist only in swarm mode; after leaving the swarm, <code>docker secret ls</code> answers <code>This node is not a swarm manager.</code></p>

<h3>docker stack deploy: your compose file, almost</h3>
${slide('dk-15', 20, 'stack deploy: file compose gần như giữ nguyên — nhưng vài khoá bị BỎ QUA')}
<pre><code class="language-yaml">services:
  web:
    image: traefik/whoami:v1.10
    build: ./web
    ports:
      - "18152:80"
    networks: [back]
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 5s
        failure_action: rollback
      resources:
        limits:
          memory: 64M
  cache:
    image: redis:7-alpine
    container_name: cache
    depends_on: [web]
    networks: [back]
    volumes:
      - cachedata:/data
    secrets:
      - db_pass

networks:
  back:
    driver: overlay

volumes:
  cachedata:

secrets:
  db_pass:
    external: true
    name: dk15-db-pass</code></pre>
<pre><code class="language-bash">docker stack deploy -c compose.yaml dk15-stack
docker stack services dk15-stack</code></pre>
<div class="out">Ignoring unsupported options: build

Ignoring deprecated options:

container_name: Setting the container name is not supported.

Since --detach=false was not specified, tasks will be created in the background.
In a future release, --detach=false will become the default.
Creating network dk15-stack_back
Creating service dk15-stack_cache
Creating service dk15-stack_web
ID             NAME               MODE         REPLICAS   IMAGE                  PORTS
w5vyfywbseyw   dk15-stack_cache   replicated   1/1        redis:7-alpine
zq7jkuup1m7t   dk15-stack_web     replicated   2/2        traefik/whoami:v1.10   *:18152-&gt;80/tcp</div>
<p>What the stack did with each key, checked afterwards: the <code>deploy:</code> block is honoured (2 replicas; <code>docker inspect</code> of a web task shows <code>HostConfig.Memory</code> = <code>67108864</code>, i.e. 64 MB); every name is prefixed with the stack name (<code>dk15-stack_back</code>, the volume <code>dk15-stack_cachedata</code>); the secret appears at <code>/run/secrets/db_pass</code> in the cache task; and from the cache container, <code>getent hosts web</code> returns a single virtual IP (<code>10.0.2.5</code>) while <code>nslookup tasks.web</code> returns the two real task IPs (<code>10.0.2.6</code>, <code>10.0.2.7</code>). <code>build:</code> and <code>container_name:</code> are rejected with a message. The documentation adds a warning worth knowing: <code>docker stack deploy</code> uses "the legacy Compose file version 3 format"; newer Compose-specification keys may not be understood.</p>
<div class="pitfall co-tieu-de"><strong><code>depends_on</code> is ignored — and nothing says so.</strong> <code>build</code> and <code>container_name</code> produced warnings; <code>depends_on: [web]</code> produced none, and Swarm starts tasks in whatever order it likes. An API that crashes when the database is not up yet will crash-loop until it happens to start after it. The fix is the same as in Kubernetes: the application retries its connection (with a healthcheck telling the orchestrator when it is really ready), instead of relying on start order.</div>

<h3>Leaving cleanly</h3>
<pre><code class="language-bash">docker stack rm dk15-stack
docker service rm dk15-web dk15-sdemo
docker secret rm dk15-db-pass; docker network rm dk15-net
docker swarm leave --force
docker info --format '{{.Swarm.LocalNodeState}}'
docker volume rm dk15-stack_cachedata
docker network ls --format '{{.Name}}' | grep gwbridge</code></pre>
<div class="out">Node left the swarm.
inactive
dk15-stack_cachedata
docker_gwbridge</div>
<p>Two leftovers to know about: stack volumes survive <code>stack rm</code> (on purpose — they hold data), and the <code>docker_gwbridge</code> network that <code>swarm init</code> created stays after leaving. It had no containers, so <code>docker network rm docker_gwbridge</code> removed it and the network list matched the one recorded before the lesson.</p>

<h3>Try it step by step</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · check you are not in a swarm</span><span class="lz-t">docker info --format '{{.Swarm.LocalNodeState}}'</span><span class="lz-d">Must print inactive. Anything else: stop and ask whoever set it up.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · init and one service</span><span class="lz-t">docker swarm init; docker service create --name web --replicas 3 -p 8080:80 traefik/whoami</span><span class="lz-d">curl it several times: the Hostname changes.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · break it</span><span class="lz-t">docker rm -f $(docker ps -q --filter name=web.1.)</span><span class="lz-d">docker service ps web shows Failed and a new Running task.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · update, then roll back</span><span class="lz-t">docker service update --image traefik/whoami:v1.11 --update-delay 5s web; docker service rollback web</span><span class="lz-d">Keep a curl loop running in another terminal.</span></div>
  <div class="lz-step"><span class="lz-k">Step 5 · leave</span><span class="lz-t">docker service rm web; docker swarm leave --force</span><span class="lz-d">State back to inactive; remove docker_gwbridge if it is empty.</span></div>
</div>

<h3>When Swarm, when not</h3>
<table>
<tr><th>You have…</th><th>Use</th></tr>
<tr><td>one VPS, one app, downtime of a few seconds per deploy is acceptable</td><td>Compose (Chapters 9–11). Swarm on one node buys you rolling updates and secrets, little else</td></tr>
<tr><td>2–5 machines, want failover and zero-downtime updates, a small team</td><td>Swarm — the same YAML, no new control plane to learn</td></tr>
<tr><td>rootless Docker or Podman</td><td>not Swarm (no overlay networks in rootless; Podman has no swarm mode)</td></tr>
<tr><td>many teams, autoscaling, the wider ecosystem (operators, Helm charts, managed clouds)</td><td>Kubernetes (Lesson 15.4)</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the demo server of your project restarts the API container every time you deploy, and the teacher saw a 502 during the last review. You want to show the group that a one-node swarm deploys without errors.</p><ol>
<li>Check <code>docker info --format '{{.Swarm.LocalNodeState}}'</code> prints <code>inactive</code>, then <code>docker swarm init</code>.</li>
<li>Create <code>web</code> with 3 replicas of <code>traefik/whoami:v1.10</code> on a port in your range, and confirm the hostnames rotate.</li>
<li>Start a 150-request curl loop in the background and run <code>docker service update --image traefik/whoami:v1.11 --update-parallelism 1 --update-delay 5s web</code>. Record the counts.</li>
<li>Deploy the same app as a stack from a compose file with a <code>deploy:</code> block, and find which keys were ignored.</li>
<li>Remove everything, <code>docker swarm leave --force</code>, and confirm <code>inactive</code>.</li></ol>
<p><strong>Done when:</strong> the curl loop reports <code>loi=0</code>, you can name the ignored keys (<code>build</code>, <code>container_name</code>, and the silent <code>depends_on</code>), and <code>docker info</code> is back to <code>inactive</code> with no service or stack volume left.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Swarm mode</span><span class="v">The clustering built into Docker Engine; not the old, abandoned "Classic Swarm".</span></div>
  <div class="kv"><span class="k">Manager / worker</span><span class="v">Nodes that hold the desired state (managers, Raft) or only run tasks (workers).</span></div>
  <div class="kv"><span class="k">Service / task</span><span class="v">A service is a desired state ("3 of this image"); a task is one running container of it.</span></div>
  <div class="kv"><span class="k">Routing mesh</span><span class="v">Published ports open on every node and forward to any healthy task.</span></div>
  <div class="kv"><span class="k">Overlay network</span><span class="v">A virtual network spanning all nodes, so tasks talk by service name across machines.</span></div>
  <div class="kv"><span class="k">Rolling update</span><span class="v">Replacing tasks in small batches with a delay, keeping the rest serving.</span></div>
  <div class="kv"><span class="k">Stack</span><span class="v">A group of services, networks and volumes deployed from one compose file.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Check <code>LocalNodeState</code> is <code>inactive</code> before <code>swarm init</code>; the join token is a password.</li>
<li>A service keeps N tasks running; killing one produced a new task within seconds.</li>
<li>The routing mesh publishes on every node and spreads requests; published ports are on all interfaces.</li>
<li>Rolling update one task at a time, then a rollback under load: 150 requests, 0 errors.</li>
<li>Swarm secrets are read-only tmpfs files at <code>/run/secrets</code>, never environment variables.</li>
<li><code>docker stack deploy</code> reads your compose file but ignores <code>build</code>, <code>container_name</code> and — silently — <code>depends_on</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/swarm/" target="_blank" rel="noopener">
  <span class="lc-ico">🐝</span>
  <span class="lc-body"><span class="lc-title">Swarm mode overview</span><span class="lc-sub">Concepts, and the difference from the retired Classic Swarm.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/swarm/swarm-tutorial/rolling-update/" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">Apply rolling updates to a service</span><span class="lc-sub">The official walk-through of update parallelism, delay and failure actions.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/swarm/secrets/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Manage sensitive data with Docker secrets</span><span class="lc-sub">How secrets are stored, mounted and rotated.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/swarm/stack-deploy/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Deploy a stack to a swarm</span><span class="lc-sub">Including why images must be in a registry and the Compose v3 format note.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab</span><span class="lc-sub">Docker exercises with automatic grading.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Swarm is already in your Docker Engine: <code>swarm init</code>, and a service keeps the number of copies you asked for, on any node. Rolling updates with a delay kept every request answered, measured. Your compose file mostly works with <code>stack deploy</code> — but build images first, and never rely on <code>depends_on</code>.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3</span>
<h2>Nhiều máy ở mức nhẹ: Docker Swarm</h2>
<p class="lead">Compose chạy cả bộ dịch vụ của bạn trên một máy. Máy đó khởi động lại để cập nhật nhân là trang web chết; container API sập thì <code>restart: always</code> dựng lại nó trên đúng máy đó hoặc không gì cả; còn cập nhật ảnh nghĩa là có vài giây container cũ đã đi mà container mới chưa sẵn sàng. Chế độ Swarm — có sẵn trong mọi Docker Engine — giải ba bài toán đó bằng chính định dạng file bạn đã biết, trước cả khi bạn cần tới Kubernetes.</p>
<p>Tài liệu nói rõ đây là "Docker Swarm mode", nằm sẵn trong engine, không phải "Docker Classic Swarm" cũ vốn "is no longer actively developed" (không còn được phát triển). Mọi thứ dưới đây chạy trên máy Mac của khoá dưới dạng swarm một nút, đủ để thấy mọi cơ chế; một cụm thật chỉ việc thêm máy bằng <code>docker swarm join</code>.</p>

<h3>Kiểm trước, rồi một lệnh</h3>
${slide('dk-15', 15, 'Swarm có sẵn trong Docker Engine: một lệnh biến máy thành cụm')}
<p>Biến một máy thành manager của swarm là thay đổi trạng thái của engine, và <code>docker swarm leave --force</code> lúc cuối chỉ an toàn với máy trước đó CHƯA ở swarm nào. Vậy lệnh đầu tiên là một phép kiểm:</p>
<pre><code class="language-bash">docker info --format '{{.Swarm.LocalNodeState}}'
docker swarm init
docker node ls
docker network ls --filter driver=overlay</code></pre>
<div class="out">inactive
Swarm initialized: current node (xhcje1fvesbn9kx7qm4mmnqr1) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-…(token)… 192.168.65.3:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
ID                            HOSTNAME         STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
xhcje1fvesbn9kx7qm4mmnqr1 *   docker-desktop   Ready     Active         Leader           29.8.0
ingress overlay swarm</div>
<p>Có bốn ý nằm trong output đó:</p>
<table>
<tr><th>Thuật ngữ</th><th>Nghĩa</th></tr>
<tr><td>manager (nút quản lý)</td><td>Nút giữ trạng thái mong muốn của cụm (nhân bản bằng thuật toán Raft) và nhận lệnh. Dùng 1, 3 hoặc 5 manager — số lẻ, để phần đông vẫn còn khi hỏng một hai máy.</td></tr>
<tr><td>worker (nút làm việc)</td><td>Nút chỉ chạy task. Manager cũng là worker, trừ khi bạn "drain" (rút việc khỏi) nó.</td></tr>
<tr><td>join token (mã gia nhập)</td><td>Mật khẩu để vào cụm; ai có token worker là thêm được máy vào cụm của bạn. Coi nó là bí mật (ở trên đã che đi).</td></tr>
<tr><td>mạng overlay <code>ingress</code></td><td>Được tạo tự động; chở routing mesh mô tả ngay dưới.</td></tr>
</table>
<p>Giữa các máy thật, Swarm cần mở TCP 2377 (quản lý cụm), TCP/UDP 7946 (các nút nói chuyện với nhau) và UDP 4789 (lưu lượng overlay) giữa các nút — và ĐÓNG với Internet. <code>192.168.65.3</code> là địa chỉ của máy ảo Docker Desktop, nên một máy vật lý thứ hai không gia nhập được swarm cụ thể này; trên server Linux bạn sẽ truyền <code>--advertise-addr</code> với IP nội bộ.</p>

<h3>Service là một trạng thái mong muốn, không phải một container</h3>
${slide('dk-15', 16, 'service = "tôi muốn 3 bản chạy"; routing mesh chia đều request')}
<pre><code class="language-bash">docker network create -d overlay dk15-net
docker service create --name dk15-web --replicas 3 --network dk15-net \\
  -p 18151:80 traefik/whoami:v1.10
docker service ls
for i in 1 2 3 4 5 6; do curl -s localhost:18151 | grep Hostname; done</code></pre>
<div class="out">verify: Service egfj88m3u4tlfud7zdbktffjn converged
ID             NAME       MODE         REPLICAS   IMAGE                  PORTS
egfj88m3u4tl   dk15-web   replicated   3/3        traefik/whoami:v1.10   *:18151-&gt;80/tcp
Hostname: b005bd33a10c
Hostname: 53b2cf9b51e0
Hostname: 14b4d12eae49
Hostname: b005bd33a10c
Hostname: 53b2cf9b51e0
Hostname: 14b4d12eae49</div>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Tương đương trong Compose</th></tr>
<tr><td><code>--replicas 3</code></td><td>luôn giữ ba task chạy</td><td><code>deploy.replicas: 3</code></td></tr>
<tr><td><code>--network dk15-net</code></td><td>gắn vào mạng overlay trải qua mọi nút</td><td><code>networks:</code> với <code>driver: overlay</code></td></tr>
<tr><td><code>-p 18151:80</code></td><td>công bố qua routing mesh trên <em>mọi</em> nút</td><td><code>ports:</code></td></tr>
<tr><td><code>traefik/whoami:v1.10</code></td><td>server tí hon trả lời bằng chính hostname của nó — lý tưởng để thấy chia tải</td><td><code>image:</code></td></tr>
</table>
<p>Sáu request đi vòng tròn qua ba container. Đây là <strong>routing mesh</strong> (lưới định tuyến): cổng 18151 được mở trên mọi nút của swarm, và nút nào nhận request cũng chuyển nó tới một task khoẻ mạnh, kể cả task ở máy khác. Để ý <code>*:18151</code> ở cột PORTS — công bố trên mọi giao diện mạng. Như mọi cổng công bố khác, trên server Linux nó được mở trong iptables trước cả ufw (Bài 14.3), nên hãy để CSDL trên mạng overlay không có <code>-p</code>, đừng bao giờ đưa nó lên mesh.</p>

<h3>Giết một task và nhìn nó quay lại</h3>
${slide('dk-15', 17, 'Giết một task: swarm tự dựng lại, không ai phải gõ gì')}
<pre><code class="language-bash">docker ps --filter name=dk15-web --format '{{.Names}}'
docker rm -f $(docker ps -q --filter name=dk15-web.2.)
sleep 6; docker service ps dk15-web --format '{{.Name}}\\t{{.CurrentState}}\\t{{.Error}}'</code></pre>
<div class="out">dk15-web.2.7kfapmbnmnksb0vq6xnpsu9ig
dk15-web.3.yn4yn0io2wczpy9z075g7j0tr
dk15-web.1.fnipy1bslbt11go4q7xvhs85z
dk15-web.1	Running 19 seconds ago
dk15-web.2	Running less than a second ago
dk15-web.2	Failed 5 seconds ago	"task: non-zero exit (137)"
dk15-web.3	Running 19 seconds ago</div>
<p>Mỗi task là một container tên <code>&lt;service&gt;.&lt;slot&gt;.&lt;id task&gt;</code>. Giết slot 2 cho ra mã thoát 137 (SIGKILL, Chương 2); manager thấy "muốn 3, đang chạy 2" và xếp lịch một task <em>mới</em> — id mới, cùng slot — trong vài giây. Điều này khác <code>restart: always</code> của Compose, thứ khởi động lại CHÍNH container đó trên CHÍNH máy đó; nếu cả một nút chết, Swarm dời task của nó sang máy khác. Task hỏng vẫn nằm trong lịch sử (mặc định năm bản mỗi slot), và cột <code>ERROR</code> của nó là chỗ đầu tiên cần nhìn khi một service cứ lên lên xuống xuống.</p>

<h3>Cập nhật cuốn chiếu và quay lui, đo thật</h3>
${slide('dk-15', 18, 'Cập nhật cuốn chiếu: 150 request, không rớt cái nào')}
<pre><code class="language-bash">docker service update --image traefik/whoami:v1.11 \\
  --update-parallelism 1 --update-delay 5s \\
  --update-failure-action rollback dk15-web
docker service ps dk15-web --format '{{.Name}}\\t{{.Image}}\\t{{.DesiredState}}\\t{{.CurrentState}}'</code></pre>
<div class="out">verify: Service dk15-web converged
dk15-web.1	traefik/whoami:v1.11	Running	Running 13 seconds ago
dk15-web.1	traefik/whoami:v1.10	Shutdown	Shutdown 14 seconds ago
dk15-web.2	traefik/whoami:v1.11	Running	Running 22 seconds ago
dk15-web.2	traefik/whoami:v1.10	Shutdown	Shutdown 23 seconds ago
dk15-web.2	traefik/whoami:v1.10	Shutdown	Failed 48 seconds ago
dk15-web.3	traefik/whoami:v1.11	Running	Running 5 seconds ago
dk15-web.3	traefik/whoami:v1.10	Shutdown	Shutdown 5 seconds ago</div>
<table>
<tr><th>Cờ</th><th>Nghĩa</th></tr>
<tr><td><code>--update-parallelism 1</code></td><td>thay mỗi lần một task</td></tr>
<tr><td><code>--update-delay 5s</code></td><td>chờ 5 giây giữa các đợt (cả lượt cập nhật mất 27 giây)</td></tr>
<tr><td><code>--update-failure-action rollback</code></td><td>task mới không khởi động được thì tự quay về cấu hình trước (mặc định là <code>pause</code> — dừng lại chờ bạn)</td></tr>
<tr><td><code>--update-order</code></td><td><code>stop-first</code> (mặc định, <code>service inspect</code> cho thấy) hoặc <code>start-first</code> — bật task mới trước khi dừng task cũ, đổi lại chạy dư một bản trong chốc lát</td></tr>
</table>
<p>Đọc lịch sử theo thời gian: slot 2 trước (22 giây trước), rồi slot 1 (13 giây), rồi slot 3 (5 giây). Trong lúc thay một cái, hai cái kia vẫn phục vụ. Để đo chứ không phải tin, lượt quay lui (rollback) được chạy trong khi gửi 150 request, cứ 0,1 giây một cái:</p>
<pre><code class="language-bash">( ok=0; bad=0; for i in $(seq 1 150); do
    c=$(curl -s -o /dev/null -m 2 -w '%{http_code}' localhost:18151)
    [ "$c" = 200 ] &amp;&amp; ok=$((ok+1)) || bad=$((bad+1)); sleep 0.1
  done; echo "200=$ok loi=$bad" ) &amp;
docker service rollback dk15-web; wait</code></pre>
<div class="out">verify: Service dk15-web converged
200=150 loi=0</div>
<p>Cả ba task về lại <code>v1.10</code> và không một request nào hỏng. So với <code>docker compose up -d</code> sau khi đổi tag ảnh trên một máy: container cũ dừng, container mới khởi động, và trong mấy giây đó trang web trả 502.</p>

<h3>Secret của Swarm: một file chỉ-đọc nằm trong RAM</h3>
${slide('dk-15', 19, 'Secret của Swarm: file tmpfs chỉ-đọc, không bao giờ là biến môi trường')}
<pre><code class="language-bash">printf 'MatKhau#2026' | docker secret create dk15-db-pass -
docker secret inspect dk15-db-pass --format '{{json .Spec}}'
docker service create -d --name dk15-sdemo --secret dk15-db-pass alpine:3 sh -c \\
  'ls -l /run/secrets; mount | grep secrets; echo "doc duoc: $(cat /run/secrets/dk15-db-pass | wc -c) byte"; env | grep -ci matkhau; sleep 3600'
docker service logs --raw dk15-sdemo</code></pre>
<div class="out">odvg42wbph6zmm8ku07m8tyjm
{"Name":"dk15-db-pass","Labels":{"dkhoc":"15"}}
total 4
-r--r--r--    1 root     root            12 Sep 24 01:18 dk15-db-pass
tmpfs on /run/secrets/dk15-db-pass type tmpfs (ro,relatime)
doc duoc: 12 byte
0</div>
<p>Secret được lưu mã hoá trong nhật ký Raft của các manager, <code>inspect</code> không bao giờ in giá trị, và chỉ task được cấp mới thấy nó — dưới dạng một file trên <code>tmpfs</code> (bộ nhớ RAM, không bao giờ xuống đĩa) chỉ-đọc ở <code>/run/secrets/&lt;tên&gt;</code>. Nó không phải biến môi trường (<code>env | grep</code> tìm ra 0), nên không hiện trong <code>docker inspect</code> hay bản dump khi sập. Ảnh chính thức đọc những file như vậy qua biến <code>_FILE</code>: <code>POSTGRES_PASSWORD_FILE=/run/secrets/db_pass</code>. Secret chỉ tồn tại trong chế độ swarm; rời swarm rồi thì <code>docker secret ls</code> trả lời <code>This node is not a swarm manager.</code></p>

<h3>docker stack deploy: file compose của bạn, gần như nguyên vẹn</h3>
${slide('dk-15', 20, 'stack deploy: file compose gần như giữ nguyên — nhưng vài khoá bị BỎ QUA')}
<pre><code class="language-yaml">services:
  web:
    image: traefik/whoami:v1.10
    build: ./web
    ports:
      - "18152:80"
    networks: [back]
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 5s
        failure_action: rollback
      resources:
        limits:
          memory: 64M
  cache:
    image: redis:7-alpine
    container_name: cache
    depends_on: [web]
    networks: [back]
    volumes:
      - cachedata:/data
    secrets:
      - db_pass

networks:
  back:
    driver: overlay

volumes:
  cachedata:

secrets:
  db_pass:
    external: true
    name: dk15-db-pass</code></pre>
<pre><code class="language-bash">docker stack deploy -c compose.yaml dk15-stack
docker stack services dk15-stack</code></pre>
<div class="out">Ignoring unsupported options: build

Ignoring deprecated options:

container_name: Setting the container name is not supported.

Since --detach=false was not specified, tasks will be created in the background.
In a future release, --detach=false will become the default.
Creating network dk15-stack_back
Creating service dk15-stack_cache
Creating service dk15-stack_web
ID             NAME               MODE         REPLICAS   IMAGE                  PORTS
w5vyfywbseyw   dk15-stack_cache   replicated   1/1        redis:7-alpine
zq7jkuup1m7t   dk15-stack_web     replicated   2/2        traefik/whoami:v1.10   *:18152-&gt;80/tcp</div>
<table>
<tr><th>Khoá trong file</th><th>stack deploy làm gì — kiểm lại sau khi chạy</th></tr>
<tr><td><code>deploy:</code> (replicas, update_config, resources)</td><td>được áp dụng: 2 bản; <code>docker inspect</code> một task web cho <code>HostConfig.Memory</code> = <code>67108864</code> (64 MB)</td></tr>
<tr><td>tên mạng, volume</td><td>được gắn tiền tố tên stack: <code>dk15-stack_back</code>, volume <code>dk15-stack_cachedata</code></td></tr>
<tr><td><code>secrets:</code></td><td>hiện ra ở <code>/run/secrets/db_pass</code> trong task cache</td></tr>
<tr><td>tên dịch vụ trong mạng</td><td>từ container cache, <code>getent hosts web</code> trả MỘT IP ảo (<code>10.0.2.5</code>); <code>nslookup tasks.web</code> trả hai IP thật của task (<code>10.0.2.6</code>, <code>10.0.2.7</code>)</td></tr>
<tr><td><code>build:</code>, <code>container_name:</code></td><td>bị từ chối, có báo</td></tr>
<tr><td><code>depends_on:</code></td><td>bị bỏ qua, KHÔNG báo gì</td></tr>
</table>
<p>Tài liệu thêm một cảnh báo đáng biết: <code>docker stack deploy</code> dùng "the legacy Compose file version 3 format" (định dạng Compose v3 cũ); những khoá mới của Compose specification có thể không được hiểu.</p>
<div class="pitfall co-tieu-de"><strong><code>depends_on</code> bị bỏ qua — và không ai báo.</strong> <code>build</code> và <code>container_name</code> có cảnh báo; <code>depends_on: [web]</code> thì không một lời, và Swarm khởi động task theo thứ tự nào nó thích. Một API sập khi CSDL chưa lên sẽ sập-dựng-sập liên tục cho tới khi nó tình cờ khởi động sau CSDL. Cách chữa giống hệt ở Kubernetes: ứng dụng tự thử lại kết nối (kèm healthcheck báo cho bộ điều phối khi nào nó sẵn sàng thật), thay vì trông vào thứ tự khởi động.</div>

<h3>Rời đi cho sạch</h3>
<pre><code class="language-bash">docker stack rm dk15-stack
docker service rm dk15-web dk15-sdemo
docker secret rm dk15-db-pass; docker network rm dk15-net
docker swarm leave --force
docker info --format '{{.Swarm.LocalNodeState}}'
docker volume rm dk15-stack_cachedata
docker network ls --format '{{.Name}}' | grep gwbridge</code></pre>
<div class="out">Node left the swarm.
inactive
dk15-stack_cachedata
docker_gwbridge</div>
<p>Hai thứ còn sót cần biết: volume của stack sống sót qua <code>stack rm</code> (cố ý — chúng giữ dữ liệu), và mạng <code>docker_gwbridge</code> mà <code>swarm init</code> tạo ra vẫn còn sau khi rời. Nó không có container nào, nên <code>docker network rm docker_gwbridge</code> xoá được và danh sách mạng khớp lại với danh sách đã ghi trước buổi học.</p>

<h3>Chạy thử từng bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · kiểm mình chưa ở swarm nào</span><span class="lz-t">docker info --format '{{.Swarm.LocalNodeState}}'</span><span class="lz-d">Phải in inactive. Khác thế: dừng lại và hỏi người đã dựng nó.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · init và một service</span><span class="lz-t">docker swarm init; docker service create --name web --replicas 3 -p 8080:80 traefik/whoami</span><span class="lz-d">curl vài lần: Hostname đổi.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · phá nó</span><span class="lz-t">docker rm -f $(docker ps -q --filter name=web.1.)</span><span class="lz-d">docker service ps web thấy Failed và một task Running mới.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · cập nhật, rồi quay lui</span><span class="lz-t">docker service update --image traefik/whoami:v1.11 --update-delay 5s web; docker service rollback web</span><span class="lz-d">Để một vòng curl chạy ở terminal khác.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 5 · rời đi</span><span class="lz-t">docker service rm web; docker swarm leave --force</span><span class="lz-d">Trạng thái về inactive; xoá docker_gwbridge nếu nó trống.</span></div>
</div>

<h3>Khi nào dùng Swarm, khi nào không</h3>
<table>
<tr><th>Bạn có…</th><th>Dùng</th></tr>
<tr><td>một VPS, một app, mỗi lần deploy gián đoạn vài giây là chấp nhận được</td><td>Compose (Chương 9–11). Swarm một nút chỉ đem lại cập nhật cuốn chiếu và secret, ngoài ra chẳng mấy</td></tr>
<tr><td>2–5 máy, muốn chịu lỗi và cập nhật không gián đoạn, nhóm nhỏ</td><td>Swarm — cùng YAML đó, không phải học một bộ điều khiển mới</td></tr>
<tr><td>Docker rootless hoặc Podman</td><td>không phải Swarm (rootless không có overlay network; Podman không có chế độ swarm)</td></tr>
<tr><td>nhiều đội, tự co giãn, cần hệ sinh thái rộng (operator, Helm chart, cloud có quản lý)</td><td>Kubernetes (Bài 15.4)</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> server demo của đồ án khởi động lại container API mỗi lần bạn deploy, và thầy đã thấy một lỗi 502 trong buổi review vừa rồi. Bạn muốn cho cả nhóm thấy một swarm một nút deploy mà không lỗi nào.</p><ol>
<li>Kiểm <code>docker info --format '{{.Swarm.LocalNodeState}}'</code> in <code>inactive</code>, rồi <code>docker swarm init</code>.</li>
<li>Tạo <code>web</code> với 3 bản <code>traefik/whoami:v1.10</code> ở một cổng trong dải của bạn, và xác nhận hostname xoay vòng.</li>
<li>Chạy nền một vòng 150 lần curl rồi chạy <code>docker service update --image traefik/whoami:v1.11 --update-parallelism 1 --update-delay 5s web</code>. Ghi lại hai con số.</li>
<li>Triển khai cùng app đó dưới dạng stack từ một file compose có khối <code>deploy:</code>, và tìm ra khoá nào bị bỏ qua.</li>
<li>Xoá hết, <code>docker swarm leave --force</code>, và xác nhận <code>inactive</code>.</li></ol>
<p><strong>Đạt khi:</strong> vòng curl báo <code>loi=0</code>, bạn nêu được các khoá bị bỏ qua (<code>build</code>, <code>container_name</code>, và <code>depends_on</code> im lặng), và <code>docker info</code> về lại <code>inactive</code>, không còn service hay volume stack nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Swarm mode (chế độ bầy)</span><span class="v">Khả năng lập cụm có sẵn trong Docker Engine; không phải "Classic Swarm" cũ đã bị bỏ.</span></div>
  <div class="kv"><span class="k">Manager / worker (nút quản lý / nút làm việc)</span><span class="v">Nút giữ trạng thái mong muốn (manager, dùng Raft) hoặc chỉ chạy task (worker).</span></div>
  <div class="kv"><span class="k">Service / task (dịch vụ / tác vụ)</span><span class="v">Service là trạng thái mong muốn ("3 bản ảnh này"); task là một container đang chạy của nó.</span></div>
  <div class="kv"><span class="k">Routing mesh (lưới định tuyến)</span><span class="v">Cổng công bố mở trên mọi nút và chuyển tới bất kỳ task khoẻ mạnh nào.</span></div>
  <div class="kv"><span class="k">Overlay network (mạng phủ)</span><span class="v">Mạng ảo trải qua mọi nút, để task gọi nhau bằng tên dịch vụ dù ở máy khác nhau.</span></div>
  <div class="kv"><span class="k">Rolling update (cập nhật cuốn chiếu)</span><span class="v">Thay task theo từng đợt nhỏ có khoảng nghỉ, phần còn lại vẫn phục vụ.</span></div>
  <div class="kv"><span class="k">Stack (bộ dịch vụ)</span><span class="v">Nhóm service, mạng và volume triển khai từ một file compose.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Kiểm <code>LocalNodeState</code> là <code>inactive</code> trước khi <code>swarm init</code>; join token là một mật khẩu.</li>
<li>Service giữ N task luôn chạy; giết một cái thì vài giây sau có task mới.</li>
<li>Routing mesh công bố cổng trên mọi nút và chia request; cổng công bố nằm trên mọi giao diện mạng.</li>
<li>Cập nhật cuốn chiếu từng task, rồi quay lui trong lúc có tải: 150 request, 0 lỗi.</li>
<li>Secret của Swarm là file tmpfs chỉ-đọc ở <code>/run/secrets</code>, không bao giờ là biến môi trường.</li>
<li><code>docker stack deploy</code> đọc file compose của bạn nhưng bỏ qua <code>build</code>, <code>container_name</code> và — im lặng — <code>depends_on</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/swarm/" target="_blank" rel="noopener">
  <span class="lc-ico">🐝</span>
  <span class="lc-body"><span class="lc-title">Tổng quan chế độ Swarm</span><span class="lc-sub">Khái niệm, và khác biệt với Classic Swarm đã nghỉ hưu.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/swarm/swarm-tutorial/rolling-update/" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">Cập nhật cuốn chiếu một service</span><span class="lc-sub">Hướng dẫn chính thức về parallelism, delay và hành động khi hỏng.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/swarm/secrets/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Quản lý dữ liệu nhạy cảm bằng Docker secrets</span><span class="lc-sub">Secret được lưu, gắn vào và thay mới thế nào.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/swarm/stack-deploy/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Triển khai stack lên swarm</span><span class="lc-sub">Kể cả vì sao ảnh phải nằm trên registry và ghi chú về định dạng Compose v3.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab</span><span class="lc-sub">Bài tập Docker có chấm tự động.</span></span>
</a>

<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Swarm đã nằm sẵn trong Docker Engine của bạn: <code>swarm init</code>, và một service giữ đúng số bản bạn yêu cầu, trên nút nào cũng được. Cập nhật cuốn chiếu có khoảng nghỉ đã giữ cho mọi request đều được trả lời, đo thật. File compose phần lớn chạy được với <code>stack deploy</code> — nhưng hãy dựng ảnh trước, và đừng bao giờ trông vào <code>depends_on</code>.</p>
</div>
`,
    },
    /* ─────────────────────────── 15.4 ─────────────────────────── */
    {
      title: '15.4 — From Compose to Kubernetes — and when you do not need it|||15.4 — Từ Compose tới Kubernetes — và khi nào bạn KHÔNG cần nó',
      slug: 'dk-15-4-kubernetes',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bảng đối chiếu Compose ↔ Pod/Deployment/Service/Ingress/ConfigMap/Secret/PVC, một cụm kind thật trong một container, Deployment + Service đọc từng dòng, tự lành/rollout/undo, Secret chỉ là base64, Kompose và ba cái hố của nó, và câu trả lời thẳng: đồ án một VPS không cần Kubernetes.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4</span>
<h2>From Compose to Kubernetes</h2>
<p class="lead">Kubernetes is the word on half the backend and DevOps job ads you will read during your internship search, and the other half assume you know what a Pod is. It is also, for a student project on one VPS, almost always the wrong tool. This lesson does both jobs honestly: it maps every Kubernetes object you will meet onto a Compose concept you already use, runs a real cluster on your laptop so the words become things you have touched, and ends with a clear rule for when not to use it.</p>
<p>The cluster below is <code>kind</code> ("Kubernetes in Docker"), version 0.33, which runs a whole Kubernetes 1.37 node as one Docker container. Its binary was downloaded into a scratch folder — nothing was installed — and it wrote its credentials to a separate <code>kubeconfig</code> file, so the laptop's <code>~/.kube/config</code> was never touched.</p>

<h3>Every Compose idea has a bigger sibling</h3>
${slide('dk-15', 21, 'Mỗi khái niệm Compose có một "người anh" trong Kubernetes')}
<table>
<tr><th>Compose / Swarm</th><th>Kubernetes</th><th>What changes</th></tr>
<tr><td>one container of a service</td><td><strong>Pod</strong></td><td>a Pod may hold several containers sharing network and volumes — like Podman's pod in Lesson 15.2</td></tr>
<tr><td><code>deploy.replicas</code>, <code>docker service</code></td><td><strong>Deployment</strong> (→ ReplicaSet → Pods)</td><td>keeps N copies, rolling updates, <code>kubectl rollout undo</code></td></tr>
<tr><td>the service name on a Compose network</td><td><strong>Service</strong> (ClusterIP)</td><td>a stable virtual IP and DNS name in front of changing Pods — like Swarm's VIP</td></tr>
<tr><td><code>ports: "8080:80"</code></td><td><strong>Service</strong> of type NodePort / LoadBalancer</td><td>NodePorts come from 30000–32767; LoadBalancer needs a cloud</td></tr>
<tr><td>nginx or Caddy in front</td><td><strong>Ingress</strong> + a controller, or <strong>Gateway API</strong></td><td>the docs now say "The Ingress API has been frozen" and recommend Gateway</td></tr>
<tr><td><code>environment:</code>, <code>.env</code></td><td><strong>ConfigMap</strong></td><td>a separate object, shared by many Pods</td></tr>
<tr><td><code>secrets:</code></td><td><strong>Secret</strong></td><td>by default only base64-encoded (see below)</td></tr>
<tr><td>named <code>volumes:</code></td><td><strong>PersistentVolumeClaim</strong></td><td>a request for storage; a StorageClass provides the actual disk</td></tr>
<tr><td><code>healthcheck:</code></td><td><strong>readiness / liveness probes</strong></td><td>readiness decides whether a Pod receives traffic; liveness whether it is restarted</td></tr>
</table>
<p>The deepest difference is not in the table: Kubernetes is entirely declarative and reconciling. You never "start a container"; you write the desired objects, <code>kubectl apply</code> stores them in the API server, and controllers keep working until reality matches — the same idea as Swarm's desired state, applied to everything.</p>

<h3>kind: a whole cluster in one container</h3>
${slide('dk-15', 22, 'kind: cả một cụm Kubernetes gói trong MỘT container')}
<pre><code class="language-yaml">kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
networking:
  apiServerAddress: "127.0.0.1"
  apiServerPort: 18154
nodes:
  - role: control-plane
    extraPortMappings:
      - containerPort: 30080
        hostPort: 18153
        listenAddress: "127.0.0.1"</code></pre>
<pre><code class="language-bash">KIND_EXPERIMENTAL_DOCKER_NETWORK=dk15-kind-net \\
  ./bin/kind create cluster --name dk15 --config kind.yaml --kubeconfig ./kubeconfig
docker ps --filter name=dk15-control --format '{{.Names}}\\t{{.Ports}}'
export KUBECONFIG=$PWD/kubeconfig
kubectl get nodes
kubectl get pods -A --no-headers | wc -l     # counted again after deploying this lesson's apps</code></pre>
<div class="out">Creating cluster "dk15" ...
WARNING: Overriding docker network due to KIND_EXPERIMENTAL_DOCKER_NETWORK
WARNING: Here be dragons! This is not supported currently.
 ✓ Ensuring node image (kindest/node:v1.37.0) 🖼
 ✓ Preparing nodes 📦
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
Set kubectl context to "kind-dk15"
dk15-control-plane	127.0.0.1:18154-&gt;6443/tcp, 127.0.0.1:18153-&gt;30080/tcp
NAME                 STATUS     ROLES           AGE   VERSION
dk15-control-plane   NotReady   control-plane   15s   v1.37.0
14</div>
<table>
<tr><th>Piece</th><th>Why it is there</th></tr>
<tr><td><code>apiServerPort: 18154</code></td><td>pin the Kubernetes API to a known localhost port instead of a random one</td></tr>
<tr><td><code>extraPortMappings</code> 30080 → 18153</td><td>the node is a container, so a NodePort inside it is only reachable if Docker publishes it</td></tr>
<tr><td><code>--kubeconfig ./kubeconfig</code></td><td>keep the cluster's credentials out of <code>~/.kube/config</code></td></tr>
<tr><td><code>KIND_EXPERIMENTAL_DOCKER_NETWORK</code></td><td>used here only so every object carries the course prefix; normally kind creates a network called <code>kind</code> — hence the "Here be dragons" warning</td></tr>
</table>
<p>The first creation took 53 seconds, mostly pulling the 1.3 GB node image; recreating took 10. <code>NotReady</code> right after creation is normal — the network plugin was still starting. The count of 14 was taken after this lesson's apps were deployed (3 web Pods, plus api and db from the Kompose section): the other nine belong to Kubernetes itself (etcd, API server, scheduler, controller manager, kube-proxy, two CoreDNS, the kindnet network plugin, the storage provisioner). <code>docker stats</code> on the node container read <strong>1.06 GiB of RAM</strong> before your application does anything.</p>
<div class="callout warn"><strong>kubectl 1.34 against a 1.37 cluster.</strong> Every command in this lesson worked (including <code>kubectl port-forward svc/web …</code>, tried separately), but the version-skew policy says "<code>kubectl</code> is supported within one minor version (older or newer) of <code>kube-apiserver</code>". A three-version gap is outside it: fine for learning, not something to rely on for a real cluster. <code>kubectl version</code> says so itself:<div class="out">Client Version: v1.34.1
Kustomize Version: v5.7.1
Server Version: v1.37.0
Warning: version difference between client (1.34) and server (1.37) exceeds the supported minor version skew of +/-1</div></div>

<h3>Deployment and Service, read block by block</h3>
${slide('dk-15', 23, 'Deployment + Service: đọc YAML từng khối')}
<pre><code class="language-yaml">apiVersion: v1
kind: ConfigMap
metadata:
  name: web-config
data:
  APP_MODE: "demo"
---
apiVersion: v1
kind: Secret
metadata:
  name: db-pass
type: Opaque
stringData:
  password: "MatKhau#2026"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels: { app: web }
  template:
    metadata:
      labels: { app: web }
    spec:
      containers:
        - name: whoami
          image: traefik/whoami:v1.10
          ports:
            - containerPort: 80
          envFrom:
            - configMapRef: { name: web-config }
          env:
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef: { name: db-pass, key: password }
          resources:
            limits: { memory: "64Mi", cpu: "250m" }
          readinessProbe:
            httpGet: { path: /, port: 80 }
---
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  type: NodePort
  selector: { app: web }
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080</code></pre>
<table>
<tr><th>Field</th><th>Meaning</th></tr>
<tr><td><code>selector.matchLabels</code> + <code>template.metadata.labels</code></td><td>the Deployment manages Pods <em>by label</em>; the two must match or <code>apply</code> is rejected</td></tr>
<tr><td><code>template</code></td><td>the mould every Pod is made from; changing it triggers a rolling update</td></tr>
<tr><td><code>envFrom: configMapRef</code></td><td>every key of the ConfigMap becomes an environment variable</td></tr>
<tr><td><code>secretKeyRef</code></td><td>one key of a Secret becomes one variable</td></tr>
<tr><td><code>resources.limits</code></td><td>the <code>--memory</code>/<code>--cpus</code> of Chapter 11; <code>250m</code> = a quarter of a CPU</td></tr>
<tr><td><code>readinessProbe</code></td><td>traffic only reaches a Pod once <code>GET /</code> succeeds</td></tr>
<tr><td>Service <code>selector: { app: web }</code></td><td>sends to every ready Pod with that label — not to a container name</td></tr>
<tr><td><code>port</code> / <code>targetPort</code> / <code>nodePort</code></td><td>the Service's port / the container's port / the port opened on the node (mapped to 18153 by kind)</td></tr>
</table>
<pre><code class="language-bash">kubectl apply -f app.yaml
kubectl rollout status deploy/web --timeout=120s
kubectl get pods -o wide
for i in 1 2 3 4; do curl -s localhost:18153 | grep Hostname; done</code></pre>
<div class="out">configmap/web-config created
secret/db-pass created
deployment.apps/web created
service/web created
Waiting for deployment "web" rollout to finish: 0 of 3 updated replicas are available...
Waiting for deployment "web" rollout to finish: 1 of 3 updated replicas are available...
Waiting for deployment "web" rollout to finish: 2 of 3 updated replicas are available...
deployment "web" successfully rolled out
NAME                  READY   STATUS    RESTARTS   AGE   IP           NODE                 …
web-8f7db8765-5598d   1/1     Running   0          14s   10.244.0.6   dk15-control-plane   …
web-8f7db8765-mctpc   1/1     Running   0          14s   10.244.0.4   dk15-control-plane   …
web-8f7db8765-smdlw   1/1     Running   0          14s   10.244.0.2   dk15-control-plane   …
Hostname: web-8f7db8765-mctpc
Hostname: web-8f7db8765-mctpc
Hostname: web-8f7db8765-smdlw
Hostname: web-8f7db8765-smdlw</div>
<p>Pod names read as <code>&lt;deployment&gt;-&lt;hash of the template&gt;-&lt;random&gt;</code>: <code>8f7db8765</code> identifies this version of the template, which is how a rollout tells old Pods from new. Unlike Swarm's strict round-robin, the NodePort path here sent requests in pairs — the balancing is per connection and not guaranteed to alternate.</p>

<h3>Self-healing, rollout, undo</h3>
${slide('dk-15', 24, 'Tự lành, rollout, undo — và Secret chỉ là base64')}
<pre><code class="language-bash">kubectl delete pod web-8f7db8765-smdlw
kubectl get pods
kubectl set image deploy/web whoami=traefik/whoami:v1.11
kubectl rollout status deploy/web --timeout=120s | tail -1
kubectl rollout history deploy/web
kubectl rollout undo deploy/web
kubectl get deploy web -o jsonpath='{.spec.template.spec.containers[0].image}'</code></pre>
<div class="out">pod "web-8f7db8765-smdlw" deleted from default namespace
NAME                  READY   STATUS    RESTARTS   AGE
web-8f7db8765-5598d   1/1     Running   0          23s
web-8f7db8765-mctpc   1/1     Running   0          23s
web-8f7db8765-phrxh   1/1     Running   0          1s
deployment.apps/web image updated
deployment "web" successfully rolled out
deployment.apps/web
REVISION  CHANGE-CAUSE
1         &lt;none&gt;
2         &lt;none&gt;

deployment.apps/web rolled back
traefik/whoami:v1.10</div>
<p>The deleted Pod was replaced in one second by <code>…-phrxh</code> (same template hash, new random part). <code>set image</code> changed the template, so a new ReplicaSet was created and scaled up while the old one scaled down; <code>rollout undo</code> swapped them back. It is Swarm's <code>service update</code> / <code>service rollback</code>, with the history kept as ReplicaSets.</p>
<div class="pitfall co-tieu-de"><strong>A Kubernetes Secret is base64, not encryption.</strong> Anyone allowed to read it gets the password back in one pipe:
<pre><code class="language-bash">kubectl get secret db-pass -o jsonpath='{.data.password}'; echo
kubectl get secret db-pass -o jsonpath='{.data.password}' | base64 -d; echo</code></pre>
<div class="out">TWF0S2hhdSMyMDI2
MatKhau#2026</div>
<p>The Kubernetes documentation's own caution: Secrets "are, by default, stored unencrypted in the API server's underlying data store (etcd)", and "anyone who is authorized to create a Pod in a namespace can use that access to read any Secret in that namespace". It recommends enabling encryption at rest, least-privilege RBAC, and external secret stores. Never commit a Secret manifest with real values to Git — <code>stringData</code> in a YAML file is plain text.</p></div>

<h3>Kompose: it translates syntax, not intent</h3>
${slide('dk-15', 25, 'Kompose dịch được cú pháp — không dịch được ý đồ')}
<p><a href="https://kompose.io/" target="_blank" rel="noopener">Kompose</a> converts a compose file into Kubernetes manifests. A typical student compose file — an API image from the local registry and a Postgres with a named volume — went through it:</p>
<pre><code class="language-yaml">services:
  api:
    image: localhost:18150/dk15-api:1.0
    ports:
      - "18155:3000"
    environment:
      DATABASE_URL: postgres://app:app@db:5432/app
    depends_on: [db]
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:</code></pre>
<pre><code class="language-bash">kompose convert -f compose.yaml -o out/
kubectl apply -f out/ &amp;&amp; sleep 40 &amp;&amp; kubectl get pods</code></pre>
<div class="out">WARN Service "db" won't be created because 'ports' is not specified
WARN File don't exist or failed to check if the directory is empty: stat :/var/lib/postgresql/data: no such file or directory
INFO Kubernetes file "out/api-service.yaml" created
INFO Kubernetes file "out/api-deployment.yaml" created
INFO Kubernetes file "out/db-deployment.yaml" created
INFO Kubernetes file "out/pgdata-persistentvolumeclaim.yaml" created
NAME                  READY   STATUS         RESTARTS   AGE
api-cf575759b-vxnf8   0/1     ErrImagePull   0          40s
db-5b4bd69966-8b7f9   1/1     Running        0          40s</div>
<p>Three holes, each a real difference between the two worlds:</p>
<table>
<tr><th>Symptom</th><th>Why</th><th>Fix</th></tr>
<tr><td><code>ErrImagePull</code> for <code>localhost:18150/dk15-api:1.0</code></td><td>inside the node, <code>localhost</code> is the node itself; the cluster cannot see your <code>docker images</code> either</td><td><code>kind load docker-image localhost:18150/dk15-api:1.0 --name dk15</code> (for kind), or push to a registry the cluster can reach</td></tr>
<tr><td>after loading, the API runs but <code>db</code> does not resolve: <code>ENOTFOUND db</code></td><td>in Compose every service is reachable by name; in Kubernetes only a <em>Service</em> gets a DNS name, and Kompose creates one only for services with <code>ports</code></td><td><code>kubectl expose deploy db --port 5432</code> — after which the same lookup returned <code>10.96.125.187</code></td></tr>
<tr><td><code>depends_on</code> disappears</td><td>Kubernetes has no start order at all</td><td>the app retries its database connection; readiness probes gate traffic</td></tr>
</table>
<p>The PVC did work: <code>pgdata</code> became <code>Bound</code> to a 100 Mi volume provisioned by kind's <code>standard</code> StorageClass. Kompose is a good first draft and a good way to learn the objects; the output always needs a human pass.</p>

<h3>What this lesson did not build: Ingress, Gateway, Helm</h3>
<p>A real cluster puts an <strong>Ingress controller</strong> (or, as the Kubernetes docs now recommend, a <strong>Gateway API</strong> implementation) in front, doing what nginx or Caddy did in Chapters 10 and 14: one public port, routing by host name and path, TLS certificates. Applications are usually installed as <strong>Helm charts</strong> — templated bundles of manifests. Both are big topics of their own; the course's <code>/courses/nginx</code> covers the proxy ideas they are built on. What matters here is to recognise the words when a job description uses them.</p>

<h3>When you do NOT need Kubernetes</h3>
${slide('dk-15', 26, 'Khi nào KHÔNG cần Kubernetes')}
<table>
<tr><th>You have…</th><th>Use</th></tr>
<tr><td>one VPS: web + API + database (every SWP391-style project)</td><td>Docker Compose — Chapters 9–11. That is what the course's own site runs on</td></tr>
<tr><td>2–5 machines, want failover and zero-downtime updates</td><td>Swarm (Lesson 15.3), same compose file</td></tr>
<tr><td>many teams, dozens of services, autoscaling, strict multi-tenant isolation</td><td>Kubernetes — usually a managed one (EKS, GKE, AKS) so someone else runs etcd and the control plane</td></tr>
<tr><td>you want to learn it for work</td><td>kind or k3d on your laptop, exactly like this lesson</td></tr>
</table>
<p>Kubernetes does not make an application faster, and on one machine it makes it more fragile: you now operate etcd, certificates that expire, a control plane to upgrade on the project's release cadence, RBAC, a network plugin and an ingress controller. An empty kind cluster already used 1.06 GiB; on a 2 GB VPS that is half the memory spent on orchestration before your Postgres gets any.</p>

<h3>Try it step by step</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · get kind without installing</span><span class="lz-t">curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.33.0/kind-darwin-arm64 &amp;&amp; chmod +x ./kind</span><span class="lz-d">Pick the file for your OS/CPU from the kind releases page.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · a cluster with its own kubeconfig</span><span class="lz-t">./kind create cluster --name hoc --kubeconfig ./kc &amp;&amp; export KUBECONFIG=$PWD/kc</span><span class="lz-d">kubectl get nodes: Ready after a few seconds.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · Deployment + Service</span><span class="lz-t">kubectl apply -f app.yaml; kubectl get pods -w</span><span class="lz-d">Ctrl+C once all Pods are Running.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · reach it</span><span class="lz-t">kubectl port-forward svc/web 8080:80</span><span class="lz-d">Works without extraPortMappings; open localhost:8080.</span></div>
  <div class="lz-step"><span class="lz-k">Step 5 · delete everything</span><span class="lz-t">./kind delete cluster --name hoc</span><span class="lz-d">Removes the node container and its volume.</span></div>
</div>
<p>Cleanup on the course Mac was exactly step 5 plus <code>docker network rm dk15-kind-net</code>; the node's anonymous volume (recorded by id when the cluster was created) was removed by <code>kind delete</code> itself.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> an internship interviewer asks "have you used Kubernetes?". You want to answer with something you actually did, using your group project's compose file.</p><ol>
<li>Download <code>kind</code> and <code>kompose</code> into <code>~/thu-docker/k8s/bin</code> (no install), and create a cluster with <code>--kubeconfig ./kc</code>.</li>
<li>Run <code>kompose convert</code> on your project's compose file. List every warning it prints.</li>
<li>Apply the output. For each Pod that is not <code>Running</code>, find the reason with <code>kubectl describe pod</code> and fix it (<code>kind load docker-image</code>, <code>kubectl expose</code>).</li>
<li>Delete one Pod, change the image with <code>kubectl set image</code>, then <code>kubectl rollout undo</code>.</li>
<li>Delete the cluster and check <code>docker ps -a</code>.</li></ol>
<p><strong>Done when:</strong> every Pod of your app is <code>Running</code>, you can explain in two sentences why Kompose's output failed at first, you have the rollout history output — and one sentence on why your project itself stays on Compose.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pod</span><span class="v">The smallest unit Kubernetes runs: one or more containers sharing network and volumes.</span></div>
  <div class="kv"><span class="k">Deployment / ReplicaSet</span><span class="v">Keeps N Pods of a template; each template version is a ReplicaSet, which is how rollouts and undo work.</span></div>
  <div class="kv"><span class="k">Service</span><span class="v">A stable IP and DNS name in front of Pods selected by label.</span></div>
  <div class="kv"><span class="k">Ingress / Gateway API</span><span class="v">HTTP routing into the cluster; Ingress is frozen, Gateway is the recommended successor.</span></div>
  <div class="kv"><span class="k">ConfigMap / Secret</span><span class="v">Configuration objects; a Secret is only base64 unless encryption at rest is enabled.</span></div>
  <div class="kv"><span class="k">PersistentVolumeClaim</span><span class="v">A request for storage that a StorageClass satisfies with a real disk.</span></div>
  <div class="kv"><span class="k">kubeconfig / kubectl</span><span class="v">The credentials file and the CLI that talks to a cluster's API server.</span></div>
  <div class="kv"><span class="k">kind / Kompose</span><span class="v">A cluster in Docker containers for learning; a compose-to-manifest converter.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Pod ≈ a container of a service, Deployment ≈ replicas, Service ≈ the service name, ConfigMap/Secret ≈ environment/secrets, PVC ≈ a named volume.</li>
<li>kind ran a Kubernetes 1.37 node as one container in 10 s (53 s the first time), using 1.06 GiB of RAM empty.</li>
<li>Deployments self-heal, roll out on template change, and undo with <code>kubectl rollout undo</code>.</li>
<li>A Secret is base64: <code>base64 -d</code> gave the password back; enable encryption and RBAC in real clusters.</li>
<li>Kompose missed a Service for <code>db</code>, could not pull a local image, and dropped <code>depends_on</code> — review its output.</li>
<li>One VPS, one app: Compose. A few machines: Swarm. Many teams and services: managed Kubernetes.</li>
</ul>

<a class="link-card" href="https://kind.sigs.k8s.io/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">kind — Kubernetes in Docker</span><span class="lc-sub">Quick start, configuration (port mappings, API port) and loading local images.</span></span>
</a>
<a class="link-card" href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" target="_blank" rel="noopener">
  <span class="lc-ico">☸️</span>
  <span class="lc-body"><span class="lc-title">Kubernetes Deployments</span><span class="lc-sub">Rollouts, rollbacks, scaling and the ReplicaSets underneath.</span></span>
</a>
<a class="link-card" href="https://kubernetes.io/docs/concepts/configuration/secret/" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Kubernetes Secrets</span><span class="lc-sub">Including the caution about base64 and etcd, and how to protect them.</span></span>
</a>
<a class="link-card" href="https://kubernetes.io/docs/concepts/services-networking/gateway/" target="_blank" rel="noopener">
  <span class="lc-ico">🚪</span>
  <span class="lc-body"><span class="lc-title">Gateway API</span><span class="lc-sub">The recommended successor to Ingress for routing traffic into a cluster.</span></span>
</a>
<a class="link-card" href="https://kompose.io/" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Kompose</span><span class="lc-sub">Convert compose files to Kubernetes manifests — a first draft, not a finished result.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab</span><span class="lc-sub">Docker exercises with automatic grading.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Every Kubernetes object has a Compose counterpart you already understand — learn the mapping, and a manifest stops being scary. kind gives you a real cluster in one container for learning, with its own kubeconfig and one command to delete it. And for one VPS running one project, Compose is not the beginner option; it is the right one.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4</span>
<h2>Từ Compose tới Kubernetes</h2>
<p class="lead">Kubernetes là chữ xuất hiện trong một nửa số tin tuyển backend và DevOps bạn sẽ đọc lúc đi tìm chỗ thực tập, còn nửa kia thì mặc định bạn biết Pod là gì. Nó cũng là thứ, với một đồ án sinh viên chạy trên một VPS, gần như luôn là công cụ SAI. Bài này làm cả hai việc một cách thật thà: đặt mọi đối tượng Kubernetes bạn sẽ gặp cạnh một khái niệm Compose bạn đã dùng, chạy một cụm thật trên laptop để các từ ngữ biến thành thứ bạn đã chạm tay vào, và kết thúc bằng một quy tắc rõ ràng cho lúc KHÔNG nên dùng nó.</p>
<p>Cụm dưới đây là <code>kind</code> ("Kubernetes in Docker" — Kubernetes chạy trong Docker), phiên bản 0.33, chạy trọn một nút Kubernetes 1.37 dưới dạng MỘT container Docker. File chương trình của nó được tải vào một thư mục nháp — không cài gì — và nó ghi thông tin đăng nhập ra một file <code>kubeconfig</code> riêng, nên <code>~/.kube/config</code> của laptop không hề bị đụng tới.</p>

<h3>Mỗi ý tưởng Compose có một "người anh" lớn hơn</h3>
${slide('dk-15', 21, 'Mỗi khái niệm Compose có một "người anh" trong Kubernetes')}
<table>
<tr><th>Compose / Swarm</th><th>Kubernetes</th><th>Khác ở đâu</th></tr>
<tr><td>một container của một service</td><td><strong>Pod</strong></td><td>một Pod có thể chứa vài container dùng chung mạng và volume — như pod của Podman ở Bài 15.2</td></tr>
<tr><td><code>deploy.replicas</code>, <code>docker service</code></td><td><strong>Deployment</strong> (→ ReplicaSet → các Pod)</td><td>giữ N bản, cập nhật cuốn chiếu, <code>kubectl rollout undo</code></td></tr>
<tr><td>tên service trong mạng Compose</td><td><strong>Service</strong> (ClusterIP)</td><td>một IP ảo và tên DNS cố định đứng trước những Pod thay đổi liên tục — như VIP của Swarm</td></tr>
<tr><td><code>ports: "8080:80"</code></td><td><strong>Service</strong> kiểu NodePort / LoadBalancer</td><td>NodePort lấy từ dải 30000–32767; LoadBalancer cần có cloud</td></tr>
<tr><td>nginx hay Caddy đứng trước</td><td><strong>Ingress</strong> + một controller, hoặc <strong>Gateway API</strong></td><td>tài liệu giờ ghi "The Ingress API has been frozen" (API Ingress đã bị đóng băng) và khuyên dùng Gateway</td></tr>
<tr><td><code>environment:</code>, <code>.env</code></td><td><strong>ConfigMap</strong></td><td>một đối tượng riêng, nhiều Pod dùng chung</td></tr>
<tr><td><code>secrets:</code></td><td><strong>Secret</strong></td><td>mặc định chỉ là mã hoá base64 (xem dưới)</td></tr>
<tr><td><code>volumes:</code> có tên</td><td><strong>PersistentVolumeClaim</strong> (yêu cầu ổ lưu trữ)</td><td>một lời xin dung lượng; StorageClass cấp ổ đĩa thật</td></tr>
<tr><td><code>healthcheck:</code></td><td><strong>readiness / liveness probe</strong> (phép thăm dò sẵn sàng / còn sống)</td><td>readiness quyết định Pod có nhận lưu lượng không; liveness quyết định có khởi động lại nó không</td></tr>
</table>
<p>Khác biệt sâu nhất không nằm trong bảng: Kubernetes hoàn toàn theo kiểu khai báo (declarative) và tự điều hoà (reconcile). Bạn không bao giờ "khởi động một container"; bạn viết ra các đối tượng mong muốn, <code>kubectl apply</code> lưu chúng vào API server, và các controller (bộ điều khiển) cứ làm việc cho tới khi thực tế khớp với mong muốn — cùng ý tưởng trạng thái mong muốn của Swarm, áp cho mọi thứ.</p>

<h3>kind: cả một cụm trong một container</h3>
${slide('dk-15', 22, 'kind: cả một cụm Kubernetes gói trong MỘT container')}
<pre><code class="language-yaml">kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
networking:
  apiServerAddress: "127.0.0.1"
  apiServerPort: 18154
nodes:
  - role: control-plane
    extraPortMappings:
      - containerPort: 30080
        hostPort: 18153
        listenAddress: "127.0.0.1"</code></pre>
<pre><code class="language-bash">KIND_EXPERIMENTAL_DOCKER_NETWORK=dk15-kind-net \\
  ./bin/kind create cluster --name dk15 --config kind.yaml --kubeconfig ./kubeconfig
docker ps --filter name=dk15-control --format '{{.Names}}\\t{{.Ports}}'
export KUBECONFIG=$PWD/kubeconfig
kubectl get nodes
kubectl get pods -A --no-headers | wc -l     # đếm lại sau khi triển khai các app trong bài</code></pre>
<div class="out">Creating cluster "dk15" ...
WARNING: Overriding docker network due to KIND_EXPERIMENTAL_DOCKER_NETWORK
WARNING: Here be dragons! This is not supported currently.
 ✓ Ensuring node image (kindest/node:v1.37.0) 🖼
 ✓ Preparing nodes 📦
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
Set kubectl context to "kind-dk15"
dk15-control-plane	127.0.0.1:18154-&gt;6443/tcp, 127.0.0.1:18153-&gt;30080/tcp
NAME                 STATUS     ROLES           AGE   VERSION
dk15-control-plane   NotReady   control-plane   15s   v1.37.0
14</div>
<table>
<tr><th>Phần</th><th>Vì sao có nó</th></tr>
<tr><td><code>apiServerPort: 18154</code></td><td>ghim API của Kubernetes vào một cổng localhost biết trước thay vì một cổng ngẫu nhiên</td></tr>
<tr><td><code>extraPortMappings</code> 30080 → 18153</td><td>nút là một container, nên NodePort bên trong chỉ với tới được nếu Docker công bố nó ra</td></tr>
<tr><td><code>--kubeconfig ./kubeconfig</code></td><td>giữ thông tin đăng nhập của cụm ngoài <code>~/.kube/config</code></td></tr>
<tr><td><code>KIND_EXPERIMENTAL_DOCKER_NETWORK</code></td><td>chỉ dùng ở đây để mọi đối tượng mang tiền tố của khoá; bình thường kind tạo mạng tên <code>kind</code> — vì thế mới có cảnh báo "Here be dragons" (coi chừng rồng)</td></tr>
</table>
<p>Lần tạo đầu mất 53 giây, chủ yếu để kéo ảnh nút 1,3 GB; tạo lại mất 10 giây. <code>NotReady</code> ngay sau khi tạo là bình thường — plugin mạng còn đang khởi động. Con số 14 được đếm sau khi đã triển khai các app trong bài (3 Pod web, cộng api và db ở phần Kompose): chín cái còn lại thuộc về chính Kubernetes (etcd, API server, scheduler, controller manager, kube-proxy, hai CoreDNS, plugin mạng kindnet, bộ cấp ổ lưu trữ). <code>docker stats</code> trên container nút đọc ra <strong>1,06 GiB RAM</strong> trước khi app của bạn làm gì cả.</p>
<div class="callout warn"><strong>kubectl 1.34 nói chuyện với cụm 1.37.</strong> Mọi lệnh trong bài đều chạy (kể cả <code>kubectl port-forward svc/web …</code>, thử riêng), nhưng chính sách lệch phiên bản ghi "<code>kubectl</code> is supported within one minor version (older or newer) of <code>kube-apiserver</code>" (kubectl chỉ được hỗ trợ khi lệch tối đa một phiên bản phụ, cũ hơn hay mới hơn). Lệch ba bản là nằm ngoài: ổn để học, không nên dựa vào với cụm thật. Chính <code>kubectl version</code> cũng nói vậy:<div class="out">Client Version: v1.34.1
Kustomize Version: v5.7.1
Server Version: v1.37.0
Warning: version difference between client (1.34) and server (1.37) exceeds the supported minor version skew of +/-1</div></div>

<h3>Deployment và Service, đọc từng khối</h3>
${slide('dk-15', 23, 'Deployment + Service: đọc YAML từng khối')}
<pre><code class="language-yaml">apiVersion: v1
kind: ConfigMap
metadata:
  name: web-config
data:
  APP_MODE: "demo"
---
apiVersion: v1
kind: Secret
metadata:
  name: db-pass
type: Opaque
stringData:
  password: "MatKhau#2026"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels: { app: web }
  template:
    metadata:
      labels: { app: web }
    spec:
      containers:
        - name: whoami
          image: traefik/whoami:v1.10
          ports:
            - containerPort: 80
          envFrom:
            - configMapRef: { name: web-config }
          env:
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef: { name: db-pass, key: password }
          resources:
            limits: { memory: "64Mi", cpu: "250m" }
          readinessProbe:
            httpGet: { path: /, port: 80 }
---
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  type: NodePort
  selector: { app: web }
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080</code></pre>
<table>
<tr><th>Trường</th><th>Nghĩa</th></tr>
<tr><td><code>selector.matchLabels</code> + <code>template.metadata.labels</code></td><td>Deployment quản lý Pod <em>theo nhãn (label)</em>; hai chỗ này phải khớp, không thì <code>apply</code> bị từ chối</td></tr>
<tr><td><code>template</code></td><td>cái khuôn đúc ra mọi Pod; đổi khuôn là kích hoạt cập nhật cuốn chiếu</td></tr>
<tr><td><code>envFrom: configMapRef</code></td><td>mọi khoá của ConfigMap thành biến môi trường</td></tr>
<tr><td><code>secretKeyRef</code></td><td>một khoá của Secret thành một biến</td></tr>
<tr><td><code>resources.limits</code></td><td>chính là <code>--memory</code>/<code>--cpus</code> của Chương 11; <code>250m</code> = một phần tư CPU</td></tr>
<tr><td><code>readinessProbe</code></td><td>lưu lượng chỉ tới Pod khi <code>GET /</code> thành công</td></tr>
<tr><td>Service <code>selector: { app: web }</code></td><td>gửi tới mọi Pod đã sẵn sàng mang nhãn đó — không phải tới một tên container</td></tr>
<tr><td><code>port</code> / <code>targetPort</code> / <code>nodePort</code></td><td>cổng của Service / cổng trong container / cổng mở trên nút (kind ánh xạ ra 18153)</td></tr>
</table>
<pre><code class="language-bash">kubectl apply -f app.yaml
kubectl rollout status deploy/web --timeout=120s
kubectl get pods -o wide
for i in 1 2 3 4; do curl -s localhost:18153 | grep Hostname; done</code></pre>
<div class="out">configmap/web-config created
secret/db-pass created
deployment.apps/web created
service/web created
Waiting for deployment "web" rollout to finish: 0 of 3 updated replicas are available...
Waiting for deployment "web" rollout to finish: 1 of 3 updated replicas are available...
Waiting for deployment "web" rollout to finish: 2 of 3 updated replicas are available...
deployment "web" successfully rolled out
NAME                  READY   STATUS    RESTARTS   AGE   IP           NODE                 …
web-8f7db8765-5598d   1/1     Running   0          14s   10.244.0.6   dk15-control-plane   …
web-8f7db8765-mctpc   1/1     Running   0          14s   10.244.0.4   dk15-control-plane   …
web-8f7db8765-smdlw   1/1     Running   0          14s   10.244.0.2   dk15-control-plane   …
Hostname: web-8f7db8765-mctpc
Hostname: web-8f7db8765-mctpc
Hostname: web-8f7db8765-smdlw
Hostname: web-8f7db8765-smdlw</div>
<p>Tên Pod đọc là <code>&lt;deployment&gt;-&lt;mã băm của khuôn&gt;-&lt;phần ngẫu nhiên&gt;</code>: <code>8f7db8765</code> nhận diện phiên bản khuôn này, và đó là cách một lượt rollout phân biệt Pod cũ với Pod mới. Khác kiểu vòng tròn đều đặn của Swarm, đường NodePort ở đây gửi request theo cặp — chia tải tính theo kết nối, không bảo đảm luân phiên.</p>

<h3>Tự lành, rollout, undo</h3>
${slide('dk-15', 24, 'Tự lành, rollout, undo — và Secret chỉ là base64')}
<pre><code class="language-bash">kubectl delete pod web-8f7db8765-smdlw
kubectl get pods
kubectl set image deploy/web whoami=traefik/whoami:v1.11
kubectl rollout status deploy/web --timeout=120s | tail -1
kubectl rollout history deploy/web
kubectl rollout undo deploy/web
kubectl get deploy web -o jsonpath='{.spec.template.spec.containers[0].image}'</code></pre>
<div class="out">pod "web-8f7db8765-smdlw" deleted from default namespace
NAME                  READY   STATUS    RESTARTS   AGE
web-8f7db8765-5598d   1/1     Running   0          23s
web-8f7db8765-mctpc   1/1     Running   0          23s
web-8f7db8765-phrxh   1/1     Running   0          1s
deployment.apps/web image updated
deployment "web" successfully rolled out
deployment.apps/web
REVISION  CHANGE-CAUSE
1         &lt;none&gt;
2         &lt;none&gt;

deployment.apps/web rolled back
traefik/whoami:v1.10</div>
<p>Pod bị xoá được thay trong một giây bằng <code>…-phrxh</code> (cùng mã băm khuôn, phần ngẫu nhiên mới). <code>set image</code> đổi khuôn, nên một ReplicaSet mới được tạo và tăng dần số bản trong khi cái cũ giảm dần; <code>rollout undo</code> đổi ngược lại. Đó là <code>service update</code> / <code>service rollback</code> của Swarm, với lịch sử được giữ dưới dạng các ReplicaSet.</p>
<div class="pitfall co-tieu-de"><strong>Secret của Kubernetes là base64, không phải mã hoá.</strong> Ai được phép đọc nó là lấy lại mật khẩu bằng một đường ống:
<pre><code class="language-bash">kubectl get secret db-pass -o jsonpath='{.data.password}'; echo
kubectl get secret db-pass -o jsonpath='{.data.password}' | base64 -d; echo</code></pre>
<div class="out">TWF0S2hhdSMyMDI2
MatKhau#2026</div>
<p>Chính tài liệu Kubernetes cảnh báo: Secret "are, by default, stored unencrypted in the API server's underlying data store (etcd)" (mặc định được lưu KHÔNG mã hoá trong kho dữ liệu etcd), và "anyone who is authorized to create a Pod in a namespace can use that access to read any Secret in that namespace" (ai được tạo Pod trong một namespace là đọc được mọi Secret trong đó). Nó khuyên bật mã hoá khi lưu, RBAC tối thiểu quyền, và kho bí mật bên ngoài. Đừng bao giờ commit một manifest Secret có giá trị thật lên Git — <code>stringData</code> trong file YAML là chữ trần.</p></div>

<h3>Kompose: dịch cú pháp, không dịch ý đồ</h3>
${slide('dk-15', 25, 'Kompose dịch được cú pháp — không dịch được ý đồ')}
<p><a href="https://kompose.io/" target="_blank" rel="noopener">Kompose</a> đổi một file compose thành các manifest Kubernetes. Một file compose sinh viên điển hình — ảnh API từ registry cục bộ và một Postgres có volume đặt tên — được cho chạy qua nó:</p>
<pre><code class="language-yaml">services:
  api:
    image: localhost:18150/dk15-api:1.0
    ports:
      - "18155:3000"
    environment:
      DATABASE_URL: postgres://app:app@db:5432/app
    depends_on: [db]
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:</code></pre>
<pre><code class="language-bash">kompose convert -f compose.yaml -o out/
kubectl apply -f out/ &amp;&amp; sleep 40 &amp;&amp; kubectl get pods</code></pre>
<div class="out">WARN Service "db" won't be created because 'ports' is not specified
WARN File don't exist or failed to check if the directory is empty: stat :/var/lib/postgresql/data: no such file or directory
INFO Kubernetes file "out/api-service.yaml" created
INFO Kubernetes file "out/api-deployment.yaml" created
INFO Kubernetes file "out/db-deployment.yaml" created
INFO Kubernetes file "out/pgdata-persistentvolumeclaim.yaml" created
NAME                  READY   STATUS         RESTARTS   AGE
api-cf575759b-vxnf8   0/1     ErrImagePull   0          40s
db-5b4bd69966-8b7f9   1/1     Running        0          40s</div>
<p>Ba cái hố, mỗi cái là một khác biệt thật giữa hai thế giới:</p>
<table>
<tr><th>Triệu chứng</th><th>Vì sao</th><th>Sửa</th></tr>
<tr><td><code>ErrImagePull</code> với <code>localhost:18150/dk15-api:1.0</code></td><td>bên trong nút, <code>localhost</code> là chính cái nút; cụm cũng không nhìn thấy <code>docker images</code> của bạn</td><td><code>kind load docker-image localhost:18150/dk15-api:1.0 --name dk15</code> (với kind), hoặc đẩy lên một registry mà cụm với tới được</td></tr>
<tr><td>nạp ảnh xong, API chạy nhưng <code>db</code> không phân giải được: <code>ENOTFOUND db</code></td><td>trong Compose service nào cũng gọi được bằng tên; trong Kubernetes chỉ <em>Service</em> mới có tên DNS, và Kompose chỉ tạo Service cho dịch vụ có <code>ports</code></td><td><code>kubectl expose deploy db --port 5432</code> — sau đó cùng lệnh tra cứu trả về <code>10.96.125.187</code></td></tr>
<tr><td><code>depends_on</code> biến mất</td><td>Kubernetes hoàn toàn không có thứ tự khởi động</td><td>ứng dụng tự thử lại kết nối CSDL; readiness probe chặn lưu lượng cho tới khi sẵn sàng</td></tr>
</table>
<p>PVC thì chạy được: <code>pgdata</code> chuyển sang <code>Bound</code> với một volume 100 Mi do StorageClass <code>standard</code> của kind cấp. Kompose là một bản nháp đầu tốt và một cách hay để học các đối tượng; output của nó luôn cần một người đọc lại.</p>

<h3>Những gì bài này không dựng: Ingress, Gateway, Helm</h3>
<p>Một cụm thật đặt một <strong>Ingress controller</strong> (hoặc, như tài liệu Kubernetes giờ khuyên, một bản cài <strong>Gateway API</strong>) đứng trước, làm đúng việc nginx hay Caddy đã làm ở Chương 10 và 14: một cổng công khai, định tuyến theo tên miền và đường dẫn, chứng chỉ TLS. Ứng dụng thường được cài dưới dạng <strong>Helm chart</strong> — gói manifest có khuôn mẫu. Cả hai đều là chủ đề lớn riêng; khoá <code>/courses/nginx</code> dạy những ý tưởng proxy mà chúng dựa lên. Điều quan trọng ở đây là nhận ra các từ đó khi một bản mô tả công việc dùng tới.</p>

<h3>Khi nào bạn KHÔNG cần Kubernetes</h3>
${slide('dk-15', 26, 'Khi nào KHÔNG cần Kubernetes')}
<table>
<tr><th>Bạn có…</th><th>Dùng</th></tr>
<tr><td>một VPS: web + API + CSDL (mọi đồ án kiểu SWP391)</td><td>Docker Compose — Chương 9–11. Chính trang web của khoá cũng chạy như thế</td></tr>
<tr><td>2–5 máy, muốn chịu lỗi và cập nhật không gián đoạn</td><td>Swarm (Bài 15.3), cùng file compose</td></tr>
<tr><td>nhiều đội, hàng chục dịch vụ, tự co giãn, cô lập chặt giữa các khách hàng</td><td>Kubernetes — thường là loại có quản lý (EKS, GKE, AKS) để người khác lo etcd và control plane</td></tr>
<tr><td>bạn muốn học nó để đi làm</td><td>kind hoặc k3d trên laptop, đúng như bài này</td></tr>
</table>
<p>Kubernetes không làm ứng dụng nhanh hơn, và trên một máy thì nó làm hệ thống mong manh hơn: giờ bạn phải vận hành etcd, chứng chỉ có ngày hết hạn, một control plane phải nâng cấp theo nhịp phát hành của dự án, RBAC, một plugin mạng và một ingress controller. Một cụm kind rỗng đã ăn 1,06 GiB; trên VPS 2 GB, đó là một nửa bộ nhớ tiêu cho việc điều phối trước khi Postgres của bạn nhận được chút nào.</p>

<h3>Chạy thử từng bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · lấy kind mà không cài</span><span class="lz-t">curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.33.0/kind-darwin-arm64 &amp;&amp; chmod +x ./kind</span><span class="lz-d">Chọn file hợp hệ điều hành/CPU của bạn trên trang phát hành của kind.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · một cụm với kubeconfig riêng</span><span class="lz-t">./kind create cluster --name hoc --kubeconfig ./kc &amp;&amp; export KUBECONFIG=$PWD/kc</span><span class="lz-d">kubectl get nodes: Ready sau vài giây.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · Deployment + Service</span><span class="lz-t">kubectl apply -f app.yaml; kubectl get pods -w</span><span class="lz-d">Ctrl+C khi mọi Pod đã Running.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · gọi thử</span><span class="lz-t">kubectl port-forward svc/web 8080:80</span><span class="lz-d">Chạy được không cần extraPortMappings; mở localhost:8080.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 5 · xoá hết</span><span class="lz-t">./kind delete cluster --name hoc</span><span class="lz-d">Xoá container nút cùng volume của nó.</span></div>
</div>
<p>Dọn dẹp trên máy Mac của khoá đúng là bước 5 cộng thêm <code>docker network rm dk15-kind-net</code>; volume vô danh của nút (đã ghi lại id lúc tạo cụm) được chính <code>kind delete</code> xoá đi.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> người phỏng vấn thực tập hỏi "bạn đã dùng Kubernetes chưa?". Bạn muốn trả lời bằng một việc mình thật sự đã làm, dùng chính file compose của đồ án nhóm.</p><ol>
<li>Tải <code>kind</code> và <code>kompose</code> vào <code>~/thu-docker/k8s/bin</code> (không cài), và tạo một cụm với <code>--kubeconfig ./kc</code>.</li>
<li>Chạy <code>kompose convert</code> trên file compose của đồ án. Liệt kê mọi cảnh báo nó in ra.</li>
<li>Apply output. Với mỗi Pod không <code>Running</code>, tìm lý do bằng <code>kubectl describe pod</code> và sửa (<code>kind load docker-image</code>, <code>kubectl expose</code>).</li>
<li>Xoá một Pod, đổi ảnh bằng <code>kubectl set image</code>, rồi <code>kubectl rollout undo</code>.</li>
<li>Xoá cụm và kiểm <code>docker ps -a</code>.</li></ol>
<p><strong>Đạt khi:</strong> mọi Pod của app đều <code>Running</code>, bạn giải thích được trong hai câu vì sao output của Kompose lúc đầu hỏng, bạn có output của rollout history — và một câu nói vì sao chính đồ án của bạn vẫn ở lại với Compose.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pod (nhóm container nhỏ nhất)</span><span class="v">Đơn vị nhỏ nhất Kubernetes chạy: một hay vài container dùng chung mạng và volume.</span></div>
  <div class="kv"><span class="k">Deployment / ReplicaSet (bản triển khai / bộ bản sao)</span><span class="v">Giữ N Pod theo một khuôn; mỗi phiên bản khuôn là một ReplicaSet — đó là cách rollout và undo hoạt động.</span></div>
  <div class="kv"><span class="k">Service (dịch vụ)</span><span class="v">IP và tên DNS cố định đứng trước những Pod được chọn theo nhãn.</span></div>
  <div class="kv"><span class="k">Ingress / Gateway API (cổng vào HTTP)</span><span class="v">Định tuyến HTTP vào cụm; Ingress đã đóng băng, Gateway là người kế nhiệm được khuyên dùng.</span></div>
  <div class="kv"><span class="k">ConfigMap / Secret (cấu hình / bí mật)</span><span class="v">Đối tượng cấu hình; Secret chỉ là base64 trừ khi bật mã hoá khi lưu.</span></div>
  <div class="kv"><span class="k">PersistentVolumeClaim (yêu cầu ổ lưu trữ bền)</span><span class="v">Lời xin dung lượng mà StorageClass đáp ứng bằng một ổ đĩa thật.</span></div>
  <div class="kv"><span class="k">kubeconfig / kubectl</span><span class="v">File thông tin đăng nhập, và CLI nói chuyện với API server của cụm.</span></div>
  <div class="kv"><span class="k">kind / Kompose</span><span class="v">Cụm Kubernetes trong container Docker để học; công cụ đổi compose sang manifest.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Pod ≈ một container của service, Deployment ≈ replicas, Service ≈ tên service, ConfigMap/Secret ≈ environment/secrets, PVC ≈ volume có tên.</li>
<li>kind chạy một nút Kubernetes 1.37 dưới dạng một container trong 10 giây (lần đầu 53 giây), cụm rỗng ăn 1,06 GiB RAM.</li>
<li>Deployment tự lành, tự rollout khi khuôn đổi, và quay lui bằng <code>kubectl rollout undo</code>.</li>
<li>Secret là base64: <code>base64 -d</code> trả lại nguyên mật khẩu; cụm thật phải bật mã hoá và RBAC.</li>
<li>Kompose quên Service cho <code>db</code>, không kéo được ảnh cục bộ, và bỏ mất <code>depends_on</code> — luôn đọc lại output của nó.</li>
<li>Một VPS, một app: Compose. Vài máy: Swarm. Nhiều đội, nhiều dịch vụ: Kubernetes có quản lý.</li>
</ul>

<a class="link-card" href="https://kind.sigs.k8s.io/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">kind — Kubernetes trong Docker</span><span class="lc-sub">Bắt đầu nhanh, cấu hình (ánh xạ cổng, cổng API) và nạp ảnh cục bộ.</span></span>
</a>
<a class="link-card" href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" target="_blank" rel="noopener">
  <span class="lc-ico">☸️</span>
  <span class="lc-body"><span class="lc-title">Deployment của Kubernetes</span><span class="lc-sub">Rollout, rollback, co giãn và các ReplicaSet bên dưới.</span></span>
</a>
<a class="link-card" href="https://kubernetes.io/docs/concepts/configuration/secret/" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Secret của Kubernetes</span><span class="lc-sub">Kể cả lời cảnh báo về base64 và etcd, và cách bảo vệ chúng.</span></span>
</a>
<a class="link-card" href="https://kubernetes.io/docs/concepts/services-networking/gateway/" target="_blank" rel="noopener">
  <span class="lc-ico">🚪</span>
  <span class="lc-body"><span class="lc-title">Gateway API</span><span class="lc-sub">Người kế nhiệm được khuyên dùng của Ingress để đưa lưu lượng vào cụm.</span></span>
</a>
<a class="link-card" href="https://kompose.io/" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Kompose</span><span class="lc-sub">Đổi file compose thành manifest Kubernetes — bản nháp đầu, không phải kết quả hoàn chỉnh.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab</span><span class="lc-sub">Bài tập Docker có chấm tự động.</span></span>
</a>

<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Mọi đối tượng Kubernetes đều có một bản tương ứng trong Compose mà bạn đã hiểu — học cái bảng đối chiếu là manifest hết đáng sợ. kind cho bạn một cụm thật trong một container để học, với kubeconfig riêng và một lệnh để xoá. Và với một VPS chạy một đồ án, Compose không phải lựa chọn "cho người mới"; nó là lựa chọn đúng.</p>
</div>
`,
    },
    /* ─────────────────────────── 15.5 ─────────────────────────── */
    {
      title: '15.5 — Quiz: builds, security and beyond one host|||15.5 — Kiểm tra: build, bảo mật và vượt khỏi một máy',
      slug: 'dk-15-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật: bản amd64 chậm vì giả lập, token đổi mà bước vẫn CACHED, builder docker-container không ra ảnh, nhóm docker = root, uid_map của rootless, userns-remap che ảnh, cập nhật cuốn chiếu của Swarm, depends_on bị bỏ qua, Secret base64 và Kompose thiếu Service.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from the edges of everyday Docker — builds for two CPUs, credentials during a build, shared servers, several machines, and a first step into Kubernetes. Every one was reproduced on the course machines while writing this chapter. Read the explanation after submitting, especially where you guessed.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can create a <code>docker-container</code> builder, add a native node over <code>ssh://</code>, and explain why emulated RUN steps are slow.</li>
<li>I can write a <code>docker-bake.hcl</code> with a shared template and check it with <code>--print</code>.</li>
<li>I can pass build secrets with <code>--secret</code>/<code>--ssh</code>, prove they are not in the image, and know that changing one does not bust the cache.</li>
<li>I can explain why the docker group equals root, and what rootless Docker, userns-remap and Podman change.</li>
<li>I can run a one-node swarm, update a service without dropping requests, deploy a stack and leave cleanly.</li>
<li>I can map Compose to Pod/Deployment/Service, run a kind cluster with its own kubeconfig, and say when Kubernetes is not needed.</li>
</ul>
${slide('dk-15', 28, 'Bảng tra nhanh Chương 15')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống ở rìa của việc dùng Docker hằng ngày — dựng cho hai loại CPU, thông tin đăng nhập lúc build, server dùng chung, nhiều máy, và bước đầu tiên vào Kubernetes. Tình huống nào cũng đã được dựng lại trên máy của khoá trong lúc viết chương này. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tạo được builder <code>docker-container</code>, thêm được một node gốc qua <code>ssh://</code>, và giải thích được vì sao bước RUN chạy giả lập thì chậm.</li>
<li>Tôi viết được <code>docker-bake.hcl</code> có khuôn dùng chung và kiểm nó bằng <code>--print</code>.</li>
<li>Tôi đưa bí mật vào bản dựng bằng <code>--secret</code>/<code>--ssh</code>, chứng minh được chúng không nằm trong ảnh, và biết đổi bí mật không làm vỡ cache.</li>
<li>Tôi giải thích được vì sao nhóm docker bằng root, và Docker rootless, userns-remap, Podman thay đổi điều gì.</li>
<li>Tôi chạy được swarm một nút, cập nhật service mà không rớt request, triển khai stack và rời swarm sạch sẽ.</li>
<li>Tôi đặt được Compose cạnh Pod/Deployment/Service, chạy cụm kind với kubeconfig riêng, và nói được khi nào không cần Kubernetes.</li>
</ul>
${slide('dk-15', 28, 'Bảng tra nhanh Chương 15')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'On your M1 Mac, a two-platform build spends 96 s in "RUN apk add gcc musl-dev" for linux/amd64 but 29 s for linux/arm64. The group also has an amd64 Linux machine reachable as "ssh linux-nha". What makes the amd64 half fast without changing the Dockerfile?|||Trên máy Mac M1, một lượt dựng hai nền tảng mất 96 giây ở "RUN apk add gcc musl-dev" cho linux/amd64 nhưng chỉ 29 giây cho linux/arm64. Nhóm còn có một máy Linux amd64 vào được bằng "ssh linux-nha". Cách nào làm nửa amd64 nhanh lên mà không sửa Dockerfile?',
            options: [
              'Build with --no-cache so BuildKit stops mixing the arm64 cache into the amd64 build|||Dựng với --no-cache để BuildKit thôi trộn cache arm64 vào bản dựng amd64',
              'Give Docker Desktop more CPUs and memory; the emulator is limited by the VM size|||Cấp thêm CPU và RAM cho Docker Desktop; bộ giả lập bị giới hạn bởi kích thước máy ảo',
              'Append the Linux machine as a builder node for linux/amd64 with docker buildx create --append … ssh://linux-nha|||Thêm máy Linux làm node của builder cho linux/amd64 bằng docker buildx create --append … ssh://linux-nha',
              'Switch the base image to a multi-arch one, because alpine:3.22 only ships arm64 packages|||Đổi sang ảnh nền đa kiến trúc, vì alpine:3.22 chỉ có gói arm64',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The amd64 RUN step is slow because every installed program runs through CPU emulation on the Mac. A docker-container builder can have a second node on a real amd64 machine; measured, the same step took 20.2 s there, and both platforms built in parallel in 28 s. More VM resources do not remove the translation cost, --no-cache only makes things slower, and alpine is already multi-arch — that is why the build worked at all.|||VI: Bước RUN amd64 chậm vì mọi chương trình được cài đều chạy qua giả lập CPU trên Mac. Builder docker-container có thể có node thứ hai trên một máy amd64 thật; đo thật, cùng bước đó mất 20,2 giây ở đó và cả hai nền tảng dựng song song trong 28 giây. Thêm tài nguyên cho máy ảo không xoá được cái giá phiên dịch, --no-cache chỉ làm chậm thêm, còn alpine vốn đã đa kiến trúc — nên bản dựng mới chạy được.',
          },
          {
            question: 'The npm token you pass with --secret id=npm_token,env=NPM_TOKEN expired, so you exported a new one and rebuilt. The build log shows the "npm ci" step as CACHED and the image still has last week’s private packages. What is going on?|||Token npm mà bạn truyền bằng --secret id=npm_token,env=NPM_TOKEN đã hết hạn, bạn export token mới rồi dựng lại. Log bản dựng cho thấy bước "npm ci" là CACHED và ảnh vẫn chứa các gói riêng tư của tuần trước. Chuyện gì xảy ra?',
            options: [
              'Secrets are not part of the cache key, so a new value does not re-run the step; use --no-cache-filter or bump an ARG before it|||Bí mật không nằm trong khoá cache, nên giá trị mới không làm bước đó chạy lại; dùng --no-cache-filter hoặc tăng một ARG đặt trước nó',
              'The old token was written into a layer, and BuildKit reuses that layer until you delete the image|||Token cũ đã bị ghi vào một tầng, và BuildKit dùng lại tầng đó cho tới khi bạn xoá ảnh',
              'env= secrets are read once per builder; you must recreate the builder after changing the variable|||Bí mật dạng env= chỉ được đọc một lần cho mỗi builder; phải tạo lại builder sau khi đổi biến',
              'BuildKit ignored --secret and read ~/.npmrc from the build context, which still holds the old token|||BuildKit đã bỏ qua --secret và đọc ~/.npmrc từ ngữ cảnh dựng, nơi vẫn còn token cũ',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured in Lesson 15.1: changing NPM_TOKEN left both secret-using steps CACHED. Secrets are deliberately excluded from the cache key so they cannot leak through it; the price is that rotating one does not invalidate the step. docker save + grep proved the token is in no layer, so "written into a layer" is exactly what does not happen; builders are not tied to one secret value.|||VI: Đo ở Bài 15.1: đổi NPM_TOKEN mà cả hai bước dùng bí mật vẫn CACHED. Bí mật được cố ý loại khỏi khoá cache để không rò qua đó; cái giá là thay bí mật không làm bước đó mất hiệu lực. docker save + grep đã chứng minh token không nằm trong tầng nào, nên "ghi vào một tầng" chính là điều KHÔNG xảy ra; builder cũng không gắn với một giá trị bí mật nào.',
          },
          {
            question: 'After "docker buildx create --name nhom --driver docker-container --use", "docker buildx build -t api:1 ." finishes successfully, but "docker run api:1" says "Unable to find image ’api:1’ locally". Why?|||Sau "docker buildx create --name nhom --driver docker-container --use", lệnh "docker buildx build -t api:1 ." chạy xong không lỗi, nhưng "docker run api:1" báo "Unable to find image ’api:1’ locally". Vì sao?',
            options: [
              'The tag must include a registry, such as localhost:5000/api:1, whenever a custom builder is used|||Tag phải có registry, kiểu localhost:5000/api:1, mỗi khi dùng builder tuỳ chỉnh',
              'docker-container builders can only produce multi-platform images, which docker run cannot start|||Builder docker-container chỉ tạo được ảnh đa nền tảng, thứ docker run không khởi động được',
              'The build failed silently because the builder container has no access to the build context|||Bản dựng đã hỏng âm thầm vì container của builder không đọc được ngữ cảnh dựng',
              'With the docker-container driver the result stays in the build cache unless you add --load or --push|||Với driver docker-container, kết quả chỉ nằm trong cache dựng trừ khi bạn thêm --load hoặc --push',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: BuildKit runs in its own container, separate from the image store; without an exporter it prints "No output specified with docker-container driver. Build result will only remain in the build cache". --load copies the result into docker images, --push sends it to a registry. The build did succeed, a registry is optional, and single-platform builds are perfectly possible.|||VI: BuildKit chạy trong container riêng, tách khỏi kho ảnh; không có đầu ra thì nó in "No output specified with docker-container driver. Build result will only remain in the build cache". --load chép kết quả vào docker images, --push đẩy lên registry. Bản dựng thật ra đã thành công, registry là tuỳ chọn, và dựng một nền tảng hoàn toàn được.',
          },
          {
            question: 'The school gives your group one Linux VM. A teammate suggests "sudo usermod -aG docker" for all five members so nobody needs sudo. What is the real consequence?|||Trường cấp cho nhóm một máy ảo Linux. Một bạn đề nghị "sudo usermod -aG docker" cho cả năm thành viên để không ai cần sudo. Hệ quả thật là gì?',
            options: [
              'None beyond convenience: the docker group can only manage containers, never host files|||Chẳng gì ngoài sự tiện: nhóm docker chỉ quản lý được container, không bao giờ đụng file của máy chủ',
              'Every member effectively gets root: one docker run can mount /etc/shadow or / into a uid-0 container|||Mọi thành viên thực chất có root: một lệnh docker run gắn được /etc/shadow hay / vào một container uid 0',
              'Members can see each other’s containers, but seccomp and AppArmor prevent reading host files|||Thành viên thấy container của nhau, nhưng seccomp và AppArmor ngăn đọc file của máy chủ',
              'It is safe as long as every container is started with --cap-drop ALL and a non-root USER|||An toàn miễn là mọi container được chạy với --cap-drop ALL và USER không phải root',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: dockerd runs as root and does whatever a socket client asks; an ordinary user on the course Linux machine read /etc/shadow (54 lines) with a single docker run. seccomp, AppArmor and capability settings restrict containers, not the person choosing the flags — that person can simply leave them out. On shared machines use rootless Docker or Podman per user.|||VI: dockerd chạy bằng root và làm bất cứ gì client của socket yêu cầu; một user thường trên máy Linux của khoá đã đọc được /etc/shadow (54 dòng) chỉ bằng một lệnh docker run. seccomp, AppArmor và capability giới hạn container, không giới hạn người chọn cờ — người đó chỉ việc không dùng chúng. Trên máy dùng chung, dùng Docker rootless hoặc Podman cho từng người.',
          },
          {
            question: 'Under rootless Docker, a container running as root creates a file in a bind-mounted folder. Inside the container "ls -ln" shows owner 0; on the host it shows 1000. Which statement explains it?|||Dưới Docker rootless, một container chạy bằng root tạo một file trong thư mục được bind mount. Trong container "ls -ln" cho chủ là 0; trên máy chủ lại là 1000. Câu nào giải thích đúng?',
            options: [
              'Docker rewrites file ownership on every bind mount, on all platforms, to the calling user|||Docker viết lại chủ sở hữu file trên mọi bind mount, ở mọi nền tảng, thành user đã gọi lệnh',
              'A user namespace maps uid 0 inside to uid 1000 outside, as /proc/self/uid_map "0 1000 1" shows|||Một user namespace ánh xạ uid 0 bên trong thành uid 1000 bên ngoài, như dòng "0 1000 1" của /proc/self/uid_map cho thấy',
              'The container was not really root; rootless Docker silently adds --user 1000 to every run|||Container không thật sự là root; Docker rootless lặng lẽ thêm --user 1000 vào mọi lần chạy',
              'The file is copied to the host after the container exits, and the copy is owned by the daemon|||File được chép ra máy chủ sau khi container thoát, và bản chép thuộc về daemon',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Rootless mode runs the engine in a user namespace: uid_map read "0 1000 1" (root inside is 1000 outside) and "1 100000 65536" (the subuid range). id inside really says uid=0(root) — it is root within the namespace, and an ordinary user outside. There is no copying: it is the same file seen through two mappings. The "ownership rewrite" option describes Docker Desktop’s file sharing, not Linux.|||VI: Chế độ rootless chạy engine trong một user namespace: uid_map đọc ra "0 1000 1" (root bên trong là 1000 bên ngoài) và "1 100000 65536" (dải subuid). id bên trong thật sự in uid=0(root) — nó là root trong namespace, và là user thường ở ngoài. Không có chép gì cả: cùng một file nhìn qua hai phép ánh xạ. Phương án "viết lại chủ sở hữu" là mô tả lớp chia sẻ file của Docker Desktop, không phải Linux.',
          },
          {
            question: 'An admin adds "userns-remap": "default" to /etc/docker/daemon.json on the team server and restarts Docker. Now "docker image ls" is empty and people panic that all images were deleted. What happened?|||Một quản trị viên thêm "userns-remap": "default" vào /etc/docker/daemon.json trên server của nhóm rồi khởi động lại Docker. Giờ "docker image ls" rỗng và mọi người hoảng vì tưởng ảnh bị xoá hết. Chuyện gì đã xảy ra?',
            options: [
              'The restart pruned every image not used by a running container, as it always does|||Lần khởi động lại đã prune mọi ảnh không được container nào dùng, như mọi lần',
              'The images were converted to the dockremap user and must be pulled again from the registry|||Các ảnh đã bị chuyển sang user dockremap và phải kéo lại từ registry',
              'The daemon failed to start and the CLI is talking to an empty rootless daemon instead|||Daemon không khởi động nổi và CLI đang nói chuyện với một daemon rootless rỗng',
              'Remapped storage lives in a separate subdirectory, which masks the existing images until remapping is turned off|||Kho lưu trữ khi ánh xạ nằm ở một thư mục con riêng, che mất các ảnh cũ cho tới khi tắt ánh xạ',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The documentation says enabling userns-remap "effectively masks existing image and container layers", because remapped resources are stored in a subdirectory; the old images are still on disk and reappear when the option is removed. A daemon restart does not prune anything, and nothing was converted. Note also the side effect nobody announced: the restart stopped every running container.|||VI: Tài liệu ghi bật userns-remap "effectively masks existing image and container layers" (che mất tầng ảnh và container đang có), vì tài nguyên đã ánh xạ được lưu ở một thư mục con; ảnh cũ vẫn nằm trên đĩa và hiện lại khi bỏ tuỳ chọn. Khởi động lại daemon không prune gì, và chẳng có gì bị chuyển đổi. Để ý cả tác dụng phụ không ai báo trước: lần khởi động lại đã dừng mọi container đang chạy.',
          },
          {
            question: 'A swarm service has 3 replicas. You run "docker service update --image app:1.1 --update-parallelism 1 --update-delay 5s app" while users keep browsing. What do they experience, as measured in Lesson 15.3?|||Một service của swarm có 3 bản. Bạn chạy "docker service update --image app:1.1 --update-parallelism 1 --update-delay 5s app" trong lúc người dùng vẫn đang truy cập. Họ gặp gì, theo phép đo ở Bài 15.3?',
            options: [
              'Nothing: tasks are replaced one at a time, the other two keep serving, and 150 requests gave 0 errors|||Không gì cả: task được thay từng cái một, hai cái kia vẫn phục vụ, và 150 request cho 0 lỗi',
              'About 5 seconds of 502 errors per task, because each old task stops before the new one is ready|||Khoảng 5 giây lỗi 502 cho mỗi task, vì task cũ dừng trước khi task mới sẵn sàng',
              'One outage of 15 seconds while the manager pulls the new image on every node at once|||Một lần gián đoạn 15 giây trong lúc manager kéo ảnh mới về mọi nút cùng lúc',
              'Requests alternate between v1.0 and v1.1 forever until you run docker service rollback|||Request luân phiên giữa v1.0 và v1.1 mãi mãi cho tới khi bạn chạy docker service rollback',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: With parallelism 1 and three replicas, two tasks always serve while the third is replaced; the routing mesh only sends traffic to running tasks. The course measured 150 requests at 0.1 s intervals during a rollback: 200=150, errors=0. Mixed versions exist only during the ~27 s update, not forever. The 502 scenario is what a single-container "docker compose up -d" produces.|||VI: Với parallelism 1 và ba bản, luôn có hai task phục vụ trong lúc thay cái thứ ba; routing mesh chỉ gửi lưu lượng tới task đang chạy. Khoá đã đo 150 request cách nhau 0,1 giây trong một lượt rollback: 200=150, lỗi=0. Hai phiên bản lẫn nhau chỉ tồn tại trong ~27 giây cập nhật, không phải mãi mãi. Kịch bản 502 là thứ mà "docker compose up -d" với một container gây ra.',
          },
          {
            question: 'You moved the team’s compose.yaml to "docker stack deploy". The API restarts in a loop with "ECONNREFUSED db:5432" for the first minute, although the file says depends_on: [db] and it worked under Compose. Why?|||Bạn chuyển compose.yaml của nhóm sang "docker stack deploy". API khởi động lại liên tục với "ECONNREFUSED db:5432" trong phút đầu, dù file có depends_on: [db] và nó chạy tốt dưới Compose. Vì sao?',
            options: [
              'Overlay networks need about a minute to learn service names, so early lookups always fail|||Mạng overlay cần khoảng một phút để học tên dịch vụ, nên tra cứu sớm luôn hỏng',
              'stack deploy renames services with the stack prefix, so the host "db" does not exist in a stack|||stack deploy đổi tên dịch vụ kèm tiền tố stack, nên tên "db" không tồn tại trong stack',
              'Swarm ignores depends_on without any warning; the API must retry and a healthcheck must gate readiness|||Swarm bỏ qua depends_on mà không cảnh báo gì; API phải tự thử lại và healthcheck phải báo khi nào sẵn sàng',
              'The database secret was mounted as a file, so Postgres refuses connections until you restart it|||Bí mật của CSDL được gắn dạng file, nên Postgres từ chối kết nối cho tới khi bạn khởi động lại nó',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: In the course stack, build and container_name produced warnings but depends_on produced none — Swarm starts tasks in any order. The service name still resolves inside the stack (getent hosts web returned the VIP), so it is not a naming problem; ECONNREFUSED means the name resolved but nothing listened yet. The fix is an application that retries, the same rule Kubernetes imposes.|||VI: Trong stack của khoá, build và container_name có cảnh báo còn depends_on thì không — Swarm khởi động task theo thứ tự tuỳ ý. Tên dịch vụ vẫn phân giải được trong stack (getent hosts web trả VIP), nên không phải lỗi tên; ECONNREFUSED nghĩa là tên đã phân giải nhưng chưa có gì lắng nghe. Cách chữa là một ứng dụng biết thử lại, cũng là luật mà Kubernetes áp đặt.',
          },
          {
            question: 'In the group’s Kubernetes repo someone committed secret.yaml with data.password: TWF0S2hhdSMyMDI2 and says "it is fine, Secrets are encoded". What is the correct response?|||Trong repo Kubernetes của nhóm, ai đó commit secret.yaml với data.password: TWF0S2hhdSMyMDI2 và nói "không sao, Secret đã được mã hoá rồi". Phản hồi đúng là gì?',
            options: [
              'It is fine as long as the repository is private, because base64 cannot be reversed without the key|||Không sao miễn repo để riêng tư, vì base64 không giải ngược được nếu thiếu khoá',
              'It is fine because the API server encrypts every Secret with the cluster CA before storing it|||Không sao vì API server mã hoá mọi Secret bằng CA của cụm trước khi lưu',
              'Rename the field to stringData, which Kubernetes stores encrypted instead of encoded|||Đổi tên trường thành stringData, thứ Kubernetes lưu dạng mã hoá thay vì mã hoá base64',
              'base64 is encoding, not encryption: base64 -d gives MatKhau#2026; remove it from Git and rotate the password|||base64 là mã hoá hiển thị, không phải mật mã: base64 -d ra MatKhau#2026; gỡ khỏi Git và đổi mật khẩu',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: One pipe through base64 -d printed the password in Lesson 15.4. The Kubernetes docs warn that Secrets are "by default, stored unencrypted" in etcd and readable by anyone who can create Pods in the namespace. A leaked value must be rotated, not just deleted, because Git history keeps it. stringData is only a convenience for writing plain text — it ends up in the same data field.|||VI: Một đường ống qua base64 -d đã in ra mật khẩu ở Bài 15.4. Tài liệu Kubernetes cảnh báo Secret "by default, stored unencrypted" (mặc định lưu không mã hoá) trong etcd và ai tạo được Pod trong namespace là đọc được. Giá trị đã lộ phải được thay, không chỉ xoá, vì lịch sử Git còn giữ nó. stringData chỉ là cách viết chữ trần cho tiện — rốt cuộc vẫn vào cùng trường data.',
          },
          {
            question: 'After "kompose convert" and "kubectl apply", the api Pod runs but logs "getaddrinfo ENOTFOUND db", while the db Pod is Running. Kompose had printed a warning. What is missing?|||Sau "kompose convert" và "kubectl apply", Pod api chạy nhưng log báo "getaddrinfo ENOTFOUND db", trong khi Pod db đang Running. Kompose đã in một cảnh báo. Thiếu gì?',
            options: [
              'A NetworkPolicy allowing api to talk to db; Kubernetes blocks traffic between Pods by default|||Một NetworkPolicy cho phép api nói chuyện với db; Kubernetes mặc định chặn lưu lượng giữa các Pod',
              'A Service named db: Kompose creates Services only for compose services with ports, so fix it with kubectl expose|||Một Service tên db: Kompose chỉ tạo Service cho dịch vụ compose có ports, nên sửa bằng kubectl expose',
              'The depends_on ordering: api started first and cached a failed DNS answer until it is restarted|||Thứ tự depends_on: api khởi động trước và giữ câu trả lời DNS thất bại tới khi được khởi động lại',
              'An Ingress for db, because only Ingress objects receive DNS names inside the cluster|||Một Ingress cho db, vì chỉ đối tượng Ingress mới có tên DNS bên trong cụm',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Kompose warned that Service "db" would not be created because ports was not specified. In Compose every service name resolves; in Kubernetes only a Service gets a DNS name. After kubectl expose deploy db --port 5432, the same lookup returned 10.96.125.187. Pods can talk freely unless a NetworkPolicy says otherwise, and Ingress is for HTTP from outside, not internal names.|||VI: Kompose đã cảnh báo Service "db" sẽ không được tạo vì thiếu ports. Trong Compose tên dịch vụ nào cũng phân giải được; trong Kubernetes chỉ Service mới có tên DNS. Sau kubectl expose deploy db --port 5432, cùng phép tra cứu trả về 10.96.125.187. Các Pod nói chuyện tự do trừ khi có NetworkPolicy nói khác, còn Ingress là cho HTTP từ bên ngoài, không phải tên nội bộ.',
          },
        ],
      },
    },
  ],
};
