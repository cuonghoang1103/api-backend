/**
 * ngx-04-4 — Nginx · Chapter 4 · Lesson 4.4 "sendfile and open_file_cache, counted in system calls" (deck video + web, 12/11/2026). Bài web: nginx-4-4-sendfile-va-open-file-cache.
 * Output THẬT (scratchpad/ngx/demo/n4-4.txt; nginx/1.24.0, strace trên worker duy nhất): 3 request × tệp 2 MB — sendfile on ⇒ sendfile=3 writev=3;
 * off ⇒ pread64=186 writev=186 (62 + 62 mỗi request). 5 request × tệp nhỏ — open_file_cache ⇒ openat=0 fstat=0 close=5; không cache ⇒ openat=5
 * fstat=5 close=10. Deploy bằng mv (inode mới): có cache ⇒ vẫn "ban CU"; không cache ⇒ "ban MOI"; 61 s sau ⇒ "ban MOI".
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n4-4:file:/tmp/ng/conf/sf.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nworker_processes 1;\nevents {}\nhttp {\n  include /etc/nginx/mime.types;\n  access_log off;\n  server { listen 8080; root /tmp/ng/www; sendfile on; }\n  server { listen 8081; root /tmp/ng/www; sendfile off; }\n  server { listen 8082; root /tmp/ng/www; sendfile on; open_file_cache max=1000 inactive=60s; }\n  server { listen 8083; root /tmp/ng/www; sendfile on; }\n}\n",
 "n4-4:file:/root/dem-syscall.sh": "# dem-syscall.sh <cổng> <tệp> <số request> — strace worker DUY NHẤT của nginx trong lúc gửi N request, đếm từng lời gọi hệ thống\nW=$(pgrep -f 'nginx: worker'); curl -s -o /dev/null http://127.0.0.1:$1/$2   # hâm nóng (open_file_cache cần lượt đầu)\nstrace -f -p $W -e trace=openat,newfstatat,fstat,sendfile,writev,write,read,pread64,close -o /tmp/st.txt 2>/dev/null & S=$!; sleep 0.5\nfor i in $(seq $3); do curl -s -o /dev/null http://127.0.0.1:$1/$2; done; sleep 0.3; kill $S; sleep 0.3\nfor c in openat fstat sendfile writev pread64 close; do printf '%s=%s  ' $c $(grep -c \"^[0-9]* *$c(\\|^$c(\" /tmp/st.txt); done; echo\n",
 "n4-4:setup": "",
 "n4-4:sendfile": "$ bash dem-syscall.sh 8080 lon.bin 3\nopenat=3  fstat=3  sendfile=3  writev=3  pread64=0  close=6  \n$ bash dem-syscall.sh 8081 lon.bin 3\nopenat=3  fstat=3  sendfile=0  writev=186  pread64=186  close=6  ",
 "n4-4:ofc": "$ bash dem-syscall.sh 8082 nho.txt 5\nopenat=0  fstat=0  sendfile=5  writev=5  pread64=0  close=5  \n$ bash dem-syscall.sh 8083 nho.txt 5\nopenat=5  fstat=5  sendfile=5  writev=5  pread64=0  close=10  ",
 "n4-4:cu": "$ curl -s http://127.0.0.1:8082/phien-ban.txt; curl -s http://127.0.0.1:8083/phien-ban.txt\nban CU\nban CU\n=== deploy: ghi tep moi roi mv de len (inode MOI) ===\n$ echo 'ban MOI' > /tmp/ng/www/.tam && mv /tmp/ng/www/.tam /tmp/ng/www/phien-ban.txt\n$ printf 'co open_file_cache  -> '; curl -s http://127.0.0.1:8082/phien-ban.txt; printf 'khong cache         -> '; curl -s http://127.0.0.1:8083/phien-ban.txt\nco open_file_cache  -> ban CU\nkhong cache         -> ban MOI\n=== 61 giay sau (open_file_cache_valid mac dinh 60s) ===\n$ sleep 61; printf 'co open_file_cache  -> '; curl -s http://127.0.0.1:8082/phien-ban.txt\nco open_file_cache  -> ban MOI"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter, seq } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-04-4', code: 'NGX 4.4', title: 'sendfile and open_file_cache, counted in system calls', sub: 'Chapter 4 · Lesson 4.4' };
const O = (k) => { const v = DU_LIEU[`n4-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.replace(/\/tmp\/ng\//g, '/srv/');

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.4', t: 'sendfile and open_file_cache,<br>counted in system calls', sub: 'Two directives every tuning guide copies. Here is what each one actually removes — counted with strace on a real worker',
    en: 'Lesson 4.4. Two directives every tuning guide copies: sendfile and open file cache. Instead of trusting them, we count the system calls a real worker makes, with strace.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>How to count what a worker really does — strace</li>
    <li>sendfile: 186 system calls become 3</li>
    <li>open_file_cache: the opens disappear</li>
    <li>The deploy that serves the OLD file for a minute</li>
    <li>Which knobs are worth touching at all</li></ul>`,
    en: 'Five takeaways: counting a worker with strace; what sendfile removes; what open file cache removes; the deploy that keeps serving the old file; and which knobs matter.' },
  { t: 'The measuring tool: strace on one worker', body: ngc(O('file:/tmp/ng/conf/sf.conf').split('\n').filter((l) => /worker_processes|server \{/.test(l)).map((l) => l.trim().replace(/root \/tmp\/ng\/www; /, '')).join('\n'), { sm: true }) +
    tn(O('file:/root/dem-syscall.sh').split('\n').slice(1).join('\n'), { fs: 13, wrap: 120 }) +
    box('One worker, so every call is ours', '<code>worker_processes 1</code>, attach <code>strace</code> to that worker, send N requests, count each system call by name.', 'lam'),
    en: 'The tool. One worker process, so every system call we see belongs to our requests. A small script attaches strace to that worker, sends N requests, and counts each system call by name.' },
  { t: 'sendfile: 186 calls become 3', body: tn(O('sendfile'), { fs: 17 }) +
    seq(['disk', 'nginx', 'socket'], [[0, 1, 'sendfile off: pread 32 KB → into Nginx memory', '#c0392b'], [1, 2, 'writev 32 KB → out again  (× 62 per request)', '#c0392b'], [0, 2, 'sendfile on: the kernel copies file → socket, ONE call', '#2f9d58']], { rh: 46, fs: 17 }),
    en: 'Three requests for a two megabyte file. With sendfile on: three sendfile calls, one per request, plus the header writes. With sendfile off: one hundred and eighty-six reads and one hundred and eighty-six writes — sixty-two of each per request, every byte copied into Nginx memory and out again.' },
  { t: 'open_file_cache: the opens disappear', body: tn(O('ofc'), { fs: 17 }) + cmp(['5 requests, small file', 'openat', 'fstat', 'close'], [
      ['open_file_cache max=1000', '<b>0</b>', '<b>0</b>', '5 (connections only)'],
      ['no cache', '5', '5', '10 (file + connection)'],
    ], { hl: [1] }) + box('One open and one stat per request — gone', 'The descriptor stays open between requests. It matters with many small files; for one big file it is noise.', 'xanh'),
    en: 'Five requests for a small file. With open file cache: zero opens, zero stats — only the connections are closed. Without it: one open and one stat per request, and the file closed each time. The descriptor simply stays open between requests.' },
  { t: 'Trap: the cache keeps serving the OLD file', body: tn(bo(O('cu')), { fs: 15 }) +
    two(box('Why', 'A deploy that writes a new file and <code>mv</code>s it in creates a NEW inode. The cached descriptor still points at the old one — so the old bytes keep going out.', 'do2'),
      box('For how long', 'Until <code>open_file_cache_valid</code> expires: 60 s by default. Measured: old content right after the deploy, new content 61 s later. Lower it, or reload Nginx in the deploy script.', 'lam')),
    en: 'The trap. A deploy writes a new file and moves it into place, which creates a new inode. With open file cache, the cached descriptor still points at the old one: the old content kept coming out. Sixty-one seconds later, the default validity, the new content appeared.' },
  { t: 'The rest of the tuning, by how much it matters', body: cmp(['Directive', 'Effect', 'Touch it?'], [
      ['<code>sendfile on</code>', 'removes the copy through user space', '<b>yes</b> — Ubuntu ships it on'],
      ['<code>tcp_nopush on</code>', 'headers + first file bytes in one packet (needs sendfile)', 'yes, harmless'],
      ['<code>open_file_cache</code>', 'removes open + stat per request', 'many small files: yes — mind the deploy'],
      ['<code>open_file_cache_errors on</code>', 'caches 404 lookups too', 'only with the cache on'],
      ['<code>aio</code>, <code>directio</code>', 'large files on slow disks', 'measure first; usually no'],
    ]),
    en: 'The rest, by how much it matters. sendfile on, and tcp nopush with it. open file cache when you serve many small files, minding the deploy. aio and directio only after a measurement says the disk is the bottleneck.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('System call', 'one request from the program to the kernel'),
      kw('strace', 'prints or counts the system calls of a process'),
      kw('sendfile', 'kernel copies file → socket, no user-space copy'),
      kw('open_file_cache', 'keeps descriptors + metadata between requests'),
      kw('open_file_cache_valid', 'how long a cached entry is trusted — 60 s'),
      kw('inode', 'the file itself; mv-ing a new file gives a new one'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: system call, strace, sendfile, open file cache, open file cache valid, and inode.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Run Nginx with ${c('worker_processes 1')}; attach ${c('strace -c')}`,
      `Fetch a 2 MB file with sendfile on, then off`,
      `Fetch a small file 5 times, with and without the cache`,
      `${c('mv')} a new version in; fetch it at once, then after a minute`,
    ]), box('Keep these', `<ul><li>Count calls, do not guess</li><li>sendfile on</li><li>Cache = old file after deploy</li><li>Reload in the deploy script</li></ul>`, 'lam'), ''),
    en: 'Your turn: count system calls with strace, compare sendfile on and off, compare the file cache, and replace a file under a running cache. Keep: count, do not guess; sendfile on; a cache serves the old file after a deploy unless you reload.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Static files', bai: '4.4' }, S);
