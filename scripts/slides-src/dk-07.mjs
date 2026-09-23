/**
 * Docker · Deck dk-07 — Chương 7: Dữ liệu — volume, bind mount, tmpfs.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 23–24/09/2026:
 *   • "máy Mac"   = Mac M1, Docker Desktop 4.91 / Engine 29.8.0 arm64, chia sẻ file VirtioFS
 *   • "máy Linux" = Fedora 44 (SELinux Enforcing), Docker Engine 29.6.2 amd64, /home trên btrfs
 * Lúc chạy mọi đối tượng mang tiền tố dk07- (luật an toàn của khoá); trên slide dùng tên ngắn
 * (pgdata, uploads, pg, ngx…) giống bài giảng — chỉ tên đổi, chữ còn lại giữ nguyên.
 *
 * Hình tự vẽ (SVG nội tuyến, không đụng thư viện): hub() (ba kiểu gắn → ba chỗ lưu), copyVsHide()
 * (volume rỗng được chép / bind che), inode() (gắn file đơn theo inode, trước/sau sed -i), helper() (container phụ).
 */
import { S, cover, cards, box, steps, table, vs, kpis, two, mindmap, layers, term as dkTerm, diagram, yaml, bars, sv, R, T, A, D } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });

export const deck = { key: 'dk-07', code: 'DOCKER · CHƯƠNG 7', title: 'Dữ liệu: volume, bind mount, tmpfs', sub: 'Docker · Chương 7' };

/* ───────────── Slide 3 — ba kiểu gắn nối xuống ba chỗ lưu khác nhau ───────────── */
const hub = () => {
  const cols = [
    { x: 20, p: '/var/lib/postgresql/data', f: '-v pgdata:/var/lib/…/data', c: 'vio', n: 'VOLUME', l1: '/var/lib/docker/volumes/', l2: 'pgdata/_data', s1: 'Docker quản, gọi bằng TÊN', ok: '✓ sống qua rm, down, deploy' },
    { x: 305, p: '/app/src', f: '-v "$PWD/src:/app/src"', c: 'tea', n: 'BIND MOUNT', l1: '~/thu-docker/src', l2: '(thư mục CỦA BẠN)', s1: 'sửa trên máy ⇒ thấy ngay', ok: '✓ sống qua rm (là file của bạn)' },
    { x: 590, p: '/tmp', f: '--tmpfs /tmp:size=64m', c: 'amb', n: 'TMPFS', l1: 'RAM', l2: '(không bao giờ chạm đĩa)', s1: 'tính vào trần --memory', ok: '✗ mất khi stop / restart' },
    { x: 875, p: 'mọi đường dẫn khác', f: '(không gắn gì)', c: 'red', n: 'TẦNG GHI', l1: 'upperdir của container', l2: '(snapshot của containerd)', s1: 'mặc định, không cần cờ', ok: '✗ mất khi rm' },
  ];
  let s = R(0, 0, 1150, 150, { c: 'dk', fill: 'rgba(36,150,237,.07)' }) +
    T(22, 32, 'CONTAINER — tiến trình chỉ thấy MỘT cây /, không biết đường nào nằm ở đâu', { fs: 17, b: true, c: 'dk' });
  cols.forEach((k) => {
    s += R(k.x, 52, 262, 78, { c: k.c, fill: '#0d1628', r: 10 }) +
      T(k.x + 131, 84, k.p, { fs: 15, a: 'middle', mono: true, b: true }) +
      T(k.x + 131, 112, k.n, { fs: 14, a: 'middle', c: k.c, b: true });
    s += A(k.x + 131, 132, k.x + 131, 262, { c: k.c === 'red' ? 'red' : k.c });
    s += `<rect x="${k.x + 6}" y="178" width="250" height="30" rx="7" fill="#0b1220" stroke="${D[k.c]}" stroke-width="1.5"/>` +
      T(k.x + 131, 198, k.f, { fs: 13.5, a: 'middle', mono: true, c: k.c });
    s += R(k.x, 266, 262, 140, { c: k.c, fill: '#0f182a', r: 10 }) +
      T(k.x + 14, 292, k.l1, { fs: 14, mono: true, b: true }) + T(k.x + 14, 314, k.l2, { fs: 14, mono: k.l2.startsWith('pgdata'), b: k.l2.startsWith('pgdata'), c: k.l2.startsWith('pgdata') ? '#e6edf3' : 'mu' }) +
      T(k.x + 14, 346, k.s1, { fs: 14.5, c: 'mu' }) + T(k.x + 14, 382, k.ok, { fs: 15, b: true, c: k.ok.startsWith('✓') ? 'grn' : 'red' });
  });
  s += R(0, 236, 1150, 206, { c: 'dim', dash: true, fill: 'none', sw: 1.5 }) +
    T(1136, 432, 'MÁY CHỦ — Linux, hoặc máy ảo Linux của Docker Desktop (Mac/Windows)', { fs: 13.5, a: 'end', c: 'mu' });
  return sv(1150, 446, s);
};

/* ───────────── Slide 6 — volume rỗng được chép, bind rỗng thì che ───────────── */
const copyVsHide = () => {
  const panel = (x0, title, tc, target, arrowLbl, ok, res1, res2) => {
    let s = T(x0, 22, title, { fs: 17, b: true, c: tc });
    s += R(x0, 38, 230, 118, { c: 'dim', fill: '#0f182a', r: 10 }) + T(x0 + 14, 64, 'trong ẢNH nginx', { fs: 14, c: 'mu' }) +
      T(x0 + 14, 90, '/etc/nginx', { fs: 16, b: true, mono: true }) + T(x0 + 14, 116, 'nginx.conf · mime.types', { fs: 13.5, mono: true, c: 'mu' }) +
      T(x0 + 14, 138, 'conf.d/ … (8 mục)', { fs: 13.5, mono: true, c: 'mu' });
    s += R(x0 + 320, 38, 230, 118, { c: tc, fill: '#0f182a', r: 10, dash: !ok }) + T(x0 + 334, 64, target[0], { fs: 14, c: 'mu' }) +
      T(x0 + 334, 90, target[1], { fs: 16, b: true, mono: true }) + T(x0 + 334, 116, target[2], { fs: 13.5, c: ok ? 'grn' : 'red', b: true });
    s += ok ? A(x0 + 232, 97, x0 + 316, 97, { c: 'grn' }) : `<path d="M${x0 + 232} 97 L${x0 + 316} 97" stroke="${D.red}" stroke-width="3" stroke-dasharray="6 6"/>` + T(x0 + 274, 104, '✗', { fs: 22, a: 'middle', c: 'red', b: true });
    s += T(x0 + 274, 84, arrowLbl, { fs: 13, a: 'middle', c: ok ? 'grn' : 'red' });
    s += R(x0, 176, 550, 66, { c: ok ? 'grn' : 'red', fill: ok ? 'rgba(63,185,80,.08)' : 'rgba(255,92,108,.08)', r: 10 }) +
      T(x0 + 16, 202, res1, { fs: 15.5, b: true }) + T(x0 + 16, 228, res2, { fs: 14, c: 'mu' });
    return s;
  };
  return sv(1150, 246,
    panel(0, 'VOLUME RỖNG gắn vào /etc/nginx', D.vio, ['volume etc', 'etc/_data', 'được chép 8 mục'], 'chép vào', true,
      'Container thấy đủ 8 mục của ảnh', 'kể cả CHỦ SỞ HỮU + quyền của thư mục gốc') +
    panel(600, 'BIND MOUNT RỖNG gắn vào /etc/nginx', D.tea, ['thư mục máy', '~/thu-docker/rong', 'vẫn rỗng'], 'không chép', false,
      'Container thấy thư mục RỖNG', 'file của ảnh vẫn còn, chỉ bị phép gắn che đi'));
};

