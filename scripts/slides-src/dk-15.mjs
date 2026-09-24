/**
 * Docker · Deck dk-15 — Chương 15: Nâng cao — build, bảo mật & vượt khỏi một máy.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 24/09/2026:
 *   • "máy Mac"   = Mac M1, Docker Desktop 4.91 / Engine 29.8.0, buildx v0.37.0, arm64
 *   • "máy Linux" = Fedora 44, Docker Engine 29.6.2, amd64, 12 nhân (user thường, KHÔNG sudo)
 *   • Swarm một nút chạy trên máy Mac (trước đó LocalNodeState = inactive, xong thì leave --force)
 *   • Kubernetes = kind v0.33.0 (node kindest/node:v1.37.0) chạy trong Docker Desktop, kubectl 1.34
 *   • Podman 5.8.7 và Docker rootless chạy LỒNG trong container (quay.io/podman/stable, docker:29-dind-rootless)
 * Tên đối tượng trong output mang tiền tố dk15- (luật an toàn của khoá).
 */
import { S, cover, cards, box, steps, table, kpis, two, mindmap, layers, host, term as dkTerm, diagram, yaml, bars, sv, R, T, A } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });

export const deck = { key: 'dk-15', code: 'DOCKER · CHƯƠNG 15', title: 'Nâng cao: build, bảo mật, nhiều máy', sub: 'Docker · Chương 15' };

/* ───────────── SVG tự vẽ ───────────── */

/* Slide 3 — một builder, hai node thật */
const builderPic = () => sv(560, 380,
  R(0, 150, 150, 80, { c: 'tea' }) + T(75, 184, 'docker buildx', { fs: 16, a: 'middle', b: true, mono: true }) + T(75, 208, 'trên Mac', { fs: 14.5, a: 'middle', c: 'mu' }) +
  R(250, 10, 300, 150, { c: 'dk', dash: true, fill: 'rgba(36,150,237,.06)' }) +
  T(400, 40, 'node dk15-builder0', { fs: 16, a: 'middle', b: true, c: 'dk' }) +
  T(400, 66, 'container buildx_buildkit_…', { fs: 13.5, a: 'middle', mono: true, c: 'mu' }) +
  T(400, 96, 'trong VM Docker Desktop', { fs: 14.5, a: 'middle' }) +
  T(400, 122, 'arm64 gốc · amd64 = GIẢ LẬP', { fs: 14.5, a: 'middle', c: 'amb' }) +
  R(250, 220, 300, 150, { c: 'grn', fill: 'rgba(63,185,80,.06)' }) +
  T(400, 250, 'node dk15-nha', { fs: 16, a: 'middle', b: true, c: 'grn' }) +
  T(400, 276, 'endpoint ssh://linux-nha', { fs: 13.5, a: 'middle', mono: true, c: 'mu' }) +
  T(400, 306, 'máy Linux 12 nhân', { fs: 14.5, a: 'middle' }) +
  T(400, 332, 'amd64 GỐC — không giả lập', { fs: 14.5, a: 'middle', c: 'grn' }) +
  A(150, 175, 246, 100, { c: 'dk' }) + A(150, 205, 246, 290, { c: 'grn' }) +
  T(186, 124, 'arm64', { fs: 14, a: 'middle', c: 'dk', b: true }) + T(186, 272, 'amd64', { fs: 14, a: 'middle', c: 'grn', b: true }));

/* Slide 8 — một tag, bốn manifest */
const indexPic = () => sv(560, 360,
  R(150, 0, 260, 64, { c: 'vio' }) + T(280, 28, 'dk15-web:1.1', { fs: 16, a: 'middle', b: true, mono: true }) + T(280, 50, 'chỉ mục (image index)', { fs: 14, a: 'middle', c: 'mu' }) +
  [['linux/amd64', 'ảnh chạy được', 'dk', 0], ['linux/arm64', 'ảnh chạy được', 'dk', 142], ['unknown/unknown', 'attestation', 'amb', 284], ['unknown/unknown', 'attestation', 'amb', 426]]
    .map(([p, d, c, x]) => R(x + 1, 110, 132, 70, { c, r: 10 }) + T(x + 67, 138, p, { fs: 12.5, a: 'middle', mono: true, b: true }) + T(x + 67, 162, d, { fs: 13, a: 'middle', c: 'mu' })).join('') +
  A(250, 64, 67, 108, { c: 'vio' }) + A(265, 64, 209, 108, { c: 'vio' }) + A(295, 64, 351, 108, { c: 'vio' }) + A(310, 64, 493, 108, { c: 'vio' }) +
  R(280, 210, 270, 140, { c: 'amb', fill: 'rgba(255,194,51,.06)' }) +
  T(296, 238, 'mỗi attestation chứa:', { fs: 15, b: true, c: 'amb' }) +
  T(296, 266, '• SBOM (SPDX): 69 gói', { fs: 14.5 }) + T(296, 292, '• provenance (SLSA): ảnh nền,', { fs: 14.5 }) + T(310, 316, 'build-arg, máy dựng, lệnh', { fs: 14.5 }) +
  R(0, 210, 250, 140, { c: 'dk', fill: 'rgba(36,150,237,.06)' }) +
  T(16, 238, 'docker pull / run', { fs: 15, b: true, c: 'dk' }) + T(16, 266, 'chỉ lấy manifest đúng', { fs: 14.5 }) + T(16, 290, 'kiến trúc máy mình;', { fs: 14.5 }) + T(16, 314, 'unknown/unknown bị bỏ qua', { fs: 14.5, c: 'mu' }));

