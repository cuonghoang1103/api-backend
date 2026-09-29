/**
 * Deploy lên VPS · Deck dv-02 — Chương 2: Vận chuyển (rsync · git push · registry).
 *
 * MỌI output terminal trên slide là output THẬT, chạy 29/09/2026 trong "VPS thí nghiệm" (hợp đồng mục 7b):
 *   • laptop = container ubuntu:24.04 `dv02-dev` (người dùng `an`, GNU rsync 3.2.7, git 2.43, OpenSSH 9.6)
 *     vps    = container ubuntu:24.04 `dv02-vps` (sshd, người dùng `deploy`), cùng mạng Docker `dv02-net` trên Mac M1
 *     ⇒ KHÔNG qua Internet: số mili giây nhỏ hơn VPS thật (thêm RTT), số BYTE thì như nhau.
 *     Mạng chậm/đứt giả lập bằng `tc qdisc … netem rate 4mbit` / `loss 100%` trong container laptop.
 *   • registry = `registry:2` (dv02-reg); máy dựng `dv02-bld` và "VPS có Docker" `dv02-vpsd` là docker:27-dind.
 *   • byte = đếm ở card mạng eth0 (/sys/class/net/eth0/statistics), cả tiêu đề SSH/TCP.
 *   • "Mac" = Mac M1 macOS 27, /usr/bin/rsync = openrsync (protocol 29) → SSH vào vps qua 127.0.0.1:19022.
 *   • "Fedora" = linux-nha, rsync 3.4.4 (chỉ đọc phiên bản).
 * App thử: "dat-lich-nhom5" — express 4.21.2, 627 tệp (4,5 MB, gồm node_modules).
 *
 * Hình tự vẽ (SVG nội tuyến): cuonSvg() mã kiểm tra cuộn tìm khối đã dịch chuyển · honSvg() rsync bị giết giữa
 * chừng: thư mục đang chạy vs thư mục bản phát hành · duaSvg() hai lần deploy chồng nhau trên trục thời gian.
 */
import { S, cover, sh, yaml, term, pipe, mindmap, diagram, layers, tree, cards, box, steps, table, two, bars, sv, R, T, A, D } from './_dv-chung.mjs';

export const deck = { key: 'dv-02', code: 'DEPLOY · CHƯƠNG 2', title: 'Vận chuyển', sub: 'Deploy lên VPS · Chương 2' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}.l-pp .st{min-width:120px}</style>';

/* Slide 3 — mã kiểm tra CUỘN: chèn 100 byte vào đầu, mọi khối dịch chuyển mà vẫn được tìm thấy */
const cuonSvg = () => {
  let s = '';
  const x0 = 250, bw = 124;
  s += T(0, 44, 'tệp CŨ trên vps', { fs: 16, b: true, c: 'dv' }) + T(0, 66, '20.000.000 byte', { fs: 14, c: 'mu', mono: true });
  s += T(0, 184, 'tệp MỚI ở laptop', { fs: 16, b: true, c: 'grn' }) + T(0, 206, '100 byte chèn ở ĐẦU', { fs: 14, c: 'mu' });
  for (let i = 0; i < 6; i++) {
    const lb = i < 5 ? `khối ${i + 1}` : '…';
    s += R(x0 + i * bw, 26, bw - 6, 50, { c: 'blu', r: 6, sw: 2 }) + T(x0 + i * bw + (bw - 6) / 2, 57, lb, { fs: 15, a: 'middle', mono: true });
    s += R(x0 + 44 + i * bw, 166, bw - 6, 50, { c: 'grn', r: 6, sw: 2 }) + T(x0 + 44 + i * bw + (bw - 6) / 2, 197, lb, { fs: 15, a: 'middle', mono: true });
    if (i < 5) s += A(x0 + 44 + i * bw + (bw - 6) / 2, 162, x0 + i * bw + (bw - 6) / 2 + 6, 82, { c: 'grn', dash: true, sw: 2 });
  }
  s += R(x0, 166, 40, 50, { c: 'red', r: 6, sw: 2, fill: 'rgba(255,92,108,.18)' }) + T(x0 + 20, 197, '+', { fs: 20, a: 'middle', b: true, c: 'red' });
  s += T(x0 + 20, 238, '100 B', { fs: 14, a: 'middle', c: 'red', mono: true });
  s += T(0, 118, 'khớp ✓ ở vị trí MỚI', { fs: 15, c: 'grn', b: true }) + T(0, 140, '(dời +100 byte)', { fs: 14, c: 'grn' });
  s += T(x0 + 330, 238, 'so khối theo VỊ TRÍ cố định: 0 khối khớp ✗', { fs: 14.5, c: 'red' });
  s += R(1060, 20, 90, 200, { c: 'lx', r: 10, fill: 'rgba(245,183,0,.08)' }) + T(1105, 70, 'cửa', { fs: 14, a: 'middle', c: 'lx' }) + T(1105, 90, 'sổ', { fs: 14, a: 'middle', c: 'lx' }) + T(1105, 110, 'trượt', { fs: 14, a: 'middle', c: 'lx' }) + T(1105, 138, '→ 1 B', { fs: 14, a: 'middle', c: 'lx', mono: true }) + T(1105, 166, 'mỗi', { fs: 14, a: 'middle', c: 'lx' }) + T(1105, 186, 'bước', { fs: 14, a: 'middle', c: 'lx' });
  return sv(1150, 250, s);
};

/* Slide 23 — rsync bị giết sau 4 s: thư mục đang chạy thành mớ trộn; thư mục bản phát hành thì không ai dùng */
const honSvg = () => {
  let s = '';
  // Trái: thẳng vào thư mục đang chạy
  s += R(0, 0, 555, 250, { c: 'red', fill: 'rgba(255,92,108,.05)', r: 14, dash: true });
  s += T(18, 30, '✗ rsync THẲNG vào /srv/app/song (đang chạy)', { fs: 16, b: true, c: 'red' });
  const W = 500, x = 26;
  s += `<rect x="${x}" y="56" width="${W * 325 / 400}" height="44" rx="6" fill="${D.grn}" opacity=".85"/>`;
  s += `<rect x="${x + W * 325 / 400}" y="56" width="${W * 75 / 400}" height="44" rx="6" fill="${D.amb}" opacity=".9"/>`;
  s += T(x + W * 325 / 800, 84, '325 tệp PHIÊN BẢN 2', { fs: 15, a: 'middle', b: true, c: '#0b1018' });
  s += T(x + W * 325 / 400 + W * 75 / 800, 84, '75 · bản 1', { fs: 14, a: 'middle', b: true, c: '#0b1018' });
  s += T(x, 128, 'tệp tạm sót lại: 0 — từng tệp NGUYÊN VẸN', { fs: 14.5, c: 'mu' });
  s += T(x, 156, 'nhưng cả thư mục = một phiên bản', { fs: 15, c: 'tx' });
  s += T(x, 180, 'CHƯA TỪNG có trong commit nào', { fs: 15, c: 'red', b: true });
  s += T(x, 222, 'app đang chạy đọc đúng mớ trộn đó', { fs: 14.5, c: 'mu' });
  // Phải: vào thư mục mới + symlink
  s += R(595, 0, 555, 250, { c: 'grn', fill: 'rgba(63,185,80,.05)', r: 14, dash: true });
  s += T(613, 30, '✓ rsync vào phat-hanh/b2 MỚI rồi mới tráo', { fs: 16, b: true, c: 'grn' });
  s += R(620, 52, 150, 44, { c: 'dv', r: 8 }) + T(695, 80, 'hien-tai', { fs: 15, a: 'middle', mono: true, b: true });
  s += R(840, 52, 280, 44, { c: 'grn', r: 8 }) + T(980, 80, 'b1 · 400 tệp bản 1', { fs: 15, a: 'middle', mono: true });
  s += A(772, 74, 836, 74, { c: 'grn' });
  s += R(840, 112, 280, 44, { c: 'amb', r: 8, dash: true }) + T(980, 140, 'b2 · 365 tệp (dở)', { fs: 15, a: 'middle', mono: true });
  s += T(620, 140, 'không ai dùng →', { fs: 14, c: 'mu' });
  s += T(620, 186, 'bị giết: bản đang sống có 0 tệp bản 2', { fs: 14.5, c: 'grn' });
  s += T(620, 210, 'chạy LẠI: b2 đủ 400 → tráo symlink', { fs: 14.5, c: 'tx' });
  s += T(620, 234, 'mv -T = một rename(2), không thể dở', { fs: 14.5, c: 'mu' });
  return sv(1150, 252, s);
};