/* ───────────── Slide 17 — gắn MỘT FILE = gắn theo inode ───────────── */
const inode = () => {
  const stage = (x0, title, after) => {
    let s = T(x0, 20, title, { fs: 17, b: true, c: after ? 'red' : 'grn' });
    s += R(x0, 38, 230, 60, { c: 'tea', r: 10 }) + T(x0 + 14, 64, 'nginx.conf', { fs: 16, b: true, mono: true }) + T(x0 + 14, 86, 'TÊN trong thư mục máy', { fs: 13, c: 'mu' });
    s += R(x0, 176, 230, 60, { c: 'dk', r: 10 }) + T(x0 + 14, 202, 'container', { fs: 16, b: true }) + T(x0 + 14, 224, '/etc/nginx/nginx.conf', { fs: 13, mono: true, c: 'mu' });
    s += R(x0 + 320, 38, 210, 72, { c: after ? 'red' : 'grn', r: 10, dash: after, fill: after ? 'rgba(255,92,108,.07)' : '#111a2b' }) +
      T(x0 + 334, 64, 'inode 20266', { fs: 15.5, b: true, mono: true }) + T(x0 + 334, 90, after ? '"phien ban 1" (bản cũ)' : '"phien ban 1"', { fs: 13.5, c: 'mu' });
    if (after) {
      s += R(x0 + 320, 170, 210, 72, { c: 'grn', r: 10 }) + T(x0 + 334, 196, 'inode 20269', { fs: 15.5, b: true, mono: true }) + T(x0 + 334, 222, '"phien ban 2" (sed viết)', { fs: 13.5, c: 'mu' });
      s += A(x0 + 232, 72, x0 + 316, 190, { c: 'grn' }) + A(x0 + 232, 200, x0 + 316, 86, { c: 'red' });
      s += T(x0 + 265, 270, 'tên trỏ sang inode MỚI · container vẫn cầm inode CŨ', { fs: 14, a: 'middle', c: 'red', b: true });
    } else {
      s += A(x0 + 232, 68, x0 + 316, 68, { c: 'grn' }) + A(x0 + 232, 200, x0 + 316, 92, { c: 'grn' });
      s += T(x0 + 265, 270, 'docker run -v: nhân gắn đúng INODE lúc khởi động', { fs: 14, a: 'middle', c: 'grn', b: true });
    }
    return s;
  };
  return sv(1150, 280, stage(0, 'TRƯỚC — cả hai cùng chỉ một inode', false) + `<line x1="572" y1="10" x2="572" y2="276" stroke="${D.bd}" stroke-width="2" stroke-dasharray="4 6"/>` +
    stage(610, 'SAU sed -i (ghi file tạm rồi ĐỔI TÊN)', true));
};

/* ───────────── Slide 24 — mẫu container phụ ───────────── */
const helper = () => diagram({ w: 1160, h: 250, nodes: [
  { id: 'v', x: 0, y: 20, w: 260, h: 88, t: 'volume pgdata', d: 'dữ liệu cần sao lưu', c: 'vio' },
  { id: 'c', x: 450, y: 20, w: 260, h: 88, t: 'alpine (--rm)', d: 'tar -C /from -czf /to/x.tgz .\nchạy xong tự xoá', c: 'dk' },
  { id: 'h', x: 900, y: 20, w: 260, h: 88, t: 'thư mục máy "$PWD"', d: 'nơi file .tgz rơi xuống', c: 'tea' },
  { id: 'v2', x: 0, y: 160, w: 260, h: 80, t: 'volume pgdata3', d: 'volume MỚI để thử khôi phục', c: 'grn' },
  { id: 'c2', x: 450, y: 160, w: 260, h: 80, t: 'alpine (--rm)', d: 'tar -C /to -xzf /from/x.tgz', c: 'dk' },
], edges: [
  { from: 'v', to: 'c', t: '-v pgdata:/from:ro', c: 'vio' },
  { from: 'c', to: 'h', t: '-v "$PWD:/to"', c: 'tea' },
  { from: 'h', to: 'c2', t: '-v "$PWD:/from:ro"', c: 'tea', fs: 'b', ts: 'r' },
  { from: 'c2', to: 'v2', t: '-v pgdata3:/to', c: 'grn' },
] });