/* Slide 10 — uid_map của rootless */
const uidMap = () => sv(560, 400,
  T(0, 24, 'container trong dockerd rootless', { fs: 16, b: true, c: 'dk' }) +
  R(0, 40, 250, 70, { c: 'dk' }) + T(125, 70, 'uid 0 (root)', { fs: 17, a: 'middle', b: true, mono: true }) + T(125, 94, 'id ⇒ uid=0(root)', { fs: 14, a: 'middle', c: 'mu' }) +
  R(0, 130, 250, 70, { c: 'dk' }) + T(125, 160, 'uid 1 … 65536', { fs: 17, a: 'middle', b: true, mono: true }) + T(125, 184, 'user khác trong ảnh', { fs: 14, a: 'middle', c: 'mu' }) +
  T(560, 24, 'máy chủ thật', { fs: 16, b: true, c: 'grn', a: 'end' }) +
  R(310, 40, 250, 70, { c: 'grn' }) + T(435, 70, 'uid 1000', { fs: 17, a: 'middle', b: true, mono: true }) + T(435, 94, 'user thường, KHÔNG root', { fs: 14, a: 'middle', c: 'mu' }) +
  R(310, 130, 250, 70, { c: 'grn' }) + T(435, 160, 'uid 100000 …', { fs: 17, a: 'middle', b: true, mono: true }) + T(435, 184, 'dải trong /etc/subuid', { fs: 14, a: 'middle', c: 'mu' }) +
  A(250, 75, 306, 75, { c: 'amb' }) + A(250, 165, 306, 165, { c: 'amb' }) +
  R(0, 230, 560, 160, { c: 'dim', fill: '#0d1628' }) +
  T(16, 258, '$ cat /proc/self/uid_map   # trong container', { fs: 14.5, mono: true, c: 'mu' }) +
  T(16, 284, '         0       1000          1', { fs: 14.5, mono: true, c: 'amb' }) +
  T(16, 308, '         1     100000      65536', { fs: 14.5, mono: true, c: 'amb' }) +
  T(16, 340, 'File container "root" tạo trong thư mục gắn vào', { fs: 14.5 }) +
  T(16, 364, '⇒ ngoài máy chủ thuộc uid 1000, không phải 0', { fs: 14.5, c: 'grn' }));

/* Slide 18 — rolling update từng task */
const rolling = () => {
  const x0 = 150, W = 130;
  const row = (y, name, cells) => T(0, y + 26, name, { fs: 15, b: true, mono: true }) +
    cells.map(([c, t], i) => R(x0 + i * (W + 6), y, W, 40, { c, r: 8, fill: c === 'grn' ? 'rgba(63,185,80,.14)' : c === 'dk' ? 'rgba(36,150,237,.12)' : '#111a2b' }) + T(x0 + i * (W + 6) + W / 2, y + 26, t, { fs: 14, a: 'middle', mono: true })).join('');
  return sv(1100, 250,
    ['bắt đầu', 'task 1', '+5 s', 'task 2', '+5 s', 'task 3'].map((t, i) => T(x0 + i * (W + 6) + W / 2, 16, t, { fs: 14, a: 'middle', c: 'mu' })).join('') +
    row(30, 'web.2', [['dk', 'v1.10'], ['amb', 'dừng→v1.11'], ['grn', 'v1.11'], ['grn', 'v1.11'], ['grn', 'v1.11'], ['grn', 'v1.11']]) +
    row(80, 'web.1', [['dk', 'v1.10'], ['dk', 'v1.10'], ['dk', 'v1.10'], ['amb', 'dừng→v1.11'], ['grn', 'v1.11'], ['grn', 'v1.11']]) +
    row(130, 'web.3', [['dk', 'v1.10'], ['dk', 'v1.10'], ['dk', 'v1.10'], ['dk', 'v1.10'], ['dk', 'v1.10'], ['amb', 'dừng→v1.11']]) +
    T(0, 208, 'Lúc nào cũng còn ≥ 2 task phục vụ (--update-parallelism 1, order stop-first).', { fs: 15.5, c: 'grn' }) +
    T(0, 236, 'Task mới không ổn định ⇒ --update-failure-action rollback tự quay về v1.10.', { fs: 15.5, c: 'amb' }));
};

/* Slide 22 — kind: cả cụm trong một container */
const kindPic = () => sv(560, 400,
  R(0, 0, 560, 400, { c: 'tea', fill: 'rgba(45,212,191,.04)' }) + T(16, 28, 'Docker Desktop (máy Mac)', { fs: 16, b: true, c: 'tea' }) +
  R(16, 44, 528, 290, { c: 'vio', dash: true, fill: 'rgba(188,140,255,.05)' }) + T(32, 72, 'container dk15-control-plane', { fs: 15.5, b: true, mono: true, c: 'vio' }) +
  T(32, 96, 'ảnh kindest/node:v1.37.0 · ~1,06 GiB RAM', { fs: 14, c: 'mu' }) +
  [['kubelet + containerd', 110], ['kube-apiserver · etcd', 150], ['scheduler · controller-mgr', 190], ['coredns ×2 · kindnet', 230]].map(([t, y]) => R(32, y, 250, 32, { c: 'dim', r: 7, sw: 2 }) + T(44, y + 22, t, { fs: 13.5 })).join('') +
  R(300, 110, 228, 152, { c: 'grn', r: 10 }) + T(414, 136, 'Pod của bạn', { fs: 15, a: 'middle', b: true, c: 'grn' }) +
  ['web-…-5598d', 'web-…-mctpc', 'web-…-smdlw'].map((t, i) => R(316, 148 + i * 36, 196, 28, { c: 'grn', r: 6, sw: 1.5 }) + T(414, 167 + i * 36, t, { fs: 13, a: 'middle', mono: true })).join('') +
  T(32, 300, 'Pod = container lồng BÊN TRONG container node', { fs: 14.5, c: 'amb' }) +
  R(16, 346, 250, 40, { c: 'dk', r: 8 }) + T(141, 372, '127.0.0.1:18154 → API', { fs: 13.5, a: 'middle', mono: true }) +
  R(294, 346, 250, 40, { c: 'dk', r: 8 }) + T(419, 372, '127.0.0.1:18153 → 30080', { fs: 13.5, a: 'middle', mono: true }));

