/**
 * Docker · Deck dk-03 — Chương 3: Image & registry.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 23/09/2026:
 *   • "máy Mac"    = Mac M1, Docker Desktop 4.91 / Engine 29.8.0 arm64, kho ảnh containerd
 *   • "máy Linux"  = Fedora 44, Docker Engine 29.6.2 amd64 (linux-nha) — KHÔNG cài QEMU/binfmt,
 *                    nên ảnh arm64 chạy ở đây là exec format error thật
 *   • registry cục bộ: registry:2 tên dk03-reg ở localhost:18030 (máy Linux với tới qua ssh -R 18030)
 * Tên đối tượng mang tiền tố dk03- (luật an toàn của khoá); trong bài người học dùng tên ngắn.
 * Số liệu Docker Hub (giới hạn kéo): docs.docker.com/docker-hub/usage/ + header thật, 23/09/2026.
 */
import { S, cover, cards, box, steps, table, vs, kpis, two, mindmap, term as dkTerm, diagram, yaml, bars, esc, D } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });
const TCSS = '<style>.g-term pre{line-height:1.45}</style>';

export const deck = { key: 'dk-03', code: 'DOCKER · CHƯƠNG 3', title: 'Image & registry', sub: 'Docker · Chương 3' };

/* ───────────── SVG nhỏ tự vẽ ───────────── */
const MONO = 'SF Mono,Menlo,monospace';
const sv = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:block;margin:0 auto"><defs>` +
  ['dk', 'amb', 'red', 'grn', 'mu', 'tea', 'vio'].map((k) => `<marker id="m-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${D[k]}"/></marker>`).join('') +
  `</defs>${inner}</svg>`;
