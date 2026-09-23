/**
 * Docker · Deck dk-06 — Chương 6: Ảnh nhỏ và an toàn.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 23/09/2026:
 *   • "máy Linux" = Fedora 44, Docker Engine 29.6.2, amd64, kho ảnh containerd (cùng kiến trúc với VPS)
 *   • "máy Mac"   = Mac M1, Docker Desktop 4.91 / Engine 29.8.0, arm64
 * App mẫu của chương: một API Express + TypeScript + Prisma 5.22 (giống backend của người học, thu nhỏ),
 * dựng thành 8 biến thể dk06-api:{single,naive,multi,gon,distroless,trap,fix,…}.
 * Quét lỗ hổng: Trivy 0.74.0 (DB cập nhật 23/09/2026 12:53 UTC), Grype 0.119.0 — số CVE là số CỦA NGÀY ĐÓ.
 * Tên đối tượng trong output mang tiền tố dk06- (luật an toàn của khoá).
 */
import { S, cover, cards, box, steps, table, vs, kpis, two, mindmap, layers, term as dkTerm, diagram, yaml, bars, esc, D } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });
const TCSS = '<style>.g-term pre{font-size:15px;line-height:1.45}</style>';

export const deck = { key: 'dk-06', code: 'DOCKER · CHƯƠNG 6', title: 'Ảnh nhỏ và an toàn', sub: 'Docker · Chương 6' };

/* ───────────── SVG nhỏ tự vẽ (chép từ dk-01) ───────────── */
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

/* Slide 3 — hai chồng tầng: build (bị bỏ lại) và prod (được xuất ra) */
const twoStacks = () => {
  const L = [
    ['FROM node:22-slim AS build', '', 'dim'],
    ['RUN apt-get install openssl', '', 'dim'],
    ['RUN npm ci', '170 MB · có tsc, @types, prisma CLI', 'amb'],
    ['COPY . .', 'mã nguồn .ts', 'amb'],
    ['RUN prisma generate && tsc', 'sinh dist/', 'dk'],
    ['RUN npm prune --omit=dev', 'node_modules chỉ còn đồ chạy', 'grn'],
  ];
  const P = [
    ['FROM node:22-slim AS prod', '', 'dim'],
    ['RUN apt-get install openssl', '7,3 MB', 'dim'],
    ['COPY --from=build node_modules', '93 MB', 'grn'],
    ['COPY --from=build dist', '4,1 kB', 'grn'],
    ['USER node · CMD [...]', '0 B — chỉ là cấu hình', 'dim'],
  ];
  const rh = 50, gap = 8, y0 = 360;
  let s = T(20, 26, 'STAGE build — dùng xong bỏ, KHÔNG được xuất ra', { fs: 16, c: 'amb', b: true }) +
    T(650, 26, 'STAGE prod — đây mới là ẢNH của bạn', { fs: 16, c: 'grn', b: true });
  s += R(8, 38, 500, 350, { c: 'amb', dash: true, fill: 'rgba(255,194,51,.04)' });
  s += R(640, 38, 510, 350, { c: 'grn', fill: 'rgba(63,185,80,.05)' });
  L.forEach(([t, d, c], i) => {
    const y = y0 - i * (rh + gap) - rh + 20;
    s += R(22, y, 472, rh, { c, fill: '#0f182a', r: 8, sw: 2 }) + T(36, y + 22, t, { fs: 15, mono: true, b: true }) + (d ? T(36, y + 41, d, { fs: 13.5, c: 'mu' }) : '');
  });
  P.forEach(([t, d, c], i) => {
    const y = y0 - i * (rh + gap) - rh + 20;
    s += R(656, y, 480, rh, { c, fill: '#0f182a', r: 8, sw: 2 }) + T(670, y + 22, t, { fs: 15, mono: true, b: true }) + (d ? T(670, y + 41, d, { fs: 13.5, c: 'mu' }) : '');
  });
  // mũi tên COPY --from: từ tầng prune (trên cùng build) sang 2 tầng COPY
  const yPr = y0 - 5 * (rh + gap) - rh + 20, yNm = y0 - 2 * (rh + gap) - rh + 20, yDi = y0 - 3 * (rh + gap) - rh + 20;
  s += A(494, yPr + 25, 654, yNm + 25, { c: 'grn' }) + A(494, yPr + 18, 654, yDi + 25, { c: 'grn' });
  s += T(574, yPr + 8, 'COPY --from', { fs: 14, c: 'grn', a: 'middle', b: true, mono: true });
  s += T(575, 412, 'Stage sau bắt đầu TRỐNG: thứ gì không COPY --from thì không có mặt — không cần xoá.', { fs: 16, a: 'middle', c: 'tea' });
  return sv(1150, 420, s);
};

/* Slide 11 — dòng thời gian sự cố 502 */
const incident = () => {
  const st = [
    ['docker build', 'XANH', 'grn', 'Dockerfile mặc định:\nbuild = slim, chạy = alpine'],
    ['docker push', 'XANH', 'grn', 'lên GHCR'],
    ['VPS pull + tráo', 'XANH', 'grn', 'compose up -d'],
    ['backend khởi động', 'exit 1', 'red', 'không tìm thấy\nengine Prisma'],
    ['restart vô tận', 'Restarting (1)', 'red', 'mỗi lần lại chết'],
    ['nginx → backend', '502 · 7 phút', 'red', 'người dùng thấy\ntrang lỗi'],
  ];
  const w = 170, g = 22;
  let s = '';
  st.forEach(([t, k, c, d], i) => {
    const x = 6 + i * (w + g);
    s += R(x, 40, w, 96, { c, fill: c === 'red' ? 'rgba(255,92,108,.08)' : 'rgba(63,185,80,.08)', r: 10 });
    s += T(x + w / 2, 72, t, { fs: 16, a: 'middle', b: true }) + T(x + w / 2, 106, k, { fs: 16, a: 'middle', c, b: true, mono: true });
    d.split('\n').forEach((ln, j) => { s += T(x + w / 2, 168 + j * 21, ln, { fs: 14.5, a: 'middle', c: 'mu' }); });
    if (i < st.length - 1) s += A(x + w + 2, 88, x + w + g - 2, 88, { c: i < 2 ? 'grn' : 'red', sw: 2.5 });
  });
  s += `<path d="M${6 + 3 * (w + g) - 8} 20 L${6 + 3 * (w + g) - 8} 230" stroke="${D.amb}" stroke-width="2" stroke-dasharray="6 6"/>`;
  s += T(6 + 3 * (w + g) - 16, 18, 'mọi bước kiểm đều ở BÊN TRÁI vạch này', { fs: 14.5, c: 'amb', a: 'end' });
  s += T(6 + 3 * (w + g), 18, 'lỗi chỉ lộ ra khi CHẠY', { fs: 14.5, c: 'red' });
  return sv(1150, 240, s);
};