export const slides = S([
  cover({ t: 'Chương 15 — Nâng cao: build, bảo mật &amp; vượt khỏi một máy', sub: 'buildx bake · đa nền tảng · secret/ssh · attestation · rootless · Podman · Swarm · Kubernetes', chap: 'CHƯƠNG 15' }),

  { t: 'Bản đồ chương: đi tiếp từ "một máy, một người"', body: mindmap('Nâng cao', 'khi một lệnh docker build không còn đủ', [
    { t: '15.1 BuildKit nâng cao', d: 'builder riêng · đa nền tảng · bake · secret/ssh · check · SBOM', c: 'dk' },
    { t: '15.2 Bảo mật sâu', d: 'nhóm docker = root · rootless · userns-remap · Podman · seccomp', c: 'red' },
    { t: '15.3 Docker Swarm', d: 'service · replicas · rolling update · secret · stack deploy', c: 'amb' },
    { t: '15.4 Từ Compose tới Kubernetes', d: 'Pod/Deployment/Service · kind · Kompose · khi nào KHÔNG cần', c: 'vio' },
  ]) },

  /* ───────────── 15.1 ───────────── */
  { t: 'Builder riêng: BuildKit chạy trong container, gắn thêm được máy thật', body: two(
    `${term(['$ docker buildx create --name dk15-builder \\', '    --driver docker-container', 'dk15-builder', '$ docker buildx create --name dk15-builder --append \\', '    --node dk15-nha --platform linux/amd64 ssh://linux-nha', '$ docker buildx ls', 'NAME/NODE          DRIVER/ENDPOINT     STATUS   BUILDKIT', 'dk15-builder       docker-container', '= \\_ dk15-builder0  \\_ desktop-linux    running  v0.32.2', '= \\_ dk15-nha       \\_ ssh://linux-nha  running  v0.32.2'], { title: 'output thật — máy Mac', fs: 14 })}
    ${box('info', 'Builder mặc định (driver <code>docker</code>) chạy BÊN TRONG dockerd. <code>docker-container</code> cho bạn một BuildKit riêng: cache riêng, bản mới hơn, gắn được node từ xa.')}`,
    builderPic(), 'l') },

  { t: 'Giả lập chậm gấp ~3 lần — một node amd64 thật thì không', body: two(
    `${bars([
      { l: 'arm64 trên Mac', sub: 'gốc (native)', v: 28.9, txt: '28,9 s', c: 'grn' },
      { l: 'amd64 trên Mac', sub: 'GIẢ LẬP trong VM', v: 96.1, txt: '96,1 s', c: 'red' },
      { l: 'amd64 trên máy Linux', sub: 'node gốc qua ssh://', v: 20.2, txt: '20,2 s', c: 'grn' },
    ], { lw: 250 })}
    ${box('tip', 'Cùng một bước <code>RUN apk add --no-cache gcc musl-dev</code>, <code>--no-cache</code>, đo thật 24/09/2026. Bước nào chạy chương trình (cài gói, <code>npm ci</code> có mô-đun native, biên dịch) mới bị giả lập làm chậm; <code>COPY</code> thì không.')}`,
    `${term(['$ docker buildx build --builder dk15-builder \\', '    --platform linux/amd64,linux/arm64 \\', '    -t dk15-hash:1 --load .', '#10 [linux/amd64 build 2/4] RUN apk add …', '#10 DONE 20.2s', '#11 [linux/arm64 build 2/4] RUN apk add …', '#11 DONE 23.6s', '#18 exporting manifest list sha256:9efd3eb6… done', '$ docker run --rm --platform linux/amd64 dk15-hash:1', '= arch=x86_64 hash=7499008179331740677', '$ docker run --rm dk15-hash:1', '= arch=aarch64 hash=7499008179331740677'], { title: 'hai node chạy SONG SONG — tổng 28 s', fs: 13.5 })}`, 'r') },

  { t: 'bake: một file HCL thay cho nhiều lệnh build dài', body: two(
    `${yaml([
      ['variable "TAG" { default = "dev" }', 'đổi bằng TAG=1.0 bake'],
      ['group "default" {', 'bake không tên ⇒ nhóm này'],
      ['  targets = ["api", "web"] }', 'dựng song song'],
      ['target "_common" {', 'khuôn dùng chung'],
      ['  platforms = ["linux/amd64","linux/arm64"]', ''],
      ['  labels = { "dkhoc" = "15" } }', ''],
      ['target "web" {', ''],
      ['  inherits = ["_common"]', 'kế thừa khuôn'],
      ['  context  = "web"', 'thư mục ngữ cảnh'],
      ['  args     = { APP_VERSION = TAG }', 'build-arg lấy từ biến'],
      ['  tags = ["${REGISTRY}/dk15-web:${TAG}"] }', 'ghép chuỗi'],
    ], { fs: 14.5 })}`,
    `${term(['$ TAG=1.0 docker buildx bake --print web', '      "args": {', '        "APP_VERSION": "1.0"', '      "tags": [', '        "localhost:18150/dk15-web:1.0"', '$ TAG=1.0 docker buildx bake --load', '# 2 target × 2 nền tảng, 25 s', '$ docker buildx bake --check', 'api', '= Check complete, no warnings found.', 'web', '= Check complete, no warnings found.'], { title: 'output thật — máy Mac', fs: 14 })}
    ${box('tip', '<code>--print</code> cho xem cấu hình ĐÃ GIẢI (biến đã thay) mà không dựng gì — luôn chạy nó trước khi nghi bake "hiểu sai".')}`, 'l') },

  { t: 'Bí mật qua --secret: dùng được trong RUN, không nằm lại trong ảnh', body: two(
    `${yaml([
      ['RUN --mount=type=secret,id=npm_token,env=NPM_TOKEN \\', 'bí mật → biến môi trường'],
      ['    echo "token dai ${#NPM_TOKEN} ky tu"', 'chỉ trong RUN này'],
      ['RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \\', 'bí mật → file'],
      ['    ls -l /root/.npmrc', ''],
    ], { fs: 14, lang: 'docker' })}
    ${term(['$ docker buildx build --secret id=npm_token,env=NPM_TOKEN \\', '    --secret id=npmrc,src=./npmrc -t dk15-sec:1 --load .', '#7 0.037 token dai 17 ky tu, 4 ky tu dau: npm_', '#8 0.046 -r--------  1 root  root  51 … /root/.npmrc', '$ docker run --rm dk15-sec:1 ls -l /root/', '= total 0', '$ docker save dk15-sec:1 | … grep -c SECRETdk15', '= 0   # 5 file trong bản save, không file nào chứa'], { title: 'output thật — máy Mac', fs: 13 })}`,
    `${box('bad', '<b>Đổi giá trị bí mật KHÔNG làm vỡ cache.</b> Chạy lại với <code>NPM_TOKEN=npm_OTHERvalue999</code>: cả hai bước in <code>CACHED</code>. Bí mật không nằm trong khoá cache — nếu bước đó tải gói bằng token CŨ, bạn giữ nguyên kết quả cũ.')}
    ${box('good', 'Cần chạy lại khi đổi bí mật: <code>--no-cache-filter &lt;stage&gt;</code>, hoặc một <code>ARG</code> "phiên bản bí mật" đặt ngay trước bước đó.')}`, 'l2') },

  { t: '--ssh cho mượn khoá qua agent; --check chặn Dockerfile ẩu', body: two(
    `${term(['$ docker buildx build --ssh default=agent.sock …', '#8 [3/4] RUN --mount=type=ssh … ssh-add -l', '#8 0.032 SSH_AUTH_SOCK=/run/buildkit/ssh_agent.0', '= #8 0.037 256 SHA256:IRy0eq… dk15-deploy-key (ED25519)', '#9 [4/4] RUN ssh-add -l; echo "exit=$?"', '! #9 0.033 Could not open a connection to your authentication agent.', '#9 0.033 exit=2'], { title: '--ssh: khoá chỉ có mặt trong đúng RUN đó', fs: 13 })}
    ${box('tip', 'Khoá riêng KHÔNG vào BuildKit: chỉ cái socket của ssh-agent được chuyển tiếp. Dùng cho <code>git clone</code> kho riêng, <code>npm i git+ssh://…</code>.')}`,
    `${yaml([
      ['# syntax=docker/dockerfile:1', ''],
      ['# check=skip=JSONArgsRecommended;error=true', 'cảnh báo ⇒ LỖI'],
      ['FROM alpine:3.22 as base', 'FromAsCasing'],
      ['ENV APP_ENV production', 'LegacyKeyValueFormat'],
    ], { fs: 14, lang: 'docker' })}
    ${term(['$ docker build --check .', 'Check complete, 2 warnings have been found!', 'WARNING: FromAsCasing - https://docs.docker.com/go/…', 'WARNING: LegacyKeyValueFormat - https://docs.docker.com/go/…', '! ERROR: lint violation found for rules: FromAsCasing, LegacyKeyValueFormat', '$ echo $?', '! 1'], { title: 'Chương 5 đã dạy --check; đây là cách ÉP nó', fs: 13 })}`) },

  { t: 'Attestation: SBOM và nguồn gốc (provenance) đi KÈM ảnh', body: two(
    `${term(['$ docker buildx build --platform linux/amd64,linux/arm64 \\', '    --attest type=sbom --attest type=provenance,mode=max \\', '    -t localhost:18150/dk15-web:1.1 --load web', '#17 [linux/amd64] generating sbom using docker.io/docker/buildkit-syft-scanner:stable-1', '$ docker buildx imagetools inspect localhost:18150/dk15-web:1.1 \\', "    --format '{{json .SBOM}}' | jq '.\"linux/amd64\".SPDX.packages|length'", '= 69', '# busybox 1.37.0-r12 · libssl3 3.3.3-r0 · nginx 1.27.5-r1 …', "$ … --format '{{json .Provenance}}' | jq … resolvedDependencies", 'pkg:docker/docker/dockerfile@1 ecfaec9ed6d8', 'pkg:docker/nginx@1.27-alpine?platform=linux%2Famd64 65645c7bb6a0', '# builderPlatform: linux/arm64 · build-arg:APP_VERSION: 1.1'], { title: 'output thật — registry cục bộ :18150', fs: 12.5 })}`,
    indexPic(), 'l') },

  /* ───────────── 15.2 ───────────── */
  { t: 'Ai vào được nhóm docker là có quyền root trên máy', body: two(
    `${term(['$ id -nG', 'Cuong03dx wheel dialout docker', '$ cat /etc/shadow', '! cat: /etc/shadow: Permission denied', '$ docker run --rm -v /etc/shadow:/s:ro alpine:3 \\', '    sh -c "id; wc -l < /s"', '+ uid=0(root) gid=0(root) groups=0(root),…', '+ 54'], { title: 'output thật — máy Linux, user thường, không sudo', fs: 15 })}
    ${box('bad', 'Không cần lỗ hổng nào: <code>-v /:/host</code> là đọc/ghi được MỌI file. Vì dockerd chạy bằng root, ai nói chuyện được với <code>/var/run/docker.sock</code> thì ra lệnh được cho root.')}`,
    diagram({ w: 520, h: 420, nodes: [
      { id: 'u', x: 0, y: 10, w: 236, h: 76, t: 'user Cuong03dx', d: 'nhóm docker', c: 'tea' },
      { id: 's', x: 0, y: 172, w: 236, h: 76, t: '/var/run/docker.sock', d: 'srw-rw---- root:docker', c: 'amb' },
      { id: 'd', x: 320, y: 172, w: 196, h: 76, t: 'dockerd', d: 'chạy bằng ROOT', c: 'red' },
      { id: 'c', x: 320, y: 334, w: 196, h: 76, t: 'container uid 0', d: 'gắn /etc/shadow vào', c: 'red' },
    ], edges: [{ from: 'u', to: 's', t: 'ghi được' }, { from: 's', to: 'd', t: 'API' }, { from: 'd', to: 'c', t: 'tạo' }] }), 'l') },

  { t: 'Rootless: "root" trong container chỉ là uid 1000 ngoài máy', body: two(
    `${term(['$ docker exec dk15-rootless ps -o user,args', 'rootless  rootlesskit --net=slirp4netns …', 'rootless  dockerd --host=unix:///run/user/1000/docker.sock …', '$ docker info --format "{{json .SecurityOptions}}"', '= ["name=seccomp,profile=builtin","name=rootless","name=cgroupns"]', '$ docker run --rm -v /tmp:/h alpine:3 touch /h/tao-boi-root', '$ ls -ln /h/tao-boi-root         # nhìn TỪ container', '-rw-r--r--  1 0     0     0 … tao-boi-root', '$ ls -ln /tmp/tao-boi-root       # nhìn từ máy chủ', '= -rw-r--r--  1 1000  1000  0 … tao-boi-root'], { title: 'output thật — dockerd rootless (docker:29-dind-rootless)', fs: 13 })}`,
    uidMap(), 'l') },

  { t: 'Rootless và userns-remap đổi an toàn lấy vài giới hạn', body: table(['', 'Docker thường', 'Rootless', 'userns-remap'], [
    ['dockerd chạy bằng', '-root', '+user thường', '-root'],
    ['root trong container là', '-root thật (uid 0)', '+uid của bạn', '+uid 231072… (dockremap)'],
    ['Cài / bật', 'mặc định', 'mỗi user tự cài; cần newuidmap + /etc/subuid', '<code>"userns-remap": "default"</code> trong daemon.json + khởi động lại'],
    ['Cổng &lt; 1024', 'được', '!cần <code>net.ipv4.ip_unprivileged_port_start=0</code>', 'được'],
    ['Không hỗ trợ', '—', '!AppArmor, checkpoint, overlay network, cổng SCTP', '!<code>--pid=host</code>, <code>--network=host</code>, <code>--privileged</code> (trừ khi <code>--userns=host</code>)'],
    ['Giới hạn RAM/CPU', 'được', '!chỉ khi cgroup v2 + systemd', 'được'],
    ['Ảnh/container cũ', '—', 'kho riêng của user', '!bị "che" — <code>docker image ls</code> rỗng sau khi bật'],
  ], { sm: true }) },

  { t: 'seccomp đã bật sẵn; --cap-drop ALL còn chặt hơn', body: two(
    `${term(['$ docker run --rm alpine:3 grep -E "^(CapEff|NoNewPrivs|Seccomp):" /proc/self/status', 'CapEff:  00000000a80425fb', 'NoNewPrivs:  0', '= Seccomp:  2        # 2 = đang lọc syscall', '$ docker run --rm alpine:3 unshare -U id', '! unshare: unshare(0x10000000): Operation not permitted', '$ docker run --rm --security-opt seccomp=unconfined alpine:3 unshare -U id', '+ uid=65534(nobody) gid=65534(nobody) …', '$ docker run --rm --cap-drop ALL alpine:3 sh -c "chown nobody /tmp"', '! chown: /tmp: Operation not permitted'], { title: 'output thật — máy Linux', fs: 13 })}`,
    `${cards([
      { ic: '🧱', t: 'seccomp', d: 'lọc lời gọi hệ thống (syscall); hồ sơ mặc định chặn khoảng 44 trên 300+ cái, có <code>unshare</code>, <code>mount</code>, <code>reboot</code>', c: 'blu' },
      { ic: '🔑', t: 'capability', d: 'mảnh quyền của root; mặc định giữ 14, <code>--cap-drop ALL</code> bỏ hết (Chương 6)', c: 'amb' },
      { ic: '🛡', t: 'AppArmor / SELinux', d: 'Ubuntu có AppArmor <code>docker-default</code>; Fedora dùng SELinux — máy Linux của khoá không bật cho Docker', c: 'vio' },
    ], 1)}`, 'l') },

  { t: 'Podman: không có tiến trình nền, chạy rootless mặc định, có "pod"', body: two(
    `${term(['$ podman info --format "rootless={{.Host.Security.Rootless}} runtime={{.Host.OCIRuntime.Name}}"', '= rootless=true runtime=crun', '$ podman pod create --name nhom -p 8080:80', '$ podman run -d --pod nhom --name web nginx:alpine', '$ podman run -d --pod nhom --name kiemtra alpine:3 sleep 600', '$ podman exec kiemtra wget -qO- http://localhost:80 | grep -o "<title>.*</title>"', '= <title>Welcome to nginx!</title>', '$ podman kube generate nhom | grep -E "^kind|    name:"', 'kind: Pod', '    name: web', '    name: kiemtra', '$ podman compose version', '! Error: looking up compose provider failed'], { title: 'output thật — Podman 5.8.7 (user podman, uid 1000)', fs: 12.5 })}`,
    `${host({ t: 'Pod "nhom" — CHUNG một mạng', ic: '🫛', cols: 2, ctrs: [
      { n: 'web', im: 'nginx:alpine', c: 'grn', items: ['nghe cổng 80'] },
      { n: 'kiemtra', im: 'alpine:3', c: 'tea', items: ['gọi <code>localhost:80</code> — vì chung mạng'] },
    ], side: [{ t: 'không có dockerd: mỗi container một <code>conmon</code> giám sát', c: 'amb' }, { t: '<code>podman compose</code> chỉ là vỏ — cần cài docker-compose hoặc podman-compose', c: 'red' }] })}`, 'l') },

  { t: 'Chọn gì khi nào: đừng đổi công cụ chỉ vì nghe "an toàn hơn"', body: table(['Tình huống', 'Nên chọn', 'Vì sao'], [
    ['Laptop cá nhân, Mac/Windows', '+Docker Desktop như đang dùng', 'daemon đã nằm trong máy ảo; nhóm docker không trao root của macOS'],
    ['Server Linux dùng chung (phòng lab, máy nhóm)', '+Rootless Docker, hoặc Podman', 'thành viên chạy container mà không ai thành root của máy'],
    ['VPS riêng, chỉ bạn quản trị', 'Docker thường + siết container (Chương 6)', 'đơn giản; rủi ro lớn hơn nằm ở cổng mở và ảnh lạ'],
    ['Máy RHEL/Fedora của công ty', '+Podman', 'có sẵn, hỗ trợ chính thức, systemd tích hợp (Quadlet)'],
    ['Cần <code>--network=host</code>, overlay network, Swarm', '-KHÔNG rootless / userns-remap', 'hai chế độ đó không hỗ trợ'],
    ['Chạy CI dựng ảnh trong container', '!BuildKit rootless hoặc builder từ xa', 'đừng gắn <code>docker.sock</code> vào job CI'],
  ], { sm: true }) },

  /* ───────────── 15.3 ───────────── */
  { t: 'Swarm có sẵn trong Docker Engine: một lệnh biến máy thành cụm', body: two(
    `${term(["$ docker info --format '{{.Swarm.LocalNodeState}}'", '= inactive      # KIỂM TRƯỚC: chưa ở cụm nào', '$ docker swarm init', 'Swarm initialized: current node (xhcje1fvesbn9kx7qm4mmnqr1) is now a manager.', '    docker swarm join --token SWMTKN-1-…(token)… 192.168.65.3:2377', '$ docker node ls', 'HOSTNAME        STATUS  AVAILABILITY  MANAGER STATUS  ENGINE VERSION', 'docker-desktop  Ready   Active        Leader          29.8.0', '$ docker network ls --filter driver=overlay', 'ingress   overlay   swarm'], { title: 'output thật — máy Mac', fs: 13 })}`,
    diagram({ w: 520, h: 420, nodes: [
      { id: 'm', x: 140, y: 10, w: 240, h: 84, t: 'manager', d: 'giữ trạng thái mong muốn\n(Raft) · nhận lệnh', c: 'amb' },
      { id: 'w1', x: 10, y: 180, w: 230, h: 84, t: 'worker 1', d: 'chạy task', c: 'dk' },
      { id: 'w2', x: 280, y: 180, w: 230, h: 84, t: 'worker 2', d: 'chạy task', c: 'dk' },
      { id: 'n', x: 10, y: 330, w: 500, h: 80, t: 'mạng overlay + routing mesh', d: 'cổng công bố mở trên MỌI node', c: 'vio' },
    ], edges: [{ from: 'm', to: 'w1', t: ':2377' }, { from: 'm', to: 'w2', t: ':2377' }] }), 'l') },

  { t: 'service = "tôi muốn 3 bản chạy"; routing mesh chia đều request', body: two(
    `${term(['$ docker service create --name dk15-web --replicas 3 \\', '    --network dk15-net -p 18151:80 traefik/whoami:v1.10', 'verify: Service egfj88m3u4tlfud7zdbktffjn converged', '$ docker service ls', 'NAME      MODE        REPLICAS  IMAGE                 PORTS', '= dk15-web  replicated  3/3       traefik/whoami:v1.10  *:18151->80/tcp', '$ for i in 1 2 3 4 5 6; do curl -s localhost:18151 | grep Hostname; done', 'Hostname: b005bd33a10c', 'Hostname: 53b2cf9b51e0', 'Hostname: 14b4d12eae49', 'Hostname: b005bd33a10c', '…'], { title: 'output thật — swarm một nút trên Mac', fs: 13 })}`,
    `${cards([
      { ic: '🎯', t: 'Trạng thái mong muốn', d: 'Bạn khai số bản; manager so với thực tế và tự sửa chênh lệch.', c: 'amb' },
      { ic: '📦', t: 'task', d: 'Một bản chạy của service = một container tên <code>dk15-web.2.7kfap…</code>.', c: 'blu' },
      { ic: '🔀', t: 'routing mesh', d: 'Cổng 18151 nhận ở mọi node, rồi chia vòng tròn tới các task — ba hostname lần lượt ở trên.', c: 'vio' },
    ], 1)}`, 'l') },

  { t: 'Giết một task: swarm tự dựng lại, không ai phải gõ gì', body: two(
    `${term(['$ docker rm -f $(docker ps -q --filter name=dk15-web.2.)', '$ docker service ps dk15-web', 'NAME        CURRENT STATE                ERROR', 'dk15-web.1  Running 19 seconds ago', '= dk15-web.2  Running less than a second ago', '! dk15-web.2  Failed 5 seconds ago         "task: non-zero exit (137)"', 'dk15-web.3  Running 19 seconds ago', '$ docker service ls --format "{{.Name}} {{.Replicas}}"', '= dk15-web 3/3'], { title: 'output thật — máy Mac', fs: 14 })}`,
    `${box('info', 'Khác <code>restart: always</code> của Compose: restart chỉ khởi động lại CHÍNH container đó trên CHÍNH máy đó. Swarm tạo một task MỚI (id mới) và có thể đặt nó sang máy khác nếu máy cũ chết.')}
    ${box('warn', 'Lịch sử task giữ lại (mặc định 5 bản/slot) — đọc cột ERROR ở đây trước khi đọc log.')}`, 'l') },

  { t: 'Cập nhật cuốn chiếu: 150 request, không rớt cái nào', body: `
    ${rolling()}
    ${two(term(['$ docker service update --image traefik/whoami:v1.11 \\', '    --update-parallelism 1 --update-delay 5s \\', '    --update-failure-action rollback dk15-web', 'verify: Service dk15-web converged    # 27 s'], { title: 'output thật', fs: 13.5 }),
      term(['$ (150 lần curl, cách 0,1 s) & docker service rollback dk15-web', 'verify: Service dk15-web converged', '= 200=150 loi=0'], { title: 'đo tính sẵn sàng khi rollback', fs: 13.5 }))}` },

  { t: 'Secret của Swarm: file tmpfs chỉ-đọc, không bao giờ là biến môi trường', body: two(
    `${term(["$ printf 'MatKhau#2026' | docker secret create dk15-db-pass -", 'odvg42wbph6zmm8ku07m8tyjm', "$ docker secret inspect dk15-db-pass --format '{{json .Spec}}'", '= {"Name":"dk15-db-pass","Labels":{"dkhoc":"15"}}   # không có giá trị', '$ docker service create --name dk15-sdemo --secret dk15-db-pass alpine:3 …', '$ docker service logs --raw dk15-sdemo', '-r--r--r--  1 root  root  12 … dk15-db-pass', 'tmpfs on /run/secrets/dk15-db-pass type tmpfs (ro,relatime)', 'doc duoc: 12 byte', '0        # env | grep -ci matkhau'], { title: 'output thật — máy Mac', fs: 13 })}`,
    `${steps([
      ['Mã hoá khi lưu', 'nằm trong nhật ký Raft của manager, mã hoá'],
      ['Chỉ task được cấp mới thấy', 'gắn vào <code>/run/secrets/&lt;tên&gt;</code> trong RAM'],
      ['Ảnh chính thức đọc được <code>_FILE</code>', '<code>POSTGRES_PASSWORD_FILE=/run/secrets/db_pass</code>'],
      ['Ngoài swarm thì không có', '<code>This node is not a swarm manager</code>'],
    ])}`, 'l') },

  { t: 'stack deploy: file compose gần như giữ nguyên — nhưng vài khoá bị BỎ QUA', body: two(
    `${yaml([
      ['services:', ''],
      ['  web:', ''],
      ['    image: traefik/whoami:v1.10', 'PHẢI có ảnh dựng sẵn'],
      ['    build: ./web', '✗ bỏ qua (có báo)'],
      ['    deploy:', 'chỉ swarm mới đọc'],
      ['      replicas: 2', ''],
      ['      update_config: { parallelism: 1, delay: 5s }', ''],
      ['      resources: { limits: { memory: 64M } }', 'HostConfig.Memory=67108864'],
      ['  cache:', ''],
      ['    image: redis:7-alpine', ''],
      ['    container_name: cache', '✗ bỏ qua (có báo)'],
      ['    depends_on: [web]', '✗ bỏ qua IM LẶNG'],
      ['    secrets: [db_pass]', '/run/secrets/db_pass'],
    ], { fs: 13.5 })}`,
    `${term(['$ docker stack deploy -c compose.yaml dk15-stack', '! Ignoring unsupported options: build', 'Ignoring deprecated options:', '! container_name: Setting the container name is not supported.', 'Creating network dk15-stack_back', 'Creating service dk15-stack_cache', 'Creating service dk15-stack_web', '$ docker stack services dk15-stack', 'NAME              REPLICAS  IMAGE                 PORTS', 'dk15-stack_cache  1/1       redis:7-alpine', 'dk15-stack_web    2/2       traefik/whoami:v1.10  *:18152->80/tcp'], { title: 'output thật — máy Mac', fs: 12 })}
    ${box('warn', 'Docs: <code>docker stack deploy</code> dùng định dạng Compose v3 CŨ; khoá mới của Compose spec có thể không được hiểu.')}`, 'l') },

  /* ───────────── 15.4 ───────────── */
  { t: 'Mỗi khái niệm Compose có một "người anh" trong Kubernetes', body: table(['Compose / Swarm', 'Kubernetes', 'Khác ở đâu'], [
    ['một container của service', '<b>Pod</b>', 'Pod có thể chứa vài container CHUNG mạng + volume (như pod của Podman)'],
    ['<code>deploy.replicas</code>, <code>docker service</code>', '<b>Deployment</b> (→ ReplicaSet → Pod)', 'giữ số bản, rolling update, <code>rollout undo</code>'],
    ['tên service trong mạng Compose', '<b>Service</b> (ClusterIP)', 'một IP ảo + tên DNS cố định trước các Pod'],
    ['<code>ports: "8080:80"</code>', '<b>Service</b> NodePort / LoadBalancer', 'NodePort chỉ dải 30000–32767'],
    ['nginx/Caddy đứng trước', '<b>Ingress</b> (+ controller) / <b>Gateway API</b>', 'Ingress đã "đóng băng"; K8s khuyên dùng Gateway'],
    ['<code>environment:</code>, file <code>.env</code>', '<b>ConfigMap</b>', 'đối tượng riêng, nhiều Pod dùng chung'],
    ['<code>secrets:</code>', '<b>Secret</b>', '!mặc định chỉ base64, KHÔNG mã hoá trong etcd'],
    ['<code>volumes:</code> có tên', '<b>PersistentVolumeClaim</b>', 'xin dung lượng; StorageClass cấp đĩa thật'],
    ['<code>healthcheck:</code>', '<b>readiness/liveness probe</b>', 'readiness quyết định Pod có nhận request không'],
  ], { sm: true }) },

  { t: 'kind: cả một cụm Kubernetes gói trong MỘT container', body: two(
    `${term(['$ KIND_EXPERIMENTAL_DOCKER_NETWORK=dk15-kind-net \\', '    ./bin/kind create cluster --name dk15 \\', '    --config kind.yaml --kubeconfig ./kubeconfig', ' ✓ Ensuring node image (kindest/node:v1.37.0)', ' ✓ Preparing nodes', ' ✓ Starting control-plane', ' ✓ Installing CNI', ' ✓ Installing StorageClass', '# lần đầu 53 s (kéo ảnh 1,3 GB) · lần sau 10 s', '$ docker ps --filter name=dk15-control', '= dk15-control-plane  127.0.0.1:18154->6443/tcp, 127.0.0.1:18153->30080/tcp', '$ kubectl get pods -A --no-headers | wc -l', '14'], { title: 'output thật — máy Mac', fs: 13 })}
    ${box('tip', '<code>--kubeconfig ./kubeconfig</code> giữ <code>~/.kube/config</code> của bạn nguyên vẹn.')}`,
    kindPic(), 'l') },

  { t: 'Deployment + Service: đọc YAML từng khối', body: two(
    `${yaml([
      ['kind: Deployment', 'giữ N bản của một Pod'],
      ['spec:', ''],
      ['  replicas: 3', '= deploy.replicas'],
      ['  selector: { matchLabels: { app: web } }', 'quản Pod mang nhãn này'],
      ['  template:', 'khuôn của từng Pod'],
      ['    metadata: { labels: { app: web } }', 'PHẢI khớp selector'],
      ['    spec:', ''],
      ['      containers:', ''],
      ['        - image: traefik/whoami:v1.10', ''],
      ['          envFrom: [{ configMapRef: … }]', '= environment:'],
      ['          resources: { limits: { memory: 64Mi } }', ''],
      ['          readinessProbe: { httpGet: { path: /, port: 80 } }', ''],
    ], { fs: 13.5 })}`,
    `${yaml([
      ['kind: Service', 'IP ảo + tên DNS "web"'],
      ['spec:', ''],
      ['  type: NodePort', 'mở ra ngoài node'],
      ['  selector: { app: web }', 'gửi tới Pod có nhãn này'],
      ['  ports:', ''],
      ['    - port: 80', 'cổng của Service'],
      ['      targetPort: 80', 'cổng trong container'],
      ['      nodePort: 30080', 'kind ánh xạ → 18153'],
    ], { fs: 13.5 })}
    ${term(['$ kubectl apply -f app.yaml', 'deployment.apps/web created', 'service/web created', '$ curl -s localhost:18153 | grep Hostname', '= Hostname: web-8f7db8765-mctpc'], { title: 'output thật', fs: 13 })}`, 'l') },

  { t: 'Tự lành, rollout, undo — và Secret chỉ là base64', body: two(
    `${term(['$ kubectl delete pod web-8f7db8765-smdlw', '$ kubectl get pods', 'web-8f7db8765-5598d   1/1   Running   0   23s', 'web-8f7db8765-mctpc   1/1   Running   0   23s', '= web-8f7db8765-phrxh   1/1   Running   0   1s', '$ kubectl set image deploy/web whoami=traefik/whoami:v1.11', 'deployment "web" successfully rolled out', '$ kubectl rollout undo deploy/web', 'deployment.apps/web rolled back', "$ kubectl get deploy web -o jsonpath='{…image}'", '= traefik/whoami:v1.10'], { title: 'output thật — cụm kind', fs: 13 })}`,
    `${term(["$ kubectl get secret db-pass -o jsonpath='{.data.password}'", 'TWF0S2hhdSMyMDI2', '$ … | base64 -d', '! MatKhau#2026'], { title: 'ai đọc được Secret là có mật khẩu', fs: 14 })}
    ${box('bad', 'Docs Kubernetes: Secret "stored unencrypted in the API server’s underlying data store (etcd)" theo mặc định; ai tạo được Pod trong namespace là đọc được mọi Secret trong đó. Cần bật mã hoá etcd + RBAC.')}`) },

  { t: 'Kompose dịch được cú pháp — không dịch được ý đồ', body: two(
    `${term(['$ kompose convert -f compose.yaml -o out/', '! WARN Service "db" won\'t be created because \'ports\' is not specified', 'INFO Kubernetes file "out/api-service.yaml" created', 'INFO Kubernetes file "out/api-deployment.yaml" created', 'INFO Kubernetes file "out/db-deployment.yaml" created', 'INFO Kubernetes file "out/pgdata-persistentvolumeclaim.yaml" created', '$ kubectl apply -f out/ && kubectl get pods', '! api-cf575759b-vxnf8   0/1   ErrImagePull   0   40s', '= db-5b4bd69966-8b7f9   1/1   Running        0   40s', '$ kubectl exec deploy/api -- node -e "…lookup(\'db\')…"', '! ENOTFOUND db'], { title: 'output thật — kompose 1.38.0 + kind', fs: 12.5 })}`,
    `${cards([
      { ic: '🔌', t: 'Không có ports ⇒ không có Service', d: 'Trong Compose ai cũng gọi được <code>db</code>. Ở K8s phải có Service tên <code>db</code> — sửa: <code>kubectl expose deploy db --port 5432</code>.', c: 'red' },
      { ic: '🏷', t: '<code>localhost:18150/…</code> trỏ vào node', d: 'Cụm không thấy <code>docker images</code> của bạn: <code>kind load docker-image</code>, hoặc đẩy lên registry thật.', c: 'amb' },
      { ic: '⏳', t: '<code>depends_on</code> biến mất', d: 'K8s không có thứ tự khởi động; app phải tự thử lại kết nối.', c: 'vio' },
    ], 1)}`, 'l') },

  { t: 'Khi nào KHÔNG cần Kubernetes — gần như mọi đồ án sinh viên', body: two(
    `${table(['Bạn có…', 'Dùng'], [
      ['1 VPS, 1 web + API + CSDL', '+Docker Compose (Chương 9–11)'],
      ['2–5 máy, muốn tự lành + rolling update', '+Swarm (15.3)'],
      ['nhiều đội, hàng chục dịch vụ, tự co giãn', '!Kubernetes (thường là dịch vụ có quản lý: EKS/GKE/AKS)'],
      ['muốn học K8s để đi làm', '+kind / k3d trên laptop — đúng như bài này'],
    ], { sm: true })}
    ${box('warn', 'Kubernetes không làm app nhanh hơn. Nó thêm một lớp phải vận hành: etcd, chứng chỉ, nâng phiên bản ba tháng một lần, RBAC, Ingress/Gateway.')}`,
    `${kpis([
      { v: '1,06 GiB', l: 'RAM của một cụm kind RỖNG', c: 'red' },
      { v: '14 Pod', l: '9 Pod hệ thống + 5 của bạn', c: 'amb' },
      { v: '26 MiB', l: 'RAM của registry dk15-reg, để so', c: 'grn' },
    ])}
    ${box('tip', 'Một VPS 2 GB chạy Compose cả web lẫn CSDL thoải mái; dựng K8s trên đó là tiêu nửa RAM cho bộ máy điều phối.')}`, 'l') },

  /* ───────────── chung ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 15', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Bản amd64 dựng trên Mac mất gấp 3 lần', 'bước RUN chạy qua giả lập', 'node amd64 thật (<code>--append ssh://…</code>) hoặc runner ARM trong CI'],
    ['Đổi token mà build vẫn dùng kết quả cũ', 'bí mật không nằm trong khoá cache ⇒ <code>CACHED</code>', '<code>--no-cache-filter</code> hoặc ARG phiên bản'],
    ['"Cho bạn vào nhóm docker cho tiện"', 'nhóm docker = root máy', 'rootless / Podman trên máy dùng chung'],
    ['<code>stack deploy</code> không dựng ảnh', '<code>build:</code> bị bỏ qua', 'build + push trước, compose chỉ ghi <code>image:</code>'],
    ['Container stack không đợi CSDL', '<code>depends_on</code> bị bỏ qua im lặng', 'healthcheck + app tự thử lại'],
    ['<code>docker secret</code> báo "not a swarm manager"', 'secret là tính năng của Swarm', 'Compose thường: <code>secrets: file:</code>'],
    ['Pod <code>ErrImagePull</code> với ảnh vừa build', 'cụm không thấy kho ảnh của máy bạn', '<code>kind load docker-image</code> / registry'],
    ['<code>ENOTFOUND db</code> sau Kompose', 'dịch vụ không có <code>ports</code> ⇒ không có Service', '<code>kubectl expose</code> hoặc viết Service'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 15', body: table(['Muốn…', 'Gõ'], [
    ['Builder riêng + node Linux thật', '<code>docker buildx create --name b --driver docker-container</code> · <code>--append --node n ssh://host</code>'],
    ['Nhiều ảnh, một lệnh', '<code>docker buildx bake --print</code> rồi <code>TAG=1.0 docker buildx bake</code>'],
    ['Bí mật lúc build', '<code>--secret id=x,env=VAR</code> + <code>RUN --mount=type=secret,id=x,env=VAR</code>'],
    ['Khoá SSH lúc build', '<code>--ssh default</code> + <code>RUN --mount=type=ssh …</code>'],
    ['Cảnh báo Dockerfile thành lỗi', '<code># check=error=true</code> · <code>docker build --check .</code>'],
    ['SBOM + provenance', '<code>--attest type=sbom --attest type=provenance,mode=max</code> · <code>imagetools inspect --format</code>'],
    ['Swarm một nút', "<code>docker swarm init</code> … <code>docker swarm leave --force</code>"],
    ['Service / cập nhật', '<code>docker service create --replicas 3 -p …</code> · <code>service update --image …</code> · <code>service rollback</code>'],
    ['Compose lên Swarm', '<code>docker stack deploy -c compose.yaml tên</code>'],
    ['Cụm K8s thử', '<code>kind create cluster --name x --kubeconfig ./kc</code> · <code>kind delete cluster --name x</code>'],
    ['Đọc/đổi Deployment', '<code>kubectl apply -f</code> · <code>set image</code> · <code>rollout undo</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 15 (45 phút)', body: `
    ${steps([
      ['Tạo builder <code>docker-container</code>, dựng một ảnh cho amd64 + arm64, đọc chỉ mục bằng <code>imagetools inspect</code>', 'đo thời gian bước RUN của từng nền tảng'],
      ['Viết <code>docker-bake.hcl</code> cho API + web của đồ án, đưa token npm vào bằng <code>--secret</code>', 'chứng minh <code>docker save … | grep</code> ra 0'],
      ['Soi quyền của mình: <code>id -nG</code>, <code>SecurityOptions</code>, <code>Seccomp:</code> trong container', 'ghi lại máy mình thuộc hàng nào trong bảng 15.2'],
      ['Swarm một nút: service 3 bản, rolling update, rollback trong lúc curl liên tục', 'rồi <code>swarm leave --force</code>'],
      ['kind: triển khai cùng ứng dụng bằng Deployment + Service, xoá một Pod, <code>rollout undo</code>', 'rồi <code>kind delete cluster</code>'],
    ])}
    ${box('good', '<b>Đạt khi:</b> <code>imagetools inspect</code> có đủ hai nền tảng, rollback không làm rớt request nào, và <code>docker info</code> báo lại <code>inactive</code>, <code>docker ps -a</code> sạch.')}` },
]);