export const slides = S([
  cover({ t: 'Chương 7 — Dữ liệu: volume, bind mount, tmpfs', sub: 'Vì sao container quên · volume đào sâu · bind mount và bốn cái bẫy · tmpfs, gốc chỉ-đọc, bí mật · sao lưu, khôi phục, di chuyển', chap: 'CHƯƠNG 7' }),

  { t: 'Bản đồ chương: dữ liệu phải sống ở ĐÂU', body: mindmap('Dữ liệu sống sót', 'container vứt được — dữ liệu thì không', [
    { t: '7.1 Ba cách gắn', d: 'volume · bind · tmpfs — và luật gắn đè thư mục có sẵn', c: 'dk' },
    { t: '7.2 Volume đào sâu', d: 'nằm ở đâu, nhãn, dangling, prune chỉ xoá vô danh', c: 'vio' },
    { t: '7.3 Bind mount', d: 'node_modules biến mất, file root, SELinux, file đơn theo inode, Mac chậm', c: 'tea' },
    { t: '7.4 tmpfs &amp; bí mật', d: 'RAM có trần, --read-only, env lộ trong inspect', c: 'amb' },
    { t: '7.5 Sao lưu', d: 'tar vs pg_dump, khôi phục rồi ĐẾM, chuyển máy', c: 'grn' },
  ]) },

  /* ───────────── 7.1 ───────────── */
  { t: 'Ba kiểu gắn = ba chỗ lưu khác nhau trên máy chủ', body: `${hub()}` },

  { t: 'Container quên: file ở tầng ghi chết theo docker rm', body: two(
    term(['$ docker run --name forgetful -d alpine:3.20 sleep 300', '$ docker exec forgetful sh -c \\', '    \'echo "important" > /data.txt; cat /data.txt\'', 'important', '$ docker rm -f forgetful', '$ docker run --rm alpine:3.20 cat /data.txt', "! cat: can't open '/data.txt': No such file or directory"], { title: 'output thật — máy Mac', fs: 16 }),
    `${table(['Việc bạn làm', 'Tầng ghi', 'Volume có tên'], [
      ['<code>stop</code> · <code>restart</code>', '+còn', '+còn'],
      ['<code>rm</code> · <code>compose down</code>', '-mất', '+còn'],
      ['Deploy ảnh mới', '-mất', '+còn'],
      ['<code>compose down -v</code>', '-mất', '-MẤT'],
    ], { sm: true })}
    ${box('info', 'Không có gì mất “do lỗi”. Container mới từ cùng ảnh luôn bắt đầu từ các tầng ảnh <b>sạch</b>.')}`, 'l') },

  { t: 'Đọc -v theo hình dạng BÊN TRÁI dấu hai chấm', body: two(
    `${table(['Bạn gõ', 'Bạn được'], [
      ['<code>-v pgdata:/data</code>', 'Volume CÓ TÊN (không có /)'],
      ['<code>-v "$PWD/src:/app"</code>', 'Bind mount (bắt đầu bằng / ./ ~)'],
      ['<code>-v /data</code>', '!Volume VÔ DANH (tên ngẫu nhiên)'],
      ['<code>…:/app:ro</code>', 'Chỉ đọc'],
      ['<code>--mount type=bind,src=…,dst=…</code>', 'Như trên, nhưng BÁO LỖI thay vì đoán'],
    ], { sm: true })}`,
    `${term(['# gõ nhầm: file app.conf chưa có trên máy', '$ docker run --rm -v "$PWD/khong-co/app.conf:/etc/app.conf" \\', '    alpine:3.20 ls -la /etc/app.conf', 'drwxr-xr-x    2 root     root     64 …  .', '$ ls -la khong-co', '! drwxr-xr-x  2 admin  wheel  64 … app.conf     # THƯ MỤC!', '$ docker run --rm --mount type=bind,\\', '    src="$PWD/khong-co2/app.conf",dst=/etc/app.conf …', '= invalid mount config for type "bind": bind source', '= path does not exist: /host_mnt/…/khong-co2/app.conf'], { title: 'output thật — máy Mac' })}`, 'r') },

  { t: 'Volume RỖNG được chép nội dung ảnh — bind mount thì che', body: `
    ${copyVsHide()}
    ${two(
    term(['$ docker run --rm -v etc:/etc/nginx nginx:1.27-alpine \\', '    ls /etc/nginx | wc -l', '8', '$ docker run --rm -v "$PWD/rong:/etc/nginx" nginx:1.27-alpine \\', '    ls -A /etc/nginx | wc -l', '! 0', '$ docker run --rm -v own:/var/lib/postgresql/data \\', '    --entrypoint ls postgres:16-alpine -ld /var/lib/postgresql/data', '+ drwxrwxrwt 2 postgres postgres 4096 … /var/lib/postgresql/data'], { title: 'output thật — máy Mac', fs: 14 }),
    box('tip', 'Luật chính xác (docs + đo thật): chép khi volume <b>RỖNG</b> lúc gắn — kể cả volume cũ đã bị dọn trống. Tắt bằng <code>volume-nocopy</code>. Ảnh postgres có thư mục data RỖNG: cái được chép chỉ là <b>chủ sở hữu</b>; <code>initdb</code> là việc của entrypoint.'), 'l')}` },

  { t: 'Đặt tên volume: volume vô danh = dữ liệu mồ côi', body: two(
    term(['$ docker volume create uploads', '$ docker run -d --name a1 -v uploads:/uploads alpine:3.20 \\', '    sleep 600', '$ docker run -d --name a2 -v /uploads alpine:3.20 sleep 600', '$ docker volume ls', 'DRIVER    VOLUME NAME', 'local     uploads', '! local     8c41b8e25248ff212ac9a8827809bec79608a66ab7da2e5a8915caacc3ccacd7', '$ docker volume inspect 8c41b8e2… --format \'{{json .Labels}}\'', '{"com.docker.volume.anonymous":""}', '$ docker rm -f -v a2        # -v: xoá luôn volume VÔ DANH của a2', '$ docker rm -f a1           # volume uploads: vẫn còn'], { title: 'output thật — máy Mac' }),
    cards([
      { ic: '🏷️', t: 'Có tên', d: 'Tìm lại được sau 6 tháng, gắn lại có chủ đích, sao lưu theo tên.', c: 'grn' },
      { ic: '❓', t: 'Vô danh', d: 'Sinh ra từ <code>-v /đường</code> hoặc dòng <code>VOLUME</code> trong ảnh. Vẫn giữ dữ liệu — nhưng không ai nhớ nó là của ai.', c: 'red' },
      { ic: '🧹', t: 'Ai dọn vô danh', d: '<code>docker rm -v</code>, <code>run --rm</code>, <code>volume prune</code>. Có tên thì chỉ khi bạn gọi đích danh.', c: 'amb' },
    ], 1), 'l') },

  /* ───────────── 7.2 ───────────── */
  { t: 'Volume chỉ là một thư mục — trên Mac nó nằm trong máy ảo', body: two(
    `${term(['$ docker volume create --label app=blog --label env=prod blog-uploads', '$ docker volume inspect -f \'{{ .Mountpoint }}\' blog-uploads', '/var/lib/docker/volumes/blog-uploads/_data', '$ ls /var/lib/docker/volumes', '! ls: /var/lib/docker/volumes: No such file or directory'], { title: 'máy Mac — đường dẫn nằm trong máy ảo Linux' })}
    ${term(['$ ls -la /var/lib/docker/volumes/blog-uploads/_data', "! ls: cannot access '…/_data': Permission denied", '$ docker run --rm -v /var/lib/docker/volumes/blog-uploads:/v:ro \\', '    alpine ls -la /v/_data', '-rw-r--r--    1 root     root      3 … a.txt'], { title: 'máy Linux — không sudo vẫn đọc được qua docker' })}`,
    `${box('warn', '<b>Đọc</b> thư mục đó để chẩn đoán thì được. <b>Ghi</b> thì đi qua một container (Bài 7.5): quyền, nhãn SELinux, và trên Mac/Windows đường dẫn còn không có trên máy bạn.')}
    ${box('bad', 'Dòng thứ hai bên trái cho thấy một điều quan trọng: ai chạy được <code>docker</code> là đọc được mọi thứ của root. Nhóm <code>docker</code> = quyền root (Bài 6.4).')}`, 'l2') },

  { t: 'Nhãn giúp bạn tìm lại — dangling KHÔNG có nghĩa là rác', body: two(
    term(['$ docker volume ls --filter label=env=prod', 'DRIVER    VOLUME NAME', 'local     blog-uploads', 'local     pg-data', '$ docker volume ls --filter dangling=true --format \'{{.Name}}\'', '+ blog-uploads', 'uploads', 'f23d3ceff2ace768139dfc44171513c7676a5e86c4d7f44fbb5d37c9c6788f1b', '$ docker volume ls --filter label=dkhoc=07 --format \'table {{.Name}}\\t{{.Labels}}\'', 'VOLUME NAME     LABELS', 'blog-uploads    app=blog,dkhoc=07,env=prod', 'pg-data         app=blog,dkhoc=07,env=prod', 'f23d3ceff2ac…   com.docker.volume.anonymous=,dkhoc=07'], { title: 'output thật — máy Mac (đã lọc chỉ volume của bài)' }),
    `${table(['dangling=true nghĩa là', 'KHÔNG có nghĩa là'], [
      ['Lúc này không container nào (kể cả đã dừng) tham chiếu', 'Không ai cần nữa'],
      ['Volume của một container vừa <code>rm</code> để dựng lại', '-Xoá được'],
    ], { sm: true })}
    ${box('tip', 'Compose tự gắn nhãn <code>com.docker.compose.project</code>, nên <code>compose down -v</code> chỉ xoá đúng volume của dự án đó.')}`, 'l') },

  { t: 'docker volume prune chỉ xoá volume VÔ DANH (từ Docker 23)', body: two(
    term(['$ docker volume prune --filter label=dkhoc=07', 'WARNING! This will remove anonymous local volumes not', 'used by at least one container.', 'Are you sure you want to continue? [y/N] y', 'Deleted Volumes:', 'f23d3ceff2ace768139dfc44171513c7676a5e86c4d7f44fbb5d37c9c6788f1b', 'Total reclaimed space: 0B', '$ docker volume ls --filter label=dkhoc=07 --format \'{{.Name}}\'', '+ blog-uploads         # có tên + dangling: VẪN CÒN', '+ pg-data', '+ uploads', '$ docker volume prune -a --filter label=dkhoc=07', '! WARNING! This will remove all local volumes not used by…'], { title: 'output thật — máy Mac (luôn kèm --filter khi thử)' }),
    table(['Lệnh', 'Xoá gì'], [
      ['<code>docker volume rm uploads</code>', 'Đúng một cái; <b>từ chối</b> nếu còn container giữ'],
      ['<code>docker volume prune</code>', 'Volume VÔ DANH không ai dùng'],
      ['!<code>docker volume prune -a</code>', 'MỌI volume không ai dùng — kể cả có tên'],
      ['<code>docker rm -v web</code>', 'Container + volume vô danh của nó'],
      ['-<code>docker compose down -v</code>', 'Volume khai trong file compose — cả CSDL dev'],
    ], { sm: true }), 'l') },

  { t: 'Chia sẻ một volume: một bên ghi, bên kia đọc :ro', body: `
    ${diagram({ w: 1160, h: 150, nodes: [
      { id: 'w', x: 10, y: 30, w: 300, h: 84, t: 'writer', d: 'date >> /data/log.txt mỗi 2 s', c: 'amb' },
      { id: 'v', x: 430, y: 30, w: 300, h: 84, t: 'volume shared', d: 'một thư mục, hai container', c: 'vio' },
      { id: 'r', x: 850, y: 30, w: 300, h: 84, t: 'reader', d: '-v shared:/data:ro', c: 'grn' },
    ], edges: [{ from: 'w', to: 'v', t: 'đọc-ghi', c: 'amb' }, { from: 'v', to: 'r', t: 'chỉ đọc', c: 'grn' }] })}
    ${two(
    term(['$ docker run -d --name writer -v shared:/data alpine:3.20 \\', "    sh -c 'while true; do date >> /data/log.txt; sleep 2; done'", '$ docker run --rm -v shared:/data:ro alpine:3.20 \\', "    sh -c 'sleep 5; tail -2 /data/log.txt'", 'Wed Sep 23 18:21:31 UTC 2026', 'Wed Sep 23 18:21:33 UTC 2026', '$ docker run --rm -v shared:/data:ro alpine:3.20 touch /data/nope', '! touch: /data/nope: Read-only file system'], { title: 'output thật — máy Mac' }),
    box('warn', 'Docker <b>không thêm khoá</b> nào. Hai tiến trình cùng ghi một file = hành vi của hệ thống file. Log ghi nối thì ổn; <b>hai Postgres trên một thư mục data thì hỏng</b>.'), 'l2')}` },

  { t: 'Đĩa đầy? system df -v chỉ ra volume 0 LINKS', body: two(
    term(['$ docker system df', 'TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE', 'Images          90        19        42.97GB   30.29GB (70%)', 'Containers      34        7         882.5MB   553.7MB (62%)', 'Local Volumes   71        24        14.38GB   4.051GB (28%)', 'Build Cache     579       1         39.27GB   21.09GB', '$ docker system df -v', '…', 'VOLUME NAME                 LINKS     SIZE', 'pg-data                     1         50.33MB', '! d6ca5185fd050830fdb7…      0         1.765GB', '…', '$ docker volume rm pg-data', '! Error response from daemon: remove pg-data: volume is in use - [9caba9dd…]', '$ docker ps -a --filter volume=pg-data --format \'{{.Names}}\'', 'holder'], { title: 'output thật — máy Mac của khoá (đã rút gọn)' }),
    steps([
      ['<b>0 LINKS</b> + tên 64 ký tự hex', 'ứng viên rác — nhưng chưa chắc'],
      ['Tra ngày tạo, nhãn, gắn thử để xem bên trong', '<code>docker run --rm -v &lt;tên&gt;:/d:ro alpine ls /d</code>'],
      ['Chắc rồi mới xoá THEO TÊN', '<code>docker volume rm &lt;tên&gt;</code>'],
    ]), 'l') },

  /* ───────────── 7.3 ───────────── */
  { t: 'Bind mount: sửa trên máy, container thấy ngay — không build lại', body: two(
    term(['$ docker run -d --name dev -p 18070:3000 \\', '    -v "$PWD:/app" -v /app/node_modules app-dev', '$ curl -s localhost:18070', 'xin chao v3 — sua tren Mac', '$ echo \'// lan 3\' >> server.js        # sửa TRÊN MÁY', '$ docker logs dev | tail -2', "+ Restarting 'server.js'", 'nghe o cong 3000'], { title: 'output thật — máy Mac, node --watch' }),
    `${steps([
      ['Mã nguồn nằm trên máy bạn', 'VS Code sửa như thường'],
      ['<code>-v "$PWD:/app"</code> cho container nhìn thẳng vào đó', 'không chép, không build lại ảnh'],
      ['Trình theo dõi file (nodemon, <code>node --watch</code>, next dev) tự chạy lại', 'nhờ sự kiện inotify đi qua phép gắn'],
    ])}
    ${box('warn', 'Trên Windows chỉ có inotify khi mã nằm <b>trong</b> WSL2 (<code>~/project</code>), không phải <code>/mnt/c/…</code> — theo tài liệu Docker Desktop.')}`, 'l') },

  { t: 'Bẫy 1: bind che node_modules — volume gắn SÂU hơn cứu nó', body: two(
    `${layers({ w: 520, cap: 'áp theo độ sâu đường dẫn: sâu hơn nằm TRÊN', rows: [
      { t: 'ẢNH: <code>/app</code> có <code>node_modules</code> (67 gói)', c: 'dim', k: 'ẢNH' },
      { t: '<code>-v "$PWD:/app"</code> — thư mục máy, KHÔNG có node_modules', c: 'tea', k: 'BIND' },
      { t: '<code>-v /app/node_modules</code> — volume vô danh, được chép 67 gói', mnt: true, k: 'VOLUME' },
    ] })}
    ${yaml([['services:', ''], ['  web:', ''], ['    volumes:', ''], ['      - .:/app', 'mã nguồn, sửa sống'], ['      - /app/node_modules', 'giữ bản của ẢNH']], { fs: 15 })}`,
    term(['$ docker run --rm app-dev ls node_modules | wc -l', '67', '$ docker run --rm -v "$PWD:/app" app-dev ls /app/node_modules', '! ls: /app/node_modules: No such file or directory', '$ docker run --rm -v "$PWD:/app" app-dev', "! Error: Cannot find module 'express'", '$ docker run --rm -v "$PWD:/app" -v /app/node_modules \\', '    app-dev ls /app/node_modules | wc -l', '= 67', '$ ls -la node_modules    # Docker tạo sẵn chỗ gắn trên máy', 'drwxr-xr-x  2 admin  wheel  64 … .'], { title: 'output thật — máy Mac' }), 'r') },

  { t: 'Bẫy 2 &amp; 3: file thuộc root trên Linux, và SELinux', body: two(
    `${term(['$ docker run --rm -v "$PWD/out:/out" alpine \\', '    sh -c "mkdir -p /out/build && echo hi > /out/build/app.js"', '$ ls -la out/build', '…', '! -rw-r--r--. 1 root root 3 … app.js', '$ echo sua >> out/build/app.js', '! zsh:4: permission denied: out/build/app.js', '$ docker run --rm -u "$(id -u):$(id -g)" -v "$PWD/out:/out" \\', '    alpine sh -c "echo hi > /out/mine.txt; id"', '= uid=1000 gid=1000 groups=1000'], { title: 'máy Linux' })}
    ${term(['$ docker run --rm -v "$PWD/out:/out" alpine:3.20 \\', "    sh -c 'echo hi > /out/made-in-container.txt; ls -ln /out'", '-rw-r--r--  1 0  0  3 … made-in-container.txt', '$ ls -la out/', '…', '+ -rw-r--r--  1 admin  wheel  3 … made-in-container.txt'], { title: 'máy Mac — Docker Desktop đổi chủ sở hữu hộ bạn' })}`,
    `${term(['$ getenforce', 'Enforcing', '$ docker info --format \'{{.SecurityOptions}}\'', '[name=seccomp,profile=builtin name=cgroupns]', '$ docker run --rm -v "$PWD/conf:/etc/app" alpine \\', '    cat /etc/app/app.conf', '= listen = 0.0.0.0:8080'], { title: 'máy Linux Fedora 44 — Docker CE' })}
    ${box('info', 'Docker CE mặc định <b>không bật</b> SELinux cho container ⇒ không bị chặn, và <code>:z</code> không làm gì. Lỗi <i>Permission denied</i> xuất hiện trên RHEL/CentOS có <code>--selinux-enabled</code> hoặc Podman: khi đó dùng <code>:z</code>, <b>đừng</b> <code>:Z</code> vào <code>$HOME</code>.')}`, 'l') },

  { t: 'Bẫy 4 (sự cố thật): gắn MỘT FILE là gắn theo INODE', body: `
    ${inode()}
    ${term(['$ docker run -d --name ngx -p 18071:80 -v "$PWD/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:1.27-alpine', '$ ls -i nginx.conf; sed -i "s/phien ban 1/phien ban 2/" nginx.conf; ls -i nginx.conf', '20266 nginx.conf', '20269 nginx.conf', '$ docker exec ngx nginx -s reload; curl -s localhost:18071', '… [notice] 37#37: signal process started', '! phien ban 1                 # reload "thành công" — vẫn cấu hình CŨ'], { title: 'output thật — máy Linux (y hệt sự cố nginx của dự án sinh viên)' })}` },

  { t: 'Sửa file đã gắn đơn lẻ: cái nào container THẤY', body: two(
    table(['Cách sửa trên máy', 'Inode', 'Linux', 'Mac (VirtioFS)'], [
      ['<code>sed -i</code>', 'ĐỔI', '-thấy bản CŨ', '-No such file'],
      ['<code>mv file.moi file</code>', 'ĐỔI', '-thấy bản CŨ', '-No such file'],
      ['<code>cat moi &gt; file</code>', 'giữ', '+thấy (sau reload)', '+thấy (sau reload)'],
      ['vim 9.2 <code>:w</code> (đo)', 'giữ', '+thấy', '(không đo)'],
      ['Gắn cả THƯ MỤC + <code>sed -i</code>', 'đổi', '+thấy', '+thấy'],
      ['<code>node --watch</code> sau <code>sed -i</code>', 'đổi', '!chạy lại 1 lần rồi điếc', '!không chạy lại nữa'],
    ], { sm: true }),
    `${box('good', '<b>Cách chữa bền:</b> gắn THƯ MỤC (<code>./nginx:/etc/nginx/conf.d:ro</code>), không gắn file đơn.')}
    ${box('tip', '<b>Buộc phải gắn file đơn?</b> Ghi đè tại chỗ <code>cat moi &gt; file</code>, rồi kiểm từ BÊN TRONG: <code>docker exec ngx sha256sum /etc/nginx/nginx.conf</code> phải khớp <code>sha256sum nginx.conf</code>.')}
    ${box('warn', 'Đã lỡ <code>sed -i</code>: ghi đè lại cũng vô ích — container giữ inode cũ tới khi <b>restart</b>.')}`, 'l') },

  { t: 'Bind mount trên Mac chậm ~12 lần — trên Linux thì như nhau', body: two(
    bars([
      { l: 'Mac · bind (VirtioFS)', sub: 'ghi 1273 · stat 149 · đọc 396 · xoá 422', v: 2240, txt: '2 240 ms', c: 'red' },
      { l: 'Mac · volume', sub: 'nằm trong máy ảo', v: 184, txt: '184 ms', c: 'grn' },
      { l: 'Linux · bind', sub: 'btrfs, cùng nhân', v: 104, txt: '104 ms', c: 'grn' },
      { l: 'Linux · volume', sub: '', v: 110, txt: '110 ms', c: 'grn' },
    ], { lw: 300, max: 2400 }),
    `${box('info', 'Phép đo: node trong <code>node:22-alpine</code> ghi, stat, đọc rồi xoá <b>2 000 file 4 KB</b>. Trung vị 3 lượt; bước ghi trên bind Mac dao động 830–2 081 ms.')}
    ${table(['Máy', 'Để mã ở đâu'], [
      ['Linux', 'Đâu cũng được — bind mount không tốn gì'],
      ['Mac', 'Mã: bind. <code>node_modules</code>, <code>.next</code>: volume'],
      ['Windows', 'Trong WSL2 (<code>~/project</code>), KHÔNG <code>/mnt/c</code>'],
    ], { sm: true })}`, 'l') },

  /* ───────────── 7.4 ───────────── */
  { t: 'tmpfs là RAM — không đặt size thì trần = nửa RAM máy', body: two(
    term(['$ docker run --rm --tmpfs /scratch:rw,size=64m,mode=1777 \\', '    alpine:3.20 df -h /scratch', 'tmpfs                    64.0M         0     64.0M   0% /scratch', '$ docker run --rm --tmpfs /scratch:size=8m alpine:3.20 \\', '    dd if=/dev/zero of=/scratch/big bs=1M count=16', "! dd: error writing '/scratch/big': No space left on device", '8+0 records out', '$ docker run --rm --tmpfs /scratch alpine:3.20 df -h /scratch', '! tmpfs                     3.9G         0      3.9G   0% /scratch', '$ docker run --rm alpine:3.20 df -h /dev/shm', 'shm                      64.0M         0     64.0M   0% /dev/shm'], { title: 'output thật — máy Mac (máy ảo 7,7 GiB RAM)' }),
    `${cards([
      { ic: '📏', t: 'Luôn đặt size=', d: 'Không đặt thì trần = nửa RAM của máy (ở đây 3,9G), không phải trần của container.', c: 'amb' },
      { ic: '🔁', t: 'restart cũng xoá', d: 'Đo thật: ghi file vào tmpfs, <code>docker restart</code> ⇒ thư mục rỗng.', c: 'red' },
      { ic: '🌐', t: '/dev/shm chỉ 64 MB', d: 'Chrome/Playwright hay chết vì nó. Sửa: <code>--shm-size=1g</code>.', c: 'blu' },
    ], 1)}`, 'l') },

  { t: 'tmpfs tính vào trần --memory: không đặt size ⇒ bị giết OOM', body: two(
    term(['$ docker run --name tmpoom --memory 128m --memory-swap 128m \\', '    --tmpfs /scratch alpine:3.20 sh -c \\', "    'dd if=/dev/zero of=/scratch/big bs=1M count=200; \\", '     echo "dd xong, exit=$?"; df -h /scratch | tail -1\'', '! Killed', '! dd xong, exit=137', 'tmpfs      3.9G    125.6M      3.8G   3% /scratch', '$ docker inspect -f \'OOMKilled={{.State.OOMKilled}}\' tmpoom', '! OOMKilled=true', '# thử lại với --tmpfs /scratch:size=64m:', "= dd: error writing '/scratch/big': No space left on device", '= shell van song'], { title: 'output thật — máy Mac' }),
    `${kpis([{ v: '125,6M', l: 'nằm lại trong RAM', c: 'red' }, { v: '137', l: 'dd bị SIGKILL', c: 'amb' }])}
    ${box('warn', 'File trong tmpfs là <b>trang bộ nhớ</b> của container. Không có swap để đẩy ra ⇒ nhân giết một tiến trình. Đặt <code>size</code> nhỏ hơn <code>--memory</code> để lỗi là “hết chỗ” thay vì “bị giết”.')}`, 'l') },

  { t: '--read-only: bật lên, để nó chết, đọc lỗi, khoét đúng lỗ', body: two(
    term(['$ docker run -d --name ro --read-only -p 18072:80 \\', '    nginx:1.27-alpine', '$ docker ps -a --filter name=ro \\', '    --format \'{{.Names}} {{.Status}}\'', '! ro Exited (1) 2 seconds ago', '$ docker logs ro | tail -1', '! nginx: [emerg] mkdir() "/var/cache/nginx/client_temp" failed', '!   (30: Read-only file system)', '$ docker run -d --name ro --read-only \\', '    --tmpfs /var/cache/nginx:size=32m --tmpfs /run:size=1m \\', '    -p 18072:80 nginx:1.27-alpine', "$ curl -s -o /dev/null -w '%{http_code}\\n' localhost:18072", '= 200', '$ docker exec ro touch /etc/nginx/x', '! touch: /etc/nginx/x: Read-only file system'], { title: 'output thật — máy Mac' }),
    steps([
      ['Bật <code>--read-only</code>', 'ứng dụng tự nói nó cần ghi vào đâu'],
      ['tmpfs cho đường dẫn phù du', '<code>/tmp</code>, <code>/run</code>, <code>/var/cache/nginx</code>'],
      ['Volume cho thứ phải giữ', 'upload, cache đáng giữ, CSDL'],
      ['Thử cả đường ghi lúc CHẠY', 'upload, ghi phiên, xoay log'],
    ]), 'l') },

  { t: 'Bí mật: biến môi trường hiện NGUYÊN trong docker inspect', body: two(
    `${table(['Cách', 'Ai đọc được'], [
      ['-❌ <code>ENV</code> / <code>COPY .env</code> trong ảnh', 'Mọi người kéo được ảnh — mãi mãi'],
      ['!⚠️ <code>-e KEY=…</code>', '<code>inspect</code>, lịch sử shell'],
      ['✅ <code>--env-file</code> quyền 600', '<code>inspect</code> (vẫn thấy!)'],
      ['+✅✅ File trên tmpfs / secret của compose', 'Chỉ tiến trình trong container'],
    ], { sm: true })}
    ${box('bad', 'Dán kết quả <code>docker inspect</code> vào khung chat = công bố mật khẩu CSDL. Bí mật lúc DỰNG: <code>RUN --mount=type=secret</code> (Bài 6.1), không bao giờ <code>ARG</code>.')}`,
    term(['$ docker run -d --name api -e DB_PASSWORD=matkhau-that-123 \\', '    alpine:3.20 sleep 600', '$ docker inspect -f \'{{json .Config.Env}}\' api', '! ["DB_PASSWORD=matkhau-that-123",', '"PATH=/usr/local/sbin:/usr/local/bin:…"]'], { title: 'output thật — máy Mac' }), 'r') },

  { t: 'docker cp vào tmpfs báo thành công — nhưng file rơi xuống ĐĨA', body: two(
    `${term(['$ docker run -d --name sec \\', '    --tmpfs /run/secrets:rw,size=1m,mode=0700 \\', '    alpine:3.20 sleep 600', '$ docker cp jwt.key sec:/run/secrets/jwt.key', '$ echo "cp exit=$?"', 'cp exit=0', '$ docker exec sec ls -la /run/secrets', 'total 4', 'drwx------  2 root  root    40 … .', '! drwxr-xr-x  1 root  root  4096 … ..      # tmpfs TRỐNG', '$ docker diff sec', 'C /run', 'A /run/secrets', '! A /run/secrets/jwt.key     # nằm ở TẦNG GHI, dưới tmpfs'], { title: 'output thật — Mac và Linux như nhau' })}`,
    `${term(['$ docker exec -i sec \\', '    sh -c \'cat > /run/secrets/jwt.key\' < jwt.key', '$ docker exec sec df -h /run/secrets | tail -1', '= tmpfs     1.0M      4.0K   1020.0K   0% /run/secrets', '$ docker diff sec', 'C /run', 'A /run/secrets              # không còn jwt.key trên đĩa'], { title: 'cách đúng: ghi QUA tiến trình trong container' })}
    ${box('info', 'Tài liệu <code>docker cp</code>: không chép được vào <b>tmpfs</b> và các mount tạo trong container. Nó chép vào tầng ghi — đúng chỗ bạn muốn tránh.')}`) },

  /* ───────────── 7.5 ───────────── */
  { t: 'Mẫu container phụ: volume :ro + thư mục máy + tar', body: `
    ${helper()}
    ${term(['$ docker run --rm -v pgdata:/from:ro -v "$PWD:/to" alpine:3.20 tar -C /from -czf /to/pgdata.tgz .', '… 5.096 total          # 158 MB dữ liệu ⇒ file 33M', '$ docker volume create pgdata3', '$ docker run --rm -v pgdata3:/to -v "$PWD:/from:ro" alpine:3.20 tar -C /to -xzf /from/pgdata.tgz', '… 1.467 total'], { title: 'output thật — máy Mac (Postgres ĐÃ DỪNG trước khi tar)' })}` },

  { t: 'tar thư mục data ≠ pg_dump — đo trên cùng 500 000 dòng', body: two(
    `${kpis([{ v: '0,49 s', l: 'pg_dump · 4,4 MB', c: 'grn' }, { v: '5,1 s', l: 'tar (đã dừng) · 33 MB', c: 'amb' }])}
    ${kpis([{ v: '0,72 s', l: 'pg_restore', c: 'grn' }, { v: '1,5 s', l: 'giải tar (+ khởi động)', c: 'amb' }])}
    <p style="font-size:14.5px;color:${D.mu};margin-top:6px">Bảng <code>don_hang</code> 500 000 dòng, volume 158 MB (dữ liệu + WAL), Mac M1, Postgres 16. Dump không chứa chỉ mục — dựng lại khi khôi phục.</p>`,
    table(['Cách', 'Khi Postgres đang chạy', 'Mang sang bản khác'], [
      ['<code>tar</code> thư mục data', '-Ảnh chụp RÁCH — cấm', '-Chỉ đúng bản chính (16 → 16)'],
      ['<code>tar</code> khi đã <code>stop</code>', '!Phải ngừng dịch vụ', '-Chỉ đúng bản chính'],
      ['<code>pg_dump -Fc</code>', '+An toàn — ảnh chụp giao dịch', '+Được: 16 arm64 → 18 amd64'],
      ['Snapshot LVM/ZFS/đám mây', '+Nếu nguyên tử', 'Tuỳ tầng lưu trữ'],
    ], { sm: true }), 'r') },

  { t: 'Khôi phục xong thì ĐẾM — 500 000 = 500 000 mới gọi là sao lưu', body: two(
    term(['$ docker exec pg pg_dump -U postgres -d postgres \\', '    --format=custom > db.dump', '$ docker run -d --name pg2 -e POSTGRES_PASSWORD=x \\', '    -v pgdata2:/var/lib/postgresql/data postgres:16-alpine', '$ docker exec pg2 createdb -U postgres khoi_phuc', '$ docker exec -i pg2 pg_restore -U postgres -d khoi_phuc \\', '    --no-owner < db.dump', '$ docker exec pg2 psql -U postgres -d khoi_phuc \\', '    -c "select count(*), sum(tong) from don_hang;"', '  count  |      sum', '= 500000 | 1250008591454', '# bản gốc trên pg: 500000 | 1250008591454'], { title: 'output thật — máy Mac' }),
    `${steps([
      ['Khôi phục vào chỗ MỚI', 'volume mới / CSDL nháp — không đè cái đang sống'],
      ['Đếm một bảng bạn biết', '<code>count(*)</code> + một tổng kiểm (<code>sum</code>)'],
      ['So với bản gốc', 'khớp ⇒ bản sao lưu có trạng thái TỐT'],
      ['Rồi mới tráo', 'dừng dịch vụ, trỏ sang volume đã kiểm'],
    ])}
    ${box('warn', 'Bản sao lưu chưa từng khôi phục có trạng thái <b>KHÔNG BIẾT</b>, không phải “chắc ổn”.')}`, 'l') },

  { t: 'docker exec -t làm hỏng bản dump nhị phân', body: two(
    term(['$ docker exec    pg pg_dump -U postgres -d postgres \\', '    --format=custom > db.dump', '$ docker exec -t pg pg_dump -U postgres -d postgres \\', '    --format=custom > db-tty.dump', '$ ls -l db.dump db-tty.dump | awk \'{print $5, $9}\'', '4610442 db.dump', '! 4631142 db-tty.dump        # dài hơn 20 700 byte', '$ docker exec -i pg pg_restore -l < db-tty.dump', '! pg_restore: error: could not read from input file: end of file'], { title: 'output thật — máy Mac' }),
    `${box('bad', '<code>-t</code> cấp một <b>terminal ảo</b>; terminal đổi mỗi <code>\\n</code> thành <code>\\r\\n</code>. Với văn bản thì khó thấy, với file nhị phân <code>-Fc</code> là hỏng — mà lệnh vẫn thoát 0.')}
    ${table(['Cờ', 'Dùng khi'], [
      ['(không cờ)', 'Lấy dữ liệu RA: <code>pg_dump &gt; file</code>'],
      ['<code>-i</code>', 'Đưa dữ liệu VÀO: <code>pg_restore &lt; file</code>'],
      ['<code>-it</code>', 'Chỉ khi NGƯỜI gõ: <code>psql</code>, <code>sh</code>'],
    ], { sm: true })}`, 'l') },

  { t: 'Chuyển volume sang máy khác: tar | ssh | tar, rồi so md5', body: two(
    term(['$ docker run --rm -v pgdata:/from:ro alpine:3.20 \\', '    tar -C /from -cf - . \\', "  | ssh linux-nha 'docker volume create pgdata >/dev/null; \\", "      docker run --rm -i -v pgdata:/to alpine tar -C /to -xf -'", '… 37.252 total', '# hai phía: 982 file; du 158.2M (Mac) vs 158.1M (Linux)', '$ … find . -type f -exec md5sum {} + | sort -k2 | md5sum', '= 7b020c506e90772aa07c6907ea816405  -      # Mac', '= 7b020c506e90772aa07c6907ea816405  -      # Linux', '# postgres:18 gắn đúng volume đó:', '! FATAL:  database files are incompatible with server', '! DETAIL:  … initialized by PostgreSQL version 16, which is', '!   not compatible with this version 18.6.'], { title: 'output thật — Mac (arm64) → máy Linux (amd64)' }),
    `${steps([
      ['Dừng thứ đang ghi', 'hoặc dùng pg_dump thay tar'],
      ['Chảy thẳng qua ssh', 'không cần chỗ trống cho file tạm'],
      ['Kiểm bằng số file + md5', '<code>du</code> lệch vì khác hệ thống file — đừng tin <code>du</code>'],
      ['Giữ volume nguồn thêm một tuần', 'đĩa rẻ hơn dữ liệu'],
    ])}
    ${box('good', 'Cùng bản dump đó <code>pg_restore</code> vào <b>Postgres 18.6 amd64</b>: 500000 dòng, khớp tổng.')}`, 'l') },

  { t: 'Script sao lưu hằng đêm: set -e + .part là thứ cứu bạn', body: two(
    yaml([
      ['set -Eeuo pipefail', 'lỗi ở đâu dừng ở đó'],
      ['docker exec pg pg_dump … -Fc \\', 'KHÔNG -t'],
      ['  > "$DEST/db-$STAMP.dump.part"', 'ghi ra .part trước'],
      ['mv "$DEST/db-$STAMP.dump.part" \\', 'đổi tên = nguyên tử'],
      ['   "$DEST/db-$STAMP.dump"', ''],
      ['find "$DEST" -name "*.dump" \\', ''],
      ['  -mtime +$KEEP -delete', 'chỉ xoá bản cũ, bỏ qua .part'],
      ['rclone copy "$DEST" r2:backups', 'RA KHỎI máy'],
    ], { fs: 15 }),
    `${term(['# tên container gõ sai — CÓ set -e:', '! Error response from daemon: …', '! … No such container: pg-sai', 'exit=1   # chỉ để lại .part; .dump cũ nguyên vẹn', '# cùng lỗi — KHÔNG set -e:', '! Error response from daemon: …', '! … No such container: pg-sai', '! 2026-09-24 01:35:22 · db-2026-09-24.dump   0B', 'exit=0   # file 0 byte mang tên bản thật'], { title: 'output thật — máy Mac' })}
    ${box('tip', 'Báo động khi <b>VẮNG</b> nhịp tim, không chỉ khi lỗi; và mỗi tháng khôi phục thử một lần.')}`, 'r') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 7', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Postgres rỗng sau <code>compose down</code> / deploy', 'Volume vô danh mới được gắn; cái cũ mồ côi', 'Đặt tên: <code>pgdata:/var/lib/postgresql/data</code>'],
    ['Có thư mục tên <code>app.conf</code> trên máy', '<code>-v</code> tự tạo đường dẫn không tồn tại', '<code>--mount type=bind</code> báo lỗi thay vì đoán'],
    ['<code>Cannot find module</code> khi gắn mã nguồn', 'Bind che <code>node_modules</code> của ảnh', 'Thêm <code>- /app/node_modules</code>'],
    ['Sửa <code>nginx.conf</code>, reload xanh, không đổi', 'Gắn file đơn theo inode; <code>sed -i</code>/<code>mv</code> đổi inode', 'Gắn thư mục, hoặc <code>cat &gt;</code> + kiểm sha256 bên trong'],
    ['Container bị giết khi ghi file tạm', 'tmpfs không trần ăn vào <code>--memory</code>', '<code>--tmpfs /tmp:size=64m</code>'],
    ['Bí mật nằm trên đĩa dù đã dùng tmpfs', '<code>docker cp</code> không chép được vào tmpfs', '<code>docker exec -i … cat &gt;</code>'],
    ['<code>pg_restore</code>: could not read from input file', 'Dump lấy bằng <code>docker exec -t</code>', 'Bỏ <code>-t</code> khi lấy dữ liệu ra'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 7', body: table(['Muốn…', 'Gõ'], [
    ['Volume có tên / chỉ đọc', '<code>-v pgdata:/var/lib/postgresql/data</code> · <code>-v cfg:/etc/app:ro</code>'],
    ['Bind mount không cho đoán', '<code>--mount type=bind,src="$PWD/src",dst=/app/src,ro</code>'],
    ['Container gắn những gì', '<code>docker inspect -f \'{{json .Mounts}}\' web</code>'],
    ['Volume ăn đĩa · ai đang giữ', '<code>docker system df -v</code> · <code>docker ps -a --filter volume=pgdata</code>'],
    ['Dọn vô danh (có lọc)', '<code>docker volume prune --filter label=…</code> (thêm <code>-a</code> = cả có tên)'],
    ['tmpfs có trần · gốc chỉ đọc', '<code>--tmpfs /tmp:size=64m</code> · <code>--read-only</code>'],
    ['Sao lưu / khôi phục volume', '<code>docker run --rm -v v:/from:ro -v "$PWD:/to" alpine tar -C /from -czf /to/v.tgz .</code>'],
    ['Dump / khôi phục Postgres', '<code>docker exec pg pg_dump -Fc … &gt; db.dump</code> · <code>docker exec -i pg pg_restore -d … &lt; db.dump</code>'],
    ['Chuyển volume sang máy khác', '<code>… tar -cf - . | ssh máy \'docker run --rm -i -v v:/to alpine tar -C /to -xf -\'</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 7 (45 phút)', body: `
    ${steps([
      ['Chứng minh volume sống qua <code>rm</code>, tầng ghi thì không', 'hai container, một file mỗi chỗ, <code>rm -f</code>, đọc lại'],
      ['Tái hiện <code>Cannot find module</code> rồi vá bằng volume sâu hơn', '<code>-v "$PWD:/app" -v /app/node_modules</code>'],
      ['Gắn một file cấu hình đơn, <code>sed -i</code> nó, thấy container đọc bản cũ', 'rồi chuyển sang gắn thư mục'],
      ['Chạy nginx <code>--read-only</code>, đọc lỗi, khoét đúng hai lỗ tmpfs', '<code>curl</code> phải ra 200'],
      ['Sao lưu Postgres bằng <code>pg_dump</code>, khôi phục vào container mới, ĐẾM', 'con số hai bên phải khớp'],
    ])}
    ${box('good', '<b>Đạt khi:</b> mỗi bước bạn dán được output chứng minh, và <code>docker ps -a</code> + <code>docker volume ls</code> không còn thứ gì mang tiền tố <code>thu-</code> sau khi dọn.')}` },
]);