const R = (x, y, w, h, { c = 'dk', fill = '#111a2b', dash = false, r = 12, sw = 2.5, op = 1 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${D[c] || c}" stroke-width="${sw}"${dash ? ' stroke-dasharray="9 7"' : ''} opacity="${op}"/>`;
const T = (x, y, s, { fs = 17, c = '#e6edf3', a = 'start', b = false, mono = false } = {}) =>
  `<text x="${x}" y="${y}" font-size="${fs}" fill="${D[c] || c}" text-anchor="${a}"${b ? ' font-weight="800"' : ''}${mono ? ` font-family="${MONO}"` : ''}>${esc(s)}</text>`;
const A = (x1, y1, x2, y2, { c = 'dk', dash = false, sw = 3 } = {}) =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${D[c]}" stroke-width="${sw}" fill="none"${dash ? ' stroke-dasharray="7 6"' : ''} marker-end="url(#m-${c})"/>`;

/* Slide 3 — một tên ảnh tách thành 4 trường */
const nameParts = () => {
  const parts = [
    { t: 'docker.io', w: 190, c: 'dim', k: 'REGISTRY', d: 'bỏ trống ⇒ docker.io' },
    { t: '/', w: 22, sep: true },
    { t: 'library', w: 150, c: 'dim', k: 'NAMESPACE', d: 'bỏ trống ⇒ library' },
    { t: '/', w: 22, sep: true },
    { t: 'nginx', w: 130, c: 'grn', k: 'REPOSITORY', d: 'phần DUY NHẤT bắt buộc' },
    { t: ':', w: 22, sep: true },
    { t: '1.27-alpine', w: 210, c: 'amb', k: 'TAG', d: 'bỏ trống ⇒ latest' },
    { t: '@', w: 26, sep: true },
    { t: 'sha256:6564…', w: 200, c: 'vio', k: 'DIGEST', d: 'tuỳ chọn: tên của NỘI DUNG' },
  ];
  let x = 0, s = '';
  for (const p of parts) {
    if (p.sep) { s += T(x + p.w / 2, 92, p.t, { fs: 30, a: 'middle', c: 'mu', mono: true, b: true }); x += p.w; continue; }
    s += R(x, 58, p.w, 50, { c: p.c, fill: p.c === 'dim' ? 'rgba(107,122,147,.10)' : '#0f182a', dash: p.c === 'dim', r: 9 });
    s += T(x + p.w / 2, 91, p.t, { fs: 21, a: 'middle', mono: true, b: true, c: p.c === 'dim' ? 'mu' : '#fff' });
    s += T(x + p.w / 2, 40, p.k, { fs: 13.5, a: 'middle', c: p.c, b: true });
    s += T(x + p.w / 2, 134, p.d, { fs: 13.5, a: 'middle', c: 'mu' });
    x += p.w;
  }
  s += T(0, 180, 'Bạn gõ:  docker pull nginx', { fs: 18, mono: true });
  s += T(0, 208, 'Docker hiểu:  docker.io/library/nginx:latest   (khung xám nét đứt = Docker tự điền)', { fs: 16, c: 'mu' });
  return sv(1000, 222, s);
};

/* Slide 6 — chỉ mục → manifest → config + tầng */
const indexTree = () => {
  let s = '';
  s += R(0, 120, 250, 96, { c: 'dk' }) + T(125, 152, 'nginx:1.27-alpine', { fs: 16, a: 'middle', b: true, mono: true }) +
    T(125, 176, 'CHỈ MỤC (image index)', { fs: 14.5, a: 'middle', c: 'dk', b: true }) + T(125, 200, 'sha256:65645c7b…', { fs: 13.5, a: 'middle', c: 'mu', mono: true });
  const rows = [
    ['linux/amd64', 'sha256:62223d64…', 'grn'], ['linux/arm64/v8', 'sha256:63ffc0d1…', 'grn'], ['linux/arm/v7 · v6 · 386', '3 manifest nữa', 'dim'],
    ['ppc64le · riscv64 · s390x', '3 manifest nữa', 'dim'], ['unknown/unknown × 8', 'chứng thực (SBOM, provenance)', 'vio'],
  ];
  rows.forEach(([p, d, c], i) => {
    const y = 8 + i * 66;
    s += `<path d="M250 168 C 300 168, 300 ${y + 27}, 340 ${y + 27}" stroke="${D[c] || D.dim}" stroke-width="2.5" fill="none"/>`;
    s += R(340, y, 300, 54, { c, r: 9, dash: c === 'vio' }) + T(356, y + 23, p, { fs: 15.5, b: true, mono: true }) + T(356, y + 44, d, { fs: 13, c: 'mu', mono: c !== 'vio' });
  });
  s += A(640, 101, 720, 101, { c: 'grn' });
  s += R(720, 8, 420, 176, { c: 'grn', fill: 'rgba(63,185,80,.06)' }) + T(740, 36, 'MANIFEST của linux/arm64/v8', { fs: 15.5, b: true, c: 'grn' }) +
    T(740, 64, 'config  → Os, Architecture, Env, Cmd', { fs: 14.5, mono: true }) +
    T(740, 90, 'layers  → 8 blob tầng (nén)', { fs: 14.5, mono: true }) +
    T(740, 116, 'annotations → source, revision…', { fs: 14.5, mono: true }) +
    T(740, 150, 'máy Mac M1 kéo đúng MỤC NÀY', { fs: 15, c: 'amb', b: true }) + T(740, 172, 'máy Linux amd64 kéo mục linux/amd64', { fs: 14, c: 'mu' });
  s += T(720, 228, 'Mọi thứ được gọi bằng sha256 của chính các byte của nó', { fs: 15.5, c: 'tea' });
  s += T(720, 254, '⇒ tag chỉ là một cái nhãn trỏ vào ô xanh dương bên trái', { fs: 15.5, c: 'tea' });
  return sv(1150, 336, s);
};

/* Slide 8 — tag là nhãn dán dời được */
const tagMove = () => {
  let s = '';
  s += R(0, 20, 250, 70, { c: 'tea' }) + T(125, 50, 'alpine:3.20', { fs: 18, a: 'middle', b: true, mono: true }) + T(125, 75, 'ảnh d9e853e87e55', { fs: 14, a: 'middle', c: 'mu', mono: true });
  s += R(0, 170, 250, 70, { c: 'vio' }) + T(125, 200, 'busybox:1.36', { fs: 18, a: 'middle', b: true, mono: true }) + T(125, 225, 'ảnh 73aaf090f3d8', { fs: 14, a: 'middle', c: 'mu', mono: true });
  s += R(410, 100, 230, 60, { c: 'amb', fill: 'rgba(255,194,51,.10)' }) + T(525, 137, 'demo:v1', { fs: 20, a: 'middle', b: true, mono: true, c: 'amb' });
  s += A(410, 118, 256, 64, { c: 'red', dash: true }) + T(300, 104, '① trước', { fs: 14.5, c: 'red' });
  s += A(410, 142, 256, 196, { c: 'grn' }) + T(300, 188, '② sau docker tag', { fs: 14.5, c: 'grn' });
  s += T(0, 280, 'Không cảnh báo, không hỏi lại. Ảnh cũ KHÔNG mất:', { fs: 15.5, c: 'mu' });
  s += T(0, 304, 'nó vẫn còn tên alpine:3.20 nên không thành <none>.', { fs: 15.5, c: 'mu' });
  return sv(660, 316, s);
};

/* Slide 11 — digest = sha256(byte của manifest) */
const digestBytes = () => {
  let s = '';
  s += R(0, 10, 330, 170, { c: 'dim', fill: '#070c16', r: 10 });
  ['{', '  "mediaType": "…image.index.v1+json",', '  "manifests": [', '    { "platform": {"arm64"…},', '      "digest": "sha256:ab44…" },', '    { … attestation … } ]', '}   ← 855 byte'].forEach((l, i) =>
    s += T(14, 36 + i * 21, l, { fs: 13, mono: true, c: i === 6 ? 'amb' : '#c9d1d9' }));
  s += A(330, 95, 420, 95, { c: 'dk' }) + T(375, 82, 'sha256', { fs: 14.5, a: 'middle', c: 'dk', b: true, mono: true });
  s += R(420, 58, 290, 74, { c: 'vio' }) + T(565, 88, 'a00cf050ee0d2fea…', { fs: 16.5, a: 'middle', b: true, mono: true }) + T(565, 113, '= DIGEST của ảnh', { fs: 14.5, a: 'middle', c: 'vio' });
  s += T(0, 214, 'Đổi 1 byte ⇒ digest khác hẳn. Không ai “dời” được digest,', { fs: 15.5, c: 'mu' });
  s += T(0, 238, 'và máy kéo tự băm lại để kiểm — tải hỏng là báo lỗi.', { fs: 15.5, c: 'mu' });
  return sv(720, 250, s);
};

/* Slide 14 — push = HEAD blob? PUT blob, PUT manifest */
const pushFlow = () => diagram({ w: 1160, h: 250, nodes: [
  { id: 'c', x: 0, y: 70, w: 230, h: 100, t: 'docker push', d: 'localhost:18030/\nnhom/dk03-api:1.0', c: 'blu' },
  { id: 'b', x: 380, y: 0, w: 380, h: 70, t: '① HEAD /v2/…/blobs/sha256:…', d: 'tầng này registry có chưa?', c: 'tea' },
  { id: 'u', x: 380, y: 90, w: 380, h: 70, t: '② POST + PUT /blobs/uploads/…', d: 'chỉ tầng registry CHƯA có', c: 'amb' },
  { id: 'm', x: 380, y: 180, w: 380, h: 70, t: '③ PUT /v2/…/manifests/1.0', d: 'cuối cùng: gắn tag vào manifest', c: 'grn' },
  { id: 'r', x: 900, y: 70, w: 250, h: 100, t: 'registry:2', d: 'dk03-reg · cổng 18030\nchỉ là một web server', c: 'dk' },
], edges: [
  { from: 'c', to: 'b', c: 'tea' }, { from: 'c', to: 'u', c: 'amb' }, { from: 'c', to: 'm', c: 'grn' },
  { from: 'b', to: 'r', c: 'tea' }, { from: 'u', to: 'r', c: 'amb' }, { from: 'm', to: 'r', c: 'grn' },
] });

/* Slide 18 — gương kéo xuyên */
const mirror = () => diagram({ w: 1160, h: 220, nodes: [
  { id: 'a', x: 0, y: 0, w: 220, h: 60, t: 'máy bạn A', c: 'blu' },
  { id: 'b', x: 0, y: 80, w: 220, h: 60, t: 'máy bạn B', c: 'blu' },
  { id: 'ci', x: 0, y: 160, w: 220, h: 60, t: 'máy chạy CI', c: 'blu' },
  { id: 'm', x: 420, y: 60, w: 300, h: 100, t: 'gương (registry:2)', d: 'REGISTRY_PROXY_REMOTEURL\n= https://registry-1.docker.io', c: 'grn' },
  { id: 'h', x: 910, y: 60, w: 240, h: 100, t: 'Docker Hub', d: 'tính 1 lượt kéo\ncho lần ĐẦU tiên', c: 'dk' },
], edges: [
  { from: 'a', to: 'm', c: 'grn' }, { from: 'b', to: 'm', c: 'grn' }, { from: 'ci', to: 'm', c: 'grn' },
  { from: 'm', to: 'h', c: 'dk', t: 'chỉ khi chưa có', dash: true },
] });

/* Slide 25 — thang dọn dẹp (rủi ro tăng dần) */
const ladder = () => {
  const rungs = [
    ['1', 'docker builder prune', 'bộ đệm dựng', 'mất: lượt dựng sau chậm hơn', 'grn'],
    ['2', 'docker image prune', 'ảnh <none> (mồ côi)', 'mất: không gì dùng tên được', 'grn'],
    ['3', 'docker container prune', 'container đã dừng', 'mất: log + mã thoát của chúng', 'amb'],
    ['4', 'docker image prune -a', 'MỌI ảnh không container nào dùng', 'mất: bản để QUAY LUI', 'ora'],
    ['5', 'docker volume prune (-a)', 'volume không gắn vào đâu', 'mất: CƠ SỞ DỮ LIỆU', 'red'],
  ];
  let s = '';
  rungs.forEach(([n, cmd, what, loss, c], i) => {
    const y = 290 - i * 68, x = i * 38;
    s += R(x, y, 1100 - x * 1.4, 56, { c, fill: '#0f182a', r: 10 });
    s += `<circle cx="${x + 30}" cy="${y + 28}" r="17" fill="${D[c]}"/>` + T(x + 30, y + 34, n, { fs: 17, a: 'middle', b: true, c: '#08101e' });
    s += T(x + 60, y + 35, cmd, { fs: 17, b: true, mono: true });
    s += T(x + 400, y + 35, what, { fs: 15.5, c: 'mu' });
    s += T(1085 - x * 0.4, y + 35, loss, { fs: 15.5, c, a: 'end', b: true });
  });
  s += A(1130, 330, 1130, 20, { c: 'red' }) + T(1120, 14, 'rủi ro', { fs: 14, c: 'red', a: 'end' });
  return sv(1150, 352, s);
};

/* Slide 26 — dòng thời gian bản phát hành trên máy chủ */
const rollback = () => {
  let s = '';
  const rel = [['v1', 'f934ee732cd4', 'red'], ['v2', '782802ea637a', 'red'], ['v3', 'bbc911fc7624', 'grn']];
  rel.forEach(([v, id, c], i) => {
    const x = i * 180;
    s += R(x, 20, 160, 70, { c, fill: c === 'red' ? 'rgba(255,92,108,.08)' : 'rgba(63,185,80,.10)', dash: c === 'red' });
    s += T(x + 80, 50, `dk03-web:${v}`, { fs: 16, a: 'middle', b: true, mono: true }) + T(x + 80, 74, id, { fs: 13, a: 'middle', c: 'mu', mono: true });
  });
  s += T(80, 118, 'untagged', { fs: 14.5, a: 'middle', c: 'red', b: true }) + T(260, 118, 'untagged', { fs: 14.5, a: 'middle', c: 'red', b: true });
  s += T(440, 118, 'container đang chạy', { fs: 14.5, a: 'middle', c: 'grn', b: true });
  s += T(0, 158, 'v3 hỏng lúc 3 giờ sáng ⇒ không còn v2 trên máy', { fs: 15.5, c: 'amb' });
  s += T(0, 182, '⇒ quay lui = kéo lại từ registry (nếu registry còn sống)', { fs: 15.5, c: 'mu' });
  return sv(540, 194, s);
};

export const slides = S([
  cover({ t: 'Chương 3 — Image &amp; registry', sub: 'Đọc tên ảnh · tag với digest · Hub, GHCR &amp; registry tự dựng · ảnh đa kiến trúc · giữ đĩa khỏi đầy', chap: 'CHƯƠNG 3' }),

  { t: 'Bản đồ chương: 5 câu hỏi, 5 bài', body: mindmap('Image &amp; registry', 'biết CHÍNH XÁC mình đang chạy byte nào', [
    { t: '3.1 Đọc tên ảnh', d: 'registry/namespace/repo:tag@digest — 3 phần Docker tự điền', c: 'dk' },
    { t: '3.2 Tag vs digest', d: 'tag là nhãn dời được; digest là băm của nội dung', c: 'amb' },
    { t: '3.3 Registry', d: 'một API HTTP: Hub, GHCR, registry:2 của riêng bạn', c: 'tea' },
    { t: '3.4 Đa kiến trúc', d: 'arm64 vs amd64: no matching manifest · exec format error', c: 'vio' },
    { t: '3.5 Dọn đĩa', d: 'system df, thang prune, đừng xoá bản quay lui và volume', c: 'red' },
  ]) },

  /* ───────────── 3.1 ───────────── */
  { t: '“nginx” thật ra là 4 trường — Docker tự điền 3', body: `
    ${nameParts()}
    ${two(
    term(['$ docker pull docker.io/library/nginx:1.27-alpine', 'Status: Image is up to date for nginx:1.27-alpine', '$ docker image inspect nginx:1.27-alpine --format \'{{index .RepoDigests 0}}\'', '+ nginx@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10'], { title: 'output thật — máy Mac: tên dài và tên ngắn là MỘT ảnh', fs: 14 }),
    box('info', 'Docker in tên ở dạng <b>rút gọn</b> (<code>nginx:1.27-alpine</code>), nhưng lưu và kéo bằng dạng <b>đầy đủ</b>. Hai lệnh <code>pull</code> dạng ngắn/dài không tải lại gì.'), 'l2')}` },

  { t: 'Có dấu chấm, dấu hai chấm hay “localhost” ⇒ mới là registry', body: two(
    table(['Bạn gõ', 'Docker hiểu là', 'Registry'], [
      ['<code>nginx</code>', '<code>docker.io/library/nginx:latest</code>', 'Docker Hub'],
      ['<code>bitnami/redis</code>', '<code>docker.io/bitnami/redis:latest</code>', 'Docker Hub'],
      ['!<code>myregistry/app</code>', 'user <b>myregistry</b> trên Hub', '-Docker Hub (!)'],
      ['<code>ghcr.io/cuong/api</code>', 'có dấu chấm ⇒ máy <code>ghcr.io</code>', '+GHCR'],
      ['<code>localhost:18030/app</code>', 'có dấu hai chấm ⇒ máy + cổng', '+registry của bạn'],
      ['<code>NGINX</code>', '—', '-lỗi: phải chữ thường'],
    ], { sm: true }),
    term(['$ docker pull myregistry/app', 'Using default tag: latest', '! Error response from daemon: pull access denied', '! for myregistry/app, repository does not exist', '! or may require \'docker login\'', '$ docker pull NGINX', '! invalid reference format: repository name', '! (library/NGINX) must be lowercase'], { title: 'output thật — máy Mac', fs: 14 }), 'l') },

  { t: 'Phần trước dấu / cho biết ai chịu trách nhiệm về ảnh', body: `
    ${cards([
      { ic: '🏅', t: 'Không namespace = Official Image', d: '<code>nginx</code>, <code>postgres</code>, <code>node</code>. Docker soát, Dockerfile công khai, dựng lại khi có bản vá. Mặc định chọn loại này.', c: 'grn' },
      { ic: '🏢', t: 'Nhà cung cấp (Verified Publisher)', d: '<code>grafana/grafana</code>, <code>bitnami/…</code>. Đáng tin — nhưng chính sách do CÔNG TY đó quyết.', c: 'blu' },
      { ic: '👤', t: 'Bất kỳ ai', d: '<code>someuser/thing</code>: không ai soát. <code>nodejs</code> ≠ <code>node</code>. Đọc Dockerfile trước khi chạy.', c: 'amb' },
      { ic: '🌐', t: 'Có tên máy đứng trước', d: '<code>ghcr.io/…</code>, <code>quay.io/…</code>: registry khác Hub — thường là ảnh của chính dự án.', c: 'tea' },
    ], 2)}
    ${box('warn', '<b>Chuyện thật 08–09/2025:</b> Bitnami dời gần hết ảnh <code>bitnami/*</code> có số phiên bản sang <code>bitnamilegacy/*</code> (ngừng cập nhật) và tạm tắt ảnh theo lịch “brownout”. File compose ghi <code>bitnami/postgresql:15</code> kéo về bỗng lỗi — không một dòng mã nào đổi.')}` },

  { t: 'Một tag trỏ tới một CHỈ MỤC — bên dưới là cả chục ảnh', body: `
    ${indexTree()}
    ${term(['$ docker buildx imagetools inspect --raw nginx:1.27-alpine | jq -r \'.manifests[] | …\'', 'linux/amd64 sha256:62223d644fa2', 'unknown/unknown sha256:24abdb3793b8 attestation-manifest', 'linux/arm/v6 sha256:0c423916aba5   …   (16 dòng: 8 nền tảng + 8 chứng thực)'], { title: 'output thật — máy Mac', fs: 14 })}` },

  { t: 'Nguồn gốc ảnh nằm ở annotation — không phải ở label', body: two(
    term(['$ docker image inspect nginx:1.27-alpine \\', '    --format \'{{json .Config.Labels}}\'', '{"maintainer":"NGINX Docker Maintainers <docker-maint@nginx.com>"}', '$ docker buildx imagetools inspect nginx:1.27-alpine', '  Platform:    linux/amd64', '  Annotations:', '+   org.opencontainers.image.created:  2025-04-16T17:07:33Z', '+   org.opencontainers.image.revision: eaf8875a1967d24c…', '+   org.opencontainers.image.source:   https://github.com/nginx/docker-nginx.git#…', '+   org.opencontainers.image.version:  1.27.5-alpine'], { title: 'output thật — máy Mac', fs: 14 }),
    `${box('info', '<b>Label</b> nằm trong config của ảnh (<code>LABEL</code> trong Dockerfile). <b>Annotation</b> gắn lên manifest/chỉ mục — ảnh chính thức ghi <code>source</code>, <code>revision</code>, <code>version</code> ở ĐÂY.')}
    ${box('warn', '<code>nginx:1.27-alpine</code> dựng lần cuối <b>16/04/2025</b>: nhánh 1.27 đã đóng, tag đứng yên, <b>không còn bản vá</b>. Hôm nay <code>nginx:alpine</code> là 1.31.6. Ghim bản phụ chỉ an toàn khi nhánh đó còn sống.')}`, 'l2') },

  /* ───────────── 3.2 ───────────── */
  { t: 'Tag là nhãn dán: docker tag dời nó đi không một lời cảnh báo', body: two(
    tagMove(),
    term(['$ docker tag alpine:3.20 demo:v1', '$ docker images demo --format \'{{.Repository}}:{{.Tag}} {{.ID}}\'', 'demo:v1 d9e853e87e55', '$ docker tag busybox:1.36 demo:v1', '$ docker images demo --format \'{{.Repository}}:{{.Tag}} {{.ID}}\'', '+ demo:v1 73aaf090f3d8', '$ docker images alpine:3.20 --format \'{{.Repository}}:{{.Tag}} {{.ID}}\'', '= alpine:3.20 d9e853e87e55    # ảnh cũ vẫn nguyên'], { title: 'output thật — máy Mac', fs: 14 })) },

  { t: 'Kéo lại một tag đã dời ⇒ ảnh cũ thành &lt;none&gt; (mồ côi)', body: two(
    term(['# máy Mac đẩy bản mới lên CÙNG tag :latest …', '$ docker pull localhost:18030/dk03-web:latest', 'Status: Downloaded newer image for localhost:18030/dk03-web:latest', '$ docker images -a --format \'{{.Repository}}:{{.Tag}} {{.ID}} {{.CreatedSince}}\' | grep dk03-web', 'localhost:18030/dk03-web:latest bd97053ba6fc 3 seconds ago', '$ docker images -f dangling=true --format \'{{.ID}} {{.Repository}}:{{.Tag}}\'', '! 85cc7a3cc38a <none>:<none>', '$ docker ps -a --format \'{{.Names}} {{.Image}} {{.Status}}\'', '+ dk03-web 85cc7a3cc38a Exited (0) 3 seconds ago', '# ⇒ container cũ giờ chỉ còn trỏ bằng ID'], { title: 'output thật — máy Linux (vai “máy chủ”)', fs: 14 }),
    `${steps([
      ['Registry dời tag <code>:latest</code> sang bản mới', 'ai đó vừa đẩy lên'],
      ['Máy chủ <code>docker pull</code> ⇒ tên đi theo bản mới', 'bản cũ mất cái tên DUY NHẤT'],
      ['Bản cũ thành <code>&lt;none&gt;</code>, vẫn chiếm đĩa', 'mỗi lần deploy đẻ thêm một cái'],
    ])}
    ${box('info', 'Đo trên Docker 29: <code>docker build -t app:dev</code> lặp lại trên máy dựng <b>không</b> để lại <code>&lt;none&gt;</code> — ảnh cũ bị gỡ luôn. Mồ côi chủ yếu sinh ra ở máy <b>kéo</b>.')}`, 'l') },

  { t: ':latest chỉ là tên MẶC ĐỊNH — hôm nay nó là Postgres 18', body: `
    ${table(['Tag (23/09/2026)', 'PG_MAJOR', 'PG_VERSION', 'PGDATA'], [
      ['<code>postgres:16-alpine</code>', '16', '16.15', '<code>/var/lib/postgresql/data</code>'],
      ['<code>postgres:17-alpine</code>', '17', '17.11', '<code>/var/lib/postgresql/data</code>'],
      ['!<code>postgres:latest</code>', '!18', '!18.6-1.pgdg13+2', '-<code>/var/lib/postgresql/18/docker</code>'],
    ], { sm: true })}
    ${two(
    term(['$ docker buildx imagetools inspect postgres:latest \\', '    --format \'{{json (index .Image "linux/arm64")}}\' | jq -c .config.Env', '["PATH=…","GOSU_VERSION=1.19","LANG=en_US.utf8",', '+ "PG_MAJOR=18","PG_VERSION=18.6-1.pgdg13+2",', '! "PGDATA=/var/lib/postgresql/18/docker"]'], { title: 'output thật — đọc config KHÔNG cần kéo ảnh', fs: 14 }),
    box('bad', 'Compose ghi <code>postgres:latest</code> + volume ở <code>/var/lib/postgresql/data</code>: máy mới kéo về bản 18 ⇒ <b>đổi cả chỗ đặt dữ liệu</b> lẫn định dạng file. Ghi rõ <code>postgres:16-alpine</code>.'), 'l')}` },

  { t: 'Digest = SHA-256 của chính các byte manifest', body: `
    ${two(digestBytes(), box('good', 'Docker 29 (kho containerd): <b>IMAGE ID = digest của chỉ mục</b>. Băm file, dòng push, cột ID: ba con số là MỘT.'), 'l2')}
    ${term(['$ curl -s -H \'Accept: application/vnd.oci.image.index.v1+json\' localhost:18030/v2/nhom/dk03-api/manifests/1.0 -o m.json', '$ shasum -a 256 m.json', '+ a00cf050ee0d2feaa229e0bcce8c8f26b583e6f3252a7faac62c1f11b9f194c2  m.json', '$ docker push localhost:18030/nhom/dk03-api:1.0 | tail -1', '+ 1.0: digest: sha256:a00cf050ee0d2feaa229e0bcce8c8f26b583e6f3252a7faac62c1f11b9f194c2 size: 855', '$ docker images localhost:18030/nhom/dk03-api --format \'{{.ID}}\'', '+ a00cf050ee0d'], { title: 'output thật — máy Mac, registry dk03-reg', fs: 13.5 })}` },

  { t: 'Hai loại digest: của chỉ mục (đúng) và của một nền tảng (bẫy)', body: two(
    diagram({ w: 520, h: 330, nodes: [
      { id: 'i', x: 130, y: 0, w: 260, h: 74, t: 'chỉ mục e2ff2c8a…', d: 'dk03-multi:1', c: 'grn', mono: true },
      { id: 'a', x: 0, y: 150, w: 240, h: 74, t: 'amd64 060304a7…', d: 'riêng một nền tảng', c: 'dim', mono: true },
      { id: 'r', x: 280, y: 150, w: 240, h: 74, t: 'arm64 5d668cf2…', d: 'riêng một nền tảng', c: 'red', mono: true },
      { id: 'x', x: 130, y: 262, w: 260, h: 64, t: 'Linux amd64 chạy?', d: 'ghim @5d668cf2 ⇒ chết', c: 'red' },
    ], edges: [{ from: 'i', to: 'a', c: 'dim' }, { from: 'i', to: 'r', c: 'dim' }, { from: 'r', to: 'x', c: 'red' }] }),
    term(['$ docker run --rm localhost:18030/dk03-multi:1', '= dung tren linux/arm64 cho linux/amd64', '= x86_64', '$ docker run --rm localhost:18030/dk03-multi@sha256:5d668cf2…', 'WARNING: The requested image\'s platform (linux/arm64) does not', 'match the detected host platform (linux/amd64/v3) …', '! exec /bin/sh: exec format error', '$ echo "exit=$?"', '! exit=255'], { title: 'output thật — máy Linux amd64', fs: 14 }), 'r') },

  { t: 'Ghim tag@digest: người đọc thấy phiên bản, máy dùng digest', body: two(
    `${yaml([
      ['# Dockerfile', ''],
      ['FROM postgres:16-alpine@sha256:<digest-chỉ-mục>', 'đọc được + bất biến'],
      ['', ''],
      ['# compose.yaml', ''],
      ['services:', ''],
      ['  web:', ''],
      ['    image: nginx:1.27-alpine@sha256:65645c7b…', 'digest THẮNG tag'],
    ], { fs: 14.5 })}
    ${term(['$ docker pull nginx:latest@sha256:65645c7bb6a0…   # digest của 1.27!', '+ Status: Image is up to date for nginx@sha256:65645c7bb6a0…', '# ⇒ chữ :latest bị bỏ qua, byte kéo về là 1.27'], { title: 'output thật — máy Mac', fs: 13.5 })}`,
    steps([
      ['<b>Mỗi lượt dựng: 1 tag bất biến</b>', '<code>app:1.4.2-a1b2c3d</code> — không bao giờ dùng lại'],
      ['<b>Vài bí danh dời được</b>', '<code>1.4</code> · <code>latest</code> · <code>staging</code> — cho người gõ'],
      ['<b>Deploy bằng tag bất biến hoặc digest</b>', 'quay lui = chạy lại một cái tên cũ, 10 giây'],
      ['<b>Bot giữ cho ghim không cũ</b>', 'Renovate/Dependabot mở PR khi tag nguồn dời'],
    ]), 'r') },

  /* ───────────── 3.3 ───────────── */
  { t: 'Registry chỉ là một API HTTP — đẩy là vài lệnh PUT', body: `
    ${pushFlow()}
    ${term(['$ docker run -d --name reg -p 18030:5000 -v regdata:/var/lib/registry registry:2', '$ curl -s localhost:18030/v2/_catalog', '{"repositories":["dk03-app","dk03-web","goc/alpine","nhom/dk03-api"]}', '$ curl -s localhost:18030/v2/nhom/dk03-api/tags/list', '{"name":"nhom/dk03-api","tags":["1.0"]}'], { title: 'output thật — máy Mac', fs: 14 })}` },

  { t: 'Tầng registry đã có ⇒ “Mounted from”, không tải lên lại', body: two(
    term(['$ docker push localhost:18030/nhom/dk03-api:1.0', 'The push refers to repository [localhost:18030/nhom/dk03-api]', '= af79558cf9ed: Pushed', '+ 3f26bc2dec0b: Mounted from goc/alpine', '= 8ff4d425b3ee: Pushed', '+ 44136fa355b3: Mounted from dk03-web', '1.0: digest: sha256:a00cf050ee0d… size: 855', '$ docker push localhost:18030/goc/alpine:3.20 | tail -3', ' Info -> Not all multiplatform-content is present and', '         only the available single-platform image was pushed'], { title: 'output thật — máy Mac', fs: 14 }),
    `${box('info', '<b>Mounted from</b>: registry đã có tầng đó ở một repo khác ⇒ chỉ “gắn” sang, 0 byte đi qua mạng. Tầng định danh bằng sha256 nên so là biết.')}
    ${box('warn', '<b>Not all multiplatform-content…</b>: <code>alpine:3.20</code> trên máy chỉ có phần arm64 ⇒ Docker 29 đẩy MỘT nền tảng và báo digest mới. Ảnh đẩy lên KHÔNG còn đa kiến trúc.')}`, 'l') },

  { t: 'config.json: mật khẩu chỉ được base64 — không phải mã hoá', body: two(
    term(['$ echo matkhau123 | docker login localhost:18031 -u cuong --password-stdin', 'Login Succeeded', '! WARNING! Your credentials are stored unencrypted in', "! '/tmp/dk03/cfg/config.json'.", '$ cat $DOCKER_CONFIG/config.json', '{', '    "auths": {', '        "localhost:18031": {', '+             "auth": "Y3Vvbmc6bWF0a2hhdTEyMw=="', '        }', '    }', '}', '$ echo Y3Vvbmc6bWF0a2hhdTEyMw== | base64 -d', '! cuong:matkhau123'], { title: 'output thật — máy Linux (không có credential helper)', fs: 14 }),
    `${term(['$ jq .credsStore ~/.docker/config.json', '+ "desktop"      # Docker Desktop: vào Keychain của macOS'], { title: 'máy Mac', fs: 14 })}
    ${list3()}`, 'l') },

  { t: 'Docker Hub đếm lượt kéo — ẩn danh thì đếm theo IP', body: two(
    `${table(['Loại tài khoản', 'Giới hạn kéo (docs, 09/2026)'], [
      ['Không đăng nhập', '!100 / 6 giờ / mỗi IPv4 (hoặc mỗi dải IPv6 /64)'],
      ['Personal (miễn phí, đã đăng nhập)', '200 / 6 giờ'],
      ['Pro · Team · Business', '+Không giới hạn'],
    ], { sm: true })}
    ${box('warn', 'Header thật chiều 23/09/2026 lại báo <code>100;w=3600</code> (cửa sổ 1 giờ) — tài liệu và máy chủ đang nói hai con số. <b>Tin header</b>, và đừng thiết kế CI sát trần.')}`,
    `${term(['$ T=$(curl -s "https://auth.docker.io/token?service=registry.docker.io\\', '    &scope=repository:ratelimitpreview/test:pull" | jq -r .token)', '$ curl -s --head -H "Authorization: Bearer $T" \\', '    https://registry-1.docker.io/v2/ratelimitpreview/test/manifests/latest \\', '    | grep -i ^ratelimit', '+ ratelimit-limit: 100;w=3600', '! ratelimit-remaining: 32;w=3600'], { title: 'output thật — máy Mac (mạng nhà, ẩn danh)', fs: 13.5 })}
    ${box('tip', '<code>HEAD</code> không tính lượt. Đa kiến trúc: mỗi nền tảng kéo về tính 1 lượt.')}`, 'r') },

  { t: 'Gương kéo xuyên: cả nhóm kéo từ một máy trong mạng', body: `
    ${mirror()}
    ${two(
    term(['$ docker run -d --name mirror -p 18032:5000 \\', '    -e REGISTRY_PROXY_REMOTEURL=https://registry-1.docker.io registry:2', '$ time docker pull -q localhost:18032/library/busybox:1.36', '! … 8.925 total      # lần đầu: gương đi lấy từ Hub', '$ docker rmi …; time docker pull -q localhost:18032/library/busybox:1.36', '= … 2.794 total      # lần sau: lấy từ gương'], { title: 'output thật — máy Mac', fs: 14 }),
    term(['$ docker info --format \'{{json .RegistryConfig.InsecureRegistryCIDRs}}\'', '+ ["::1/128","127.0.0.0/8"]', '# ⇒ localhost được phép HTTP thường; máy khác', '#   trong mạng thì phải khai insecure-registries'], { title: 'máy Mac', fs: 14 }), 'l')}` },

  /* ───────────── 3.4 ───────────── */
  { t: 'Ảnh sai kiến trúc chết theo HAI kiểu khác nhau', body: two(
    `<div style="font-size:17px;font-weight:800;color:${D.amb};margin-bottom:6px">Kiểu 1 — kéo qua registry: từ chối ngay</div>
    ${term(['$ docker pull localhost:18030/dk03-app:latest', '! Error response from daemon: no matching manifest for', '! linux/amd64/v3 in the manifest list entries: no match', '! for platform in manifest: not found'], { title: 'máy Linux amd64 — ảnh dựng trên Mac', fs: 14 })}
    <p style="font-size:15px;color:${D.mu};margin-top:8px">Docker 29 dựng ra một <b>chỉ mục</b> chỉ có mục arm64 ⇒ máy amd64 không tìm thấy mục của mình.</p>`,
    `<div style="font-size:17px;font-weight:800;color:${D.red};margin-bottom:6px">Kiểu 2 — save | ssh load: chạy rồi mới chết</div>
    ${term(['$ docker save dk03-app:moi | ssh linux-nha docker load', 'Loaded image: dk03-app:moi', '$ ssh linux-nha docker run --rm dk03-app:moi', 'WARNING: The requested image\'s platform (linux/arm64)', 'does not match the detected host platform (linux/amd64/v3)…', '! exec /bin/cat: exec format error', '! exit=255'], { title: 'output thật — Mac ⇒ máy Linux', fs: 14 })}
    <p style="font-size:15px;color:${D.mu};margin-top:8px">Nhân nhận một file mã máy ARM trên CPU x86 ⇒ “định dạng thực thi” sai.</p>`) },

  { t: 'Mỗi máy tự chọn mục khớp CPU của nó trong chỉ mục', body: two(
    table(['Tên', 'Là', 'Ví dụ'], [
      ['<code>amd64</code> = <code>x86_64</code>', 'Intel/AMD', 'VPS, máy Linux ở nhà, CI GitHub mặc định'],
      ['<code>arm64</code> = <code>aarch64</code>', 'ARM 64-bit', 'Mac M1–M4, Raspberry Pi 4/5, AWS Graviton'],
      ['<code>amd64/v3</code>', 'amd64 có AVX2…', 'máy Linux ở nhà tự báo mức này'],
    ], { sm: true }),
    term(['$ docker run --rm dk03-multi:1', '= dung tren linux/arm64 cho linux/arm64', '= aarch64', '$ docker run --rm --platform linux/amd64 dk03-multi:1', '+ dung tren linux/arm64 cho linux/amd64', '+ x86_64', '$ docker image ls --tree dk03-multi:1', 'IMAGE           ID            DISK USAGE   CONTENT SIZE', 'dk03-multi:1    e2ff2c8a77d7      25.7MB         7.73MB', '├─ linux/amd64  060304a7b1b1      12.1MB         3.63MB', '└─ linux/arm64  5d668cf2c045      13.6MB         4.09MB'], { title: 'output thật — máy Mac', fs: 14 }), 'r') },

  { t: 'Chạy ảnh “ngoại”: Rosetta gần như miễn phí, QEMU chậm ~3 lần', body: two(
    bars([
      { l: 'linux/arm64', sub: 'native trên M1', v: 3.38, txt: '3,38 s', c: 'grn' },
      { l: 'linux/amd64', sub: 'Rosetta (Docker Desktop)', v: 3.95, txt: '3,95 s', c: 'tea' },
      { l: 'linux/riscv64', sub: 'QEMU mô phỏng', v: 8.85, txt: '8,85 s', c: 'red' },
    ], { lw: 260, max: 10 }),
    `${term(['$ docker run --rm --platform linux/riscv64 alpine:3.20 \\', '    sh -c \'dd if=/dev/zero bs=1M count=500 | sha256sum\''], { title: 'cùng một việc: băm 500 MB — máy Mac', fs: 14 })}
    ${box('info', 'Trong máy ảo Docker Desktop, <code>/proc/sys/fs/binfmt_misc</code> có <b>rosetta</b> cho amd64 và <b>qemu</b> cho phần còn lại. Máy Linux thuần không có gì ⇒ <code>exec format error</code>.')}
    ${box('warn', 'Mô phỏng là để TẠO ảnh hoặc thử nhanh — việc nặng (biên dịch, JIT) có thể chậm gấp nhiều lần hoặc hỏng.')}`, 'l') },

  { t: 'Docker 29: một lệnh dựng hai kiến trúc, --load thẳng về máy', body: two(
    term(['$ docker buildx build --platform linux/amd64,linux/arm64 \\', '    -t dk03-multi:1 --load .', '#11 exporting manifest list sha256:e2ff2c8a77d7… done', '= #11 unpacking to docker.io/library/dk03-multi:1 0.0s done', '$ docker push localhost:18030/dk03-multi:1', '$ docker buildx imagetools inspect localhost:18030/dk03-multi:1 | grep Platform', '  Platform:    linux/amd64', '  Platform:    linux/arm64', '  Platform:    unknown/unknown     # ×2 chứng thực'], { title: 'output thật — máy Mac, driver docker mặc định', fs: 13.5 }),
    `${table(['', 'Kho overlay2 (cũ)', 'Kho containerd (Docker 29)'], [
      ['Driver <code>docker</code> dựng đa nền tảng', '-không', '+được'],
      ['<code>--load</code> nhiều nền tảng', '-lỗi <i>exporting manifest lists</i>', '+giữ cả chỉ mục'],
      ['Builder <code>docker-container</code>', 'bắt buộc', 'chỉ khi cần cache ngoài…'],
    ], { sm: true })}
    ${box('tip', 'Máy mình dùng kho nào? <code>docker info -f \'{{.DriverStatus}}\'</code> → Mac in <code>[[driver-type io.containerd.snapshotter.v1]]</code>. Máy cài từ trước Engine 29 có thể vẫn là overlay2.')}`, 'l') },

  { t: 'Biên dịch chéo: dựng trên máy mình, cho máy đích', body: two(
    yaml([
      ['FROM --platform=$BUILDPLATFORM alpine:3.20 AS build', 'chạy NATIVE, nhanh'],
      ['ARG BUILDPLATFORM TARGETPLATFORM', 'BuildKit tự điền'],
      ['RUN echo "dung tren $BUILDPLATFORM cho $TARGETPLATFORM" \\', 'Go/Rust: GOARCH=…'],
      ['    > /info.txt', ''],
      ['FROM alpine:3.20', 'nền theo máy ĐÍCH'],
      ['COPY --from=build /info.txt /info.txt', 'chép kết quả sang'],
      ['CMD ["sh", "-c", "cat /info.txt; uname -m"]', ''],
    ], { lang: 'docker', fs: 14.5 }),
    `${term(['$ docker run --rm --platform linux/amd64 dk03-multi:1', '+ dung tren linux/arm64 cho linux/amd64', 'x86_64'], { title: 'output thật — máy Mac', fs: 14 })}
    ${table(['Biến', 'Nghĩa'], [
      ['<code>BUILDPLATFORM</code>', 'máy đang DỰNG (Mac: linux/arm64)'],
      ['<code>TARGETPLATFORM</code>', 'máy sẽ CHẠY ảnh'],
      ['<code>TARGETARCH</code>', 'phần kiến trúc: <code>amd64</code>, <code>arm64</code>'],
    ], { sm: true })}`, 'l') },

  /* ───────────── 3.5 ───────────── */
  { t: 'docker system df: máy dựng ở nhà đang ôm 355 GB bộ đệm', body: two(
    `${term(['$ docker system df', 'TYPE            TOTAL  ACTIVE  SIZE      RECLAIMABLE', 'Images          77     20      36.8GB    25.09GB (68%)', 'Containers      43     14      883MB     553.7MB (62%)', 'Local Volumes   68     26      9.098GB   4.158GB (45%)', 'Build Cache     482    0       32.29GB   17.73GB'], { title: 'output thật — máy Mac', fs: 14 })}
    ${term(['$ docker system df', 'Images          326    3       201.7GB   172.7GB (85%)', '+ Build Cache     875    0       355.1GB   305.8GB', '$ df -h / | tail -1', '/dev/nvme0n1p1  477G  294G  168G  64% /'], { title: 'output thật — máy Linux dựng ảnh cho deploy', fs: 14 })}`,
    `${kpis([{ v: '355 GB', l: 'bộ đệm dựng', c: 'red' }, { v: '172 GB', l: 'ảnh thu hồi được', c: 'amb' }])}
    ${table(['Cột', 'Đọc là'], [
      ['ACTIVE', 'đang được container (kể cả đã dừng) dùng'],
      ['RECLAIMABLE', 'xoá được mà không ai đang dùng'],
      ['Build Cache', 'không in % — phần đang dùng chung không tính'],
    ], { sm: true })}`, 'l') },

  { t: 'Thang dọn đĩa: leo từ dưới lên, rủi ro tăng mỗi bậc', body: `
    ${ladder()}
    ${box('info', 'Bậc 1–2 dọn được gần hết mà không cần suy nghĩ. Từ bậc 4 trở lên: đọc danh sách trước, và <b>không bao giờ tự động hoá bậc 5</b>.')}` },

  { t: 'prune -a xoá luôn bản bạn định quay lui về', body: two(
    term(['$ docker images --filter label=dkhoc=03 --format \'{{.Repository}}:{{.Tag}}\'', 'localhost:18030/dk03-web:v3', 'localhost:18030/dk03-web:v2', 'localhost:18030/dk03-web:v1', '$ docker image prune -a -f --filter label=dkhoc=03', '! untagged: localhost:18030/dk03-web:v1', '! untagged: localhost:18030/dk03-web:v2', '…', 'Total reclaimed space: 14.6MB', '$ docker images --filter label=dkhoc=03 --format \'{{.Repository}}:{{.Tag}}\'', '= localhost:18030/dk03-web:v3     # chỉ còn cái đang chạy'], { title: 'output thật — máy Linux (có --filter label: an toàn để thử)', fs: 14 }),
    `${rollback()}
    ${box('tip', 'Dọn theo tuổi, cửa sổ DÀI hơn chu kỳ phát hành: <code>--filter until=336h</code>; hoặc gắn nhãn <code>keep=true</code> cho 2–3 bản gần nhất và thêm <code>--filter label!=keep=true</code>.')}`, 'l') },

  { t: 'volume prune chỉ xoá volume VÔ DANH — vẫn phải nhìn trước', body: two(
    term(['$ docker volume create --label dkhoc=03 named', '$ docker volume prune -f --filter label=dkhoc=03', '= Total reclaimed space: 0B      # volume có tên: bỏ qua', '$ docker volume prune -a -f --filter label=dkhoc=03', '! Deleted Volumes:', '! named', '# ── volume vô danh của một postgres đã rm:', '$ docker volume inspect $V --format \'{{json .Labels}}\'', '{"com.docker.volume.anonymous":""}', '$ docker run --rm -v $V:/v:ro alpine:3.20 cat /v/PG_VERSION', '+ 16', '$ docker run --rm -v $V:/v:ro alpine:3.20 du -sh /v', '+ 38.3M	/v'], { title: 'output thật — máy Mac', fs: 13.5 }),
    `${box('info', 'Từ Engine 23: <code>docker volume prune</code> và <code>system prune --volumes</code> chỉ xoá volume <b>vô danh</b>. Có <code>-a</code> mới xoá cả volume có tên.')}
    ${box('bad', 'Nhưng volume vô danh lại chính là chỗ Postgres chạy thiếu <code>-v</code> cất dữ liệu (Bài 1.4). Mở ra xem bằng một container <code>:ro</code> trước khi xoá bất cứ thứ gì.')}`, 'l') },

  { t: 'Tự động hoá phần AN TOÀN, để phần nguy hiểm cho người', body: two(
    `${yaml([
      ['{', '/etc/docker/daemon.json'],
      ['  "builder": {', ''],
      ['    "gc": {', 'dọn bộ đệm tự động'],
      ['      "enabled": true,', ''],
      ['      "defaultKeepStorage": "20GB"', 'trần của bộ đệm'],
      ['    }', ''],
      ['  }', ''],
      ['}', ''],
    ], { fs: 14.5 })}
    ${box('tip', 'CLI Docker 29: <code>builder prune --keep-storage</code> đã đổi thành <code>--reserved-space</code> (cờ cũ vẫn chạy, in cảnh báo).')}`,
    `${yaml([
      ['[Service]', 'docker-prune.service'],
      ['Type=oneshot', ''],
      ['ExecStart=/usr/bin/docker builder prune -f --filter until=168h', ''],
      ['ExecStart=/usr/bin/docker image prune -f', 'chỉ <none>'],
      ['[Timer]', 'docker-prune.timer'],
      ['OnCalendar=Sun 04:00', 'mỗi tuần'],
    ], { lang: 'docker', fs: 13.5 })}
    ${box('bad', 'KHÔNG bao giờ có <code>-a</code> hay <code>--volumes</code> trong việc chạy tự động.')}`) },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 3', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['<code>push</code> báo <code>denied</code> dù đã login', 'Tên không có tài khoản ⇒ đẩy vào <code>library/</code> của Hub', '<code>docker tag app user/app:1</code> hoặc <code>ghcr.io/user/app:1</code>'],
    ['Máy mới clone về, Postgres không lên', '<code>:latest</code> đã nhảy sang bản lớn mới', 'Ghi rõ bản: <code>postgres:16-alpine</code>(@digest)'],
    ['“Đã deploy” mà vẫn chạy bản cũ', 'Máy chủ dùng tag cũ đã có sẵn, không kéo lại', '<code>docker compose pull</code> trước, hoặc deploy bằng tag bất biến'],
    ['<code>no matching manifest for linux/amd64</code>', 'Ảnh dựng trên Mac chỉ có arm64', '<code>buildx build --platform linux/amd64,linux/arm64</code>'],
    ['<code>exec format error</code>', 'Chạy ảnh ARM trên x86 (save/load, hoặc ghim digest nền tảng)', 'So <code>.Architecture</code> với <code>uname -m</code>; ghim digest CHỈ MỤC'],
    ['<code>toomanyrequests</code> giữa lúc deploy', 'Kéo ẩn danh, chung IP với cả CI/văn phòng', 'Đăng nhập, dùng gương, đưa ảnh của mình sang GHCR'],
    ['Đĩa VPS đầy, Postgres chết theo', 'Bộ đệm dựng + ảnh <code>&lt;none&gt;</code> tích tụ', 'Timer dọn hằng tuần + <code>builder.gc</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 3', body: table(['Muốn…', 'Gõ'], [
    ['Xem digest của ảnh trên máy', '<code>docker images --digests</code> · <code>inspect -f \'{{.RepoDigests}}\'</code>'],
    ['Xem chỉ mục trên registry (không kéo)', '<code>docker buildx imagetools inspect nginx:1.27-alpine</code>'],
    ['Đọc config / ENV từ xa', '<code>imagetools inspect X --format \'{{json (index .Image "linux/amd64")}}\'</code>'],
    ['Kiến trúc của ảnh vs của máy', '<code>inspect -f \'{{.Architecture}}\'</code> · <code>uname -m</code>'],
    ['Dựng + đẩy đa kiến trúc', '<code>docker buildx build --platform linux/amd64,linux/arm64 -t R/app:1 --push .</code>'],
    ['Registry thử cục bộ', '<code>docker run -d -p 5000:5000 --name reg registry:2</code>'],
    ['Liệt kê repo / tag', '<code>curl localhost:5000/v2/_catalog</code> · <code>…/v2/app/tags/list</code>'],
    ['Còn bao nhiêu lượt kéo Hub', '<code>curl --head … | grep -i ratelimit</code>'],
    ['Đĩa đang đi đâu', '<code>docker system df</code> · <code>docker system df -v</code>'],
    ['Dọn an toàn', '<code>docker builder prune -f</code> · <code>docker image prune -f</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 3 (40 phút)', body: `
    ${steps([
      ['Khai triển 5 tên ngắn ra dạng đầy đủ, rồi kiểm bằng <code>docker pull</code> dạng dài', '“up to date” = đúng là cùng một ảnh'],
      ['Chạy <code>registry:2</code> ở cổng 5000, đẩy hai ảnh dùng chung ảnh nền', 'tìm dòng <code>Mounted from</code>; so digest với <code>shasum</code> của manifest'],
      ['Dời một tag, rồi ghim lại bằng <code>tag@digest</code> trong compose', 'giải thích vì sao digest thắng tag'],
      ['Dựng một ảnh cho <code>linux/amd64,linux/arm64</code>, chạy cả hai bằng <code>--platform</code>', 'đọc <code>docker image ls --tree</code>'],
      ['Đọc <code>docker system df</code> của máy mình, dọn bậc 1–2', 'ghi lại trước/sau — KHÔNG đụng volume'],
    ])}
    ${box('good', '<b>Đạt khi:</b> bạn nói được mỗi tên ảnh trong compose của nhóm trỏ tới registry nào, bản nào, kiến trúc nào — và máy bạn nhẹ đi mà không mất thứ gì.')}` },
]).map((x) => ({ ...x, body: TCSS + x.body }));

function list3() {
  return `${box('tip', '<b>Ba thói quen:</b> luôn <code>--password-stdin</code> (không <code>-p</code>: lộ trong lịch sử shell và <code>ps</code>) · dùng <b>access token</b> thay mật khẩu · máy dùng chung thì <code>docker logout</code>.')}`;
}
