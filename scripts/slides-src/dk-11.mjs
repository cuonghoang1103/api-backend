/**
 * Docker · Deck dk-11 — Chương 11: Chạy trên production.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 24/09/2026:
 *   • "máy Linux" = Fedora 44, Docker Engine 29.6.2 amd64 (cgroup v2, kho ảnh containerd)
 *   • "máy Mac"   = Mac M1, Docker Desktop 4.91 / Engine 29.8.0 arm64
 * Tên đối tượng trong output mang tiền tố dk11- (luật an toàn của khoá); trong bài người học dùng tên ngắn.
 * Phần "khởi động lại máy" KHÔNG chạy thật (không restart dockerd trên máy đang chạy việc thật) — vẽ theo
 * tài liệu docs.docker.com và ghi rõ trên slide. Các sự cố VPS là chuyện thật của một dự án sinh viên.
 */
import { S, cover, cards, box, steps, table, vs, kpis, two, mindmap, host, term as dkTerm, diagram, yaml, bars, esc, D } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });

export const deck = { key: 'dk-11', code: 'DOCKER · CHƯƠNG 11', title: 'Chạy trên production', sub: 'Docker · Chương 11' };

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

/* Slide 4 — độ trễ restart đo thật bằng docker events (máy Linux) */
const backoff = () => {
  const d = [0.14, 0.24, 0.44, 0.86, 1.63, 3.23, 6.43, 12.84, 25.64];
  const x0 = 250, bw = 34, gap = 64, H = 250, base = 290, max = 26;
  let s = T(0, 24, 'chờ giữa "die" và "start" kế tiếp', { fs: 15, c: 'mu' });
  d.forEach((v, i) => {
    const x = x0 + i * (bw + gap), h = Math.max(4, (v / max) * H);
    s += `<rect x="${x}" y="${base - h}" width="${bw}" height="${h}" rx="5" fill="${i < 4 ? D.grn : i < 7 ? D.amb : D.red}" opacity=".85"/>`;
    s += T(x + bw / 2, base - h - 10, v.toFixed(2).replace('.', ',') + ' s', { fs: 14.5, a: 'middle', mono: true, b: true });
    s += T(x + bw / 2, base + 22, `lần ${i + 2}`, { fs: 13.5, a: 'middle', c: 'mu' });
  });
  s += `<line x1="${x0 - 14}" y1="${base}" x2="1150" y2="${base}" stroke="${D.bd}" stroke-width="2"/>`;
  s += T(0, 90, 'sh -c "sleep 2; exit 1"', { fs: 16, mono: true, b: true }) + T(0, 116, '--restart on-failure', { fs: 15, mono: true, c: 'tea' });
  s += T(0, 160, 'mỗi lần ≈ ×2', { fs: 20, c: 'amb', b: true }) + T(0, 188, 'bắt đầu ~0,1 s', { fs: 15, c: 'mu' });
  s += T(0, 212, 'trần ~1 phút', { fs: 15, c: 'mu' }) + T(0, 236, 'đứng vững ≥ 10 s ⇒ về 0', { fs: 15, c: 'mu' });
  return sv(1150, 322, s);
};

/* Slide 19 — khoảng trống lúc up -d tráo container (đo thật trên Mac) */
const gapLine = () => {
  const X = (t) => 60 + t * 105; // 0..10 s
  let s = '';
  for (let t = 0; t <= 10; t++) s += `<line x1="${X(t)}" y1="40" x2="${X(t)}" y2="236" stroke="#1d2a40" stroke-width="1"/>` + T(X(t), 258, `${t}s`, { fs: 13.5, a: 'middle', c: 'dim', mono: true });
  const band = (y, t1, t2, c, lbl) => `<rect x="${X(t1)}" y="${y}" width="${X(t2) - X(t1)}" height="38" rx="7" fill="${D[c]}" opacity=".25" stroke="${D[c]}" stroke-width="2"/>` + T((X(t1) + X(t2)) / 2, y + 25, lbl, { fs: 15, a: 'middle', b: true });
  s += T(0, 30, 'container CŨ (v1)', { fs: 15, c: 'mu' }) + band(40, 0, 2.0, 'grn', 'phục vụ bình thường');
  s += `<rect x="${X(2.0)}" y="40" width="${X(2.2) - X(2.0)}" height="38" fill="${D.amb}" opacity=".8"/>` + T(X(2.1), 100, 'SIGTERM · 0,2 s', { fs: 13.5, a: 'middle', c: 'amb' });
  s += T(0, 128, 'container MỚI (v2)', { fs: 15, c: 'mu' }) + band(138, 2.2, 4.4, 'red', 'đang "nối CSDL" 2 s') + band(138, 4.4, 10, 'grn', 'phục vụ');
  s += `<rect x="${X(2.0)}" y="190" width="${X(4.2) - X(2.0)}" height="36" rx="7" fill="${D.red}" opacity=".85"/>` + T(X(3.1), 214, '26 request lỗi', { fs: 15.5, a: 'middle', b: true });
  s += T(X(4.4) + 14, 214, '111 request OK (curl mỗi 50 ms trong 12 s)', { fs: 14.5, c: 'grn' });
  return sv(1150, 268, s);
};