/* Slide 24 — hai lần deploy chồng nhau: B bắt đầu sau, xong trước; A ghi đè */
const duaSvg = () => {
  const X = (t) => 150 + t * 540; // giây → px
  let s = '';
  s += T(0, 58, 'deploy A', { fs: 16, b: true, c: 'amb' }) + T(0, 78, 'bản CŨ hơn', { fs: 13.5, c: 'mu' });
  s += T(0, 128, 'deploy B', { fs: 16, b: true, c: 'blu' }) + T(0, 148, 'bản MỚI', { fs: 13.5, c: 'mu' });
  s += `<rect x="${X(0)}" y="40" width="${X(1.5) - X(0)}" height="40" rx="6" fill="${D.amb}" opacity=".8"/>` + T((X(0) + X(1.5)) / 2, 66, 'chuyển tệp 1,5 s', { fs: 15, a: 'middle', b: true, c: '#0b1018' });
  s += `<rect x="${X(0.15)}" y="110" width="${X(0.45) - X(0.15)}" height="40" rx="6" fill="${D.blu}" opacity=".85"/>` + T((X(0.15) + X(0.45)) / 2, 136, '0,3 s', { fs: 15, a: 'middle', b: true, c: '#0b1018' });
  s += `<circle cx="${X(0.45)}" cy="130" r="9" fill="${D.blu}"/>` + T(X(0.45) + 16, 136, 'tráo → B ✓', { fs: 15, c: 'blu', b: true });
  s += `<circle cx="${X(1.5)}" cy="60" r="9" fill="${D.amb}"/>` + T(X(1.5) + 16, 66, 'tráo → A (ghi đè!)', { fs: 15, c: 'amb', b: true });
  s += `<path d="M${X(0)} 190 L${X(1.8)} 190" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 0.5, 1, 1.5].forEach((t) => { s += `<path d="M${X(t)} 184 L${X(t)} 196" stroke="${D.dim}" stroke-width="2"/>` + T(X(t), 216, `${String(t).replace('.', ',')} s`, { fs: 14, a: 'middle', c: 'mu', mono: true }); });
  s += T(0, 196, 'hien-tai →', { fs: 15, c: 'tx', mono: true });
  s += R(X(0.45), 228, X(1.5) - X(0.45), 34, { c: 'blu', r: 6 }) + T((X(0.45) + X(1.5)) / 2, 251, 'B đang chạy', { fs: 14.5, a: 'middle', c: 'blu' });
  s += R(X(1.5), 228, X(1.8) - X(1.5), 34, { c: 'red', r: 6, fill: 'rgba(255,92,108,.15)' }) + T((X(1.5) + X(1.8)) / 2, 251, 'A — mãi', { fs: 14.5, a: 'middle', c: 'red', b: true });
  return sv(1150, 268, s);
};

export const slides = S([
  cover({ t: 'Chương 2 — Vận chuyển: đưa tạo tác lên máy', sub: 'rsync và thuật toán chênh lệch · git push vào kho trần + hook · ảnh container qua registry · chọn đường · khi đường truyền đứt giữa chừng', chap: 'CHƯƠNG 2' }),

  { t: 'Bản đồ chương: ba đường chở byte lên máy chủ', body: mindmap('Vận chuyển', 'byte đã lên máy ≠ đã lên sóng', [
    { t: '2.1 rsync', d: 'mã kiểm tra cuộn · dấu / cuối · cờ -a -z -n -i · --delete xoá thật', c: 'blu' },
    { t: '2.2 git push', d: 'kho trần + post-receive · chỉ thứ ĐÃ COMMIT · hook hỏng ≠ push hỏng', c: 'vio' },
    { t: '2.3 registry', d: 'ảnh = danh sách lớp · lớp trùng không đi lại · tag vs digest', c: 'tea' },
    { t: '2.4 Chọn đường', d: 'đo cùng thay đổi một dòng · so cho công bằng · dựng ở đâu', c: 'amb' },
    { t: '2.5 Hỏng nửa chừng', d: 'mớ trộn hai bản · thư mục mới + symlink · flock · --partial · --timeout', c: 'red' },
    { t: 'Chuyện thật', d: 'deploy.sh rsync cây làm việc chộp file đang gõ dở ⇒ deploy-nha.sh chỉ gửi commit', c: 'grn' },
  ]) },

  /* ───────────── 2.1 rsync ───────────── */
  { t: 'rsync chỉ gửi những khối đã đổi', body: `
    ${cuonSvg()}
    ${two(
      table(['Tệp 20 MB, lần thứ…', 'Literal data', 'Total bytes sent'], [
        ['lần đầu (vps chưa có)', '20.000.000', '20.004.998'],
        ['đổi 100 byte ở GIỮA', '4.472', '+22.482'],
        ['!CHÈN 100 byte vào ĐẦU', '100', '+18.115'],
        ['chèn tiếp, nhưng <code>--whole-file</code>', '20.000.200', '20.005.198'],
      ], { sm: true, center: [1, 2] }),
      box('info', '<b>Đo thật</b> bằng <code>rsync -a --stats</code>, laptop → vps. Lần đầu luôn gửi hết; tệp <b>đã nén</b> (.gz, .zip, ảnh) đổi một byte nguồn là đổi gần hết byte nén ⇒ chênh lệch gần như không giúp gì.'), 'l')}` },

  { t: 'Đường rsync: dựng ở laptop, chép vào thư mục mới', body: `
    ${pipe([
      { c: 'npm ci && npm run build', d: 'laptop: cây đã dựng', ac: 'grn' },
      { c: 'rsync -az --link-dest', d: '→ phat-hanh/&lt;giờ&gt;-&lt;sha&gt;/<br>chỉ khối khác đi', ac: 'blu' },
      { c: 'ln -sfn + mv -T', d: 'hien-tai → bản mới<br>một rename(2)', ac: 'vio' },
      { c: 'curl -fsS /health', d: 'byte tới ≠ web chạy', ac: 'amb' },
    ], { mui: ['SSH', 'xong mới tráo', 'kiểm'] })}
    ${sh([
      ['BAN=/srv/app/phat-hanh/$(date -u +%F-%H%M%S)-$(git rev-parse --short HEAD)', 'tên = giờ + commit'],
      ['rsync -az --delete --link-dest=/srv/app/hien-tai/ ./ "vps:$BAN/"', 'thư mục MỚI'],
      ['ssh vps "ln -sfn $BAN /srv/app/ht.moi && mv -T /srv/app/ht.moi /srv/app/hien-tai"', 'tráo nguyên tử'],
    ], { fs: 14 })}
    ${term(['# app 627 tệp, 4,5 MB (gồm node_modules) · đếm byte ở card mạng của laptop', '  rsync -az (ca node_modules)           312 ms   gui     648999 byte', '  rsync -az (dich DA co)                233 ms   gui      21621 byte', '  rsync -az (khong doi gi)              233 ms   gui      21255 byte', '  ssh vps true (chi bat tay)            183 ms   gui       5121 byte'], { title: 'laptop → vps (hai container, cùng máy) — đo thật', fs: 14 })}` },

  { t: 'Dấu / cuối NGUỒN đổi cả cây thư mục', body: two(
    `${tree(`# rsync -a dist vps:/srv/app/s1/   (KHÔNG /)
s1/
└── dist/
    ├── index.html
    └── assets/app.css`)}
    ${tree(`# rsync -a dist/ vps:/srv/app/s2/  (CÓ /)
s2/
├── index.html
└── assets/app.css`)}`,
    `${term(['$ rsync -a dist vps:/srv/app/s1/', '$ rsync -a dist/ vps:/srv/app/s2/', '$ ssh vps "cd /srv/app; find s1 s2 -type f | sort"', '! s1/dist/assets/app.css', '! s1/dist/index.html', '= s2/assets/app.css', '= s2/index.html'], { title: 'laptop → vps — output thật', fs: 14.5 })}
    ${box('warn', 'Dấu / ở <b>nguồn</b> = “nội dung của”. Dấu / ở đích không đổi gì. Sai kiểu <code>s1/dist/</code> thì nginx vẫn phục vụ bản CŨ ở <code>s1/index.html</code> — không lỗi nào báo.')}
    ${box('tip', 'Quy ước cả khoá: nguồn và đích <b>luôn</b> có / cuối: <code>rsync -a dist/ vps:$BAN/</code>.')}`, 'l') },

  { t: 'Bảng cờ rsync nên thuộc', body: two(
    table(['Cờ', 'Làm gì', 'Khi nào'], [
      ['<code>-a</code>', '= <code>-rlptgoD</code>: đệ quy, giữ link/quyền/giờ', 'gần như luôn'],
      ['<code>-z</code>', 'nén trên đường truyền', 'chữ, mạng chậm'],
      ['!<code>--delete</code>', 'XOÁ ở đích thứ nguồn không có', 'bản gương — cần chốt'],
      ['<code>-n</code> <code>--dry-run</code>', 'chỉ in kế hoạch, không đổi gì', 'trước mọi lần đầu'],
      ['<code>-i</code> <code>--itemize-changes</code>', 'mã cho từng mục: <code>&lt;f..t…</code> <code>*deleting</code>', 'đọc kế hoạch'],
      ['<code>-c</code> <code>--checksum</code>', 'so NỘI DUNG thay vì cỡ + giờ', 'cùng cỡ, cùng giây'],
      ['<code>--partial</code>', 'giữ tệp chuyển dở để nối tiếp', 'tệp lớn, mạng chập chờn'],
      ['<code>--link-dest=DIR</code>', 'tệp không đổi = liên kết cứng', 'thư mục releases'],
      ['<code>--filter=\'protect P\'</code>', 'cấm xoá P ở đích', '<code>tai-len/</code>, <code>.env</code>'],
    ], { sm: true }),
    `${term(['# app 4,5 MB, chủ yếu là chữ (.js)', 'khong -z: 2334579 byte', '= co -z:    649089 byte', '# một tệp 3 MB ĐÃ NÉN (.gz)', 'tep da nen, khong -z: 3019243 byte 312 ms', '! tep da nen, co -z:    3019971 byte 304 ms'], { title: '-z: đo thật', fs: 14 })}
    ${box('info', '<code>-z</code> giảm <b>3,6 lần</b> với chữ, <b>không</b> giảm gì với tệp đã nén (còn nhiều hơn 728 byte). Bật <code>-z</code> cho mã nguồn/HTML/JSON; ảnh, .gz, .zip thì không được gì.')}`, 'l2') },

  { t: '--delete xoá cả ảnh người dùng — và thoát 0', body: two(
    `${term(['# vps đang có tai-len/quan-trong.jpg và .env — nguồn KHÔNG có', '$ rsync -an --delete --itemize-changes \\', '        dist/ vps:/srv/app/web/', '! *deleting   tai-len/quan-trong.jpg', '! *deleting   tai-len/', '! *deleting   .env', '<f..t...... index.html', '+ exit=0'], { title: 'chạy THỬ (-n) — output thật', fs: 14 })}
    ${term(['$ rsync -a --delete --filter="protect tai-len/" \\', '        --filter="protect .env" -n -i dist/ vps:/srv/app/web/', '= <f..t...... index.html'], { title: 'protect: phía nhận không được xoá', fs: 14 })}`,
    `${term(['# index.html đổi v1 → v9: CÙNG cỡ, CÙNG giờ sửa', '$ rsync -an -i dist/ vps:/srv/app/web/', '# (không in dòng nào — rsync coi là giống nhau)', '$ rsync -an -i --checksum dist/ vps:/srv/app/web/', '= <fc........ index.html'], { title: 'so nhanh (cỡ + giờ) vs --checksum', fs: 14 })}
    ${table(['Ký tự', 'Nghĩa'], [
      ['<code>&lt;</code> · <code>&gt;</code>', 'gửi lên máy xa · nhận về/chép cục bộ'],
      ['<code>f</code> · <code>d</code>', 'tệp · thư mục'],
      ['<code>c</code> · <code>s</code> · <code>t</code>', 'nội dung · cỡ · giờ sửa khác'],
      ['<code>+++</code> · <code>*deleting</code>', 'mục MỚI · sẽ bị XOÁ'],
    ], { sm: true })}`) },

  { t: 'Mac có openrsync, Windows không có rsync', body: `${table(['Cờ (đo thật từng cờ)', 'Mac: openrsync, protocol 29 (“2.6.9 compatible”)', 'Ubuntu 24.04 (3.2.7) · Fedora 44 (3.4.4)'], [
      ['<code>-a -z -n -i --delete --checksum --timeout</code>', '+có', '+có'],
      ['<code>--partial --partial-dir --link-dest --filter --max-delete</code>', '+có', '+có'],
      ['<code>--info=progress2</code>', '-unrecognized option', '+có'],
      ['<code>--append-verify</code> · <code>--chown</code>', '-unrecognized option', '+có'],
      ['mã itemize', '!9 ký tự: <code>&lt;f+++++++</code>', '11 ký tự: <code>&lt;f+++++++++</code>'],
    ], { sm: true })}` + two(
    term(['$ /usr/bin/rsync --version | head -2', 'openrsync: protocol version 29', 'rsync version 2.6.9 compatible', '$ rsync -a --info=progress2 -e "$E" macdist/ deploy@127.0.0.1:/srv/app/mac/', "! rsync: unrecognized option `--info=progress2'", '$ rsync -ai --delete "--filter=protect tai-len/" -e "$E" macdist/ …', '<f+++++++ index.html', '= # tai-len/a.jpg vẫn còn trên vps'], { title: 'Mac M1 → vps (cổng 19022) — output thật', fs: 13 }),
    box('tip', '<b>Mac:</b> script deploy dùng GNU rsync (<code>brew install rsync</code>) hoặc chạy trong Linux. <b>Windows:</b> không có rsync ⇒ dùng WSL; đường dẫn <code>/mnt/c/…</code> hiện quyền <code>777</code> ⇒ thêm <code>--chmod=D755,F644</code>.'), 'l2') },

  /* ───────────── 2.2 git push ───────────── */
  { t: 'git push vào kho trần — hook làm phần còn lại', body: diagram({
    w: 1160, h: 470,
    nodes: [
      { id: 'lap', x: 0, y: 40, w: 250, h: 96, t: 'laptop: ~/app', d: 'git commit\ngit push vps master', ic: '💻', c: 'grn' },
      { id: 'kho', x: 360, y: 40, w: 270, h: 96, t: '/srv/app/kho.git', d: 'kho TRẦN: chỉ có objects\nkhông có cây làm việc', ic: '📦', c: 'vio', mono: true },
      { id: 'hook', x: 740, y: 40, w: 400, h: 96, t: 'hooks/post-receive', d: 'stdin: <cũ> <mới> <ref>\nchạy SAU khi objects đã nhận', ic: '⚙️', c: 'amb', mono: true },
      { id: 'ban', x: 740, y: 230, w: 400, h: 96, t: 'phat-hanh/2026-…-c84837c', d: 'git --work-tree=$BAN checkout -f master', ic: '📁', c: 'blu', mono: true },
      { id: 'ht', x: 360, y: 230, w: 270, h: 96, t: 'hien-tai →', d: 'ln -sfn + mv -T\n(tráo nguyên tử)', ic: '🔗', c: 'dv', mono: true },
      { id: 'app', x: 0, y: 230, w: 250, h: 96, t: 'app / nginx', d: 'đọc từ hien-tai/', ic: '🌐', c: 'tea' },
      { id: 'ket', x: 200, y: 380, w: 760, h: 70, t: 'remote:   [hook] hien-tai → 2026-09-29-010734-c84837c', d: 'mọi dòng hook in ra quay về terminal của bạn, kèm tiền tố remote:', c: 'grn', mono: true },
    ],
    edges: [
      { from: 'lap', to: 'kho', t: 'SSH', c: 'grn' },
      { from: 'kho', to: 'hook', t: 'kích hoạt', c: 'vio' },
      { from: 'hook', to: 'ban', t: '① giải nén', c: 'amb' },
      { from: 'ban', to: 'ht', t: '② trỏ vào', c: 'blu' },
      { from: 'ht', to: 'app', t: '③ phục vụ', c: 'tea' },
    ],
  }) },

  { t: 'Hook post-receive: một lần deploy trong 12 dòng', body: `${sh([
      ['#!/bin/bash', 'LF, không CRLF (slide 13)'],
      ['set -euo pipefail', 'lỗi đầu tiên là dừng'],
      ['DICH=/srv/app', ''],
      ['while read -r cu moi ref; do', 'MỘT dòng mỗi ref'],
      ['  [ "$ref" = "refs/heads/master" ] || { echo "  [hook] bo qua $ref"; continue; }', 'lọc nhánh'],
      ['  BAN="$DICH/phat-hanh/$(date -u +%Y-%m-%d-%H%M%S)-$(echo "$moi" | cut -c1-7)"', ''],
      ['  mkdir -p "$BAN"', 'thư mục MỚI'],
      ['  git --work-tree="$BAN" --git-dir=/srv/app/kho.git checkout -f master', 'ghi tệp ra'],
      ['  echo "  [hook] da giai nen ban $(basename "$BAN")"', ''],
      ['  ln -sfn "$BAN" "$DICH/ht.moi" && mv -T "$DICH/ht.moi" "$DICH/hien-tai"', 'tráo SAU CÙNG'],
      ['  echo "  [hook] hien-tai → $(basename "$(readlink "$DICH/hien-tai")")"', ''],
      ['done', ''],
    ], { fs: 13 })}` + two(
    `${term(['$ git push vps master', 'remote: Already on \'master\'', '= remote:   [hook] da giai nen ban 2026-09-29-010734-c84837c', '= remote:   [hook] hien-tai → 2026-09-29-010734-c84837c', '$ git push vps HEAD:refs/heads/feature/thu', '+ remote:   [hook] bo qua refs/heads/feature/thu'], { title: 'laptop → vps — output thật', fs: 13 })}`,
    box('info', '<code>checkout -f</code> vứt mọi thứ ở thư mục đích — an toàn CHỈ vì <code>$BAN</code> mới tinh. Thiếu dòng 5 thì push nhánh nào cũng lên production.'), 'l') },

  { t: 'Chỉ thứ ĐÃ COMMIT mới đi qua git push', body: two(
    `${term(['$ git status --short', '! M src/app.js          # đang sửa dở, có dòng TODO', '! ?? src/dat-lich.js    # tệp mới, gõ được nửa hàm', '$ rsync -az --exclude=.git ./ vps:/srv/app/rs/   # kiểu deploy.sh cũ', '$ git push vps master                            # kiểu deploy-nha.sh', 'Everything up-to-date', '$ ssh vps \'ls /srv/app/rs/src /srv/app/hien-tai/src; grep -c TODO …\'', '! rs/src:        app.js dat-lich.js', '= hien-tai/src:  app.js', '! /srv/app/rs/src/app.js:1', '= /srv/app/hien-tai/src/app.js:0'], { title: 'cùng cây làm việc, hai đường — output thật', fs: 13 })}`,
    `${box('bad', '<b>Chuyện thật 13/08/2026:</b> <code>deploy.sh</code> rsync CÂY LÀM VIỆC nên <b>ba lần</b> đẩy nhầm tệp mà một phiên khác đang gõ dở — build trên VPS đổ, dù mã đã commit là sạch.')}
    ${box('good', '<code>deploy-nha.sh</code> lấy mã bằng git: lúc đầu <code>git archive HEAD</code> (272 MB mỗi lần), rồi <code>git push</code> vào kho trần ở máy nhà — lần đầu ~150 MB, sau đó vài chục KB. <b>Không đọc đĩa</b> ⇒ tệp đang gõ dở không lọt được.')}
    ${box('warn', 'Cái giá có chủ ý: thay đổi <b>chưa commit</b> không bao giờ lên production. Script hỏi <code>[y/N]</code> khi cây làm việc còn bẩn.')}`, 'l') },

  { t: 'post-receive hỏng, git push vẫn xanh', body: two(
    `${term(['# hooks/post-receive: echo "build HONG" >&2; exit 1', '$ git push thu master; echo "exit=$?"', 'remote:   [post-receive] build HONG', ' * [new branch]      master -> master', '! exit=0'], { title: 'post-receive thoát 1 — output thật', fs: 13.5 })}
    ${term(['# hooks/pre-receive: từ chối nếu src/app.js còn TODO', '$ git push thu master; echo "exit=$?"', 'remote:   [pre-receive] TU CHOI: con TODO trong src/app.js', '!  ! [remote rejected] master -> master (pre-receive hook declined)', 'error: failed to push some refs to \'ssh://vps/srv/app/kho2.git\'', '= exit=1'], { title: 'pre-receive thoát 1 — output thật', fs: 13.5 })}`,
    `${table(['Hook', 'Chạy lúc', 'Thoát ≠ 0 thì'], [
      ['<code>pre-receive</code>', 'TRƯỚC khi lưu gì', '+từ chối cả lần push'],
      ['<code>update</code>', 'trước, cho TỪNG ref', '+từ chối ref đó'],
      ['<code>post-receive</code>', 'SAU khi đã lưu', '-không báo gì, vẫn 0'],
    ], { sm: true })}
    ${steps([
      ['Kiểm được trước (cú pháp, TODO, nhánh) ⇒ <code>pre-receive</code>', 'chặn ngay ở cửa'],
      ['Dựng + tráo ⇒ <code>post-receive</code> với <code>set -euo pipefail</code>', 'lỗi thì dừng, bản cũ vẫn chạy'],
      ['Đọc output <code>remote:</code> — đừng tin <code>exit=0</code>', 'hoặc curl /health sau push'],
    ])}`, 'l') },

  { t: 'Hook mang CRLF từ Windows thì không bao giờ chạy', body: two(
    term(['$ od -c hooks/post-receive | head -1', '0000000   #   !   /   b   i   n   /   b   a   s   h  \\r  \\n   e   c   h', '$ git push crlf master; echo "exit=$?"', "! fatal: cannot exec 'hooks/post-receive': No such file or directory", 'To ssh://vps/srv/app/kho3.git', ' * [new branch]      master -> master', '! exit=0'], { title: 'hook soạn trên Windows — output thật', fs: 13 }),
    box('bad', 'Nhân tìm trình thông dịch tên <code>/bin/bash\\r</code> — không có ⇒ “No such file”. Push vẫn thành công, deploy <b>không hề chạy</b>, không ai thấy nếu không đọc kỹ.'), 'l') + two(
    `${sh([
      ['# 1. kho mã: ép LF cho script và hook', ''],
      ['printf "*.sh text eol=lf\\nhooks/* text eol=lf\\n" >> .gitattributes', ''],
      ['# 2. máy Windows (Git for Windows)', ''],
      ['git config --global core.autocrlf input', 'không đổi LF → CRLF'],
      ['# 3. sửa tệp đã hỏng, trên máy chủ', ''],
      ["sed -i 's/\\r$//' hooks/post-receive", 'bỏ \\r cuối dòng'],
      ['file hooks/post-receive', '"with CRLF" = còn hỏng'],
    ], { fs: 13.5 })}`,
    `${table(['Máy dev', 'git + ssh', 'rsync'], [
      ['Windows', 'Git for Windows / OpenSSH có sẵn', '-không có ⇒ WSL'],
      ['WSL2 (Ubuntu)', '+như Linux', '+GNU rsync'],
      ['macOS', '+có sẵn', '!openrsync (slide 8)'],
    ], { sm: true })}`, 'l2') },

  /* ───────────── 2.3 registry ───────────── */
  { t: 'Ảnh là danh sách lớp — lớp trùng không đi lại', body: two(
    layers({ w: 540, cap: 'dat-lich:v1', rows: [
      { k: '1–4', t: 'node:22-alpine (4 lớp)', sz: '313ad79ffb02…', c: 'blu' },
      { k: '5', t: 'WORKDIR /app', sz: 'b4714786448e', c: 'tea' },
      { k: '6', t: 'COPY package*.json', sz: '0eae6277f54b', c: 'tea' },
      { k: '7', t: 'RUN npm ci --omit=dev', sz: 'bb4efb3c2e82', c: 'tea' },
      { k: '8', t: 'COPY src/ ./src/', sz: '4d86db499775', c: 'amb' },
      { k: '9', t: 'COPY public/ ./public/', sz: 'e02a21b47500', c: 'amb' },
    ] }),
    `${layers({ w: 540, cap: 'dat-lich:v2 — đổi MỘT dòng src/app.js', rows: [
      { k: '1–4', t: 'node:22-alpine — y hệt', sz: '313ad79ffb02…', c: 'grn' },
      { k: '5', t: 'WORKDIR /app', sz: 'b4714786448e', c: 'grn' },
      { k: '6', t: 'COPY package*.json', sz: '0eae6277f54b', c: 'grn' },
      { k: '7', t: 'RUN npm ci · 4,37 MB', sz: 'bb4efb3c2e82', c: 'grn' },
      { k: '8', t: 'COPY src/ — KHÁC · 304 B', sz: 'b5a9d500b536', c: 'red' },
      { k: '9', t: 'COPY public/ — KHÁC (thư mục /app đổi giờ)', sz: '38b958a37b2f', c: 'red' },
    ] })}
    ${box('info', 'Mã băm từng lớp: <code>docker inspect</code>, trường <code>.RootFS.Layers</code>. Registry lưu blob <b>theo mã băm</b> ⇒ 7 lớp trùng chỉ nằm một lần và không bao giờ đi lại.')}`) },

  { t: 'Đẩy v2 lên registry: 27 KB thay vì 63 MB', body: `
    ${pipe([
      { c: 'docker build -t …:v2 .', d: 'máy dựng (dv02-bld)', ac: 'grn' },
      { c: 'docker push', d: 'chỉ lớp registry CHƯA có', ac: 'blu' },
      { c: 'registry:2', d: 'dv02-reg:5000<br>blob theo sha256', ac: 'tea' },
      { c: 'docker pull', d: 'VPS: chỉ lớp nó CHƯA có', ac: 'vio' },
      { c: 'compose up -d', d: 'tráo — Chương 3, 13', ac: 'amb' },
    ], { mui: ['HTTP', 'lưu', 'HTTP', ''] })}
    ${two(
      term(['$ docker push dv02-reg:5000/dat-lich:v2', '= 0eae6277f54b: Layer already exists', '= bb4efb3c2e82: Layer already exists', '= …  (7 lớp: Layer already exists)', '+ b5a9d500b536: Pushed', '+ 38b958a37b2f: Pushed', 'v2: digest: sha256:eefa62d7371f… size: 2197', '$ docker pull dv02-reg:5000/dat-lich:v2     # trên "VPS"', '# (tóm tắt) 7 × Already exists · 2 × Pull complete'], { title: 'dind → registry → dind — output thật', fs: 13 }),
      table(['Đo ở card mạng', 'Thời gian', 'Byte'], [
        ['push v1 (registry rỗng)', '4.890 ms', '63.462.090 gửi'],
        ['!push v2 (đổi 1 dòng)', '79 ms', '+27.420 gửi'],
        ['pull v1 (VPS chưa có gì)', '2.559 ms', '63.118.329 nhận'],
        ['!pull v2 (đổi 1 dòng)', '80 ms', '+15.395 nhận'],
      ], { sm: true }), 'l')}` },

  { t: 'Một dòng COPY . . đặt sai chỗ: 2 MB mỗi lần', body: two(
    `${yaml([
      ['# ĐÚNG — thứ ít đổi lên TRƯỚC', ''],
      ['FROM node:22-alpine', ''],
      ['WORKDIR /app', ''],
      ['COPY package.json package-lock.json ./', 'đổi khi thêm thư viện'],
      ['RUN npm ci --omit=dev --no-audit --no-fund', 'lớp 4,37 MB — giữ cache'],
      ['COPY src/ ./src/', 'đổi MỖI commit'],
      ['COPY public/ ./public/', ''],
      ['CMD ["node", "src/app.js"]', ''],
    ], { lang: 'docker', fs: 14.5 })}
    ${yaml([
      ['# SAI — một commit bất kỳ làm vỡ cache npm ci', ''],
      ['FROM node:22-alpine', ''],
      ['WORKDIR /app', ''],
      ['COPY . .', 'mọi tệp ⇒ đổi mọi lần'],
      ['RUN npm ci --omit=dev --no-audit --no-fund', 'chạy LẠI, mã băm MỚI'],
      ['CMD ["node", "src/app.js"]', ''],
    ], { lang: 'docker', fs: 14.5 })}`,
    `${bars([
      { l: 'push v2 — ĐÚNG', sub: '2 lớp nhỏ', v: 27420, txt: '27.420 byte', c: 'grn' },
      { l: 'push v2 — SAI', sub: 'cả lớp npm ci', v: 1997645, txt: '1.997.645 byte', c: 'red' },
    ], { lw: 170 })}
    ${bars([
      { l: 'build — ĐÚNG', sub: 'cache npm ci', v: 789, txt: '789 ms', c: 'grn' },
      { l: 'build — SAI', sub: 'npm ci lại', v: 1539, txt: '1.539 ms', c: 'red' },
    ], { lw: 170 })}
    ${box('warn', 'Đo thật với express (4,4 MB). App thật có Prisma, Next… lớp phụ thuộc cỡ <b>hàng trăm MB</b> — tỉ lệ ~73 lần ở đây thành hàng phút mỗi lần deploy. Dockerfile vẫn CHẠY, không gì cảnh báo.')}`, 'r') },

  { t: 'Tag đổi được, digest thì không', body: two(
    `${term(['# máy dựng: gắn tag prod cho v1 rồi đẩy', '$ docker pull dv02-reg:5000/dat-lich:prod        # VPS, lần 1', 'dv02-reg:5000/dat-lich@sha256:dd73b24b8201…', '# máy dựng: gắn tag prod cho v2 rồi đẩy — CÙNG TÊN', '$ docker pull dv02-reg:5000/dat-lich:prod        # VPS, lần 2', '! Status: Downloaded newer image for dv02-reg:5000/dat-lich:prod', '$ docker run --rm …:prod node -e "…BAN…"', '! v2', '$ docker pull dv02-reg:5000/dat-lich@sha256:dd73b24b…', '= dv02-reg:5000/dat-lich@sha256:dd73b24b820188e8…'], { title: '"VPS" dv02-vpsd — output thật', fs: 13 })}`,
    `${steps([
      ['<b>Tag</b> = con trỏ ĐỔI ĐƯỢC', 'ai có quyền push cũng dời được; hai máy kéo cùng tag cách nhau một tuần có thể chạy hai mã khác nhau'],
      ['<code>:latest</code> = không có phiên bản nào', 'không lùi được, không trả lời được “đang chạy gì?”'],
      ['<b>Digest</b> = chính nội dung', '<code>@sha256:dd73…</code> kéo ở đâu, năm nào cũng ra đúng bộ byte đó'],
      ['Tag cho NGƯỜI đọc, deploy theo DIGEST', 'tag <code>2026-09-29-c84837c</code> + ghi lại digest ⇒ lùi bản = kéo digest cũ'],
    ])}`, 'l') },

  { t: 'Tập với registry cục bộ — GHCR chỉ khác địa chỉ', body: `${sh([
      ['# registry thử ngay trên máy bạn, chỉ nghe loopback', ''],
      ['docker run -d --name reg -p 127.0.0.1:19025:5000 registry:2', ''],
      ['TAG=$(date -u +%F)-$(git rev-parse --short HEAD)', 'tag đọc được'],
      ['docker build -t localhost:19025/dat-lich:$TAG .', ''],
      ['docker push localhost:19025/dat-lich:$TAG', 'in ra digest'],
      ['docker buildx imagetools inspect \\', ''],
      ['  localhost:19025/dat-lich:$TAG --format "{{.Manifest.Digest}}"', 'ghi lại'],
      ['# thật: GHCR — chỉ đổi tên ảnh + đăng nhập bằng token', ''],
      ['echo "$CR_PAT" | docker login ghcr.io -u USER --password-stdin', 'token: write:packages'],
      ['docker push ghcr.io/USER/dat-lich:$TAG', ''],
    ], { fs: 13.5 })}<div style="height:14px"></div>` + two(
    `${yaml([
      ['# compose.yaml trên VPS — ghim theo DIGEST', ''],
      ['services:', ''],
      ['  app:', ''],
      ['    image: ghcr.io/USER/dat-lich@sha256:dd73b24b…', 'không :latest'],
      ['    env_file: /srv/app/chung/.env', 'Chương 4'],
      ['    restart: unless-stopped', ''],
    ], { fs: 14 })}`,
    `${box('info', 'Registry không TLS: <code>localhost</code> được Docker cho qua sẵn; tên khác (<code>dv02-reg:5000</code>) phải khai “insecure-registry” cho daemon — chỉ trong phòng thí nghiệm.')}
    ${box('warn', 'Cần thêm: registry còn sống, khoá đăng nhập, máy dựng. Chương 13 dựng trọn đường GHCR + CI.')}`) },

  /* ───────────── 2.4 chọn đường ───────────── */
  { t: 'Ba đường, đo trên cùng một thay đổi một dòng', body: `
    ${table(['Đường', 'Chở đi cái gì', 'Lần đầu', 'Đổi 1 dòng', 'Máy chủ cần'], [
      ['<code>rsync -az</code>', 'cây đã dựng + node_modules (627 tệp)', '312 ms · 649 KB', '!233 ms · 21,6 KB', 'rsync'],
      ['<code>git push</code>', 'chỉ mã đã commit (5 tệp)', '222 ms · 14,6 KB', '!204 ms · 6,1 KB', 'git + <b>tự npm ci/build</b>'],
      ['<code>docker push</code>', 'ảnh: nền + thư viện + mã', '4.890 ms · 63,5 MB', '!79 ms · 27,4 KB', 'Docker (không npm, không mã)'],
      ['<code>docker pull</code> (VPS)', 'các lớp nó chưa có', '2.559 ms · 63,1 MB', '!80 ms · 15,4 KB', ''],
      ['<code>ssh vps true</code>', 'chỉ bắt tay SSH — cái sàn', '183 ms · 5,1 KB', '', ''],
    ])}
    ${two(
      box('warn', '<b>Ba hàng chở ba THỨ khác nhau</b> — so byte giữa các hàng là so danh sách loại trừ, không phải so đường truyền. rsync gửi cả node_modules; git không (gitignore) nên máy chủ phải tự dựng.'),
      box('info', '<b>Môi trường:</b> container trên cùng Mac M1, không qua Internet ⇒ VPS thật thêm vài chục–vài trăm ms mỗi lượt đi–về. Số byte thì y như vậy. Registry đi HTTP, không bắt tay SSH ⇒ lần hai nhanh hơn.'))}` },

  { t: 'Đừng so lần đồng bộ ĐẦU với lần CHÊNH LỆCH', body: two(
    `${bars([
      { l: 'rsync lần đầu', sub: 'đích rỗng', v: 648999, txt: '649,0 KB', c: 'red' },
      { l: 'rsync đổi 1 dòng', sub: 'đích đã có', v: 21621, txt: '21,6 KB', c: 'blu' },
      { l: 'rsync không đổi gì', sub: 'vẫn gửi danh sách tệp', v: 21255, txt: '21,3 KB', c: 'blu' },
      { l: 'git push đổi 1 dòng', sub: 'chỉ object mới', v: 6125, txt: '6,1 KB', c: 'vio' },
      { l: 'ssh vps true', sub: 'bắt tay', v: 5121, txt: '5,1 KB', c: 'amb' },
    ], { lw: 230 })}
    ${box('bad', 'Bảng đầu tiên của Bài 2.4 đã so <b>rsync lần đầu</b> (1,5 MB) với <b>git push lần hai</b> (586 byte) — “tệ hơn 2.500 lần” là số của hai phép khác nhau.')}`,
    `${bars([
      { l: 'ssh vps true', sub: 'sàn', v: 183, txt: '183 ms', c: 'amb' },
      { l: 'git push', sub: 'đổi 1 dòng', v: 204, txt: '204 ms', c: 'vio' },
      { l: 'rsync', sub: 'đổi 1 dòng', v: 233, txt: '233 ms', c: 'blu' },
      { l: 'rsync', sub: 'lần đầu, 627 tệp', v: 312, txt: '312 ms', c: 'red' },
    ], { lw: 170, max: 320 })}
    ${box('good', 'Với dự án cỡ này, <b>80–90% thời gian là bắt tay SSH</b>. Tốc độ không phải lý do để chọn đường nào — chọn theo <b>cái gì được phép lên production</b>.')}`) },

  { t: 'Chọn đường theo tạo tác, không theo tốc độ', body: diagram({
    w: 1160, h: 480,
    nodes: [
      { id: 'q1', x: 400, y: 0, w: 360, h: 80, t: 'Runtime phải đi kèm mã?', d: 'Node/glibc đúng bản · nhiều máy chủ', ic: '❓', c: 'amb' },
      { id: 'reg', x: 880, y: 0, w: 280, h: 80, t: 'registry (2.3)', d: 'VPS không cần npm/mã nguồn', ic: '🐳', c: 'tea' },
      { id: 'q2', x: 400, y: 150, w: 360, h: 80, t: 'Tạo tác là MÃ NGUỒN?', d: 'thông dịch, kho nhỏ, 1–2 máy', ic: '❓', c: 'amb' },
      { id: 'git', x: 880, y: 150, w: 280, h: 80, t: 'git push (2.2)', d: 'chỉ thứ đã commit', ic: '📦', c: 'vio' },
      { id: 'rs', x: 400, y: 300, w: 360, h: 80, t: 'rsync (2.1)', d: 'tạo tác ĐÃ DỰNG ở máy khác', ic: '🔁', c: 'blu' },
      { id: 'no', x: 0, y: 150, w: 290, h: 110, t: 'KHÔNG dùng', d: 'scp · FTP · sửa tệp qua SSH\ngit pull trên máy chủ', ic: '⛔', c: 'red' },
      { id: 'moi', x: 0, y: 400, w: 1160, h: 70, t: 'Đường nào cũng: thư mục/ảnh MỚI → kiểm → tráo → giữ bản cũ để lùi', d: 'thứ băng qua đường truyền phải CHÍNH LÀ thứ đã kiểm thử', c: 'grn' },
    ],
    edges: [
      { from: 'q1', to: 'reg', t: 'có', c: 'tea' },
      { from: 'q1', to: 'q2', t: 'không', c: 'amb' },
      { from: 'q2', to: 'git', t: 'có', c: 'vio' },
      { from: 'q2', to: 'rs', t: 'không — đã dựng', c: 'blu' },
    ],
  }) },

  { t: 'Dựng ở đâu là câu hỏi riêng', body: `
    ${cards([
      { ic: '🖥', t: 'Trên VPS', d: 'Khớp nền tảng theo định nghĩa. Nhưng: build 15 phút tuần tự, song song thì <strong>OOM exit 137</strong>; cache 7,6 GB làm đầy đĩa chứa Postgres (18/08).', c: 'red' },
      { ic: '⚙️', t: 'Trong CI', d: 'VPS chỉ còn là máy chủ. Phải KHỚP đích: cùng kiến trúc, cùng libc, cùng Node — thứ trôi lệch lặng lẽ.', c: 'amb' },
      { ic: '🏠', t: 'Máy của bạn', d: '<code>deploy-nha.sh</code>: 12 nhân dựng song song 3–6 phút (~3× nhanh hơn VPS), đẩy GHCR, VPS chỉ kéo + tráo, <strong>không còn cache build</strong>.', c: 'grn' },
      { ic: '🐳', t: 'Trong ảnh đích', d: 'Môi trường dựng CHÍNH LÀ môi trường chạy ⇒ lệch nền tảng không thể xảy ra về cấu trúc.', c: 'tea' },
    ], 4)}
    ${two(
      box('bad', '<b>18/08:</b> <code>docker build .</code> lấy nhầm Dockerfile ⇒ nền Alpine (musl) mang engine Prisma glibc. Build xanh, đẩy xanh, tráo xanh ⇒ backend restart vô tận, <b>502 bảy phút</b>.'),
      box('good', 'Dựng ngoài máy chủ ⇒ thêm MỘT chốt so tạo tác với nơi nó sẽ chạy, <b>trước khi đẩy</b>: libc ↔ engine, <code>node -v</code>, kiến trúc (<code>--platform linux/amd64</code> khi dựng từ Mac M1).'))}` },

  /* ───────────── 2.5 hỏng nửa chừng ───────────── */
  { t: 'Đứt giữa chừng: 325 tệp mới trộn 75 tệp cũ', body: `
    ${honSvg()}
    ${two(
      term(['# tc qdisc … netem rate 4mbit · 400 tệp · giết sau 4 s', '$ timeout -s KILL 4 rsync -a rel/ vps:/srv/app/song/', '! rsync rc=137 sau 4005 ms', '  con PHIEN BAN 1: 75 tep', '  da thanh PHIEN BAN 2: 325 tep', '  tep tam con sot: 0'], { title: 'thẳng vào thư mục đang chạy — output thật', fs: 13 }),
      term(['$ timeout -s KILL 4 rsync -a --link-dest=../b1 rel/ vps:…/b2/', 'rc=137', '= hien-tai -> /srv/app/r/phat-hanh/b1', '=   ban dang song co PHIEN BAN 2: 0 tep', '  b2 (do dang) co: 365 tep', '$ rsync -a --link-dest=../b1 rel/ vps:…/b2/   # chạy lại', '= hien-tai -> /srv/app/r/phat-hanh/b2'], { title: 'thư mục mới + symlink — output thật', fs: 13 }))}` },

  { t: 'Hai lần deploy chồng nhau: bản CŨ thắng', body: `${duaSvg()}` + two(
    `${term(['$ bash trien.sh A 1.5 & sleep 0.15; bash trien.sh B 0.3 & wait', '  [B] xong, hien-tai → B', '  [A] xong, hien-tai → A', '! KET QUA: dang phuc vu A'], { title: 'vps — output thật', fs: 13 })}
    ${box('bad', 'Cả hai thoát 0, cả hai in “xong”. Người deploy B tin bản sửa đã lên — production chạy A cho tới lần deploy sau.')}`,
    box('info', '<b>Chuyện thật</b> (app desktop, 19–20/08): 11 lần bump phiên bản trong 4,5 giờ từ nhiều phiên; một bản <b>chưa từng</b> phát hành mà ai cũng tin đã ship.'), 'l') },

  { t: 'flock -n bỏ cuộc, flock -w chờ tới lượt', body: two(
    `${sh([
      ['# đầu script deploy, TRÊN MÁY CHỦ', ''],
      ['exec 9>/var/lock/deploy.lock', 'mở fd 9, giữ suốt script'],
      ['if ! flock -n 9; then', '-n: không chờ'],
      ['  echo "co lan deploy khac dang chay — DUNG" >&2', ''],
      ['  exit 1', 'CI thấy ĐỎ'],
      ['fi', ''],
      ['# … chuyển · kiểm · tráo …', 'fd đóng ⇒ nhân nhả khoá'],
    ], { fs: 15 })}
    ${table(['Dạng', 'Giữ khoá bao lâu'], [
      ['<code>flock tệp lệnh</code>', 'chỉ trong MỘT lệnh'],
      ['!<code>exec 9&gt;tệp; flock 9</code>', 'suốt đời shell — dùng cái này'],
    ], { sm: true })}`,
    `${term(['══ khoa: n ══', '! [B] co lan deploy khac dang chay — DUNG', '  [A] xong, hien-tai → A', '  KET QUA: dang phuc vu A', '══ khoa: w ══', '  [A] xong, hien-tai → A', '  [B] xong, hien-tai → B', '= KET QUA: dang phuc vu B'], { title: 'vps, cùng hai lần deploy — output thật', fs: 13.5 })}
    ${box('tip', '<code>-w 10</code>: bản MỚI NHẤT thắng — gần như luôn là điều bạn muốn. Khoá phải nằm trên <b>máy chủ</b>, không trên laptop; bị giết, sập, rớt SSH thì nhân tự nhả.')}`) },

  { t: '--partial nối tiếp, --timeout biến treo thành lỗi', body: two(
    `${term(['# tệp 8 MB · netem rate 4mbit · lần 1 bị giết sau 6 s', '# lần 2 (chạy lại):', '! che do [mac dinh]: … lan 2 gui 9388456 byte, 17045 ms', '= che do [--partial-dir=…]: … lan 2 gui 5407864 byte, 8527 ms', '# ls -la /srv/app/p/.rsync-tam (sau khi bị giết)', '-rw-r--r-- 1 deploy deploy 4096000 Sep 29 01:09 to.bin'], { title: 'nối tiếp — output thật', fs: 13.5 })}
    ${box('info', 'Mặc định rsync <b>xoá</b> tệp chuyển dở. <code>--partial-dir</code> giữ nó ở chỗ KHÁC tên thật ⇒ lần sau nối tiếp, và không bao giờ phơi ra một tệp viết dở mang tên thật.')}`,
    `${term(['# đang chuyển 30 MB thì mạng mất 100% gói', '$ rsync -a --timeout=5 lon.bin vps:/srv/app/t/', '[sender] io timeout after 6 seconds -- exiting', '! rsync error: timeout in data send/receive (code 30) …', '= rc=30 sau 17 s', '$ timeout 25 rsync -a lon.bin vps:/srv/app/t2/   # KHÔNG --timeout', '! rc=124 sau 25 s          # tự nó sẽ treo tiếp'], { title: 'mạng chết — output thật', fs: 13.5 })}
    ${sh([
      ['for i in 1 2 3; do', 'TỐI ĐA 3 lần'],
      ['  rsync -a --partial-dir=.rsync-tam --timeout=30 \\', ''],
      ['    ./ "vps:$BAN/" && break', ''],
      ['  [ $i = 3 ] && { echo "HONG sau 3 lan" >&2; exit 1; }', 'hỏng phải ỒN'],
      ['  sleep $((i * 5))', 'lùi dần 5, 10 s'],
      ['done', ''],
    ], { fs: 13.5 })}`) },

  { t: 'Bước nào chạy lại được an toàn', body: two(
    table(['Bước', 'Chạy lại?', 'Vì sao'], [
      ['Chuyển vào thư mục bản phát hành MỚI', '+an toàn', 'không ai đang dùng; chạy lại = ghi cho đủ'],
      ['Tráo symlink (<code>ln -sfn</code> + <code>mv -T</code>)', '+an toàn', 'trỏ lại chỗ cũ không đổi gì; rename không dở được'],
      ['<code>docker push</code> / <code>pull</code>', '+an toàn', 'blob theo mã băm; lớp đã có thì bỏ qua'],
      ['<code>git push</code> + post-receive', '!cẩn thận', '“up-to-date” ⇒ hook KHÔNG chạy lại'],
      ['rsync THẲNG vào thư mục đang chạy', '!nguy hiểm', 'mớ trộn còn trộn thêm trong lúc chạy'],
      ['Migration cơ sở dữ liệu', '-không', 'nửa chừng ⇒ P3009, mọi deploy sau bị chặn (Ch5)'],
    ], { sm: true }),
    `${steps([
      ['Ghi vào một <b>tên chưa ai dùng</b>', 'giờ + mã commit'],
      ['<b>Khoá</b> trên máy chủ', 'một lần một deploy'],
      ['<b>Trần</b> cho mọi vòng thử lại', 'số lần + <code>--timeout</code>'],
      ['Byte tới ≠ web chạy ⇒ <b>kiểm HTTP</b>', 'Bài 0.3 · Chương 3'],
    ])}
    ${box('warn', 'Hook chỉ chạy khi ref <b>đổi</b> ⇒ chạy lại một deploy git hỏng: commit mới, hoặc chạy script dựng bằng tay.')}`, 'l2') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 2', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Ảnh người dùng / <code>.env</code> biến mất sau deploy', '<code>--delete</code> dọn thứ nguồn không có', '<code>-n -i</code> trước · <code>protect</code> · để trạng thái NGOÀI thư mục deploy'],
    ['Web vẫn hiện bản cũ, deploy “thành công”', 'thiếu / cuối nguồn ⇒ <code>app/dist/</code>', 'nguồn và đích luôn có <code>/</code>'],
    ['Lỗi vô nghĩa, mã không khớp commit nào', 'rsync đứt giữa chừng vào thư mục ĐANG CHẠY', 'thư mục mới + symlink'],
    ['Build đổ vì một tệp chẳng ai commit', 'rsync CÂY LÀM VIỆC (tệp đang gõ dở)', 'gửi bằng git / ảnh dựng từ commit'],
    ['Push xanh mà web không đổi', 'post-receive hỏng · hook CRLF · push “up-to-date”', 'đọc dòng <code>remote:</code> · <code>eol=lf</code> · curl sau push'],
    ['Mỗi deploy kéo hàng trăm MB', '<code>COPY . .</code> trước <code>npm ci</code>', 'thứ ít đổi lên trước'],
    ['Hai máy cùng tag chạy mã khác nhau', 'tag bị dời', 'deploy theo digest'],
    ['Bản sửa mới nhất không lên', 'hai deploy chồng nhau', '<code>flock -w</code> trên máy chủ'],
    ['Deploy treo cả tiếng', 'không <code>--timeout</code>, thử lại vô hạn', 'trần số lần + thời gian'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 2 (1/2): rsync', body: two(
    sh([
      ['rsync -az src/ vps:dst/', '/ cuối = nội dung'],
      ['rsync -ain --delete src/ vps:dst/', 'CHẠY THỬ, đọc từng mục'],
      ['rsync -a --stats …', 'Literal / Matched / sent'],
      ['rsync -a -c …', 'so nội dung, không cỡ+giờ'],
      ["rsync -a --delete --filter='protect tai-len/' …", 'cấm xoá ở đích'],
      ["rsync -a --exclude='.env*' --exclude=.git …", 'không chở bí mật'],
      ['rsync -a --max-delete=50 …', 'phanh xoá hàng loạt'],
      ['rsync -a --link-dest=/srv/app/hien-tai/ ./ vps:$BAN/', 'bản mới, tệp trùng = hardlink'],
      ['rsync -a --partial-dir=.rsync-tam --timeout=30 …', 'nối tiếp · không treo'],
      ['rsync -a -e "ssh -p 2222" …', 'cổng SSH lạ'],
      ['rsync -a --chmod=D755,F644 …', 'từ WSL /mnt/c'],
    ], { fs: 13.5 }),
    table(['Mã itemize', 'Nghĩa'], [
      ['<code>&lt;f+++++++++</code>', 'tệp MỚI gửi lên'],
      ['<code>&lt;f..t......</code>', 'giờ sửa khác (nội dung đi bằng chênh lệch)'],
      ['<code>&lt;fc........</code>', 'nội dung khác (<code>-c</code>)'],
      ['<code>cd+++++++++</code>', 'thư mục mới'],
      ['!<code>*deleting</code>', 'SẼ XOÁ ở đích'],
      ['<code>.d..t......</code>', 'thư mục chỉ đổi giờ'],
    ], { sm: true }), 'l2') },

  { t: 'Bảng tra nhanh Chương 2 (2/2): git, registry, khoá', body: `${
    sh([
      ['git init --bare /srv/app/kho.git', 'máy chủ: kho trần'],
      ['git remote add vps ssh://vps/srv/app/kho.git', 'laptop'],
      ['git push vps master', 'deploy = push'],
      ['git --work-tree=$BAN --git-dir=… checkout -f master', 'trong hook'],
      ['chmod +x hooks/post-receive', 'thiếu x = không chạy'],
      ['printf "*.sh text eol=lf\\n" >> .gitattributes', 'chống CRLF'],
      ['exec 9>/var/lock/deploy.lock; flock -w 10 9', 'một deploy một lúc'],
      ['ln -sfn $BAN ht.moi && mv -T ht.moi hien-tai', 'tráo nguyên tử'],
    ], { fs: 13.5 })}<div style="height:14px"></div>${
    sh([
      ['docker build -t REG/app:$TAG .', 'tag = ngày + commit'],
      ['docker push REG/app:$TAG', '“Layer already exists”'],
      ['docker buildx imagetools inspect REG/app:$TAG', 'lấy digest'],
      ['docker pull REG/app@sha256:…', 'VPS kéo đúng byte'],
      ['docker history --format "{{.Size}} {{.CreatedBy}}" IMG', 'lớp nào to'],
      ['docker inspect -f "{{.RootFS.Layers}}" IMG', 'mã băm từng lớp'],
      ['docker run -d -p 127.0.0.1:19025:5000 registry:2', 'registry tập'],
      ['echo "$CR_PAT" | docker login ghcr.io -u USER --password-stdin', 'GHCR'],
    ], { fs: 13.5 })}` },

  { t: 'Thực hành Chương 2 (45 phút): ba đường, một sự cố', body: `
    ${steps([
      ['Dựng VPS thí nghiệm (container Ubuntu + sshd) và một "laptop"; <code>ssh vps true</code> đo cái sàn', 'con số ms của riêng máy bạn'],
      ['rsync app vào <code>phat-hanh/b1</code> + symlink; đổi một dòng, <code>--stats</code> lần hai', 'Literal data (openrsync của Mac: Unmatched data) chỉ vài KB'],
      ['<code>rsync -ain --delete</code> lên thư mục có <code>tai-len/</code>: đọc <code>*deleting</code>, thêm <code>protect</code>, chạy lại', 'không còn dòng *deleting nào'],
      ['Kho trần + post-receive; push; rồi làm hỏng hook (<code>exit 1</code>, CRLF) và xem push vẫn <code>exit=0</code>', 'giải thích được vì sao'],
      ['<code>tc … netem rate 4mbit</code>, giết rsync sau 4 s: một lần vào thư mục đang chạy, một lần vào thư mục mới', 'đếm tệp bản 1/bản 2 ở cả hai'],
    ])}
    ${box('good', '<b>Đạt khi:</b> có ba con số (sàn SSH, rsync và git push lần hai), <code>hien-tai</code> không trỏ vào mớ trộn, đã dọn container + mạng.')}` },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
