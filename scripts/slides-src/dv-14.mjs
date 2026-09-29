/**
 * Deploy lên VPS · Deck dv-14 — Chương 14 (MỚI): Nhiều môi trường, và vượt khỏi một máy chủ.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 29/09/2026:
 *  - Docker Desktop trên Mac M1: ảnh dv14-app (Python 3.12 alpine) chạy thành staging/production/preview, ảnh
 *    dv14-fe (nginx 1.27) cho chuyện cấu hình "nướng" vào ảnh, Postgres 16 (dv14-pgprod/pgstg), Redis 7 (dv14-redis);
 *  - "VPS thí nghiệm" = container ubuntu:24.04 có sshd (ảnh tự build dv14-img, mạng dv14-net 172.30.14.0/24):
 *    dv14-lb (nginx 1.24.0 + HAProxy 2.8.16, SSH 127.0.0.1:19142), dv14-vps1/2 (app Python, SSH 19143/19144),
 *    dv14-old/new (Postgres 16 + rsync, SSH 19140/19141), dv14-dns (bind9) + dv14-res (unbound);
 *  - độ trễ tới trung tâm dữ liệu: đo từ máy Fedora ở nhà (Việt Nam) bằng curl tới máy speedtest công khai của Hetzner;
 *  - giá: trang giá CHÍNH THỨC của từng hãng, đọc 29/09/2026.
 * Số đo trong container trên Mac (đĩa, mạng giữa hai container) là MINH HOẠ, không phải số của một VPS thật.
 * Hình tự vẽ (SVG): matMay() dòng thời gian tắt một máy (nginx vs HAProxy) · deployRelease() tách deploy khỏi phát hành.
 * Tô màu: sh() cho bash; conf() (chép từ dv-03/dv-12) cho nginx.conf/haproxy.cfg/zone; yaml() cho Dockerfile/k8s; code() cho SQL.
 */
import { S, cover, sh, yaml, term, mindmap, diagram, cards, box, table, vs, kpis, two, bars, code, sv, R, T, A, D, esc } from './_dv-chung.mjs';

export const deck = { key: 'dv-14', code: 'DEPLOY · CHƯƠNG 14', title: 'Nhiều môi trường, nhiều máy', sub: 'Deploy lên VPS · Chương 14' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}' +
  '.d-yml .c .nu{color:#b5cea8}.d-yml .c .sx{color:#c586c0}.d-yml .c .sec{color:#ff7b72;font-weight:700}' +
  '.l-sh .c .ty{color:#4ec9b0}svg{max-width:100%;height:auto}.c-code{font-size:14px;line-height:1.45}</style>';