/* Slide 19 — các lớp khoá quanh tiến trình: vẽ bằng layers(), app ở ĐÁY, lớp ngoài cùng ở trên */
const rings = () => layers({ w: 610, cap: 'kẻ tấn công chiếm được app ⇒ phải xuyên qua TỪNG lớp phía trên', rows: [
  { t: '<b>app bị chiếm</b> (lỗi RCE trong mã/thư viện)', k: 'KẺ TẤN CÔNG', c: 'red' },
  { t: '<code>USER 10001</code> — thoát ra cũng chỉ là user thường', c: 'grn' },
  { t: '<code>--read-only</code> + <code>--tmpfs</code> — không cài được web shell', c: 'amb' },
  { t: '<code>no-new-privileges</code> — setuid không nâng quyền', c: 'tea' },
  { t: '<code>--cap-drop=ALL</code> — 14 capability → 0', c: 'blu' },
  { t: '<b>seccomp</b> (mặc định BẬT) — chặn ~44 syscall', c: 'vio' },
  { t: '<code>--memory</code> · <code>--pids-limit</code> · <code>-p 127.0.0.1:</code> — giới hạn thiệt hại', c: 'dim' },
] });

export const slides = S([
  cover({ t: 'Chương 6 — Ảnh nhỏ và an toàn', sub: 'Multi-stage · ảnh nền &amp; bẫy musl · cắt megabyte · chạy an toàn · quét lỗ hổng &amp; chuỗi cung ứng', chap: 'CHƯƠNG 6' }),

  { t: 'Bản đồ chương: 5 bài, một câu hỏi — ảnh của bạn chở theo những gì?', body: mindmap('Ảnh nhỏ &amp; an toàn', 'chỉ chở đúng thứ tiến trình cần', [
    { t: '6.1 Dựng nhiều stage', d: 'stage sau bắt đầu trống · COPY --from · --target · bí mật ở lại stage dựng', c: 'dk' },
    { t: '6.2 Ảnh nền &amp; musl', d: 'slim · alpine · distroless · scratch — và sự cố 502 vì glibc/musl', c: 'red' },
    { t: '6.3 Cắt megabyte', d: 'đo bằng history/dive · xoá ở RUN sau vô ích · Prisma CLI lọt vào', c: 'amb' },
    { t: '6.4 Chạy an toàn', d: 'USER · --read-only · cap-drop · no-new-privileges · sock = root', c: 'grn' },
    { t: '6.5 Quét &amp; chuỗi cung ứng', d: 'Trivy/Grype · phân loại · SBOM · cổng CI', c: 'vio' },
  ]) },

  /* ───────────── 6.1 ───────────── */
  { t: 'Stage sau bắt đầu TRỐNG — chỉ thứ bạn COPY --from mới sang', body: twoStacks() },

  { t: 'Đo thật cùng một app: 1,88 GB → 467 MB chỉ bằng tách stage', body: two(
    `${bars([
      { l: 'single — node:22', sub: 'một stage, COPY . ., npm ci', v: 1880, txt: '1,88 GB', c: 'red' },
      { l: 'naive — 2 stage', sub: 'chép nguyên node_modules', v: 487, txt: '487 MB', c: 'amb' },
      { l: 'multi — 2 stage + prune', sub: 'đúng mẫu của bài', v: 467, txt: '467 MB', c: 'grn' },
    ], { lw: 240, max: 1900 })}
    <p style="font-size:15px;color:${D.mu};margin-top:8px">DISK USAGE trên máy Linux (Docker 29: bản nén + bản giải nén). Bản nén phải tải về: 489 MB → 122 MB.</p>`,
    term(['$ docker images dk06-api', 'IMAGE             DISK USAGE   CONTENT SIZE', '! dk06-api:single       1.88GB          489MB', 'dk06-api:naive         487MB          124MB', '= dk06-api:multi        467MB          122MB', '$ docker history dk06-api:single \\', '    --format \'{{.Size}}  {{.CreatedBy}}\' | grep npm', '+ 170MB  RUN /bin/sh -c npm ci # buildkit'], { title: 'output thật — máy Linux, Docker 29.6 (bỏ cột ID)' }), 'l') },

  { t: '--target: một Dockerfile, nhiều ảnh — stage không cần thì BỎ QUA', body: `
    ${diagram({ w: 1160, h: 250, nodes: [
      { id: 'b', x: 10, y: 90, w: 170, h: 70, t: 'base', d: 'node:22-slim + openssl', c: 'dim' },
      { id: 'd', x: 250, y: 90, w: 170, h: 70, t: 'deps', d: 'npm ci (có dev)', c: 'blu' },
      { id: 'v', x: 520, y: 0, w: 190, h: 66, t: 'dev', d: 'tsc --watch', c: 'tea' },
      { id: 't', x: 520, y: 92, w: 190, h: 66, t: 'test', d: 'tsc --noEmit · npm test', c: 'amb' },
      { id: 'u', x: 520, y: 184, w: 190, h: 66, t: 'build', d: 'build + prune', c: 'vio' },
      { id: 'p', x: 860, y: 150, w: 290, h: 90, t: 'prod (stage cuối)', d: 'COPY --from=build\nmặc định khi không --target', c: 'grn' },
    ], edges: [
      { from: 'b', to: 'd', c: 'dim' }, { from: 'd', to: 'v', c: 'tea' }, { from: 'd', to: 't', c: 'amb' }, { from: 'd', to: 'u', c: 'vio' },
      { from: 'u', to: 'p', c: 'grn', t: 'COPY --from' }
    ] })}
    ${two(term(['$ docker build --target dev -t dk06-api:dev --progress=plain . 2>&1 \\', '    | grep -E "^#[0-9]+ \\[(base|deps|dev|test|build|prod)" | sort -u -k2,2', '#6 [base 1/4] FROM docker.io/library/node:22-slim@sha256:48e4…', '#11 [deps 1/1] RUN npm ci', '= #12 [dev 1/2] COPY . .      # test · build · prod: KHÔNG chạy', '$ docker images --format \'{{.Tag}} {{.Size}}\' dk06-api', 'dev 602MB · test 602MB · = prod 470MB'], { title: 'output thật — máy Linux (dòng cuối gộp lại cho gọn)' }),
      box('tip', 'Compose chọn stage bằng <code>build: { target: dev }</code>. Stage <code>test</code> hỏng ⇒ lệnh build hỏng ⇒ không thể có ảnh hỏng.'), 'l2')}` },

  { t: 'COPY --from lấy được từ stage, từ ẢNH KHÁC, từ ngữ cảnh có tên', body: two(
    yaml([
      ['COPY --from=build /app/dist ./dist', 'từ một stage có tên'],
      ['COPY --from=0 /app/dist ./dist', 'theo số thứ tự — dễ vỡ'],
      ['COPY --from=ghcr.io/jqlang/jq:1.8.1 \\', 'từ một ảnh bất kỳ'],
      ['     /jq /usr/local/bin/jq', '1 file tĩnh, 2,2 MB'],
      ['COPY --from=assets logo.svg ./public/', 'ngữ cảnh có tên:'],
      ['# docker build --build-context assets=../shared .', ''],
    ], { lang: 'docker', fs: 15 }),
    `${term(['$ docker run --rm --entrypoint sh \\', '    dk06-api:prod \\', '    -c \'jq --version; ls -l /usr/local/bin/jq\'', '= jq-1.8.1', '-rwxr-xr-x. 1 root root 2255816 …', '    … /usr/local/bin/jq'], { title: 'output thật — máy Linux' })}
    ${box('good', 'Thêm MỘT công cụ tĩnh (jq, tini, migrate…) bằng hai dòng — không kéo trình quản lý gói và danh mục gói vào ảnh.')}`, 'r') },

  { t: 'Bí mật ở stage dựng KHÔNG lên ảnh — và lệnh kiểm phải đúng Docker 29', body: two(
    term(['# .npmrc có token; stage build: COPY .npmrc rồi RUN … && rm .npmrc', '$ docker save dk06-secret:mot | tar -x -C out', '$ for f in out/blobs/sha256/*; do', '    tar -tzf "$f" 2>/dev/null; done | grep -c npmrc', '! 2          # 1 stage: .npmrc + .wh..npmrc — token VẪN trong ảnh', '$ … cùng lệnh với dk06-secret:nhieu', '= 0          # 2 stage: stage build không được xuất ra', '# lệnh cũ tìm */layer.tar ⇒ in 0 với CẢ HAI ảnh (không kiểm gì)'], { title: 'output thật — máy Mac, Docker 29.8' }),
    `${table(['Cách', 'Token ở đâu'], [
      ['1 stage, <code>rm .npmrc</code>', '-trong tầng COPY của ảnh'],
      ['2 stage', '+chỉ trong cache dựng ở máy dựng'],
      ['<code>--mount=type=secret</code>', '+không ở tầng nào cả'],
    ], { sm: true })}
    ${box('warn', 'Docker 25+ xuất <code>docker save</code> theo chuẩn OCI: tầng nằm ở <code>blobs/sha256/</code>, <b>không còn</b> <code>layer.tar</code>. Lệnh kiểm không tìm thấy gì ≠ ảnh sạch.')}`, 'l') },

  /* ───────────── 6.2 ───────────── */
  { t: 'Ảnh nền quyết định phần lớn kích thước — và phần lớn rắc rối', body: two(
    `${bars([
      { l: 'node:22', sub: 'Debian đủ bộ', v: 1630, txt: '1,63 GB · nén 425 MB', c: 'red' },
      { l: 'node:22-slim', sub: 'Debian tỉa · glibc', v: 327, txt: '327 MB · 82,6', c: 'grn' },
      { l: 'node:22-alpine', sub: 'Alpine 3.24 · musl', v: 237, txt: '237 MB · 61,2', c: 'amb' },
      { l: 'distroless nodejs22', sub: 'không shell · glibc', v: 205, txt: '205 MB · 52,6', c: 'blu' },
      { l: 'distroless static', sub: 'cho Go/Rust tĩnh', v: 7.06, txt: '7,06 MB', c: 'vio' },
    ], { lw: 210, max: 1650 })}
    <p style="font-size:14.5px;color:${D.mu};margin-top:6px">DISK USAGE · CONTENT SIZE (MB), máy Linux amd64, 23/09/2026.</p>`,
    table(['Nền', 'Dùng khi'], [
      ['<code>-slim</code>', '+MẶC ĐỊNH: có native module, Prisma, Python, hay không chắc'],
      ['<code>-alpine</code>', '!Chỉ JS thuần, hoặc đã CHẠY THỬ thật'],
      ['distroless', '+Production ổn định; kèm biến thể :debug'],
      ['scratch / static', 'Một file nhị phân tĩnh (Go, Rust)'],
      ['bản đủ <code>node:22</code>', '-Chỉ làm stage dựng'],
    ], { sm: true }), 'l') },

  { t: 'musl ≠ glibc: cùng chuẩn C, KHÔNG cùng nhị phân', body: two(
    `<div style="display:flex;gap:16px;justify-content:center">
      ${layers({ w: 270, cap: '<b>node:22-slim</b> (Debian)', rows: [
        { t: 'nhân Linux (chung)', c: 'dim' }, { t: 'glibc 2.36', c: 'grn', k: 'libc' }, { t: '<code>ld-linux-x86-64.so.2</code>', c: 'grn' }, { t: 'node · engine Prisma debian', c: 'dk' }] })}
      ${layers({ w: 270, cap: '<b>node:22-alpine</b>', rows: [
        { t: 'nhân Linux (chung)', c: 'dim' }, { t: 'musl 1.2', c: 'amb', k: 'libc' }, { t: '<code>ld-musl-x86_64.so.1</code>', c: 'amb' }, { t: 'node bản dựng cho musl', c: 'dk' }] })}
    </div>
    ${box('info', 'Chương trình đã biên dịch ghi sẵn tên <b>trình nạp</b> (ld-…) nó cần. Khác libc ⇒ khác trình nạp ⇒ không chạy.')}`,
    term(['$ docker run --rm node:22-slim \\', '    sh -c \'ldd --version 2>&1 | head -1\'', 'ldd (Debian GLIBC 2.36-9+deb12u14) 2.36', '$ docker run --rm node:22-alpine \\', '    sh -c \'ldd 2>&1 | head -1\'', '+ musl libc (x86_64)', '$ docker run --rm node:22-slim \\', '    ls /lib/x86_64-linux-gnu/libc.so.6', '/lib/x86_64-linux-gnu/libc.so.6', '$ docker run --rm node:22-alpine \\', '    ls /lib/ld-musl-x86_64.so.1', '/lib/ld-musl-x86_64.so.1', '# Mac M1: /lib/ld-musl-aarch64.so.1', '#         /lib/aarch64-linux-gnu/libc.so.6'], { title: 'output thật — máy Linux amd64' }), 'r') },

  { t: 'File CÓ THẬT mà báo “no such file” — dấu vân tay của lệch libc', body: two(
    term(['$ cat Dockerfile', 'FROM alpine:3.22', 'COPY --from=node:22-slim /usr/local/bin/node /usr/local/bin/node', '$ docker build -t dk06-glibc-tren-alpine .', '$ docker run --rm dk06-glibc-tren-alpine node --version', '! exec /usr/local/bin/node: no such file or directory', '$ docker run --rm dk06-glibc-tren-alpine \\', '    ls -l /usr/local/bin/node', '+ -rwxr-xr-x 1 root root 124836408 … /usr/local/bin/node', '$ docker run --rm dk06-glibc-tren-alpine ls /lib64', '! ls: /lib64: No such file or directory'], { title: 'output thật — máy Linux (exit 255)' }),
    `${steps([
      ['Nhân mở file <code>node</code> (có thật, 124 MB)', 'đọc thấy: “cần trình nạp /lib64/ld-linux-x86-64.so.2”'],
      ['Alpine KHÔNG có <code>/lib64</code>', 'chỉ có /lib/ld-musl-x86_64.so.1'],
      ['Nhân báo ENOENT = “no such file”', 'nhưng file THIẾU là trình nạp, không phải node'],
    ])}
    ${box('tip', 'Thấy “no such file” cho một file <code>ls</code> vẫn thấy ⇒ nghĩ ngay tới libc (hoặc CRLF ở dòng <code>#!</code>).')}`, 'l') },

  { t: 'Sự cố thật: build xanh, đẩy xanh, tráo xanh — rồi API 502 bảy phút', body: `
    ${incident()}
    ${two(box('bad', 'Script deploy gọi <code>docker build .</code> ⇒ lấy <code>Dockerfile</code> mặc định thay vì <code>Dockerfile.backend</code> mà compose dùng: stage dựng Debian sinh engine <b>glibc</b>, stage chạy lại là <code>node:22-alpine</code> (<b>musl</b>).'),
      box('good', 'Bài học được ghi lại: <b>build xanh không có nghĩa là ảnh chạy được</b>. Phải có một bước CHẠY ảnh (hoặc soi nó) trước khi đẩy.'))}` },

  { t: 'Dựng lại y hệt: engine debian-openssl-3.0.x trên nền musl', body: two(
    term(['$ docker run -d --name dk06-trap --restart unless-stopped \\', '    -e DATABASE_URL=postgresql://u:p@db:5432/app dk06-api:trap', '$ docker ps -a --format \'{{.Names}}  {{.Status}}\'', '! dk06-trap  Restarting (1) 4 seconds ago', '$ docker inspect -f \'RestartCount={{.RestartCount}}\' dk06-trap', '! RestartCount=7          # sau 12 giây', '$ docker logs dk06-trap 2>&1 | head -6', 'prisma:warn Prisma failed to detect the libssl/openssl version…', '! PrismaClientInitializationError: Prisma Client could not', '!   locate the Query Engine for runtime "linux-musl".', '+ This happened because Prisma Client was generated for', '+ "debian-openssl-3.0.x", but the actual deployment', '+ required "linux-musl".'], { title: 'output thật — máy Linux, Prisma 5.22' }),
    `${yaml([
      ['FROM node:22-slim AS build', 'glibc'],
      ['RUN npx prisma generate', 'engine cho debian'],
      ['', ''],
      ['FROM node:22-alpine', 'musl ⇐ lệch!'],
      ['COPY --from=build /app/node_modules …', 'mang engine glibc'],
    ], { lang: 'docker', fs: 15 })}
    ${box('info', 'Có nginx đứng trước ⇒ upstream chết ⇒ người dùng thấy <b>502 Bad Gateway</b>. Log của Prisma nói THẲNG cách sửa — nhưng chỉ ai đọc log mới thấy.')}`, 'l') },

  { t: 'Chốt kiểm libc ↔ engine: 1 giây, chạy TRƯỚC docker push', body: two(
    `${yaml([
      ['#!/bin/sh  (check-libc.sh <ảnh>)', ''],
      ['docker run --rm --entrypoint sh "$1" -c \'', ''],
      ['  ls /lib/ld-musl-* >/dev/null 2>&1 \\', 'có trình nạp musl?'],
      ['    && LIBC=musl || LIBC=glibc', ''],
      ['  ENG=$(ls node_modules/.prisma/client \\', 'engine đã sinh'],
      ['    | grep -o "libquery_engine-.*node")', ''],
      ['  case "$LIBC:$ENG" in', ''],
      ['    musl:*musl*|glibc:*debian*) exit 0;;', 'khớp ⇒ đẩy'],
      ['    *) echo "LỆCH"; exit 1;; esac\'', 'lệch ⇒ DỪNG'],
    ], { fs: 14.5 })}
    ${box('good', 'Sửa gốc: <code>binaryTargets = ["native", "linux-musl-openssl-3.0.x"]</code> + <code>apk add openssl</code> — hoặc dùng <code>-slim</code> cho cả hai stage.')}`,
    term(['$ ./check-libc.sh dk06-api:trap; echo "exit=$?"', 'libc:    musl', 'engines: …debian-openssl-3.0.x.so.node', '! LỆCH: libc musl nhưng không có engine cho nó', '! exit=1', '$ ./check-libc.sh dk06-api:fix; echo "exit=$?"', 'libc:    musl', 'engines: …debian-openssl-3.0.x.so.node', '         …linux-musl-openssl-3.0.x.so.node', '= OK', '= exit=0', '$ docker logs dk06-fix', '= db connected', '= listening on 8080'], { title: 'output thật — máy Linux' }), 'l') },

  /* ───────────── 6.3 ───────────── */
  { t: 'Đo trước khi cắt: docker history chỉ ra byte nằm ở đâu', body: two(
    term(['$ docker history dk06-api:single \\', '    --format \'table {{.Size}}\\t{{.CreatedBy}}\' | cut -c1-58', 'SIZE      CREATED BY', '12.3kB    RUN /bin/sh -c npm run build', '16.3MB    RUN /bin/sh -c npx prisma generate', '+ 170MB     RUN /bin/sh -c npm ci', '81.9kB    COPY . .', '208MB     RUN … cài node', '+ 618MB     RUN … apt-get (bộ biên dịch của node:22)', '191MB     RUN … apt-get', '132MB     # debian.sh … bookworm'], { title: 'output thật — máy Linux' }),
    `${layers({ w: 450, cap: 'dk06-api:single — 85% là ẢNH NỀN, không phải app', rows: [
      { t: 'debian bookworm', sz: '132MB', c: 'dim' },
      { t: 'apt: curl, git…', sz: '191MB', c: 'dim' },
      { t: 'apt: gcc, python3…', sz: '618MB', c: 'red', k: 'NẶNG NHẤT' },
      { t: 'cài node 22', sz: '208MB', c: 'dk' },
      { t: 'npm ci (có dev)', sz: '170MB', c: 'amb' },
      { t: 'prisma generate + tsc', sz: '16MB', c: 'grn' },
    ] })}
    ${box('tip', 'Đọc từ dưới lên = Dockerfile. Tầng to nhất thường KHÔNG nằm ở chỗ bạn đoán.')}`, 'l') },

  { t: 'Cài ở RUN này, xoá ở RUN sau: ảnh 667 MB thay vì 243 MB', body: two(
    `<div style="display:flex;gap:16px;justify-content:center">
      ${layers({ w: 300, cap: '<b>hai RUN</b> — 667 MB', rows: [
        { t: 'node:22-alpine', sz: '237MB', c: 'dim' },
        { t: 'apk add python3 make g++', sz: '315MB', c: 'red' },
        { t: 'apk del …', sz: '41kB', c: 'amb', k: 'WHITEOUT' }] })}
      ${layers({ w: 300, cap: '<b>một RUN</b> — 243 MB', rows: [
        { t: 'node:22-alpine', sz: '237MB', c: 'dim' },
        { t: 'apk add … &amp;&amp; del …', sz: '6 MB', c: 'grn' }] })}
    </div>
    ${box('bad', 'Tầng dưới là bất biến. <code>apk del</code> ở tầng sau chỉ dán nhãn “đã xoá” — 315 MB vẫn được đẩy, kéo và lưu.')}`,
    term(['$ docker images --format \\', '    \'{{.Repository}}:{{.Tag}}  {{.Size}}\' \\', '    | grep waste', '! dk06-waste:hai  667MB', '= dk06-waste:mot  243MB', '$ docker run --rm \\', '    -v /var/run/docker.sock:/var/run/docker.sock \\', '    wagoodman/dive:latest dk06-waste:hai --ci', '  efficiency: 83.3305 %', '+ wastedBytes: 115089598 bytes (115 MB)', 'Count  Wasted Space  File Path', '    2         41 MB  /usr/bin/lto-dump', '    2        9.4 MB  /usr/lib/libc.a', '    2        7.0 MB  /usr/lib/libstdc++.a'], { title: 'output thật — máy Linux, dive 0.13.1' }), 'l') },

  { t: 'npm prune --omit=dev vẫn giữ 60 MB Prisma CLI — vì nó là devOptional', body: two(
    term(['$ docker run --rm --entrypoint sh dk06-api:multi -c \\', '    \'du -sh node_modules/* node_modules/.prisma \\', '     | sort -hr | head -4\'', '+ 44M   node_modules/@prisma      # 34M là @prisma/engines', '+ 26M   node_modules/prisma       # CLI — app không gọi tới', '16M   node_modules/.prisma      # engine app CẦN', '396K  node_modules/iconv-lite', '$ npm ls prisma --omit=dev', '└─┬ @prisma/client@5.22.0', '  └─┬ prisma@5.22.0             # peer tuỳ chọn ⇒ "devOptional"', '    └── @prisma/engines@5.22.0'], { title: 'output thật — máy Linux + Mac' }),
    `${bars([
      { l: 'naive (chép cả node_modules)', v: 114, txt: '114 MB', c: 'red' },
      { l: 'multi (npm prune)', v: 89, txt: '89 MB', c: 'amb' },
      { l: 'gọn (prune + rm prisma CLI)', v: 30.7, txt: '30,7 MB', c: 'grn' },
    ], { lw: 260, max: 120 })}
    ${yaml([
      ['RUN npm prune --omit=dev \\', ''],
      [' && rm -rf node_modules/prisma \\', 'CLI'],
      ['    node_modules/@prisma/engines', 'engine của CLI'],
    ], { lang: 'docker', fs: 14.5 })}
    ${box('warn', 'Cần <code>prisma migrate deploy</code> trong container? Chạy nó từ ảnh/stage riêng, đừng giữ CLI trong ảnh app.')}`, 'l') },

  { t: 'Thang giảm cân của cùng một app: 1,88 GB → 337 MB', body: two(
    bars([
      { l: 'single · node:22', sub: 'một stage', v: 1880, txt: '1,88 GB · nén 489', c: 'red' },
      { l: 'naive · 2 stage', sub: 'node_modules nguyên xi', v: 487, txt: '487 · 124', c: 'ora' },
      { l: 'multi · + npm prune', sub: 'mẫu của bài 6.1', v: 467, txt: '467 · 122', c: 'amb' },
      { l: 'gon · + bỏ Prisma CLI, npm', sub: 'slim, vẫn có shell', v: 377, txt: '377 · 94,4', c: 'grn' },
      { l: 'distroless', sub: 'không shell (còn Prisma CLI)', v: 337, txt: '337 · 91,6', c: 'blu' },
    ], { lw: 280, max: 1900 }),
    `${kpis([{ v: '÷5,6', l: 'DISK USAGE: 1,88 GB → 337 MB', c: 'grn' }, { v: '÷5,3', l: 'bản nén phải tải: 489 → 91,6 MB', c: 'blu' }])}
    ${box('info', 'Hai bước đầu (tách stage, tỉa dependency) làm gần hết việc. Sau đó mỗi bước chỉ còn vài chục MB — lúc đó hãy dừng lại và đo cái khác.')}`, 'l') },

  { t: 'Docker 29: .Size là bản NÉN — cổng kích thước phải biết mình đo gì', body: two(
    term(['$ docker image inspect -f \'{{.Size}}\' dk06-api:single', '+ 489064150          # 466 MiB — KHÔNG phải 1,88 GB', '$ docker images dk06-api:single', 'IMAGE             DISK USAGE   CONTENT SIZE', 'dk06-api:single       1.88GB          489MB', '# cổng CI: 250 MiB, đo bằng .Size', '$ MAX=$((250*1024*1024))', '$ SIZE=$(docker image inspect dk06-api:gon --format \'{{.Size}}\')', '$ echo "image size: $((SIZE/1024/1024))MB"', '= image size: 90MB', '= size ok'], { title: 'output thật — máy Linux, kho ảnh containerd' }),
    table(['Con số', 'Nghĩa (Docker 29, kho containerd)', 'Dùng cho'], [
      ['<code>.Size</code> / CONTENT SIZE', 'Bản nén = số byte kéo về', '+cổng CI, thời gian deploy'],
      ['DISK USAGE', 'Nén + giải nén trên đĩa', 'dọn đĩa máy chủ'],
      ['<code>docker history</code>', 'Từng tầng, đã giải nén', 'tìm tầng béo'],
      ['Engine ≤ 27 (overlay2)', '<code>.Size</code> = bản giải nén', '!đặt ngưỡng lại khi nâng cấp'],
    ], { sm: true }), 'l') },

  /* ───────────── 6.4 ───────────── */
  { t: 'Năm lớp khoá quanh tiến trình — mỗi lớp chặn một bước của kẻ tấn công', body: two(
    rings(),
    term(['$ docker exec dk06-hardened sh -c \'id; \\', '    grep -E "CapEff|NoNewPrivs|Seccomp:" \\', '    /proc/self/status\'', '= uid=10001 gid=10001 groups=10001', '= CapEff:  0000000000000000', '= NoNewPrivs:  1', '= Seccomp:  2        # 2 = bộ lọc đang bật', '$ docker exec dk06-hardened touch /app.txt', '! touch: /app.txt: Read-only file system', '$ docker run --rm alpine \\', '    grep NoNewPrivs /proc/self/status', '! NoNewPrivs:  0      # mặc định: TẮT'], { title: 'output thật — máy Mac' }), 'l') },

  { t: '--read-only: nginx chết vì không ghi được — tmpfs khai đúng chỗ là sống', body: two(
    term(['$ docker run -d --name dk06-web2 --read-only \\', '    -p 18062:80 nginx:1.27-alpine', '$ docker ps -a --filter name=dk06-web2 --format \'{{.Status}}\'', '! Exited (1) 2 seconds ago', '$ docker logs dk06-web2 | tail -1', '! nginx: [emerg] mkdir() "/var/cache/nginx/client_temp" failed', '!   (30: Read-only file system)', '$ docker run -d --name dk06-web --read-only \\', '    --tmpfs /tmp:rw,noexec,nosuid,size=64m \\', '    --tmpfs /var/cache/nginx:rw,size=32m \\', '    --tmpfs /var/run:rw,size=8m \\', '    -p 18061:80 nginx:1.27-alpine', '$ curl -s -o /dev/null -w \'%{http_code}\\n\' localhost:18061', '= 200'], { title: 'output thật — máy Mac' }),
    `${steps([
      ['Chạy thử ảnh với <code>--read-only</code>', 'cái gì cần ghi sẽ hỏng NGAY, có tên đường dẫn'],
      ['Đọc log: đường dẫn nào?', '<code>/var/cache/nginx</code>, <code>/var/run</code>, <code>/tmp</code>'],
      ['Khai từng cái bằng <code>--tmpfs</code> (hoặc volume)', 'dữ liệu cần giữ ⇒ volume, không phải tmpfs'],
    ])}
    ${box('tip', 'Không muốn đoán? Chạy bình thường một lúc rồi <code>docker diff</code> — nó liệt kê đúng những chỗ app đã ghi.')}`, 'l') },

  { t: 'Capability: mặc định 14 cái, --cap-drop=ALL còn 0 — thêm lại đúng cái cần', body: two(
    term(['$ docker run --rm alpine \\', '    sh -c \'apk add -q libcap; capsh --print | head -1\'', 'Current: cap_chown,cap_dac_override,cap_fowner,', '  cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,', '  cap_net_bind_service,cap_net_raw,cap_sys_chroot,', '  cap_mknod,cap_audit_write,cap_setfcap=ep     # 14 cái', '$ … --cap-drop=ALL …', '= Current: =', '$ … --cap-drop=ALL --cap-add=NET_BIND_SERVICE …', '= Current: cap_net_bind_service=ep', '$ docker run --rm --cap-drop=NET_RAW alpine \\', '    ping -c1 1.1.1.1 | tail -1', '+ round-trip min/avg/max = 30.325/30.325/30.325 ms', '$ … --cap-drop=NET_RAW alpine tcpdump -c1 -i eth0', '! (Attempt to create packet socket failed -', '!  CAP_NET_RAW may be required)'], { title: 'output thật — máy Mac + máy Linux' }),
    table(['Capability', 'Cho phép', 'Cần không?'], [
      ['NET_BIND_SERVICE', 'mở cổng &lt; 1024', '!chỉ khi không đổi được sang 8080'],
      ['NET_RAW', 'socket thô: giả gói, nghe lén', '+bỏ — ping vẫn chạy (socket ICMP thường)'],
      ['CHOWN, SETUID…', 'đổi chủ file, đổi user', '+app web: không'],
      ['SYS_ADMIN', 'gần như root (mount…)', '-KHÔNG có trong mặc định — đừng thêm'],
    ], { sm: true }), 'l') },

  { t: 'Trọn bộ cờ an toàn — và vòng lặp kiểm mọi container trong 10 giây', body: two(
    yaml([
      ['services:', ''],
      ['  api:', ''],
      ['    user: "10001:10001"', 'không phải root'],
      ['    read_only: true', 'không ghi được /'],
      ['    tmpfs: ["/tmp:rw,noexec,nosuid,size=64m"]', ''],
      ['    cap_drop: [ALL]', '14 → 0'],
      ['    security_opt: ["no-new-privileges:true"]', ''],
      ['    pids_limit: 200', 'chặn fork bomb'],
      ['    mem_limit: 256m', ''],
      ['    ports: ["127.0.0.1:18060:8080"]', 'chỉ proxy vào được'],
    ], { fs: 14.5 }),
    term(['$ for c in $(docker ps --filter name=dk06- \\', '      --format \'{{.Names}}\'); do', '    docker inspect "$c" --format \'…\'   # mẫu ở bài 6.4', '  done', '! /dk06-legacy     user: ROOT (!)  readonly: false', '!                  capdrop: []  sock: MOUNTED (!)', '= /dk06-hardened   user: 10001:10001  readonly: true', '=                  capdrop: [ALL]  memory: 268435456', '+ /dk06-web        user: ROOT (!)  readonly: true', '+                  capdrop: []   # nginx master là root', '# (ghép 8 dòng/container của vòng lặp thành 2 dòng)'], { title: 'output thật — máy Mac' }), 'r') },

  { t: '--privileged hay gắn docker.sock = trao chìa khoá ROOT của máy chủ', body: `
    ${diagram({ w: 1160, h: 200, nodes: [
      { id: 'c', x: 10, y: 60, w: 220, h: 84, t: 'container “monitor”', d: '-v docker.sock:…', c: 'red' },
      { id: 's', x: 400, y: 60, w: 190, h: 84, t: 'docker.sock', d: 'API toàn quyền', c: 'amb', mono: true },
      { id: 'd', x: 670, y: 60, w: 170, h: 84, t: 'dockerd', d: 'chạy bằng root', c: 'dk' },
      { id: 'n', x: 900, y: 60, w: 250, h: 84, t: 'container MỚI', d: '-v /:/host · chroot /host\n⇒ uid=0 trên máy chủ', c: 'red' },
    ], edges: [{ from: 'c', to: 's', c: 'amb', t: 'docker run …' }, { from: 's', to: 'd', c: 'amb' }, { from: 'd', to: 'n', c: 'red', t: 'tạo' }] })}
    ${two(term(['$ docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\', '    docker:cli run --rm -v /:/host alpine chroot /host id', '! uid=0(root) gid=0(root) groups=0(root),1(daemon),2(bin),3(sys),…', '$ docker run --rm alpine sh -c \'ls /dev | wc -l\'', '15', '$ docker run --rm --privileged alpine sh -c \'ls /dev | wc -l\'', '! 169          # có cả vda, vda1 — ổ đĩa thô'], { title: 'output thật — máy Mac (root của máy ảo Docker Desktop)' }),
      box('bad', 'Cần thật (CI dựng ảnh, Traefik, giám sát)? Coi container đó là <b>root máy chủ</b>. Ưu tiên <code>docker-socket-proxy</code> chỉ mở vài API, hoặc builder rootless.'), 'l2')}` },

  /* ───────────── 6.5 ───────────── */
  { t: 'Chuỗi cung ứng: phần lớn thứ trong ảnh bạn KHÔNG tự viết', body: `
    ${diagram({ w: 1160, h: 260, nodes: [
      { id: 'b', x: 10, y: 0, w: 210, h: 64, t: 'ảnh nền', d: 'debian: 90 gói deb', c: 'dim' },
      { id: 'n', x: 10, y: 92, w: 210, h: 64, t: 'npm', d: '276 gói (kể cả npm)', c: 'amb' },
      { id: 'm', x: 10, y: 184, w: 210, h: 64, t: 'mã của bạn', d: 'vài chục file', c: 'grn' },
      { id: 'k', x: 320, y: 92, w: 200, h: 64, t: 'docker build', d: 'Dockerfile', c: 'dk' },
      { id: 'i', x: 600, y: 92, w: 190, h: 64, t: 'ảnh', d: '367 thành phần', c: 'dk' },
      { id: 'r', x: 860, y: 0, w: 290, h: 64, t: 'registry (GHCR)', d: 'SBOM + chữ ký đi kèm', c: 'vio' },
      { id: 's', x: 860, y: 184, w: 290, h: 64, t: 'máy chủ', d: 'verify trước khi chạy', c: 'tea' },
    ], edges: [
      { from: 'b', to: 'k', c: 'dim' }, { from: 'n', to: 'k', c: 'amb' }, { from: 'm', to: 'k', c: 'grn' }, { from: 'k', to: 'i', c: 'dk' },
      { from: 'i', to: 'r', c: 'vio', t: 'push' }, { from: 'r', to: 's', c: 'tea', t: 'pull' },
    ] })}
    ${table(['Ở đâu', 'Công cụ', 'Trả lời câu hỏi'], [
      ['lockfile', '<code>npm audit</code>', 'gói JS nào có lỗ hổng — trước cả khi có ảnh'],
      ['ảnh', 'Trivy · Grype · Docker Scout', 'toàn bộ gói hệ điều hành + ngôn ngữ trong ảnh'],
      ['registry', 'SBOM · provenance · cosign', 'trong ảnh có gì, ai dựng, từ commit nào'],
    ], { sm: true })}` },

  { t: 'Quét thật: cùng một app, 12 lỗi HIGH/CRITICAL có bản vá → còn 1', body: two(
    bars([
      { l: 'node:22 (single)', sub: 'mọi mức · deb', v: 3983, txt: '3 983 CVE', c: 'red' },
      { l: 'multi · slim', sub: 'mọi mức · deb', v: 239, txt: '239', c: 'amb' },
      { l: 'distroless', sub: 'mọi mức · deb', v: 54, txt: '54', c: 'blu' },
      { l: 'alpine (fix)', sub: 'mọi mức · apk', v: 0, txt: '0', c: 'grn' },
    ], { lw: 200, max: 4000 }),
    `${table(['Ảnh', 'HIGH/CRIT có bản vá', 'Grype đếm (mọi mức)'], [
      ['<code>dk06-api:multi</code>', '!12 (11 trong npm)', '258 (Trivy: 264)'],
      ['<code>dk06-api:gon</code> (bỏ npm)', '+1', '—'],
      ['<code>dk06-api:distroless</code>', '+1', '—'],
    ], { sm: true })}
    ${box('info', 'Trivy 0.74.0, DB ngày 23/09/2026. Con số là của NGÀY ĐÓ — mai quét lại sẽ khác. Hai máy quét lệch nhau là bình thường (khác CSDL, khác cách khớp gói).')}`, 'r') },

  { t: '11/12 lỗi nằm trong npm — thứ app của bạn KHÔNG BAO GIỜ chạy', body: two(
    term(['$ trivy image -q --severity HIGH,CRITICAL --ignore-unfixed \\', '    --pkg-types library --format json dk06-api:multi | …', 'brace-expansion  CVE-2026-13149  HIGH', '    ↳ usr/local/lib/node_modules/npm/…', 'tar              CVE-2026-59873  CRITICAL', '    ↳ usr/local/lib/node_modules/npm/…', 'sigstore         CVE-2026-48815  HIGH', '    ↳ usr/local/lib/node_modules/npm/…', '… (8 dòng nữa, cùng thư mục npm)', '+ path-to-regexp   CVE-2026-4867   HIGH', '+     ↳ app/node_modules/path-to-regexp   # CỦA APP'], { title: 'output thật — máy Linux (cột rút gọn)' }),
    `${steps([
      ['Tách <b>nền</b> khỏi <b>gói của app</b>', 'sửa khác nhau: nâng ảnh nền vs sửa lockfile'],
      ['Hỏi: đoạn mã đó có CHẠY không?', 'npm chỉ dùng lúc build ⇒ bỏ khỏi ảnh chạy'],
      ['Xoá npm ở stage cuối (hoặc distroless)', '12 → 1, không đụng một dòng mã'],
    ])}
    ${box('warn', 'Xoá npm trong ảnh slim KHÔNG làm ảnh nhỏ đi (nó ở tầng nền — whiteout), nhưng máy quét và kẻ tấn công đều không còn thấy nó.')}`, 'l') },

  { t: 'Cổng CI hợp lý: chỉ chặn HIGH/CRITICAL ĐÃ CÓ BẢN VÁ', body: two(
    `${yaml([
      ['- name: Quét ảnh', ''],
      ['  uses: aquasecurity/trivy-action@…', 'ghim phiên bản'],
      ['  with:', ''],
      ['    image-ref: ghcr.io/…:<sha>', ''],
      ['    severity: HIGH,CRITICAL', 'không chặn LOW'],
      ['    ignore-unfixed: true', 'chưa vá = theo dõi'],
      ['    exit-code: "1"', 'có lỗi ⇒ đỏ'],
      ['    trivyignores: .trivyignore', 'rủi ro đã nhận'],
    ], { fs: 14.5 })}
    ${yaml([
      ['# CVE-2026-4867 — path-to-regexp 0.1.12 (express 4)', ''],
      ['# Chỉ route tĩnh. Xem lại trước 2026-10-15.', 'lý do + hạn'],
      ['CVE-2026-4867', ''],
    ], { fs: 14 })}`,
    `${term(['$ trivy image -q --severity HIGH,CRITICAL \\', '    --ignore-unfixed --exit-code 1 dk06-api:gon', '! Total: 1 (HIGH: 1, CRITICAL: 0)', '$ echo "exit=$?"', '! exit=1                  # CI đỏ', '# .trivyignore ở thư mục đang đứng — Trivy tự đọc:', '= exit=0'], { title: 'output thật — máy Linux' })}
    ${box('tip', '5 bước đọc báo cáo: lọc cái có bản vá → tách nền/app → hỏi “có chạy tới không?” → sửa cái rẻ ngay → chấp nhận CÓ HẠN.')}
    `, 'l') },

  { t: 'SBOM: danh sách thành phần — hỏi “ta có đóng gói X không?” trong 1 giây', body: two(
    term(['$ trivy image -q --format cyclonedx dk06-api:multi \\', '    > sbom.cdx.json', '$ ls -l sbom.cdx.json | awk \'{print $5}\'', '512825', '$ node -e \'… đếm theo loại …\' sbom.cdx.json', 'components: 367', '{ npm: 276, deb: 90, operating-system: 1 }', '$ … lọc tên openssl, libssl3, express', '+ libssl3 3.0.20-1~deb12u2', '+ openssl 3.0.20-1~deb12u2', 'express 4.21.2'], { title: 'output thật — máy Mac đọc SBOM quét ở máy Linux' }),
    `${cards([
      { ic: '📋', t: 'SBOM', d: 'Bản kê mọi gói + phiên bản trong ảnh (SPDX / CycloneDX).', c: 'blu' },
      { ic: '🧾', t: 'Provenance', d: '<code>--provenance=mode=max</code>: dựng từ repo nào, commit nào, builder nào.', c: 'tea' },
      { ic: '✍️', t: 'Chữ ký (cosign)', d: 'Chứng minh ảnh do CI của bạn dựng. Ký mà không <strong>verify</strong> lúc deploy = vô nghĩa.', c: 'vio' },
    ], 1)}`, 'l') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 6', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Build/đẩy/tráo xanh rồi <code>Restarting (1)</code>, nginx 502', 'Engine/native module glibc trên nền musl', 'Chốt kiểm libc ↔ engine; <code>binaryTargets</code>; hoặc <code>-slim</code>'],
    ['<code>exec …: no such file or directory</code> dù file có', 'Thiếu trình nạp (lệch libc) hoặc CRLF ở <code>#!</code>', 'Cùng libc cho build và chạy'],
    ['Ảnh không nhỏ đi sau <code>RUN rm</code>/<code>apk del</code>', 'Xoá ở tầng sau = whiteout', 'Dọn trong CÙNG RUN, hoặc tách stage'],
    ['Multi-stage mà vẫn to', 'Chép nguyên <code>node_modules</code> chưa tỉa; Prisma CLI devOptional', '<code>npm prune --omit=dev</code> + rm CLI'],
    ['Thêm <code>USER node</code> rồi <code>EACCES</code>', 'Thư mục app ghi thuộc root', '<code>COPY --chown</code>, thử <code>--read-only</code> trước khi đẩy'],
    ['Cổng quét đỏ mãi rồi bị tắt', 'Chặn cả lỗi chưa có bản vá / mức thấp', 'HIGH/CRITICAL + <code>--ignore-unfixed</code> + <code>.trivyignore</code> có hạn'],
    ['Lệnh kiểm bí mật in 0 “sạch”', 'Tìm <code>layer.tar</code> — Docker 29 không còn', 'Duyệt <code>blobs/sha256/*</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 6', body: table(['Muốn…', 'Gõ'], [
    ['Dựng tới một stage', '<code>docker build --target test -t app:test .</code>'],
    ['Thêm 1 công cụ tĩnh', '<code>COPY --from=ghcr.io/jqlang/jq:1.8.1 /jq /usr/local/bin/jq</code>'],
    ['Ảnh dùng libc gì', '<code>docker run --rm --entrypoint sh app -c \'ls /lib/ld-musl-* || ldd --version\'</code>'],
    ['Byte nằm ở tầng nào', '<code>docker history app --format \'{{.Size}} {{.CreatedBy}}\'</code> · <code>dive app --ci</code>'],
    ['Kích thước phải tải', '<code>docker image inspect -f \'{{.Size}}\' app</code> (Docker 29: bản nén)'],
    ['Chạy an toàn', '<code>--user 10001 --read-only --tmpfs /tmp --cap-drop=ALL --security-opt no-new-privileges:true</code>'],
    ['Soi quyền đang có', '<code>docker exec c grep -E "CapEff|NoNewPrivs|Seccomp" /proc/self/status</code>'],
    ['Quét, chỉ thứ sửa được', '<code>trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 app</code>'],
    ['Sinh SBOM', '<code>trivy image --format cyclonedx app</code> · <code>docker buildx build --sbom=true</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 6 (45 phút)', body: `
    ${steps([
      ['Dựng app của bạn (hoặc app mẫu) một stage, ghi DISK USAGE + CONTENT SIZE', '<code>docker images</code> — đây là số “trước”'],
      ['Tách build / prod, tỉa dependency, đo lại', 'mục tiêu: giảm ≥ 60% bản nén'],
      ['Dựng cố ý bản lệch libc (build slim, chạy alpine) rồi để chốt kiểm bắt nó', '<code>check-libc.sh</code> phải in LỆCH, exit 1'],
      ['Chạy ảnh với <code>--read-only --cap-drop=ALL --user 10001</code>, khai tmpfs tới khi sống', '<code>curl</code> trả 200'],
      ['Quét bằng Trivy, tách nền / app, đưa HIGH có bản vá về 0 hoặc có dòng <code>.trivyignore</code>', 'ghi lại số và NGÀY quét'],
    ])}
    ${box('good', '<b>Đạt khi:</b> có bảng “trước / sau / số CVE”, chốt kiểm bắt được bản lệch, và <code>docker ps -a --filter name=thu-</code> sạch.')}` },
]).map((x) => ({ ...x, body: TCSS + x.body }));