export const slides = S([
  cover({ t: 'Chương 11 — Chạy trên production', sub: 'Restart &amp; reboot · hạn mức &amp; exit 137 · log &amp; đĩa đầy · cập nhật, CI/CD &amp; quay lui · dọn dẹp &amp; giám sát', chap: 'CHƯƠNG 11' }),

  { t: 'Bản đồ chương: 5 thứ làm sập một VPS lúc 3 giờ sáng', body: mindmap('Production', 'sống sót khi bạn đang ngủ', [
    { t: '11.1 Restart', d: 'sập thì tự dậy · qua được reboot · đọc vòng lặp sập', c: 'dk' },
    { t: '11.2 Hạn mức', d: 'một chỗ rò chỉ giết MỘT container · exit 137', c: 'red' },
    { t: '11.3 Log', d: 'json-file không tự xoay ⇒ đĩa đầy', c: 'amb' },
    { t: '11.4 Cập nhật', d: 'khoảng trống khi tráo · tag theo commit · quay lui', c: 'tea' },
    { t: '11.5 Đĩa &amp; giám sát', d: 'thang prune an toàn · 5 phép kiểm tối thiểu', c: 'vio' },
  ]) },

  /* ───────────── 11.1 ───────────── */
  { t: 'Bốn chính sách restart — unless-stopped là mặc định đúng', body: `
    ${table(['Chính sách', 'App sập (exit ≠ 0)', 'App tự thoát 0', 'Bạn <code>docker stop</code>', 'dockerd khởi động lại / reboot', 'Dùng cho'], [
      ['<code>no</code> (mặc định)', '-nằm chết', '-nằm yên', 'nằm yên', '-không lên', 'migration, seed, việc một lần'],
      ['<code>on-failure[:N]</code>', '+dậy (tối đa N lần)', 'nằm yên', 'nằm yên', '-không lên', 'worker theo lô'],
      ['<code>always</code>', '+dậy', '+dậy', 'nằm yên…', '!LÊN LẠI — kể cả cái bạn đã stop', 'hiếm khi'],
      ['<code>unless-stopped</code>', '+dậy', '+dậy', 'nằm yên', '+lên lại, trừ cái bạn đã stop', '+mọi dịch vụ chạy dài'],
    ], { sm: true })}
    ${box('info', 'Nguồn: docs.docker.com “Start containers automatically”. Chính sách chỉ có hiệu lực khi container đã <b>khởi động thành công</b> — Docker hiểu là đã chạy được ≥ 10 giây.')}` },

  { t: 'Docker không nện liên hồi: độ trễ restart nhân đôi', body: `
    ${backoff()}
    ${two(
    term(['$ docker events --filter container=flaky \\', '    --filter event=start --filter event=die', '…die 1 → start sau 0,14 s → die 1 → start sau 0,24 s …', '$ docker inspect -f \'{{.RestartCount}} restarts\' flaky', '+ 7 restarts         # sau 25 giây'], { title: 'output thật — máy Linux, Docker 29.6' }),
    box('tip', 'Vòng lặp sập tự <b>chậm dần</b> nên không ngốn máy — nhưng cũng vì thế mà nó im lặng. Nhìn <code>RestartCount</code>, đừng chờ nó “làm ồn”.'), 'l')}` },

  { t: 'Đổi chính sách không cần tạo lại container; on-failure:3 bỏ cuộc sau 3 lần', body: two(
    `${term(['$ docker run -d --name web nginx:1.27-alpine', '$ F=\'{{.HostConfig.RestartPolicy.Name}}\'', '$ docker inspect -f "$F" web', '! no', '$ docker update --restart unless-stopped web', 'web', '$ docker inspect -f "$F" web', '= unless-stopped'], { title: 'output thật — máy Mac' })}
    ${box('good', 'Quên <code>--restart</code> trên container đang chạy? <code>docker update</code> sửa tại chỗ, không mất tầng ghi. Trong compose: ghi <code>restart: unless-stopped</code> rồi <code>up -d</code>.')}`,
    term(['$ docker run -d --name cap \\', '    --restart on-failure:3 \\', '    alpine sh -c \'exit 3\'', '$ docker inspect -f \\', '  \'{{.RestartCount}} · {{.State.Status}}\' cap', '! 3 · exited', '$ docker ps -a --filter name=cap \\', '    --format \'{{.Status}}\'', 'Exited (3) 4 seconds ago'], { title: 'output thật — máy Mac' }), 'l') },

  { t: 'Reboot: dockerd dựng lại container theo chính sách — KHÔNG theo depends_on', body: `
    ${diagram({ w: 1160, h: 250, nodes: [
      { id: 'b', x: 0, y: 20, w: 190, h: 70, t: 'Máy bật lại', d: 'mất điện / vá nhân', c: 'dim' },
      { id: 's', x: 250, y: 20, w: 230, h: 70, t: 'systemd', d: 'docker.service enabled?', c: 'blu' },
      { id: 'd', x: 540, y: 20, w: 230, h: 70, t: 'dockerd', d: 'đọc chính sách từng container', c: 'dk' },
      { id: 'u', x: 840, y: 0, w: 310, h: 64, t: 'always · unless-stopped', d: 'lên lại — thứ tự NGẪU NHIÊN', c: 'grn' },
      { id: 'n', x: 840, y: 90, w: 310, h: 64, t: 'no · on-failure', d: 'nằm im, không ai báo', c: 'red' },
      { id: 'c', x: 250, y: 170, w: 520, h: 72, t: 'unit systemd chạy “docker compose up -d --no-build”', d: 'cả STACK lên đúng thứ tự depends_on, đúng file env', c: 'tea' },
    ], edges: [
      { from: 'b', to: 's', c: 'dim' }, { from: 's', to: 'd', c: 'blu' }, { from: 'd', to: 'u', c: 'grn' }, { from: 'd', to: 'n', c: 'red' },
      { from: 's', to: 'c', c: 'tea', t: 'tuỳ chọn' },
    ] })}
    ${two(term(['$ systemctl is-enabled docker', '= enabled', '$ docker info -f \'{{.LiveRestoreEnabled}}\'', 'false'], { title: 'output thật — máy Linux (chỉ đọc)' }),
    box('warn', 'Slide này vẽ theo <b>tài liệu</b>, không reboot máy thật. Hãy tự thử một lần trên VPS của bạn vào lúc vắng: reboot rồi <code>docker compose ps</code>. API lên trước Postgres là chuyện bình thường ⇒ app phải tự thử lại (Bài 9.3).'), 'l')}` },

  { t: 'Ba con số đọc một vòng lặp sập trước khi đọc log', body: two(
    term(['$ docker ps -a --filter name=flaky \\', '    --format \'{{.Names}} {{.Status}}\'', '! flaky Restarting (1) 3 seconds ago', '$ docker inspect -f \\', '  \'{{.RestartCount}} {{.State.ExitCode}} {{.State.OOMKilled}}\' \\', '  flaky', '+ 10 1 false', '$ docker logs --tail 3 flaky    # chỉ đọc lần CUỐI'], { title: 'output thật — máy Linux' }),
    table(['Bạn thấy', 'Nghĩa là', 'Nhìn tiếp'], [
      ['<code>RestartCount</code> tăng', 'vòng lặp, không phải một lần', '<code>docker events</code>'],
      ['<code>ExitCode 1</code>', 'app tự báo lỗi (thiếu env, không nối được DB)', '<code>docker logs --tail</code>'],
      ['-<code>137</code> + <code>OOMKilled=true</code>', 'chạm trần RAM', 'Bài 11.2'],
      ['<code>137</code> + <code>false</code>', 'bị kill / stop quá hạn', 'ai gõ <code>kill</code>?'],
      ['<code>143</code>', 'SIGTERM, thoát tử tế', 'bình thường'],
      ['<code>127</code> / restart vô tận ngay khi lên', 'ảnh hỏng: thiếu lệnh, sai libc', 'đổi ảnh, quay lui'],
    ], { sm: true }), 'l') },

  /* ───────────── 11.2 ───────────── */
  { t: 'Không hạn mức: một chỗ rò kéo chết luôn Postgres', body: two(
    `<div style="font-size:18px;font-weight:800;color:${D.red};margin-bottom:6px">❌ Không đặt <code>memory</code></div>
    ${host({ t: 'VPS 6 GB — RAM cạn', cols: 3, ctrs: [
      { n: 'worker', im: 'rò 4 GB', c: 'amb', items: ['vẫn sống'] },
      { n: 'db', im: 'postgres', c: 'red', items: ['<b>bị nhân GIẾT</b>', 'vì to nhất'] },
      { n: 'api', im: 'node', c: 'red', items: ['502 theo'] },
    ] })}
    ${box('bad', 'Máy cạn RAM ⇒ nhân chọn nạn nhân theo điểm <code>oom_score</code>: thường là tiến trình TO nhất — Postgres. Log của worker thủ phạm lại chẳng có gì lạ.')}`,
    `<div style="font-size:18px;font-weight:800;color:${D.grn};margin-bottom:6px">✅ Mỗi dịch vụ một trần</div>
    ${host({ t: 'VPS 6 GB — còn thở', cols: 3, ctrs: [
      { n: 'worker', im: 'trần 256M', c: 'red', items: ['<b>exit 137</b>', 'tự dậy lại'] },
      { n: 'db', im: 'trần 1G', c: 'grn', items: ['không hay biết'] },
      { n: 'api', im: 'trần 512M', c: 'grn', items: ['vẫn phục vụ'] },
    ] })}
    ${box('tip', 'Hạn mức biến “cả máy sập” thành “một container khởi động lại”. Đó là toàn bộ cuộc đánh đổi.')}`) },

  { t: 'Chạm trần ⇒ nhân giết bằng SIGKILL: exit 137, sự kiện oom, dòng dmesg', body: `
    ${term(['$ docker run --name oom --memory 128m --memory-swap 128m \\', '    alpine dd if=/dev/zero of=/dev/null bs=200M count=1 ; echo "exit: $?"', '! exit: 137', '$ docker inspect -f \'OOMKilled={{.State.OOMKilled}}\' oom', '! OOMKilled=true', '# docker events trong lúc đó:  create → attach → start → oom → die 137', '$ docker run --rm --pid=host --privileged alpine dmesg | grep -i "killed process"', '+ Memory cgroup out of memory: Killed process 511503 (dd) total-vm:206436kB,', '+   anon-rss:130476kB, file-rss:900kB, … oom_score_adj:0'], { title: 'output thật — máy Linux, Docker 29.6' })}
    ${two(kpis([{ v: '137', l: '= 128 + 9 (SIGKILL)', c: 'red' }, { v: '128 MB', l: 'anon-rss ≈ đúng trần', c: 'amb' }]),
    box('info', '<b>“Memory cgroup out of memory”</b> = container chạm trần CỦA NÓ, máy chủ vẫn ổn. Nếu dmesg ghi <b>“Out of memory”</b> không kèm cgroup ⇒ cả máy cạn RAM, nạn nhân có thể là bất kỳ ai.'), 'l2')}` },

  { t: 'deploy.resources trong compose = mấy con số ghi vào cgroup', body: two(
    yaml([
      ['services:', ''],
      ['  api:', ''],
      ['    deploy:', ''],
      ['      resources:', ''],
      ['        limits:', ''],
      ['          memory: 512M', 'trần CỨNG ⇒ vượt là chết'],
      ['          cpus: "1.5"', '1,5 nhân ⇒ vượt là CHẬM'],
      ['        reservations:', ''],
      ['          memory: 256M', 'sàn mềm, gần như ghi chú'],
      ['    memswap_limit: 512M', 'bằng memory ⇒ không swap'],
    ], { fs: 15 }),
    `${term(['$ docker compose up -d', '$ docker inspect dk11-lim-api-1 -f \\', '  \'{{.HostConfig.Memory}} {{.HostConfig.MemorySwap}} \\', '  {{.HostConfig.NanoCpus}}\'', '+ 536870912 536870912 1500000000', '# = 512 MiB RAM · 512 MiB RAM+swap · 1,5 CPU', '$ docker stats --no-stream --format \\', '    \'{{.Name}} {{.MemUsage}}\' dk11-lim-api-1', 'dk11-lim-api-1 9.355MiB / 512MiB'], { title: 'output thật — máy Mac, Compose v2' , fs: 14 })}
    ${box('info', '<code>deploy.resources</code> CÓ tác dụng với <code>docker compose</code> thường (không cần Swarm) — cột LIMIT của <code>docker stats</code> là bằng chứng.')}`, 'l') },

  { t: 'Hết CPU thì CHẬM, hết RAM thì CHẾT', body: `
    ${vs({
      no: { t: 'limits.memory — trần CỨNG', items: ['Vượt một byte ⇒ SIGKILL, exit 137', 'Không có “chậm lại cho kịp”', 'Đặt cho MỌI dịch vụ chạy dài'] },
      yes: { t: 'limits.cpus — HẠN NGẠCH', items: ['Vượt ⇒ bị bóp, chạy chậm lại', 'Không bao giờ giết container', '<code>"0.5"</code> = 50 ms CPU mỗi 100 ms'] },
    })}
    ${term(['# container chạy vòng lặp vô tận "while :; do :; done", trần cpus: "0.5"', '$ docker stats --no-stream --format \'table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\'', 'NAME              CPU %     MEM USAGE / LIMIT', '+ dk11-lim-burn-1   49.77%    660KiB / 64MiB'], { title: 'output thật — máy Mac' })}` },

  { t: 'Chỉ đặt memory thì swap được GẤP ĐÔI; mem_swappiness bị vứt trên cgroup v2', body: two(
    term(['# compose chỉ ghi limits.memory: 64M, không ghi memswap_limit', '$ docker inspect -f \'mem={{.HostConfig.Memory}} \\', '  swap={{.HostConfig.MemorySwap}}\' dk11-lim-burn-1', '! mem=67108864 swap=134217728      # 64M RAM + 64M swap', '$ docker run --rm --memory 128m --memory-swappiness 0 alpine echo ok', '! WARNING: Your kernel does not support memory swappiness', '! capabilities or the cgroup is not mounted. Memory swappiness', '! discarded.', 'ok'], { title: 'output thật — Mac và máy Linux giống nhau (cgroup v2)' }),
    `${table(['Muốn', 'Ghi trong compose'], [
      ['Không cho swap', '<code>memswap_limit</code> = <code>memory</code>'],
      ['Cho swap thêm X', '<code>memswap_limit</code> = memory + X'],
      ['-<code>mem_swappiness: 0</code>', '-bị bỏ qua trên cgroup v2 (Ubuntu 22.04+)'],
    ], { sm: true })}
    ${box('warn', 'Máy chủ có swap mà không đặt <code>memswap_limit</code> ⇒ app rò rỉ không chết nhanh, nó <b>chậm dần</b> vì swap — khó nhận ra hơn một cú exit 137.')}`, 'l') },

  { t: 'Node 20+ tự đọc trần cgroup — Node 18 thì không', body: two(
    bars([
      { l: 'node:18 · -m 512m', sub: 'không biết trần', v: 2096, txt: '2096 MB', c: 'red' },
      { l: 'node:20 · -m 512m', sub: '≈ nửa trần', v: 259, txt: '259 MB', c: 'grn' },
      { l: 'node:22 · -m 512m', sub: '≈ nửa trần', v: 259, txt: '259 MB', c: 'grn' },
      { l: 'node:22 · -m 2g', sub: '≈ nửa trần', v: 1048, txt: '1048 MB', c: 'grn' },
      { l: 'node:22 · 512m + max-old-space=384', sub: 'bạn quyết', v: 387, txt: '387 MB', c: 'tea' },
    ], { lw: 340, max: 2200 }),
    `${term(['$ docker run --rm -m 512m node:22-alpine node -e \\', '  "console.log(\'heap cap:\', (require(\'v8\')', '  .getHeapStatistics().heap_size_limit', '  /1048576).toFixed(0)+\'MB\')"', '+ heap cap: 259MB', '$ docker run --rm -m 512m node:22-alpine node -e \\', '  "console.log(require(\'os\').totalmem()/1048576|0,', '  process.constrainedMemory()/1048576)"', '! 7934 512     # os.totalmem: RAM máy ảo · cgroup: 512'], { title: 'output thật — máy Mac' })}
    ${box('tip', 'Node 22 chỉ dùng ~½ trần cho heap. Đặt <code>NODE_OPTIONS=--max-old-space-size</code> ≈ 75% trần để dùng hết mà vẫn còn chỗ cho phần ngoài heap.')}`, 'l') },

  /* ───────────── 11.3 ───────────── */
  { t: 'Log đi đâu: stdout → dockerd → một file JSON trên máy chủ', body: `
    ${diagram({ w: 1160, h: 200, nodes: [
      { id: 'a', x: 0, y: 40, w: 210, h: 80, t: 'app', d: 'console.log → stdout', c: 'grn' },
      { id: 's', x: 270, y: 40, w: 210, h: 80, t: 'shim', d: 'giữ stdout/stderr', c: 'vio' },
      { id: 'd', x: 540, y: 40, w: 230, h: 80, t: 'dockerd', d: 'log driver: json-file', c: 'dk' },
      { id: 'f', x: 840, y: 20, w: 310, h: 120, t: '<id>-json.log', d: 'trong /var/lib/docker/containers/<id>\nghi mãi, KHÔNG tự xoay', c: 'red' },
    ], edges: [{ from: 'a', to: 's', c: 'grn' }, { from: 's', to: 'd', c: 'vio' }, { from: 'd', to: 'f', c: 'red' }] })}
    ${term(['$ docker inspect -f \'{{.LogPath}}\' noisy', '/var/lib/docker/containers/4199a2e6…/4199a2e6…-json.log', '$ docker inspect -f \'{{.HostConfig.LogConfig.Type}} {{.HostConfig.LogConfig.Config}}\' noisy', '! json-file map[]        # map[] = KHÔNG xoay vòng', '# một dòng trong file:', '{"log":"GET /api/v1/posts 200 12ms user=42 req=0\\n","stream":"stdout","time":"2026-09-23T19:20:55.35Z"}'], { title: 'output thật — máy Mac (đường dẫn nằm trong máy ảo Docker Desktop)' })}` },

  { t: '300.000 dòng log = 33 MB; có max-size thì dừng ở 2,6 MB', body: two(
    bars([
      { l: 'json-file mặc định', sub: 'map[] — phình mãi', v: 33, txt: '33,0 MB', c: 'red' },
      { l: 'max-size=1m, max-file=3', sub: '3 file xoay vòng', v: 2.6, txt: '2,6 MB', c: 'grn' },
    ], { lw: 300, max: 36 }),
    `${term(['# cùng một container in 300.000 dòng ~45 ký tự', '$ ls -lh …/4199a2e6…/ | grep json', '! 33.0M  4199a2e6…-json.log', '$ ls -lh …/6827e421…/ | grep json', '= 638.9K 6827e421…-json.log', '= 976.6K 6827e421…-json.log.1', '= 976.6K 6827e421…-json.log.2', '$ docker logs quiet | wc -l', '22882          # chỉ còn phần mới nhất'], { title: 'output thật — máy Mac' })}
    ${box('info', 'Mỗi dòng bị bọc JSON (<code>log</code>, <code>stream</code>, <code>time</code>) ⇒ file to gấp ~2,5 lần chữ in ra.')}`, 'l') },

  { t: 'docker ps -s nói 4,1 kB — file log 33 MB: không bảng nào đếm log', body: two(
    term(['$ docker ps -s --filter name=noisy \\', '    --format \'{{.Names}} {{.Size}}\'', '! noisy 4.1kB (virtual 9.33MB)', '$ docker system df', 'TYPE           TOTAL  ACTIVE  SIZE     RECLAIMABLE', 'Images         72     21      37.63GB  24.88GB (66%)', 'Containers     38     11      882.6MB  553.8MB (62%)', '…', '# log 33 MB không nằm ở dòng nào'], { title: 'output thật — máy Mac' }),
    `${cards([
      { ic: '📦', t: 'Images · Build Cache · Volumes', d: 'Docker đếm và hiện trong <code>system df</code>', c: 'blu' },
      { ic: '📜', t: 'File log <code>*-json.log</code>', d: 'KHÔNG ai đếm. Chỉ <code>du -sh /var/lib/docker/containers/*</code> mới thấy', c: 'red' },
    ], 1)}
    ${box('warn', 'Con số thật sự kết thúc ngày của bạn là <code>df -h /var/lib/docker</code>.')}`, 'l2') },

  { t: 'rm một file đang mở KHÔNG trả chỗ — truncate thì trả ngay', body: two(
    term(['# tmpfs 100 MB, một tiến trình đang "tail -f" file 60 MB', '$ df -h /t', 'tmpfs   100.0M   60.0M   40.0M  60% /t', '$ rm /t/app.log ; ls /t | wc -l', '0                        # file đã biến mất…', '$ df -h /t', '! tmpfs   100.0M   60.0M   40.0M  60% /t   # …chỗ thì chưa', '$ kill <tail> ; df -h /t', '= tmpfs   100.0M       0  100.0M   0% /t'], { title: 'output thật — máy Mac, trong container' }),
    `${term(['$ du -h <id>-json.log', '33.0M', '$ truncate -s 0 <id>-json.log', '$ du -h <id>-json.log', '= 0', '$ docker logs tick | head -2    # vẫn ghi tiếp', 'tick 16', 'tick 17'], { title: 'output thật — log của chính container dk11' })}
    ${box('warn', 'Tài liệu Docker khuyên KHÔNG đụng tay vào file log. <code>truncate</code> là <b>cấp cứu</b>; cách chữa thật là <code>max-size</code>.')}`, 'l') },

  { t: 'Đặt xoay vòng ở hai nơi — daemon.json phải RESTART, không phải reload', body: two(
    `${yaml([
      ['services:', 'compose — đi theo dự án'],
      ['  api:', ''],
      ['    logging:', ''],
      ['      driver: json-file', ''],
      ['      options:', ''],
      ['        max-size: "10m"', 'mỗi file ≤ 10 MB'],
      ['        max-file: "3"', 'giữ 3 file ⇒ ≤ 30 MB'],
    ], { fs: 15 })}
    ${yaml([
      ['{', '/etc/docker/daemon.json — CHỈ LÀ VÍ DỤ'],
      ['  "log-driver": "json-file",', ''],
      ['  "log-opts": {', 'mặc định cho container MỚI'],
      ['    "max-size": "10m", "max-file": "3" }', ''],
      ['}', ''],
    ], { fs: 15 })}`,
    `${table(['Sự thật (docs.docker.com)', ''], [
      ['<code>log-opts</code> không nằm trong danh sách reload được', '-<code>systemctl reload</code> vô tác dụng'],
      ['Phải <code>systemctl restart docker</code>', '!dừng MỌI container nếu không bật live-restore'],
      ['Container CŨ giữ cấu hình log cũ', 'phải tạo lại (<code>up -d --force-recreate</code>)'],
      ['Driver <code>local</code>', '+tự xoay: 20 MB × 5 file, có nén'],
    ], { sm: true })}
    ${box('tip', 'Máy Linux của khoá đã có sẵn daemon.json 10m × 3 — kiểm của bạn: <code>docker info -f \'{{.LoggingDriver}}\'</code> + tạo thử một container rồi xem <code>LogConfig.Config</code>.')}`, 'l') },

  /* ───────────── 11.4 ───────────── */
  { t: 'up -d tráo container = một khoảng trống: đo được 2,2 giây lỗi', body: `
    ${gapLine()}
    ${two(term(['$ ./probe.sh 12 &            # curl mỗi 50 ms', '$ TAG=e76553c docker compose up -d', ' Container dk11-blog-api-1 Recreate', ' Container dk11-blog-api-1 Started', '! 200: 111  lỗi: 26  (lỗi đầu 02:22:09.783, lỗi cuối 02:22:11.954)'], { title: 'output thật — máy Mac' }),
    box('info', 'Khoảng trống = thời gian container MỚI cần để sẵn sàng. Hai câu trả lời trung thực: deploy lúc vắng, hoặc chạy hai bản sau proxy rồi tráo lần lượt.'), 'l')}` },

  { t: 'Bắt SIGTERM + stop_grace_period ⇒ dừng trong 0,2 giây, không rơi request', body: two(
    yaml([
      ['process.on("SIGTERM", () => {', 'Docker gửi cái này'],
      ['  console.log("SIGTERM: draining");', ''],
      ['  server.close(() => {', 'ngừng nhận mới,'],
      ['    process.exit(0);', 'làm nốt việc dở rồi thoát'],
      ['  });', ''],
      ['});', ''],
      ['', ''],
      ['# compose.yaml', ''],
      ['stop_grace_period: 30s', 'dài hơn trần của app'],
    ], { fs: 15 }),
    `${term(['$ docker compose stop api', ' Container dk11-blog-api-1 Stopped', '# đo bằng date +%s%N: stop: 213 ms', '$ docker compose logs --no-log-prefix --tail 3 api', 'api v2 listening', '= SIGTERM: draining', '= closed cleanly in 0ms'], { title: 'output thật — máy Mac' })}
    ${box('warn', 'Không bắt SIGTERM ⇒ Docker chờ hết 10 s rồi SIGKILL (Bài 1.3): deploy chậm thêm 10 giây và mọi request đang dở bị cắt ngang.')}`, 'l') },

  { t: 'Dựng ở máy khác, VPS chỉ kéo về và tráo', body: `
    ${diagram({ w: 1160, h: 220, nodes: [
      { id: 'g', x: 0, y: 70, w: 180, h: 76, t: 'git commit', d: 'chỉ mã ĐÃ commit', c: 'dim' },
      { id: 'h', x: 250, y: 70, w: 250, h: 76, t: 'máy nhà / CI', d: '12 nhân · build song song 3–6 phút', c: 'grn' },
      { id: 'r', x: 570, y: 70, w: 230, h: 76, t: 'GHCR (kho ảnh)', d: 'tag theo commit: api:9f2ac1e', c: 'dk' },
      { id: 'v', x: 880, y: 70, w: 270, h: 76, t: 'VPS 6 GB', d: 'pull + up -d --no-build', c: 'tea' },
    ], edges: [{ from: 'g', to: 'h', c: 'dim' }, { from: 'h', to: 'r', c: 'grn', t: 'push' }, { from: 'r', to: 'v', c: 'dk', t: 'pull' }] })}
    ${cards([
      { ic: '💥', t: 'Dựng trên VPS: exit 137', d: 'Dựng song song web + api trên VPS 6 GB ⇒ <code>next build</code> bị OOM giết. Phải tuần tự: ~15 phút.', c: 'red' },
      { ic: '💾', t: 'Dựng trên VPS: đĩa đầy', d: 'Cache build phình 7,6 GB trên CHÍNH đĩa của Postgres ⇒ deploy chết giữa chừng: <code>no space left on device</code>.', c: 'amb' },
      { ic: '🧬', t: 'Build xanh ≠ ảnh chạy được', d: 'Dựng nhầm Dockerfile: alpine (musl) mang engine Prisma glibc ⇒ restart vô tận, API 502 bảy phút.', c: 'vio' },
    ], 3)}` },

  { t: 'Deploy là một script NGƯỜI chạy — không phải hệ quả của git push', body: two(
    diagram({ w: 560, h: 330, nodes: [
      { id: 'p', x: 170, y: 0, w: 220, h: 60, t: 'git push main', c: 'dim', mono: true },
      { id: 'a', x: 0, y: 120, w: 250, h: 70, t: 'workflow A', d: 'build + deploy', c: 'amb' },
      { id: 'b', x: 310, y: 120, w: 250, h: 70, t: 'workflow B', d: 'deploy backend', c: 'amb' },
      { id: 'x', x: 80, y: 250, w: 400, h: 74, t: 'ĐUA NHAU trên cùng VPS', d: 'feed 500 · Exited(137) · container mồ côi', c: 'red' },
    ], edges: [{ from: 'p', to: 'a', c: 'dim' }, { from: 'p', to: 'b', c: 'dim' }, { from: 'a', to: 'x', c: 'red' }, { from: 'b', to: 'x', c: 'red' }] }),
    `${yaml([
      ['on:', ''],
      ['  workflow_dispatch:', 'CHẠY TAY — push không deploy'],
      ['concurrency:', ''],
      ['  group: deploy-prod', 'một lúc chỉ MỘT lượt'],
      ['  cancel-in-progress: false', 'xếp hàng, không huỷ giữa chừng'],
    ], { fs: 15 })}
    ${box('good', 'Đẩy mã và đổi production là <b>hai quyết định</b>. Chuyện thật của một dự án sinh viên: sau hai lần sập vì hai workflow đua nhau, cả hai chỉ còn <code>workflow_dispatch</code> và deploy là script chạy tay.')}`, 'l2') },

  { t: 'Tag theo commit ⇒ “đang chạy bản nào” là sự thật, quay lui là một lệnh', body: `
    ${term(['$ git log --oneline', '5b502fc api v3', 'e76553c api v2', '$ TAG=5b502fc docker compose up -d ; curl -s -w \'%{http_code}\\n\' localhost:18110', '! {"error":"schema mismatch"}', '! 500', '$ docker images dk11-api --format \'{{.Repository}}:{{.Tag}}  {{.ID}}\'', 'dk11-api:5b502fc  3d6c00cdb484', 'dk11-api:e76553c  8a1b48ee6730', '$ TAG=e76553c docker compose up -d --no-build api      # 0,35 s', ' Container dk11-blog-api-1 Recreated', '$ curl -s localhost:18110', '= {"version":"v2"}'], { title: 'output thật — máy Mac, compose có image: dk11-api:${TAG}' })}
    ${box('warn', '<b>Đừng trông vào ảnh mồ côi.</b> Trên kho ảnh containerd (Docker 29 cài mới) ảnh cũ mất tag là bị xoá luôn — đã thử: không còn <code>&lt;none&gt;</code> nào để <code>docker tag</code> cứu. Giữ tag commit của 2–3 bản gần nhất.')}` },

  { t: 'up -d --wait bắt ảnh hỏng NGAY lúc deploy (exit 1)', body: two(
    term(['$ TAG=e76553c docker compose up -d --wait', ' Container dk11-blog-api-1 Healthy        # 6 s', '$ TAG=5b502fc docker compose up -d --wait --wait-timeout 20', '! container dk11-blog-api-1 is unhealthy', '$ echo $?', '! 1', '$ docker inspect -f \'{{.State.Health.Status}} \\', '    {{(index .State.Health.Log 0).Output}}\' dk11-blog-api-1', 'unhealthy wget: server returned error: HTTP/1.1 500 …'], { title: 'output thật — máy Mac (healthcheck: wget localhost:3000)' }),
    `${yaml([
      ['PREV=e76553c NEW=5b502fc', ''],
      ['TAG=$NEW docker compose up -d --wait \\', 'chờ healthy'],
      ['  --wait-timeout 60 \\', ''],
      ['|| TAG=$PREV docker compose \\', 'hỏng ⇒ tự lui'],
      ['     up -d --no-build --wait', ''],
    ], { fs: 15 })}
    ${box('good', 'Không có <code>--wait</code>, <code>up -d</code> trả 0 ngay khi container mới <i>khởi động</i> — kể cả khi nó trả 500 (đã thử với v3 ở trên). Có nó, script deploy <b>biết</b> mình thất bại.')}`, 'l') },

  { t: 'Có migration thì quay lui KHÔNG còn là một lệnh', body: `
    ${steps([
      ['Chỉ đổi mã', 'deploy lại tag trước: <code>TAG=&lt;sha cũ&gt; up -d --no-build</code> — 40 giây, không suy nghĩ'],
      ['Có migration đã chạy', '<b style="color:#ff8b96">DỪNG</b> — quay lui mã KHÔNG quay lui CSDL; mã cũ có thể không chạy trên schema mới'],
      ['Sửa bền vững', '<code>git revert &lt;sha&gt;</code> rồi deploy bình thường — không bao giờ <code>push --force</code>'],
      ['Sau sự cố', 'thêm MỘT phép kiểm: smoke test, chốt kiểm libc, bài test — sản phẩm của sự cố là phép kiểm mới'],
    ])}
    ${box('info', 'Luật an toàn cho migration: chỉ THÊM (cột mới cho phép null, bảng mới) ở lần deploy này, XOÁ ở lần sau — khi đó mã cũ vẫn chạy được trên schema mới, nên quay lui lại là một lệnh.')}` },

  /* ───────────── 11.5 ───────────── */
  { t: 'Bốn thứ phình ra — đây là máy Mac của chính người viết', body: two(
    term(['$ docker system df', 'TYPE           TOTAL  ACTIVE  SIZE     RECLAIMABLE', 'Images         79     23      37.81GB  24.84GB (65%)', 'Containers     41     12      882.7MB  553.9MB (62%)', 'Local Volumes  67     24      9.006GB  4.086GB (45%)', '! Build Cache    574    15      36.97GB  20.89GB'], { title: 'output thật — máy Mac, 24/09/2026' }),
    `${kpis([{ v: '37 GB', l: 'cache build', c: 'red' }, { v: '38 GB', l: 'ảnh', c: 'amb' }, { v: '9 GB', l: 'volume', c: 'vio' }])}
    ${table(['Thứ phình', 'Vì sao'], [
      ['Ảnh', 'mỗi deploy để lại bản trước'],
      ['Cache build', 'mỗi lần dựng; lớn nhất, vô hình'],
      ['Volume', 'thử nghiệm, volume vô danh'],
      ['-Log', 'KHÔNG có trong bảng này (11.3)'],
    ], { sm: true })}`, 'l') },

  { t: 'Thang prune: bắt đầu ở bậc an toàn, dừng lại trước bậc đỏ', body: two(
    table(['Lệnh', 'Xoá gì', 'Rủi ro'], [
      ['<code>builder prune</code>', 'cache build', '+lần dựng sau chậm hơn'],
      ['<code>image prune</code>', 'ảnh &lt;none&gt;', '+gần như không'],
      ['<code>container prune</code>', 'container đã dừng + log', '!mất bằng chứng sự cố'],
      ['<code>volume prune</code>', 'volume VÔ DANH không ai dùng', '!postgres chạy thiếu <code>-v</code> ⇒ DB đi luôn'],
      ['<code>image prune -a</code>', 'mọi ảnh không container nào dùng', '-mất bản để quay lui'],
      ['<code>volume prune -a</code>', 'cả volume CÓ TÊN', '-mất CSDL'],
    ], { sm: true }),
    `${term(['# volume có tên dk11-pgdata + một volume vô danh', '$ docker volume prune -f \\', '    --filter label=dkhoc=11', 'Deleted Volumes:', '= 12795f713c63eaff4a70aef336…', '# ↑ chỉ cái VÔ DANH', '$ docker volume prune -a -f \\', '    --filter label=dkhoc=11', 'Deleted Volumes:', '! dk11-pgdata      # -a: cả cái có tên'], { title: 'output thật — máy Mac, Engine 29.8' })}
    ${box('info', 'Từ Engine 23, <code>volume prune</code> và <code>system prune --volumes</code> chỉ xoá volume vô danh; phải có <code>-a</code> mới đụng volume có tên.')}`, 'l2') },

  { t: 'Dọn tự động, nhưng phải báo cả khi THÀNH CÔNG', body: two(
    yaml([
      ['#!/usr/bin/env bash', '/etc/cron.weekly/docker-cleanup'],
      ['set -Eeuo pipefail', ''],
      ['docker builder prune -f --filter until=168h', 'cache cũ hơn 7 ngày'],
      ['docker image prune -f --filter until=168h', 'ảnh <none> cũ'],
      ['docker container prune -f --filter until=24h', ''],
      ['# KHÔNG prune volume — việc của người', ''],
      ['curl -fsS https://hc-ping.com/$UUID', 'nhịp tim: “tôi còn chạy”'],
    ], { fs: 14.5 }),
    `${term(['# builder riêng dk11-b vừa dựng ảnh node + g++', '$ docker buildx du --builder dk11-b | tail -1', 'Total:  580.9MB', '$ docker buildx prune --builder dk11-b -f \\', '    --filter until=168h', '! Total:  0B     # cache mới ⇒ lọc tuổi giữ lại', '$ docker buildx prune --builder dk11-b -f', '= Total:  580.9MB'], { title: 'output thật — máy Mac' })}
    ${box('good', '<b>Công tắc người chết:</b> healthchecks.io báo động khi <b>VẮNG</b> nhịp tim — cách duy nhất biết một cron đã lặng lẽ ngừng chạy.')}`, 'l') },

  { t: 'Giám sát tối thiểu: 5 phép kiểm bắt gần hết những gì làm sập trang nhỏ', body: two(
    table(['Phép kiểm', 'Lệnh / cách đo'], [
      ['💾 1 · Đĩa &gt; 85%', '<code>df --output=pcent /var/lib/docker</code>'],
      ['🩺 2 · Container unhealthy', '<code>docker ps --filter health=unhealthy</code>'],
      ['🔁 3 · RestartCount &gt; 0', '<code>docker inspect -f \'{{.RestartCount}}\'</code>'],
      ['🌐 4 · /health trả 200', 'curl từ BÊN NGOÀI máy (UptimeRobot…)'],
      ['🗄️ 5 · Sao lưu hôm nay', 'có file và không bé tí (<code>find -size +1M</code>)'],
    ], { sm: true }),
    `${term(['$ docker ps --filter health=unhealthy \\', '    --format \'{{.Names}}\\t{{.Status}}\'', '! dk11-blog-api-1  Up 16 seconds (unhealthy)', '$ docker events --filter event=health_status \\', '    --filter event=die --filter event=oom \\', '    --format \\', '    \'{{.Time}} {{.Actor.Attributes.name}} {{.Action}}\'', '1790191991 dk11-blog-api-1 die', '! 1790192005 dk11-blog-api-1 health_status: unhealthy'], { title: 'output thật — máy Mac' , fs: 14 })}
    ${box('tip', 'Báo động theo <b>triệu chứng</b> (“/health trả 502”), không theo nguyên nhân (“CPU 78%”). Cần “vì sao” thì mới tới cAdvisor/Prometheus.')}`, 'l') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 11', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Trang chết từ 4 giờ sáng, không ai sửa', 'không có <code>restart</code> ⇒ mặc định <code>no</code>', '<code>restart: unless-stopped</code> mọi dịch vụ chạy dài'],
    ['Nhiều container chết cùng lúc, có Postgres', 'một dịch vụ không hạn mức vét cạn RAM', '<code>limits.memory</code> cho MỌI dịch vụ; đọc <code>dmesg</code>'],
    ['<code>next build</code> exit 137 trên VPS', 'dựng song song trên máy 6 GB', 'dựng ở máy khác, VPS chỉ pull + tráo'],
    ['Đĩa đầy, <code>system df</code> báo còn nhiều', 'log <code>json-file</code> không <code>max-size</code>', '<code>max-size</code>/<code>max-file</code>, rồi tạo lại container'],
    ['Sửa daemon.json, reload, log vẫn phình', '<code>log-opts</code> không reload được + container cũ giữ cấu hình cũ', 'restart dockerd lúc vắng + <code>up -d --force-recreate</code>'],
    ['Deploy xong mới biết API 502', '<code>up -d</code> không chờ healthcheck', '<code>up -d --wait</code> + tự lui về tag trước'],
    ['Không biết quay lui về bản nào', 'deploy bằng <code>:latest</code>', 'tag theo commit SHA, in phiên bản ra <code>/health</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 11', body: table(['Muốn…', 'Gõ'], [
    ['Sửa chính sách restart tại chỗ', '<code>docker update --restart unless-stopped api</code>'],
    ['Đọc vòng lặp sập', '<code>docker inspect -f \'{{.RestartCount}} {{.State.ExitCode}} {{.State.OOMKilled}}\' api</code>'],
    ['Trần RAM không swap · trần CPU', '<code>--memory 512m --memory-swap 512m --cpus 1.5</code>'],
    ['Ai đang gần trần', '<code>docker stats --no-stream</code>'],
    ['File log ở đâu, có xoay không', '<code>docker inspect -f \'{{.LogPath}} {{.HostConfig.LogConfig.Config}}\' api</code>'],
    ['Chỉ đọc 10 phút gần nhất', '<code>docker logs --since 10m --tail 200 api</code>'],
    ['Deploy chờ healthy, hỏng thì báo', '<code>docker compose up -d --wait --wait-timeout 60</code>'],
    ['Quay lui về commit trước', '<code>TAG=&lt;sha&gt; docker compose up -d --no-build api</code>'],
    ['Ai đang ăn đĩa', '<code>docker system df</code> · <code>df -h /var/lib/docker</code>'],
    ['Dọn an toàn', '<code>docker builder prune -f --filter until=168h</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 11 (45 phút)', body: `
    ${steps([
      ['Tạo một container sập mỗi 2 giây với <code>--restart on-failure</code>, đo độ trễ bằng <code>docker events</code>', 'thấy nó nhân đôi: 0,1 → 0,2 → 0,4 … s'],
      ['Gây OOM có chủ đích và đọc đủ ba bằng chứng', '<code>exit 137</code> · <code>OOMKilled=true</code> · sự kiện <code>oom</code>'],
      ['Cho một container in 300.000 dòng, đo file log; làm lại với <code>max-size=1m</code>', 'so hai con số; <code>docker ps -s</code> nói gì?'],
      ['Deploy v1 → v2 bằng tag commit trong lúc curl liên tục; đếm request lỗi', 'rồi deploy v3 hỏng với <code>--wait</code> và tự lui về v2'],
      ['Chạy <code>docker system df</code> trên máy mình; dọn bằng bậc an toàn nhất', 'ghi lại trước/sau — không đụng volume'],
    ])}
    ${box('good', '<b>Đạt khi:</b> bạn giải thích được bằng lời từng con số đã đo, và <code>docker ps -a --filter name=thu-</code> không còn gì của bạn sau khi dọn.')}` },
]);