/* ─────────── tô màu cấu hình: nginx.conf / haproxy.cfg / zone — cùng khung .d-yml với yaml() (chép từ dv-12) ─────────── */
const conf = (lines, { fs = 15, lang = 'nginx' } = {}) => {
  const hl = (raw) => {
    const ci = raw.search(/(^|\s)#/);
    let body = raw, tail = '';
    if (ci >= 0) { const at = raw[ci] === '#' ? ci : ci + 1; tail = `<span class="cm">${esc(raw.slice(at))}</span>`; body = raw.slice(0, at); }
    let m;
    if (lang === 'zone') {
      if ((m = body.match(/^(\S*)(\s+)(IN\s+)?([A-Z]+)(\s+)(.*)$/))) {
        return `<span class="k">${esc(m[1])}</span>${m[2]}${m[3] || ''}<span class="sx">${m[4]}</span>${m[5]}` +
          esc(m[6]).replace(/(\d+\.\d+\.\d+\.\d+)/g, '<span class="nu">$1</span>') + tail;
      }
      return esc(body).replace(/(\$TTL)/, '<span class="sx">$1</span>') + tail;
    }
    // nginx / haproxy: từ đầu dòng là chỉ thị
    if ((m = body.match(/^(\s*)([a-z_][a-z0-9_.-]*)(\s.*)?$/))) {
      const rest = esc(m[3] || '').replace(/("[^"]*")/g, '<span class="s">$1</span>')
        .replace(/(\d+\.\d+\.\d+\.\d+)(:\d+)?/g, '<span class="nu">$1$2</span>')
        .replace(/(\$[a-z_]+)/g, '<span class="sx">$1</span>')
        .replace(/\b(check|backup|down|always|off|on|roundrobin|leastconn|drain|ready)\b/g, '<span class="sx">$1</span>');
      return `${m[1]}<span class="k">${esc(m[2])}</span>${rest}${tail}`;
    }
    return esc(body) + tail;
  };
  return `<div class="d-yml" style="--fs:${fs}px">${lines.map((x) => {
    const [c, a] = Array.isArray(x) ? x : [x, ''];
    return `<div class="c">${hl(c) || ' '}</div><div class="a">${a ? esc(a) : ''}</div>`;
  }).join('')}</div>`;
};

/* ─────────── Deploy ≠ phát hành: mã lên máy lúc nào, người dùng thấy lúc nào ─────────── */
const deployRelease = () => {
  let s = '';
  const x0 = 200, W = 920;
  const X = (p) => x0 + p * W;
  s += T(0, 58, 'Không có cờ', { fs: 16, b: true, c: 'red' }) + T(0, 80, 'deploy = phát hành', { fs: 13.5, c: 'mu' });
  s += R(X(0), 38, X(0.3) - X(0), 48, { c: 'dim', r: 8, fill: 'rgba(255,255,255,.03)' }) + T(X(0.15), 68, 'bản cũ', { fs: 15, a: 'middle', c: 'mu' });
  s += R(X(0.3), 38, X(1) - X(0.3), 48, { c: 'red', r: 8, fill: 'rgba(248,81,73,.12)' }) + T(X(0.65), 68, '100% người dùng thấy tính năng mới NGAY lúc tráo', { fs: 15, a: 'middle', c: 'red', b: true });
  s += T(0, 168, 'Có cờ', { fs: 16, b: true, c: 'grn' }) + T(0, 190, 'deploy ≠ phát hành', { fs: 13.5, c: 'mu' });
  s += R(X(0), 148, X(0.3) - X(0), 48, { c: 'dim', r: 8, fill: 'rgba(255,255,255,.03)' }) + T(X(0.15), 178, 'bản cũ', { fs: 15, a: 'middle', c: 'mu' });
  const seg = [[0.3, 0.45, '0%', 'dv'], [0.45, 0.6, '10%', 'amb'], [0.6, 0.72, '50%', 'amb'], [0.72, 0.84, '100%', 'grn'], [0.84, 1, '0% (tắt!)', 'red']];
  seg.forEach(([a, b, t, c]) => { s += R(X(a), 148, X(b) - X(a), 48, { c, r: 8, fill: 'rgba(255,255,255,.04)' }) + T((X(a) + X(b)) / 2, 178, t, { fs: 15, a: 'middle', c, b: true, mono: true }); });
  s += `<path d="M${X(0.3)} 20 L${X(0.3)} 214" stroke="${D.amb}" stroke-width="2" stroke-dasharray="5 5"/>` + T(X(0.3) + 6, 16, 'deploy (tráo mã)', { fs: 13.5, c: 'amb', b: true });
  s += T(X(0.45), 232, 'SET flag 10', { fs: 13, a: 'middle', c: 'mu', mono: true }) + T(X(0.6), 232, 'SET flag 50', { fs: 13, a: 'middle', c: 'mu', mono: true });
  s += T(X(0.72), 232, 'SET flag 100', { fs: 13, a: 'middle', c: 'mu', mono: true }) + T(X(0.84), 232, 'SET flag 0', { fs: 13, a: 'middle', c: 'red', mono: true });
  s += T(0, 268, 'Mỗi nấc là một lệnh vào Redis, không build, không tráo, không restart — lỗi thì tắt trong một giây.', { fs: 15, c: 'amb', b: true });
  return sv(1150, 278, s);
};

/* ─────────── Tắt một máy giữa lúc có tải: số đo thật trên dv14-lb ─────────── */
const matMay = () => {
  let s = '';
  const x0 = 190, W = 940, t1 = 16;
  const X = (t) => x0 + (t / t1) * W;
  const row = (y, ten, sub, c) => { s += T(0, y + 26, ten, { fs: 16, b: true, c }) + T(0, y + 48, sub, { fs: 13, c: 'mu' }); };
  // nginx
  row(40, 'nginx upstream', 'kiểm THỤ ĐỘNG', 'dv');
  s += R(X(0), 40, X(t1) - X(0), 50, { c: 'grn', r: 6, sw: 1.2, fill: 'rgba(63,185,80,.10)' });
  s += R(X(3), 50, X(13) - X(3), 30, { c: 'red', r: 5, sw: 2, fill: 'rgba(248,81,73,.30)' });
  s += T(X(8), 71, '1 request treo 10 s (curl bỏ cuộc; nginx chờ tới 60 s)', { fs: 14, a: 'middle', c: '#fff', b: true });
  s += R(X(13), 50, X(15) - X(13), 30, { c: 'amb', r: 5, sw: 2, fill: 'rgba(210,153,34,.35)' });
  s += T(X(14), 71, '2 s', { fs: 14, a: 'middle', c: '#fff', b: true, mono: true });
  // haproxy
  row(150, 'HAProxy', 'kiểm CHỦ ĐỘNG mỗi 1 s', 'vio');
  s += R(X(0), 150, X(t1) - X(0), 50, { c: 'grn', r: 6, sw: 1.2, fill: 'rgba(63,185,80,.10)' });
  s += R(X(3.1), 160, X(5.1) - X(3.1), 30, { c: 'amb', r: 5, sw: 2, fill: 'rgba(210,153,34,.35)' }) + T(X(4.1), 181, '2 s', { fs: 14, a: 'middle', c: '#fff', b: true, mono: true });
  s += R(X(5.1), 160, X(7.1) - X(5.1), 30, { c: 'amb', r: 5, sw: 2, fill: 'rgba(210,153,34,.35)' }) + T(X(6.1), 181, '2 s', { fs: 14, a: 'middle', c: '#fff', b: true, mono: true });
  s += T(X(7.3), 228, 'vps2 DOWN → mọi request sang vps1', { fs: 13.5, c: 'grn', b: true });
  s += `<path d="M${X(10.4)} 146 L${X(10.4)} 204" stroke="${D.grn}" stroke-width="2.5"/>` + T(X(10.4) + 8, 181, 'UP lại (10,4 s)', { fs: 13.5, c: 'grn', b: true });
  // mốc rút mạng
  s += `<path d="M${X(3)} 22 L${X(3)} 212" stroke="${D.red}" stroke-width="2" stroke-dasharray="5 5"/>` + T(X(3) + 6, 18, 'rút mạng vps2', { fs: 13.5, c: 'red', b: true });
  s += `<path d="M${X(9)} 128 L${X(9)} 200" stroke="${D.grn}" stroke-width="2" stroke-dasharray="5 5"/>` + T(X(9) - 6, 124, 'cắm lại', { fs: 13.5, c: 'grn', b: true, a: 'end' });
  for (let t = 0; t <= 16; t += 2) s += T(X(t), 252, `${t} s`, { fs: 13, a: 'middle', c: 'dim', mono: true });
  return sv(1150, 262, s);
};

export const slides = S([
  cover({ t: 'Chương 14 — Nhiều môi trường, và vượt khỏi một máy chủ', sub: 'staging & preview · hai máy sau cân bằng tải · VPS, PaaS hay Kubernetes · chi phí và chuyển nhà', chap: 'CHƯƠNG 14' }),

  { t: 'Bản đồ chương: từ một máy ra nhiều nơi', body: mindmap('Nhiều nơi', 'môi trường · máy · nền tảng · hoá đơn', [
    { t: '14.1 Staging & preview', d: 'một ảnh · env khác · dữ liệu ẩn danh · cờ', c: 'dv' },
    { t: '14.2 Hai máy + LB', d: 'nginx/HAProxy · trạng thái ra ngoài · rolling', c: 'grn' },
    { t: '14.3 Chọn nền tảng', d: 'VPS · PaaS · serverless · Kubernetes', c: 'vio' },
    { t: '14.4 Chi phí & chuyển nhà', d: 'chọn máy · đo · dump/rsync · TTL', c: 'amb' },
    { t: 'Đã học', d: 'Ch3 tráo · Ch4 cấu hình · Ch12 TTL', c: 'blu' },
    { t: 'Ch15 tiếp theo', d: 'dự án trọn từ đầu tới cuối', c: 'pnk' },
  ]) },

  /* ───────────── 14.1 ───────────── */
  { t: 'Một ảnh, nhiều môi trường: chỉ env khác', body: diagram({
    w: 1150, h: 230,
    nodes: [
      { id: 'b', x: 0, y: 70, w: 230, h: 90, t: 'build MỘT lần', d: 'dv14-app:a1b2c3d', c: 'vio', mono: true },
      { id: 's', x: 400, y: 0, w: 330, h: 90, t: 'staging', d: 'staging.env: DB giả, cờ 100%', c: 'amb', mono: true },
      { id: 'p', x: 400, y: 140, w: 330, h: 90, t: 'production', d: 'production.env: DB thật, cờ 0%', c: 'grn', mono: true },
      { id: 'k', x: 880, y: 70, w: 270, h: 90, t: 'cùng sha256', d: 'đã kiểm = sẽ chạy', c: 'dv' },
    ],
    edges: [
      { from: 'b', to: 's', t: '--env-file', c: 'amb', off: 8 },
      { from: 'b', to: 'p', t: '--env-file', c: 'grn', off: 8 },
      { from: 's', to: 'k', c: 'dim', dash: true },
      { from: 'p', to: 'k', c: 'dim', dash: true },
    ],
  }) + term([
    '$ docker inspect -f "{{.Name}}  {{.Image}}" dv14-staging dv14-production',
    '/dv14-staging  sha256:20097786e6d6448aa1575bc2930b92ce63c8a05a9adedcb8e3edd840f19c33cf',
    '/dv14-production  sha256:20097786e6d6448aa1575bc2930b92ce63c8a05a9adedcb8e3edd840f19c33cf',
    '$ curl -s 127.0.0.1:19146/ ; curl -s 127.0.0.1:19147/',
    '= {"may": "4f4a754676c4", "ban": "a1b2c3d", "env": "staging", "db": "dv14-pgstg:5432/datlich_stg"}',
    '= {"may": "3cd6cb0c39c6", "ban": "a1b2c3d", "env": "production", "db": "dv14-pgprod:5432/datlich"}',
  ], { title: 'Mac — Docker Desktop', fs: 13 }) },

  { t: 'Cấu hình nướng vào ảnh không đẩy tiếp được', body: two(
    `${yaml([
      ['FROM nginx:1.27-alpine', ''],
      ['ARG NEXT_PUBLIC_API_URL', 'đọc lúc BUILD'],
      ['RUN echo "<script>const API=\'${NEXT_PUBLIC_API_URL}\'</script>" \\', 'ghi CHẾT'],
      ['    > /usr/share/nginx/html/index.html', 'vào tệp tĩnh'],
    ], { lang: 'docker', fs: 11.5 })}
    ${term([
      '$ docker build --build-arg NEXT_PUBLIC_API_URL=https://api.staging.vidu.test \\',
      '    -t dv14-fe:a1b2c3d .',
      '# staging kiểm xong, "đẩy nguyên ảnh" lên production:',
      '$ docker run -d -e NEXT_PUBLIC_API_URL=https://api.vidu.test \\',
      '    -p 127.0.0.1:19148:80 dv14-fe:a1b2c3d',
      '$ curl -s 127.0.0.1:19148/',
      "! <script>const API='https://api.staging.vidu.test'</script>",
    ], { title: 'production gọi API của staging', fs: 11.5 })}`,
    `${sh([
      ['#!/bin/sh', '40-config.sh'],
      ['# chạy MỖI LẦN container khởi động', ''],
      ['echo "window.CONFIG={API:\'${API_URL:?thieu API_URL}\'}" \\', ''],
      ['  > /usr/share/nginx/html/config.js', 'thiếu biến ⇒ dừng'],
    ], { fs: 12 })}
    ${term([
      '$ curl -s 127.0.0.1:19148/config.js; curl -s 127.0.0.1:19149/config.js',
      "= window.CONFIG={API:'https://api.staging.vidu.test'}",
      "= window.CONFIG={API:'https://api.vidu.test'}",
      '$ docker run dv14-fe:b7e9f01        # quên API_URL',
      '! /docker-entrypoint.d/40-config.sh: line 3: API_URL: thieu API_URL',
      "$ docker inspect -f '{{.State.ExitCode}}' dv14-fe-thieu",
      '! 2',
    ], { title: 'bản sửa: đọc env lúc CHẠY', fs: 11.5 })}`) },

  { t: 'Staging dùng dữ liệu ẩn danh, không chép thô', body: term([
      '$ docker exec dv14-pgprod pg_dump -U app -Fc datlich > prod.dump',
      '$ docker exec -i dv14-pgstg pg_restore -U app -d datlich_stg --no-owner < prod.dump',
      '$ psql … -c "SELECT id, ho_ten, email, sdt, ngay_sinh, ghi_chu FROM benh_nhan ORDER BY id LIMIT 3"',
      '!   1 | Nguyễn Văn An  | an.nguyen@gmail.com | 0912345678 | 1990-03-14 | dị ứng penicillin',
      '!   2 | Trần Thị Bình  | binh.tran@yahoo.com | 0987654321 | 1985-11-02 | tái khám tim mạch',
      '$ psql … -f an-danh.sql',
      'UPDATE 5000',
      '=   1 | Bệnh nhân #1 | bn1@example.invalid | 0900000001 | 1990-01-01 | (đã xoá)',
      '=   2 | Bệnh nhân #2 | bn2@example.invalid | 0900000002 | 1985-01-01 | (đã xoá)',
      '$ psql … -c "SELECT count(*) FILTER (WHERE email NOT LIKE \'%@example.invalid\') AS con_that, count(*) AS tong …"',
      '=         0 | 5000',
    ], { title: 'Postgres 16 — dữ liệu mẫu 5 000 bệnh nhân, 20 000 lịch hẹn', fs: 12 }) + two(
    code(`UPDATE benh_nhan SET
  ho_ten    = 'Bệnh nhân #' || id,
  email     = 'bn' || id || '@example.invalid',
  sdt       = '0900' || lpad((id % 1000000)::text, 6, '0'),
  ngay_sinh = date_trunc('year', ngay_sinh)::date,
  ghi_chu   = CASE WHEN ghi_chu IS NULL THEN NULL ELSE '(đã xoá)' END;`, 'sql'),
    `${box('warn', 'Giữ <strong>id</strong> và khoá ngoại ⇒ 20 000 lịch hẹn vẫn nối đúng. Chỉ thay cột <strong>nhận ra được người</strong>.')}
    ${box('bad', '<code>prod.dump</code> vẫn là dữ liệu thật: ẩn danh <strong>trước khi</strong> rời máy production, xoá dump sau khi dùng.')}`, 'l') },

  { t: 'Preview theo PR: mỗi nhánh một địa chỉ', body: two(
    conf([
      ['server {', ''],
      ['    listen 80;', ''],
      ['    server_name ~^pr-(?<pr>\\d+)\\.preview\\.vidu\\.test$;', 'bắt số PR'],
      ['    resolver 127.0.0.11 valid=10s;', 'DNS của Docker'],
      ['    location / {', ''],
      ['        proxy_pass http://dv14-pr-$pr:8000;', 'container theo PR'],
      ['        proxy_set_header Host $host;', ''],
      ['    }', ''],
      ['}', ''],
    ], { fs: 13.5 }),
    `${term([
      "$ curl -s -H 'Host: pr-12.preview.vidu.test' 127.0.0.1:19145/",
      '= {"ban": "pr12-9c1e2aa", "env": "preview-pr-12", …}',
      "$ curl -s -H 'Host: pr-15.preview.vidu.test' 127.0.0.1:19145/",
      '= {"ban": "pr15-4d5e6f7", "env": "preview-pr-15", …}',
      "$ curl -s -H 'Host: pr-16.preview.vidu.test' 127.0.0.1:19145/",
      '! <head><title>502 Bad Gateway</title></head> …',
      '$ docker logs dv14-preview 2>&1 | grep error',
      '! … dv14-pr-16 could not be resolved (3: Host not found)',
    ], { title: 'một nginx, hai PR đang mở', fs: 12.5 })}
    ${box('tip', 'Cần bản ghi <code>*.preview.vidu.test</code> + chứng chỉ wildcard (DNS-01, Ch12). Đóng PR ⇒ <code>docker rm -f dv14-pr-N</code>, không thì máy đầy container mồ côi.')}`, 'l') },

  { t: 'Feature flag: deploy không còn là phát hành', body: deployRelease() + two(
    `${term([
      '$ docker exec dv14-redis redis-cli SET flag:new_checkout 10',
      'OK',
      '# 1000 người dùng khác nhau hỏi /checkout → bao nhiêu người thấy v2?',
      '= 90',
    ], { title: 'dv14-flag — app không restart lần nào', fs: 12.5 })}
    ${table(['SET flag', '0', '10', '50', '100', '0'], [['thấy v2 / 1000', '0', '90', '495', '1000', '0']], { sm: true, center: [1, 2, 3, 4, 5] })}`,
    `${sh([
      ['bucket = crc32(user) % 100', 'mỗi người một số 0–99, CỐ ĐỊNH'],
      ['v2 nếu bucket < phan_tram', '"cuong" = 69: thấy v2 từ nấc 70%'],
    ], { fs: 13, so: false })}
    ${box('warn', 'Cờ là <strong>nợ</strong>: phát hành xong 100% thì xoá cờ và nhánh <code>if</code> cũ trong một PR — cờ quên để lại một năm là hai phiên bản mã sống song song.')}`, 'l') },

  { t: 'Staging phải giống production ở đâu', body: table(['', 'GIỐNG production', 'KHÁC production (cố ý)'], [
    ['<strong>Mã</strong>', '+cùng ảnh, cùng sha256 — ảnh đã kiểm là ảnh sẽ chạy', 'phiên bản MỚI lên staging trước'],
    ['<strong>Phần mềm</strong>', '+cùng Postgres 16, Redis 7, nginx, cùng Ubuntu', '—'],
    ['<strong>Cấu hình</strong>', '+cùng TÊN biến, cùng cách nạp (env_file)', 'giá trị: URL, khoá, cờ'],
    ['<strong>Migration</strong>', '+chạy đúng lệnh sẽ chạy trên prod (Ch5)', '—'],
    ['<strong>Dữ liệu</strong>', 'hình dạng + khối lượng gần thật', '!ẩn danh — không email/sđt thật'],
    ['<strong>Bên thứ ba</strong>', '—', '!email/SMS/thanh toán ở chế độ SANDBOX'],
    ['<strong>Kích cỡ</strong>', '—', 'máy nhỏ hơn, có thể tắt ban đêm'],
    ['<strong>Ai vào được</strong>', '—', '-KHÔNG công khai: mật khẩu / IP / VPN'],
  ], { sm: true }) + two(
    box('info', '12-Factor (factor X, Dev/prod parity): giữ khoảng cách <strong>thời gian, người, công cụ</strong> giữa dev và prod nhỏ nhất có thể.'),
    box('bad', 'Staging lộ ra Internet không mật khẩu = một bản sao web của bạn cho Google index, và cho kẻ xấu dò lỗi trên bản <strong>chưa vá</strong>.')) },

  /* ───────────── 14.2 ───────────── */
  { t: 'Một máy là một điểm chết', body: diagram({
    w: 1150, h: 300,
    nodes: [
      { id: 'u', x: 0, y: 105, w: 150, h: 80, t: 'người dùng', d: 'vidu.test', c: 'dim' },
      { id: 'lb', x: 220, y: 90, w: 300, h: 110, t: 'dv14-lb', d: 'nginx :80 · HAProxy :81\nchia request, kiểm sức khoẻ', c: 'dv', mono: true },
      { id: 'v1', x: 590, y: 10, w: 310, h: 90, t: 'dv14-vps1', d: 'app :8000 (không trạng thái)', c: 'grn', mono: true },
      { id: 'v2', x: 590, y: 190, w: 310, h: 90, t: 'dv14-vps2', d: 'app :8000 (không trạng thái)', c: 'grn', mono: true },
      { id: 'r', x: 960, y: 10, w: 190, h: 90, t: 'Redis', d: 'phiên đăng nhập', c: 'red', mono: true },
      { id: 'd', x: 960, y: 190, w: 190, h: 90, t: 'Postgres', d: 'tách máy / managed', c: 'amb', mono: true },
    ],
    edges: [
      { from: 'u', to: 'lb', c: 'dim' },
      { from: 'lb', to: 'v1', c: 'grn' },
      { from: 'lb', to: 'v2', c: 'grn' },
      { from: 'v1', to: 'r', c: 'red', dash: true },
      { from: 'v2', to: 'd', c: 'amb', dash: true },
    ],
  }) + table(['Còn chết một điểm', 'Vì sao', 'Ai lo'], [
    ['bộ cân bằng tải', 'một máy nginx/HAProxy', 'LB của nhà cung cấp (trả thêm) hoặc hai LB + IP nổi'],
    ['cơ sở dữ liệu', 'một Postgres', 'managed DB có bản sao, hoặc tự dựng replica (khoá PostgreSQL)'],
  ], { sm: true }) },

  { t: 'nginx upstream: thiếu zone là chia lệch', body: two(
    conf([
      ['upstream app {', ''],
      ['    zone app 64k;', 'CHUNG mọi worker'],
      ['    server 172.30.14.101:8000 max_fails=1 fail_timeout=10s;', ''],
      ['    server 172.30.14.102:8000 max_fails=1 fail_timeout=10s;', ''],
      ['    keepalive 16;', 'giữ kết nối'],
      ['}', ''],
      ['server {', ''],
      ['    listen 80 default_server;', ''],
      ['    location / {', ''],
      ['        proxy_pass http://app;', ''],
      ['        proxy_http_version 1.1;', 'cần cho keepalive'],
      ['        proxy_set_header Connection "";', ''],
      ['        proxy_connect_timeout 2s;', 'im 2 s ⇒ bỏ'],
      ['        proxy_next_upstream error timeout;', 'thử máy kia'],
      ['        add_header X-Upstream $upstream_addr always;', ''],
      ['    }', ''],
      ['}', ''],
    ], { fs: 11.5 }),
    `${term([
      '$ nproc ; grep worker_processes /etc/nginx/nginx.conf',
      '10',
      'worker_processes auto;',
      '# upstream KHÔNG có zone — nginx vừa khởi động',
      '$ for i in $(seq 1 10); do curl -s localhost/; done | sort | uniq -c',
      '!      10 {"may": "dv14-vps1", …}',
      '# thêm "zone app 64k;", khởi động lại',
      '$ for i in $(seq 1 10); do curl -s localhost/; done | sort | uniq -c',
      '=       5 {"may": "dv14-vps1", …}',
      '=       5 {"may": "dv14-vps2", …}',
    ], { title: 'dv14-lb — nginx 1.24.0', fs: 11.5 })}
    ${box('info', 'Mười worker, mỗi worker tự đếm vòng từ máy ĐẦU. Mười kết nối mới rơi vào mười worker ⇒ cả mười về vps1. <code>zone</code> cho chúng chung một bộ đếm.')}`, 'r') },

  { t: 'Tắt một máy giữa lúc có tải', body: matMay() + two(
    term([
      '$ bash tai.sh 25 http://localhost/     # nginx :80',
      '3.0 200 0.000711 172.30.14.101:8000',
      '! 3.0 000 10.001892',
      '13.0 200 2.006872 172.30.14.102:8000, 172.30.14.101:8000',
      '# đếm: 485 × 200 · 1 × 000 (treo)',
    ], { title: 'dv14-lb — rút mạng dv14-vps2 ở giây 3', fs: 12.5 }),
    term([
      '$ bash tai.sh 14 http://localhost:81/  # HAProxy',
      '3.1 200 2.007538 vps1',
      '5.1 200 2.008790 vps1',
      '10.4 200 0.000728 vps2',
      '# đếm: 1527 × 200 · 0 lỗi',
    ], { title: 'cùng phép thử, qua HAProxy', fs: 12.5 }), 'l') },

  { t: 'HAProxy tự hỏi thăm từng máy mỗi giây', body: two(
    conf([
      ['defaults', ''],
      ['    mode http', ''],
      ['    timeout connect 2s', ''],
      ['    timeout server  5s', 'app im 5 s ⇒ 504, không treo 60 s'],
      ['    retries 2', ''],
      ['    option redispatch', 'thử lại ở máy KHÁC'],
      ['backend app', ''],
      ['    balance roundrobin', ''],
      ['    option httpchk GET /health', 'kiểm CHỦ ĐỘNG'],
      ['    http-check expect status 200', ''],
      ['    default-server inter 1s fall 2 rise 2', '2 lần hỏng = DOWN'],
      ['    server vps1 172.30.14.101:8000 check', ''],
      ['    server vps2 172.30.14.102:8000 check', ''],
    ], { fs: 13 }),
    `${term([
      '$ echo "show stat" | sudo socat stdio /run/haproxy.sock \\',
      '    | grep "^app," | cut -d, -f1,2,18,22,23,24,37',
      'app,vps1,UP,0,0,43,L7OK',
      '+ app,vps2,UP,2,1,24,L7OK',
      'app,BACKEND,UP,,0,43,',
      '# tên · trạng thái · chkfail · chkdown · lastchg · kiểm cuối',
    ], { title: 'dv14-lb — HAProxy 2.8.16', fs: 12.5 })}
    ${table(['', 'nginx (bản miễn phí)', 'HAProxy'], [
      ['phát hiện máy chết', 'khi request THẬT hỏng', '+tự hỏi <code>/health</code> mỗi 1 s'],
      ['rút một máy ra để deploy', 'sửa tệp + reload', '+<code>set server … state drain</code>'],
      ['xem trạng thái', 'log lỗi', '+<code>show stat</code>, trang stats'],
    ], { sm: true })}`, 'l') },

  { t: 'Trạng thái trong máy = đăng xuất ngẫu nhiên', body: two(
    term([
      '$ curl -s -c jar -X POST "localhost/login?u=cuong"',
      '{"dang_nhap": "cuong", "may": "dv14-vps1"}',
      '$ for i in 1 2 3 4 5 6; do curl -s -b jar localhost/me; done',
      '= {"user": "cuong", "may": "dv14-vps1"}',
      '! {"loi": "chua dang nhap", "may": "dv14-vps2"}',
      '= {"user": "cuong", "may": "dv14-vps1"}',
      '! {"loi": "chua dang nhap", "may": "dv14-vps2"}',
      '$ head -c 300000 /dev/urandom | curl -s -X POST --data-binary @- \\',
      '    "localhost/upload?name=anh-dai-dien.jpg"',
      '{"luu": "anh-dai-dien.jpg", "byte": 300000, "may": "dv14-vps1"}',
      '$ for i in 1 2 3 4; do curl -s localhost/files/anh-dai-dien.jpg; done',
      '! {"loi": "khong co tep", "may": "dv14-vps2"}',
      '= {"tep": "anh-dai-dien.jpg", "byte": 300000, "may": "dv14-vps1"}',
    ], { title: 'SESSION_STORE=memory, ảnh trên đĩa máy', fs: 11.5 }),
    `${term([
      '$ grep SESSION /etc/app.env      # trên CẢ HAI máy',
      'SESSION_STORE=redis://dv14-redis:6379/1',
      '$ curl -s -c jar -X POST "localhost/login?u=cuong"',
      '{"dang_nhap": "cuong", "may": "dv14-vps2"}',
      '$ for i in 1 2 3 4; do curl -s -b jar localhost/me; done',
      '= {"user": "cuong", "may": "dv14-vps1"}',
      '= {"user": "cuong", "may": "dv14-vps2"}',
      '$ docker exec dv14-redis redis-cli -n 1 TTL sess:aa3d78235bbd0d3f',
      '3591',
    ], { title: 'phiên ra Redis', fs: 11.5 })}
    ${table(['Trạng thái', 'Ra đâu'], [
      ['phiên đăng nhập', 'Redis / DB, hoặc JWT ký sẵn'],
      ['ảnh, tệp tải lên', 'kho object R2/S3 (Ch12.4)'],
      ['việc nền, lịch cron', 'MỘT máy chạy, hoặc hàng đợi'],
    ], { sm: true })}`) },

  { t: 'Dừng êm + keep-alive: bản cũ vẫn phục vụ', body: two(
    `${term([
      '$ pgrep -af app.py',
      '! 231 python3 /srv/app/current/app.py',
      '1446 python3 /srv/app/current/app.py',
      '$ sudo ss -tnp state established "( sport = :8000 )"',
      '! 172.30.14.101:8000 172.30.14.100:53606 users:(("python3",pid=231,fd=5))',
      '$ sudo ss -tlnp "( sport = :8000 )"',
      'LISTEN … 0.0.0.0:8000 … users:(("python3",pid=1446,fd=3))',
    ], { title: 'dv14-vps1 — sau khi "restart" sang Redis', fs: 12 })}
    ${box('bad', 'Tiến trình CŨ (231) đã thôi nghe cổng nhưng vẫn giữ kết nối keep-alive của nginx ⇒ nginx gửi tiếp request vào bản cũ, bản cũ đọc phiên trong bộ nhớ ⇒ "chưa đăng nhập". Không có dòng lỗi nào.')}`,
    `${code(`DUNG = threading.Event()  # bật khi nhận SIGTERM

class H(http.server.BaseHTTPRequestHandler):
    timeout = 5       # keep-alive rảnh 5 s ⇒ đóng
    def send(self, code, obj, headers=()):
        ...
        if DUNG.is_set():   # đang dừng ⇒ đóng
            self.send_header('Connection', 'close')
            self.close_connection = True

def tat(*_):
    DUNG.set()
    threading.Thread(target=srv.shutdown).start()`, 'python')}
    ${term([
      '$ time sudo app-restart',
      'dv14-vps1: v1 len',
      'real    0m5.268s',
      '$ pgrep -af "^python3"',
      '= 1700 python3 /srv/app/current/app.py',
    ], { title: 'sau khi sửa: một tiến trình', fs: 12.5 })}`) },

  { t: 'Rolling: rút từng máy khỏi LB rồi tráo', body: two(
    sh([
      ['# rút gọn từ rolling.sh (bản đủ ở bài 14.2)', ''],
      ['for m in vps1 vps2; do', ''],
      ['  hap "set server app/$m state drain"', 'thôi nhận request MỚI'],
      ['  until [ "$(scur $m)" = 0 ]; do sleep 0.2; done', 'chờ request dở xong'],
      ['  ssh $(cong $m) "ln -sfn …/$BAN current && app-restart"', ''],
      ['  ssh $(cong $m) "curl -fs :8000/health" | grep -q "$BAN" \\', ''],
      ['    || { echo "DỪNG"; exit 1; }', 'máy kia vẫn bản cũ'],
      ['  hap "set server app/$m state ready"', ''],
      ['  until [ "$(status $m)" = UP ]; do sleep 0.2; done', ''],
      ['done', ''],
    ], { fs: 12.5 }) + term([
      '$ ./rolling.sh v3',
      '== 16:25:54 vps1: drain (không nhận request MỚI)',
      '   16:25:54 vps1: hết request dở, tráo sang v3',
      '   16:25:59 vps1: UP trở lại trong LB',
      '== 16:25:59 vps2: drain …',
      '   16:26:04 vps2: UP trở lại trong LB',
      '= == xong: cả hai máy chạy v3',
    ], { title: 'Mac → dv14-lb/vps1/vps2 qua SSH', fs: 12 }),
    `${kpis([
      { v: '0 / 91', l: 'lỗi khi rolling (drain từng máy)', c: 'grn' },
      { v: '325 / 385', l: 'lỗi khi tráo CẢ HAI cùng lúc', c: 'red' },
    ])}
    ${term([
      '# tráo cả hai cùng lúc, tải qua HAProxy',
      '3.0 200 v3',
      '! 3.2 502',
      '! 3.2 502',
      '! 3.2 503',
      '# … 321 dòng 503 nữa …',
      '! 6.7 503',
      '= 6.7 200 v4',
    ], { title: '3,5 giây không máy nào UP', fs: 12.5 })}
    ${box('info', 'Chuẩn bị cả hai máy trước (tải ảnh, chép mã), chỉ phần TRÁO mới đi lần lượt. Máy đầu hỏng ⇒ dừng, máy sau chưa bị đụng.')}`, 'l') },

  { t: 'Canary: 10% người dùng thử bản mới trước', body: two(
    `${term([
      '# dv14-vps2 chạy v5 (canary), dv14-vps1 vẫn v4',
      '$ echo "set weight app/vps1 9" | sudo socat stdio /run/haproxy.sock',
      '$ echo "set weight app/vps2 1" | sudo socat stdio /run/haproxy.sock',
      '$ for i in $(seq 1 1000); do curl -s localhost:81/ \\',
      '    | grep -o \'"ban": "v[0-9]"\'; done | sort | uniq -c',
      '    900 "ban": "v4"',
      '+    100 "ban": "v5"',
    ], { title: 'dv14-lb — trọng số đổi lúc chạy, không reload', fs: 12.5 })}
    ${table(['Canary theo', 'Được', 'Mất'], [
      ['trọng số máy (ở trên)', 'không sửa mã', 'một người có thể nhảy qua lại v4/v5'],
      ['cookie / người dùng', 'một người luôn một bản', 'cần LB đọc cookie hoặc cờ trong app'],
      ['feature flag (14.1)', 'theo từng tính năng', 'mã phải có cả hai nhánh'],
    ], { sm: true })}`,
    `${cards([
      { t: '1. Tăng dần', d: '10% → 50% → 100%, mỗi nấc đợi đủ lâu để thấy lỗi (vài phút tới một ngày).', c: 'blu' },
      { t: '2. So SỐ', d: 'tỉ lệ 5xx, độ trễ p95 của máy canary so với máy cũ — không so cảm giác.', c: 'amb' },
      { t: '3. Lùi = trọng số 0', d: '<code>set weight app/vps2 0</code> — một lệnh, không deploy lại.', c: 'grn' },
    ], 1)}`, 'l') },

  /* ───────────── 14.3 ───────────── */
  { t: 'Càng lên cao càng ít việc, ít quyền', body: table(['Tầng', 'VPS (Ch1–13)', 'PaaS (Render, Railway, Fly)', 'Serverless (Vercel fn, Lambda)', 'Kubernetes'], [
    ['máy, điện, mạng', 'họ', 'họ', 'họ', 'họ (managed)'],
    ['hệ điều hành, vá bảo mật', '!BẠN', 'họ', 'họ', 'họ (node) / bạn (ảnh)'],
    ['build, tráo, lùi bản', '!BẠN (script)', 'họ — <code>git push</code>', 'họ', 'bạn viết manifest'],
    ['cân bằng tải, HTTPS', '!BẠN (nginx, certbot)', 'họ', 'họ', 'Ingress + cert-manager'],
    ['mở rộng nhiều máy', '!BẠN (14.2)', 'kéo thanh trượt', 'tự động theo request', 'HPA, tự động'],
    ['Postgres, Redis', '!BẠN', 'dịch vụ thêm tiền', 'bên ngoài', 'bạn hoặc managed'],
    ['xem được bên trong', '+mọi thứ (ssh)', 'log + shell hạn chế', 'log', 'kubectl'],
    ['hoá đơn đoán trước', '+cố định/tháng', 'theo gói + dùng thêm', '-theo lượt, có thể vọt', 'cụm + node'],
  ], { sm: true }) + box('info', 'Mục 0 đã có bảng bảy chỗ chạy web. Ở đây: chọn giữa chúng cho <strong>một đồ án thật</strong>, với giá tính đến 09/2026 ở hai slide sau.') },

  { t: 'Giá VPS thật (tính đến 09/2026)', body: two(
    table(['DigitalOcean Basic', 'RAM · vCPU · SSD', 'Truyền ra', '$/tháng'], [
      ['512 MiB', '1 · 10 GB', '500 GiB', '<strong>4</strong>'],
      ['1 GiB', '1 · 25 GB', '1 000 GiB', '<strong>6</strong>'],
      ['2 GiB', '1 · 50 GB', '2 000 GiB', '<strong>12</strong>'],
      ['4 GiB', '2 · 80 GB', '4 000 GiB', '<strong>24</strong>'],
      ['8 GiB', '4 · 160 GB', '5 000 GiB', '<strong>48</strong>'],
    ], { sm: true }) + table(['DigitalOcean thêm', 'Giá'], [
      ['vượt băng thông', '$0,01/GiB (gộp cả nhóm)'],
      ['snapshot', '$0,06/GB/tháng'],
      ['backup tự động', 'thêm 20% (tuần) / 30% (ngày)'],
    ], { sm: true }),
    `${table(['Hetzner (từ 15/06/2026)', '€/tháng, chưa VAT, chưa IPv4'], [
      ['CX23 · 2 vCPU · 4 GB · 40 GB (Đức/Phần Lan)', '<strong>5,49</strong>'],
      ['CX33 (Đức/Phần Lan)', '<strong>8,49</strong>'],
      ['CAX11 ARM (Đức/Phần Lan)', '<strong>5,99</strong>'],
      ['CPX12 (<strong>Singapore</strong>)', '<strong>15,49</strong>'],
      ['vượt lưu lượng', '€1/TB · EU có 20 TB'],
    ], { sm: true })}
    ${box('warn', 'Rẻ nhất ≠ hợp nhất: CX23 ở châu Âu rẻ gấp ~3 lần CPX12 Singapore, nhưng xa người dùng Việt Nam ~200 ms mỗi vòng (đo ở 14.4).')}
    ${box('info', 'Nguồn: digitalocean.com/pricing/droplets · docs.digitalocean.com (bandwidth) · docs.hetzner.com (price-adjustment, traffic). Giá đổi thường xuyên — đọc lại trước khi trả.')}`) },

  { t: 'Giá PaaS và serverless (tính đến 09/2026)', body: table(['Nền tảng', 'Gói miễn phí', 'Gói trả tiền nhỏ nhất', 'Bẫy cần biết'], [
    ['<strong>Vercel</strong>', 'Hobby $0: 100 GB truyền, 1 triệu lượt gọi hàm', 'Pro $20/người/tháng, 1 TB rồi $0,15/GB', '-Hobby CHỈ cho dùng cá nhân, phi thương mại'],
    ['<strong>Render</strong>', 'web 512 MB — <strong>ngủ sau 15 phút</strong>, dậy ~1 phút; Postgres free <strong>hết hạn sau 30 ngày</strong>', 'web Starter $7 (512 MB) · Postgres $6 (256 MB) · Key Value $10', 'băng thông Hobby 5 GB rồi $0,15/GB'],
    ['<strong>Railway</strong>', 'dùng thử $5 một lần (30 ngày)', 'Hobby $5/tháng gồm $5 dùng; RAM $10/GB·tháng, CPU $20/vCPU·tháng', 'tính theo giây — quên tắt là tiền chạy'],
    ['<strong>Fly.io</strong>', '—', 'shared-cpu-1x 512 MB ~$3,46 (US East); Managed Postgres Basic $38', 'IPv4 riêng $2/tháng; ra châu Á $0,04/GB'],
    ['<strong>AWS Lambda</strong>', '1 triệu request + 400 000 GB-giây/tháng', '$0,20/triệu request + $0,0000166667/GB-giây', 'không giữ kết nối DB lâu — cần pool/proxy'],
  ], { sm: true }) + two(
    box('bad', '<strong>Hai cái "miễn phí" giết đồ án:</strong> Render free ngủ ⇒ hội đồng bấm link lần đầu chờ ~1 phút. Postgres free 30 ngày ⇒ tuần bảo vệ DB đã bị xoá.'),
    box('info', 'Nguồn: vercel.com/pricing, vercel.com/docs/plans/hobby, render.com/pricing, render.com/docs/free, railway.com/pricing, docs.fly.io/about/pricing, aws.amazon.com/lambda/pricing — đọc 29/09/2026.')) },

  { t: 'Cùng một đồ án, bốn hoá đơn', body: two(
    `${table(['Cách chạy "Đặt lịch phòng khám"', 'Tính', '$/tháng'], [
      ['<strong>VPS</strong> DigitalOcean 2 GiB, vùng SGP1 + backup tuần', '12 + 20%', '<strong>14,40</strong>'],
      ['<strong>Render</strong>: web + API Starter, Postgres 256 MB, Key Value', '7 + 7 + 6 + 10', '<strong>30</strong>'],
      ['<strong>Railway</strong> Hobby: ~0,6 GB RAM, ~0,1 vCPU trung bình', '5 + (6 + 2 − 5)', '<strong>~8</strong> (ước tính)'],
      ['<strong>Fly.io</strong>: 2 máy 512 MB + Managed Postgres Basic', '2 × 3,46 + 38', '<strong>~45</strong>'],
      ['<strong>Vercel</strong> Hobby (frontend) + API ở chỗ khác', '0 + …', '0 — nếu phi thương mại'],
    ], { sm: true })}
    ${box('warn', 'Railway là <strong>ước tính theo đồng hồ</strong>: RAM/CPU thật của app Node lớn hơn app Python thí nghiệm (28 MB). Đo bằng <code>docker stats</code> trước khi tin con số nào.')}`,
    `${term([
      '$ docker stats --no-stream --format "table {{.Name}}\\t{{.MemUsage}}" \\',
      '    dv14-pgprod dv14-redis dv14-vps1',
      'NAME          MEM USAGE / LIMIT',
      'dv14-pgprod   77.81MiB / 256MiB',
      'dv14-redis    6.281MiB / 64MiB',
      'dv14-vps1     46.93MiB / 512MiB',
    ], { title: 'đo RAM thật trước khi chọn gói', fs: 12.5 })}
    ${cards([
      { t: 'Đồ án 1 học kỳ', d: 'PaaS (Render/Railway) — trả tiền gói nhỏ, KHÔNG dùng DB free 30 ngày.', c: 'blu' },
      { t: 'Muốn học vận hành', d: 'VPS — mọi chương của khoá này áp dụng được.', c: 'grn' },
    ], 1)}`, 'l') },

  { t: 'Kubernetes làm tự động đúng những việc 14.2', body: two(
    yaml([
      ['apiVersion: apps/v1', ''],
      ['kind: Deployment', ''],
      ['metadata: { name: app }', ''],
      ['spec:', ''],
      ['  replicas: 2', 'hai "vps"'],
      ['  strategy:', ''],
      ['    rollingUpdate: { maxUnavailable: 0, maxSurge: 1 }', 'rolling.sh'],
      ['  template:', ''],
      ['    spec:', ''],
      ['      containers:', ''],
      ['      - name: app', ''],
      ['        image: ghcr.io/nhom/app:a1b2c3d', 'ghim tag'],
      ['        envFrom: [{ secretRef: { name: app-env } }]', '/etc/app.env'],
      ['        readinessProbe:', 'option httpchk'],
      ['          httpGet: { path: /health, port: 8000 }', ''],
    ], { fs: 12.5 }),
    `${table(['Việc ở 14.2', 'Kubernetes gọi là'], [
      ['hai máy chạy cùng ảnh', '<code>replicas: 2</code>'],
      ['HAProxy + <code>/health</code>', 'Service + <code>readinessProbe</code>'],
      ['<code>rolling.sh</code> drain từng máy', '<code>strategy.rollingUpdate</code>'],
      ['<code>/etc/app.env</code>', 'Secret / ConfigMap'],
      ['máy chết ⇒ đổi đường', 'tự tạo pod mới ở node khác'],
    ], { sm: true })}
    ${box('warn', 'Chưa cần khi: một app, một nhóm 4–5 người, một học kỳ. Cái giá: học cả một hệ khái niệm, cụm tốn tiền kể cả lúc rảnh.')}
    ${box('tip', 'Manifest này chỉ để so sánh, không chạy trong chương. Học thật: <strong>/courses/kubernetes</strong>.')}`, 'l') },

  /* ───────────── 14.4 ───────────── */
  { t: 'Chọn VPS: gần người dùng quan trọng như RAM', body: two(
    `${term([
      '$ for h in sin fsn1 hel1 ash hil; do',
      '    printf "%-24s" $h-speed.hetzner.com',
      '    for i in $(seq 1 7); do curl -s -o /dev/null -m 8 \\',
      '      -w "%{time_connect}\\n" http://$h-speed.hetzner.com/',
      '    done | sort -n | head -1',
      '  done',
      '= sin-speed.hetzner.com   0.036925',
      'fsn1-speed.hetzner.com  0.212615',
      'hel1-speed.hetzner.com  0.235182',
      'ash-speed.hetzner.com   0.222542',
      'hil-speed.hetzner.com   0.180569',
    ], { title: 'máy Fedora ở nhà (Việt Nam) — nhỏ nhất trong 7 lần', fs: 12 })}
    ${box('info', '<code>time_connect</code> ≈ một vòng đi-về (RTT). Mở một trang HTTPS mới tốn ~3–4 vòng (TCP, TLS, HTTP) trước byte đầu tiên.')}`,
    `${bars([
      { l: 'Singapore', sub: 'sin', v: 37, txt: '37 ms', c: 'grn' },
      { l: 'Hillsboro (Mỹ)', sub: 'hil', v: 181, txt: '181 ms', c: 'amb' },
      { l: 'Falkenstein (Đức)', sub: 'fsn1', v: 213, txt: '213 ms', c: 'red' },
      { l: 'Ashburn (Mỹ)', sub: 'ash', v: 223, txt: '223 ms', c: 'red' },
      { l: 'Helsinki', sub: 'hel1', v: 235, txt: '235 ms', c: 'red' },
    ], { lw: 170, max: 260 })}
    ${table(['Con số', 'Đồ án nhóm', 'cuongthai.com'], [
      ['RAM', '2 GB (có Postgres)', '6 GB'],
      ['vCPU', '1–2', '—'],
      ['Đĩa', '≥ 40 GB — ảnh + log + cache build', 'từng đầy (Ch8)'],
      ['Truyền ra/tháng', 'vài GB', 'ảnh qua CDN'],
    ], { sm: true })}`, 'l') },

  { t: 'Đo máy mới trước khi dọn nhà vào', body: two(
    term([
      '$ nproc; free -h | head -2',
      '10',
      '               total        used        free      shared  buff/cache   available',
      '! Mem:           7.7Gi       3.2Gi       1.0Gi        62Mi       3.8Gi       4.6Gi',
      '$ cat /sys/fs/cgroup/memory.max',
      '= 536870912',
      '$ fio --name=randrw --rw=randrw --bs=4k --size=256M --runtime=20 \\',
      '    --time_based --direct=1 --ioengine=libaio --iodepth=16 --group_reporting',
      '  read: IOPS=51.6k, BW=202MiB/s (212MB/s)(4035MiB/20001msec)',
      '     | 99.00th=[  433], 99.50th=[  644], 99.90th=[ 1516], …',
      '  write: IOPS=51.6k, BW=201MiB/s (211MB/s)(4030MiB/20001msec)',
      '$ iperf3 -c 172.30.14.102 -t 5',
      '[  5]   0.00-5.00   sec  27.9 GBytes  47.8 Gbits/sec   receiver',
    ], { title: 'dv14-vps1 — container trên Mac (MINH HOẠ)', fs: 11.5 }),
    `${table(['Đo gì', 'Lệnh', 'Để thấy'], [
      ['CPU/RAM thật', '<code>nproc</code>, <code>free -h</code>', 'đúng gói đã trả'],
      ['đĩa ngẫu nhiên 4k', '<code>fio --rw=randrw --bs=4k</code>', 'Postgres sống bằng IOPS'],
      ['mạng giữa hai máy', '<code>iperf3 -s</code> / <code>-c</code>', 'app ↔ DB khác máy'],
      ['độ trễ tới người dùng', '<code>curl -w %{time_connect}</code>', 'vị trí'],
    ], { sm: true })}
    ${box('warn', 'Trong container, <code>free</code> cho thấy RAM <strong>cả máy ảo Docker</strong> (7,7 GiB), giới hạn thật nằm ở <code>memory.max</code> (512 MiB). 47,8 Gbit/s là hai container cùng một cầu nối — không phải mạng thật. Chạy đúng các lệnh này trên VPS mới để có số của NÓ.')}
    ${box('tip', 'Xong thì xoá tệp thử của fio: nó ghi thật 256 MB.')}`, 'l') },

  { t: 'Hạ TTL chỉ có tác dụng sau TTL cũ', body: two(
    `${conf([
      ['$TTL 120', 'trước: 120 giây'],
      ['@   IN SOA ns1.vidu.test. admin.vidu.test. ( 2026092901 … 30 )', ''],
      ['@   IN A   172.30.14.201', 'dv14-old'],
    ], { lang: 'zone', fs: 13 })}
    ${term([
      '== 16:30:38 hạ TTL 120 → 20 trong zone (serial +1), rndc reload',
      'máy thẩm quyền : vidu.test. 20 IN A 172.30.14.201',
      '! resolver đệm   : vidu.test. 110 IN A 172.30.14.201',
      '== 16:30:43',
      '! resolver đệm   : vidu.test. 104 IN A 172.30.14.201',
      '16:32:13 vidu.test. 15 IN A 172.30.14.201',
      '16:32:28 vidu.test. 0 IN A 172.30.14.201',
      '= 16:32:33 vidu.test. 20 IN A 172.30.14.201',
    ], { title: 'dv14-dns (bind9) + dv14-res (unbound)', fs: 12.5 })}`,
    `${cards([
      { t: 'T − 1 ngày', d: 'Hạ TTL (vd 3600 → 60). Resolver đã đệm vẫn giữ số CŨ tới hết — ở đây 110 s còn lại.', c: 'blu' },
      { t: 'T − vài giờ', d: 'Rsync lượt 1, restore thử, đo máy mới. Web cũ vẫn chạy bình thường.', c: 'tea' },
      { t: 'T', d: 'Đóng băng ghi → dump/restore → rsync lượt 2 → so → đổi A. Người còn IP cũ tối đa 60 s.', c: 'amb' },
      { t: 'T + vài ngày', d: 'Máy cũ chuyển tiếp sang máy mới; hết truy cập thì tắt. Nâng TTL lại.', c: 'grn' },
    ], 1)}`, 'l') },

  { t: 'Chuyển nhà: đóng băng, chép, so, rồi mới đổi', body: two(
    sh([
      ['# rút gọn từ cat-chuyen.sh (bản đủ ở bài 14.4)', ''],
      ['buoc "1. đóng băng ghi trên máy cũ"', ''],
      ["ssh old 'touch /tmp/dong-bang'", 'bật chế độ bảo trì'],
      ['buoc "2. dump cũ → restore mới"', ''],
      ["ssh new 'ssh old \"pg_dump -Fc datlich\" \\", 'không qua đĩa'],
      ["  | pg_restore -d datlich --clean --if-exists'", ''],
      ['buoc "3. rsync lượt 2"', ''],
      ["ssh new 'rsync -aH --delete old:/srv/uploads/ /srv/uploads/'", 'chỉ phần mới'],
      ['buoc "4. so hai bên"', 'đếm dòng + md5 tệp'],
      ['buoc "5. máy cũ proxy sang máy mới"', ''],
      ['buoc "6. đổi bản ghi A"', ''],
    ], { fs: 12.5 }),
    `${term([
      '$ ./cat-chuyen.sh',
      '[0s] 1. đóng băng ghi trên máy cũ (bảo trì)',
      '[1s] 2. dump máy cũ → restore máy mới (qua SSH, không qua đĩa)',
      '[2s] 3. rsync lượt 2: chỉ phần mới từ lượt 1',
      'Number of regular files transferred: 208',
      '[2s] 4. so hai bên',
      '= dv14-old  lich_hen=20219  tep=619  tong-md5=68a3fdeea1c9',
      '= dv14-new  lich_hen=20219  tep=619  tong-md5=68a3fdeea1c9',
      '[3s] 5. máy mới nhận ghi; máy cũ chuyển tiếp …',
      '[3s] 6. đổi bản ghi A sang IP mới',
    ], { title: 'Mac → dv14-old/new qua SSH', fs: 12 })}
    ${term([
      '$ curl -s --resolve vidu.test:80:172.30.14.201 http://vidu.test/',
      '= may: dv14-new',
    ], { title: 'người còn giữ IP cũ vẫn tới máy mới', fs: 11.5 })}`, 'l') },

  { t: 'Chép khi web còn ghi là mất đơn', body: two(
    `${term([
      '$ time rsync -aH --stats deploy@172.30.14.201:/srv/uploads/ /srv/uploads/',
      'Number of regular files transferred: 411',
      'Total transferred file size: 61,951,520 bytes',
      'real    0m0.496s',
      '# lượt 2 (lúc đóng băng): 208 tệp, 12,480,000 byte',
    ], { title: 'rsync hai lượt: lượt 1 lúc web VẪN chạy', fs: 12.5 })}
    ${term([
      '# dump lúc web cũ VẪN ghi, đổi DNS ngay, 10 giây sau:',
      'dv14-old lich_hen=20239',
      '! dv14-new lich_hen=20220',
    ], { title: 'cách "nhanh": không đóng băng', fs: 12.5 })}`,
    `${kpis([
      { v: '19', l: 'lịch hẹn mất trong 10 giây — chỉ nằm trên máy cũ', c: 'red' },
      { v: '≈ 3 s', l: 'đóng băng ghi khi làm đúng (DB 20 nghìn dòng, 60 MB ảnh)', c: 'grn' },
    ])}
    ${box('bad', 'Không lỗi nào hiện ra: người đặt lịch thấy "đặt thành công" trên máy cũ, rồi dữ liệu đó không bao giờ sang máy mới. Phát hiện được khi bệnh nhân tới khám.')}
    ${box('tip', 'DB lớn (chục GB): dump mất cả giờ ⇒ dùng bản sao streaming (replica) rồi promote — xem khoá PostgreSQL. Nguyên tắc vẫn là: một lúc chỉ MỘT máy nhận ghi.')}`, 'l') },

  { t: 'Hoá đơn bất ngờ đến từ đâu', body: table(['Khoản', 'Vì sao bất ngờ', 'Con số (09/2026)', 'Phòng'], [
    ['<strong>Băng thông ra</strong>', 'video/ảnh phục vụ thẳng từ VPS; bị cào dữ liệu', 'DO $0,01/GiB · Vercel Pro $0,15/GB · Render $0,15/GB', 'ảnh qua CDN/R2; đặt cảnh báo'],
    ['<strong>Snapshot, backup</strong>', 'tính theo GB mỗi tháng, tích mãi', 'DO snapshot $0,06/GB · backup +20–30% giá máy', 'giữ N bản, xoá bản cũ tự động'],
    ['<strong>Máy quên tắt</strong>', 'staging, preview, máy thử 14.4', 'DO 2 GiB $12 dù không ai vào', 'nhãn + dọn định kỳ; PaaS tính theo giây'],
    ['<strong>IPv4</strong>', 'giá gói ghi "chưa gồm IPv4"', 'Hetzner: giá chưa IPv4 · Fly IPv4 riêng $2', 'đọc dòng chữ nhỏ'],
    ['<strong>Serverless vọt</strong>', 'vòng lặp gọi hàm, bot', 'Lambda $0,20/triệu + GB-giây', 'trần chi tiêu (spend cap)'],
    ['<strong>DB managed</strong>', 'nhỏ nhất đã đắt hơn cả VPS', 'Fly MPG Basic $38 · Render 1 GB $19', 'đồ án: Postgres trong VPS + backup'],
  ], { sm: true }) + two(
    term([
      "$ sudo awk '{n++; b+=$10} END {printf \"%d request, %.1f MB gửi đi, TB %.0f byte/request\\n\", n, b/1e6, b/n}' \\",
      '    /var/log/nginx/access.log',
      '1137 request, 0.1 MB gửi đi, TB 64 byte/request',
    ], { title: 'đo băng thông của chính bạn từ log nginx', fs: 12 }),
    box('info', 'Cột 10 của log <code>combined</code> là <code>$body_bytes_sent</code>. Nhân lên theo tháng rồi so với hạn mức gói — biết trước khi hoá đơn tới.'), 'l') },

  { t: 'Sai lầm hay gặp khi ra nhiều nơi', body: table(['Việc làm', 'Vì sao hỏng', 'Làm thay bằng'], [
    ['Build riêng cho staging và prod', 'bản chạy prod chưa từng được kiểm', 'build MỘT lần, chỉ đổi env'],
    ['<code>NEXT_PUBLIC_*</code>/ARG mang URL', 'prod gọi API staging (đo được)', 'config đọc lúc chạy'],
    ['Chép DB prod thô sang staging', 'dữ liệu thật trên máy ít bảo vệ hơn', 'ẩn danh trước khi rời prod'],
    ['Upstream nginx không <code>zone</code>', 'mỗi worker đếm riêng ⇒ lệch 10/0', '<code>zone app 64k;</code>'],
    ['Phiên, tệp tải lên trong máy', 'đăng xuất ngẫu nhiên, ảnh 404 nửa số lần', 'Redis, kho object'],
    ['Dừng êm nhưng quên keep-alive', 'bản cũ âm thầm phục vụ tiếp', '<code>Connection: close</code> + timeout'],
    ['Tráo mọi máy cùng lúc', '325 lỗi trong 3,5 s', 'rolling: drain từng máy'],
    ['Dump lúc web vẫn ghi', '19 lịch hẹn mất / 10 s', 'đóng băng → chép → so → đổi'],
    ['Chọn VPS rẻ nhất ở châu Âu', '~200 ms mỗi vòng tới VN', 'Singapore, đo <code>time_connect</code>'],
    ['Dùng Postgres free 30 ngày cho đồ án', 'DB bị xoá trước buổi bảo vệ', 'gói trả tiền nhỏ / VPS'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh (1/2): môi trường và nhiều máy', body: two(
    sh([
      ['docker inspect -f "{{.Image}}" stg prod', 'cùng sha256?'],
      ['docker run --env-file production.env IMG', 'một ảnh, env riêng'],
      ['pg_dump -Fc db | pg_restore -d db_stg', 'rồi chạy an-danh.sql'],
      ['redis-cli SET flag:ten 10', 'phát hành 10%'],
      ['redis-cli SET flag:ten 0', 'tắt khẩn cấp'],
      ['curl -sD- -o /dev/null URL | grep -i x-upstream', 'máy nào'],
      ['for i in $(seq 10); do curl -s URL; done | sort | uniq -c', 'đều chưa'],
    ], { fs: 12.5 }),
    sh([
      ['H=/run/haproxy.sock', ''],
      ['echo "show stat" | sudo socat stdio $H', 'UP/DOWN'],
      ['echo "set server app/vps1 state drain" \\', ''],
      ['  | sudo socat stdio $H', 'rút ra'],
      ['echo "set server app/vps1 state ready" \\', ''],
      ['  | sudo socat stdio $H', 'trả về'],
      ['echo "set weight app/vps2 1" | sudo socat stdio $H', 'canary'],
      ['sudo ss -tnp state established "( sport = :8000 )"', 'ai giữ kết nối'],
      ['pgrep -af "^python3"', 'còn bản cũ?'],
    ], { fs: 12.5 }), 'r') },

  { t: 'Bảng tra nhanh (2/2): nền tảng, chi phí, chuyển nhà', body: two(
    `${sh([
      ['nproc; free -h; cat /sys/fs/cgroup/memory.max', 'đúng gói?'],
      ['fio --rw=randrw --bs=4k --size=256M --direct=1 …', 'IOPS đĩa'],
      ['iperf3 -s   /   iperf3 -c IP -t 5', 'mạng hai máy'],
      ['curl -so /dev/null -w "%{time_connect}\\n" URL', 'RTT'],
      ['dig @resolver ten +noall +answer', 'TTL còn lại'],
      ['rsync -aH --delete old:/srv/uploads/ /srv/uploads/', 'chạy 2 lượt'],
      ['ssh old "pg_dump -Fc db" | pg_restore -d db --clean', 'lúc đóng băng'],
      ['curl --resolve ten:80:IP-CU http://ten/', 'máy cũ chuyển tiếp?'],
    ], { fs: 12 })}`,
    table(['Tình huống', 'Chọn'], [
      ['đồ án 1 học kỳ, cần link ổn định', 'PaaS gói trả tiền nhỏ, hoặc VPS 2 GB'],
      ['frontend tĩnh/Next phi thương mại', 'Vercel Hobby'],
      ['học vận hành, nhiều dịch vụ', 'VPS Singapore'],
      ['nhiều dịch vụ, nhiều máy, nhiều nhóm', 'Kubernetes (khoá riêng)'],
      ['việc thỉnh thoảng, theo sự kiện', 'serverless'],
    ], { sm: true }), 'l') },

  { t: 'Thực hành chương 14 (45 phút, VPS thí nghiệm)', body: table(['Bước', 'Làm gì', 'Đạt khi'], [
    ['<strong>1. Một ảnh</strong> · 8′', 'build một ảnh; chạy staging + prod với hai <code>--env-file</code>', '<code>docker inspect</code> cùng sha256, <code>/</code> trả env khác nhau'],
    ['<strong>2. Ẩn danh</strong> · 7′', 'dump → restore staging → <code>an-danh.sql</code>', 'đếm email thật = 0, lịch hẹn giữ nguyên số'],
    ['<strong>3. Hai máy</strong> · 12′', 'nginx upstream có <code>zone</code> + HAProxy <code>check</code>; rút mạng một máy lúc có tải', 'ghi được số request lỗi/chậm của từng loại LB'],
    ['<strong>4. Rolling</strong> · 10′', 'phiên ra Redis; <code>rolling.sh</code> dưới tải', '0 lỗi, cả hai máy báo bản mới'],
    ['<strong>5. Chuyển nhà</strong> · 8′', 'hạ TTL, rsync lượt 1, <code>cat-chuyen.sh</code>', 'hai bên cùng số dòng + md5; IP cũ vẫn tới máy mới'],
  ], { sm: true }) + two(
    box('info', '<strong>Dựng lab:</strong> <code>docker network create --subnet 172.30.14.0/24 dv14-net</code>; năm container Ubuntu có sshd (<code>dv14-lb</code>, <code>vps1</code>, <code>vps2</code>, <code>old</code>/<code>new</code>) + <code>redis:7-alpine</code>; SSH qua <code>127.0.0.1:19140–19144</code>.'),
    box('warn', 'Không trỏ tên miền thật, không mua gói nào để "thử". Xong: <code>docker rm -f $(docker ps -aq --filter label=dvhoc=14)</code> rồi xoá mạng và ảnh tạm.')) },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
