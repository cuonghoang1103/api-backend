/**
 * Operating Systems for Developers — Chương 9: Hệ thống file và quyền (soạn 28/10/2026 theo _HOP-DONG.md).
 * Output CHẠY THẬT trong ảnh `os-lab`; mọi "đĩa" là FILE ext4/ext2 nhỏ (8–128 MB) gắn qua loop device trong container
 * vứt đi --privileged — không đụng đĩa thật:
 *   lab/code/ch09/c91-inode.sh   → lab/out/c91-inode   (--privileged: VFS, inode, dentry, link, debugfs, cache dentry)
 *   lab/code/ch09/c92-fd.sh      → lab/out/c92-fd      (thường: bảng fd, fdinfo, dup/open hai lần/O_APPEND/fork, dup2, O_CLOEXEC)
 *   lab/code/ch09/c93-fsync.sh   → lab/out/c93-fsync   (--privileged: Dirty, fsync/fdatasync/O_DSYNC/O_DIRECT, "rút điện" crash.sh)
 *   lab/code/ch09/c94-journal.sh → lab/out/c94-journal (--privileged: journal, logdump, phát lại; ext2 dựng tay trạng thái sập; data=journal)
 *   lab/code/ch09/c95-mount.sh   → lab/out/c95-mount   (--privileged: điểm gắn, bind mount thư mục vs một file, sed -i đổi inode, noexec)
 *   lab/code/ch09/c96-quyen.sh   → lab/out/c96-quyen   (thường: rwx file/thư mục, umask, ai được xoá, sticky, setgid, setuid ids.c)
 *   lab/code/ch09/c97-cap.sh     → lab/out/c97-cap     (mặc định Docker + ip_unprivileged_port_start=1024: capabilities, ACL, log dir, .env)
 *   lab/code/ch09/c97-ssh.sh     → lab/out/c97-ssh     (ảnh node:22-bookworm có OpenSSH 9.2: khoá 0644 bị từ chối)
 *   lab/code/ch09/c97-host.sh    → lab/out/c97-host    (gõ TỪ MÁY CHỦ bằng phien-host.sh: --user, volume, --cap-drop, userns, nginx 403)
 * Dòng đầu mỗi kịch bản ghi đúng lệnh docker run. Máy đo: Docker Desktop trên Apple Silicon (arm64, 10 lõi, nhân 7.0
 * linuxkit), Ubuntu 26.04 (coreutils là uutils: cat dùng splice, dd oflag=direct tự lùi về ghi có cache — bài 9.3 đo).
 * "Rút điện" = chép ảnh đĩa khi hệ thống file ĐANG RẢNH rồi gắn bản chép (nhân phát lại journal) — chép lúc đang ghi dồn
 * dập cho ảnh "xé" không phải trạng thái sập thật (đã thử, bỏ). Trạng thái sập của ext2 (9.4) DỰNG TAY bằng debugfs, ghi rõ.
 * Thứ tự bài ≠ số trong slug: 4 slug đã seed từ khung (os-9-1-inode, os-9-2-fsync, os-9-3-journaling, os-9-4-quyen) GIỮ
 * NGUYÊN; bài mới os-9-5-fd, os-9-6-mount, os-9-7-capabilities chen vào đúng chỗ theo mạch học (syncOrder đánh số lại).
 * Ranh giới: sự cố cạn inode / file đã xoá còn mở / EMFILE đã kể ở Chương 2 (chỉ trỏ sang, đi sâu cơ chế); page cache ở
 * Chương 8; epoll/non-blocking ở Chương 10; namespace/overlayfs ở Chương 12; leo thang qua SUID ở Chương 13.
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần; ${ của bash → \${.
 */
import { run, src, card, kv, cmd } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G91 from './giang/os-09-1.mjs';
import G92 from './giang/os-09-2.mjs';
import G93 from './giang/os-09-3.mjs';
import G94 from './giang/os-09-4.mjs';
import G95 from './giang/os-09-5.mjs';
import G96 from './giang/os-09-6.mjs';
import G97 from './giang/os-09-7.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const OS = (slug) => '/courses/operating-systems-for-developers/learn?lessonSlug=' + slug;
const LNX = (slug) => '/courses/linux-bash/learn?lessonSlug=' + slug;
const OSG = (slug) => '/courses/operating-systems/learn?lessonSlug=' + slug;

export default {
  title: 'Chapter 9 — File systems and permissions|||Chương 9 — Hệ thống file và quyền',
  description: 'Dữ liệu nằm trên đĩa thế nào và khi nào nó thật sự an toàn: VFS, inode và dentry, hard/soft link soi bằng debugfs; bảng fd và mô tả file mở (chung offset sau fork/dup, O_APPEND, dup2 = chuyển hướng, O_CLOEXEC); write() không phải đã lên đĩa — fsync/fdatasync/O_DIRECT đo thật, "rút điện" thấy file 0 byte, mẫu ghi an toàn tạm → fsync → rename → fsync thư mục; journaling ext4 xem tận giao dịch; điểm gắn và bind mount (vì sao sed -i làm bind mount một file đứng yên — sự cố nginx.conf); quyền rwx, umask, ai được xoá file, setuid/setgid/sticky; capabilities, ACL, người dùng trong container; bốn tình huống thật: nginx không đọc được upload, thư mục log của root, .env ai cũng đọc, khoá SSH quá mở.',
  lessons: [
    /* ───────────────────────── 9.1 — VFS, inode, dentry, link ───────────────────────── */
    {
      title: '9.1 — A file name is only a pointer: VFS, inodes, dentries and links|||9.1 — Tên file chỉ là con trỏ: VFS, inode, dentry và liên kết',
      slug: 'os-9-1-inode',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một bộ syscall cho mọi hệ thống file (VFS: proc, tmpfs, ext4, overlay đo bằng strace + fstatfs); inode giữ mọi thứ trừ tên; thư mục là bảng tên → số inode (soi byte thật bằng debugfs); hard link vs symlink, link count, EXDEV khi mv qua đĩa khác; số inode bị dùng lại; cache dentry/inode của nhân.',
      content: `${G91}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>A file name is only a pointer: VFS, inodes, dentries and links</h2>
<p class="lead">You delete a 2 GB file and the disk does not get any emptier. You rename a config file in a Docker volume and the container still sees the old one. Both stories begin with the same fact: <strong>a file is not its name</strong>. The data and its owner, size and permissions live in an <em>inode</em>; a name is just an entry in a directory that points to that inode. This lesson answers: <strong>what exactly is stored where, and what does each command change?</strong> We look at the real bytes on a tiny ext4 disk to find out.</p>

<h3>One interface, many file systems: the VFS</h3>
<p>Inside one container, very different things look like files:</p>
${run('c91-inode', 'findmnt -lo')}
<p><code>/proc</code> is generated by the kernel on the fly, <code>/dev/shm</code> lives only in RAM (tmpfs), <code>/</code> is an overlay of image layers, <code>/etc/hosts</code> is a single file that Docker bind-mounted from the VM's ext4 disk, and <code>/mnt/lab</code> is our 8 MB ext4 "disk" (a file attached through a loop device). A program does not care. This small C program reads one file from each with exactly the same three system calls:</p>
${src('ch09/vfs.c', 'c')}
${run('c91-inode', 'strace -e trace=openat,read,close')}
<p>Same <code>openat</code>, same <code>read</code>, same <code>close</code> — and four different drivers answered. The layer that makes this possible is the <strong>Virtual File System (VFS)</strong>. Every file system registers the same small set of operations (open, read, write, lookup a name, create, rename…) and the VFS routes each system call to the right driver. That is why <code>cat /proc/loadavg</code> works, why your Node app can read a config from a Kubernetes ConfigMap mounted as tmpfs without knowing it, and why "everything is a file" is true on Linux. The VFS thinks in four objects: the <strong>superblock</strong> (one mounted file system), the <strong>inode</strong> (one file), the <strong>dentry</strong> (one name in one directory) and the <strong>file</strong> (one open instance — lesson 9.2).</p>
<p>A side note on this lab: on Ubuntu 26.04 <code>cat</code> comes from <em>uutils</em> (Rust coreutils) and copies with <code>splice()</code> instead of <code>read()</code>, which is why we use our own program to show the classic calls.</p>

<h3>The inode: everything except the name</h3>
${run('c91-inode', 'cd /mnt/lab', 4)}
<p><code>ls -i</code> prints the inode number first: <strong>14</strong>. <code>stat</code> prints what the inode holds: the type (regular file), <code>Size: 10</code> bytes, <code>Blocks: 8</code> (counted in 512-byte units, so one 4 KiB block on disk), <code>Links: 1</code>, the permission bits <code>0644</code>, owner and group, and four timestamps — <em>Access</em> (last read), <em>Modify</em> (content changed), <em>Change</em> (the inode itself changed: permissions, owner, link count) and <em>Birth</em>. Look for the name: it is not there. <code>stat</code> printed "File: app.env" only because we typed that name.</p>

<h3>Hard links and symbolic links</h3>
${run('c91-inode', 'ln app.env app.env.bak', 3)}
<p><code>ln</code> created a <strong>hard link</strong>: a second directory entry pointing at the same inode. Both names show inode 14 and the link count went from 1 to 2 — neither name is "the original". <code>ln -s</code> created a <strong>symbolic link</strong>: a brand-new inode (15) of type <code>l</code> whose content is the text <code>app.env</code> — exactly 7 bytes, its size. The kernel follows that text every time someone opens <code>current.env</code>.</p>
${run('c91-inode', 'mkdir -p releases', 2)}
<p>Directories have link counts too. <code>releases/v1</code> has 2: its name in <code>releases</code> plus its own <code>.</code> entry. <code>releases</code> has 4: its name, its <code>.</code>, and the <code>..</code> of each of its two subdirectories. That is why, on ext4, a directory's link count minus 2 is its number of subdirectories.</p>

<h3>rm removes a name, not a file</h3>
${run('c91-inode', 'rm app.env', 4)}
<p>After <code>rm app.env</code> the data is still reachable as <code>app.env.bak</code>: the inode lost one name and its link count went back to 1. The symlink, which only stored the <em>text</em> "app.env", is now dangling: <code>ls</code> still shows it, <code>cat</code> fails. The kernel frees an inode and its blocks only when <strong>both</strong> counters reach zero: names (link count) and open file descriptions. Chapter 2 met the second counter in production — the 30 MB log that <code>rm</code> did not free because the app still held it open (<a href="${OS('os-2-4-dia-io')}">lesson 2.4</a>). Here is the mechanism behind it.</p>
${lab('sysmon', 'diskfull', 'en', 'A log fills the disk; rm it while the app still holds it and df does not move — the inode has 0 names but 1 open file. Find it with lsof +L1, then truncate.')}
${lab('fdtable', 'deleted', 'en', 'The same thing one layer down — a name, an open file description, an inode: rm while the file is still open, du shows 0 while df still counts 900 MiB; then close the fd and watch the inode and its blocks finally go.', { tour: 'fdtable-deleted' })}

<h3>Looking at the disk with debugfs</h3>
<p><code>debugfs</code> reads an ext4 file system straight from the device, bypassing the kernel. We unmount the disk and ask it what is really stored:</p>
${run('c91-inode', "debugfs -R 'ls -l /'")}
<p>A <strong>directory is just a file whose content is a list of (name → inode number) records</strong>. <code>app.env</code> is gone from the list; <code>app.env.bak</code> → 14 and <code>current.env</code> → 15 remain. (The number in parentheses is the entry's file type: 1 regular, 2 directory, 7 symlink.)</p>
${run('c91-inode', "debugfs -R 'stat /app.env.bak'")}
<p>Inode 14 on disk: mode, owner, size 10, <code>Links: 1</code>, timestamps, and <code>EXTENTS: (0):1071</code> — logical block 0 of the file lives in physical block 1071. Still no name anywhere.</p>
${run('c91-inode', "debugfs -R 'stat /current.env'")}
<p>The symlink's inode uses 0 blocks: a short target is stored <em>inside</em> the inode itself (<code>Fast link dest: "app.env"</code>).</p>
${run('c91-inode', "debugfs -R 'blocks /'", 2)}
<p>These are the raw bytes of the root directory (block 3; <code>bd</code> prints offsets in octal). Each record is: inode number (4 bytes, little-endian), record length (2), name length (1), file type (1), then the name. Read the line at offset 0120: <code>0e00 0000</code> = inode 14, <code>1400</code> = record length 20, <code>0b</code> = 11 characters, <code>01</code> = regular file, then <code>app.env.bak</code>. The next record, <code>0f00 0000 … 07</code>, is inode 15, type 7, <code>current.env</code>. And the deleted <code>app.env</code>? Its bytes at offset 0100 are zeros: <code>rm</code> did not wipe the disk, it grew the previous record (<code>status.txt</code>, length <code>2400</code> = 36 bytes) so that it swallowed the deleted one. Deleting a name is editing a few bytes in a directory block.</p>

<h3>The limits of hard links</h3>
${run('c91-inode', 'ln /mnt/lab/app.env.bak', 3)}
<p>A hard link stores an inode <em>number</em>, and inode numbers only mean something inside one file system — so linking across file systems fails with <code>EXDEV</code> ("Invalid cross-device link"). Hard links to directories are refused because they could create cycles that <code>find</code>, <code>du</code> and the kernel's own path walk could never escape. And look at what <code>mv</code> does across file systems: <code>renameat2()</code> fails with <code>EXDEV</code>, so <code>mv</code> silently falls back to <strong>copy, then delete</strong>. Within one file system, <code>mv</code> is a single rename that only edits directory entries (instant, atomic, same inode); across file systems it is a slow copy that creates a new inode and can be interrupted halfway. Lesson 9.3 builds on exactly this difference.</p>

<h3>Inode numbers get reused</h3>
${run('c91-inode', 'rm /mnt/lab/current.env')}
<p>The <code>mv</code> above moved <code>app.env.bak</code> to another file system (copy, then delete — so inode 14 was freed), and now we delete the symlink. The very next new file gets inode <strong>14</strong> again. An inode number identifies a file only while it exists. Anything that remembers files by inode number alone — a backup tool, a cache keyed by <code>st_ino</code>, a "has this file changed?" check — can be fooled after a delete and a create. Use (device, inode, change time), the ext4 <em>generation</em> number, or a content hash.</p>
${lab('fdtable', 'links', 'en', 'Names → inodes, by hand: ln adds a name and bumps the link count, ln -s makes a new inode that stores only text (and dangles when its target goes), a move to another file system is copy + delete, and the freed inode number (14) is handed out again.', { tour: 'fdtable-deleted' })}

<h3>The kernel's caches of names and inodes</h3>
${run('c91-inode', 'cat /proc/sys/fs/dentry-state', 2)}
<p>Resolving <code>/srv/app/node_modules/express/index.js</code> means one lookup per path component. To avoid reading directory blocks every time, the kernel keeps a <strong>dentry cache</strong> (name → inode, per directory) and an <strong>inode cache</strong>. On this VM there are 240,480 dentries (×192 bytes ≈ 46 MB) and 172,872 cached ext4 inodes (×1,128 bytes ≈ 195 MB). The fifth number in <code>dentry-state</code> — 48,950 — counts <strong>negative dentries</strong>: cached answers of "this name does not exist". They matter for developers: Node's module resolution and every <code>$PATH</code> search probe many paths that do not exist, and remembering the misses keeps that fast. This memory is the reclaimable kernel slab that Chapter 8 counted inside <em>available</em> (<a href="${OS('os-8-1-page-cache')}">lesson 8.1</a>).</p>

<div class="pitfall co-tieu-de">
<p><strong>A relative symlink is resolved from where the link lives, not from where you are.</strong> <code>ln -s app.env current.env</code> stored the text "app.env"; it means "app.env next to me". Move the link to another directory, copy it into a Docker image with <code>COPY</code>, or create it from a script whose working directory is elsewhere (<code>ln -s releases/v2 /srv/app/current</code> run from <code>/home/deploy</code>), and it points at nothing — with no error until something opens it. For deploy symlinks use absolute targets, or <code>cd</code> into the link's directory first, and check with <code>readlink -f</code>.</p>
</div>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the team's deploy script keeps <code>releases/v1</code>, <code>releases/v2</code> and a <code>current</code> symlink; it also hard-links <code>shared/.env</code> into each release. After someone "cleaned up" old releases, the site serves 404 and nobody knows which names still point to what.</p>
<ol>
<li>In a <code>--privileged</code> lab container, build an 8 MB ext4 image, loop-mount it, and recreate the layout: two release folders, <code>shared/.env</code> hard-linked into both, <code>current</code> → <code>releases/v2</code>.</li>
<li>Run <code>ls -li</code> and <code>stat -c '%n %i %h'</code> to record every inode number and link count.</li>
<li>Delete <code>releases/v2</code> with <code>rm -r</code>. Which names still work? What is the link count of <code>.env</code> now?</li>
<li>Unmount and use <code>debugfs -R 'ls -l /releases'</code> and <code>debugfs -R 'stat /current'</code> to explain the 404 from the bytes on disk.</li>
</ol>
<p><strong>Done when:</strong> you can show, with inode numbers, which names shared the same data, and you can quote the <code>Fast link dest</code> line that proves <code>current</code> points to a name that no longer exists.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['VFS (Virtual File System)', 'The kernel layer that gives every file system the same open/read/write/lookup interface.'],
  ['inode', 'The on-disk record of a file: type, size, owner, permissions, timestamps, link count and where the data blocks are — but no name.'],
  ['directory entry / dentry', 'A (name → inode number) record inside a directory; the kernel caches them as dentries.'],
  ['hard link', 'A second name for the same inode; all names are equal, data is freed when the last one goes (and nobody holds it open).'],
  ['symbolic link', 'A separate inode whose content is a path text, resolved every time it is opened; can dangle.'],
  ['link count', 'How many directory entries point at an inode (stat %h, the 2nd column of ls -l).'],
  ['EXDEV', '"Invalid cross-device link": rename or link across file systems; mv falls back to copy + delete.'],
  ['negative dentry', 'A cached "this name does not exist" answer that makes repeated failed lookups cheap.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>The VFS gives proc, tmpfs, overlay and ext4 the same system calls; fstatfs tells you which driver answered.</li>
<li>An inode holds everything about a file except its name; a directory is a list of name → inode records.</li>
<li>Hard links are extra names for one inode; a symlink is a tiny file containing a path, stored in the inode when short.</li>
<li>rm removes one name; the data dies when the link count and the open-file count both reach zero.</li>
<li>Within one file system mv is a rename; across file systems it is copy + delete (EXDEV), and inode numbers get reused.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/inode.7.html', '📄', 'man 7 inode', 'Every field of an inode, the file type and mode bits, and the four timestamps.', 'Open')}
${L('https://www.kernel.org/doc/html/latest/filesystems/vfs.html', '🐧', 'kernel.org — Overview of the Linux Virtual File System', 'Superblocks, inodes, dentries and files: the objects every file system implements.', 'Open')}
${L(LNX('lnx-2-4-lien-ket-va-nen'), '🐧', 'Linux &amp; Bash · 2.4 — Links and archives', 'Creating and using links at the command level.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Tên file chỉ là con trỏ: VFS, inode, dentry và liên kết</h2>
<p class="lead">Bạn xoá một file 2 GB mà đĩa chẳng trống thêm chút nào. Bạn đổi tên một file cấu hình trong volume Docker mà container vẫn thấy bản cũ. Cả hai câu chuyện bắt đầu từ cùng một sự thật: <strong>file không phải là cái tên của nó</strong>. Dữ liệu cùng chủ sở hữu, kích thước và quyền nằm trong một <em>inode</em>; cái tên chỉ là một mục trong thư mục trỏ tới inode đó. Bài này trả lời: <strong>chính xác thứ gì nằm ở đâu, và mỗi lệnh thay đổi cái gì?</strong> Ta nhìn tận byte thật trên một đĩa ext4 tí hon để tìm câu trả lời.</p>

<h3>Một giao diện, nhiều hệ thống file: VFS</h3>
<p>Trong cùng một container, những thứ rất khác nhau đều trông như file:</p>
${run('c91-inode', 'findmnt -lo')}
<p><code>/proc</code> do nhân sinh ra tức thời, <code>/dev/shm</code> chỉ sống trong RAM (tmpfs), <code>/</code> là overlay ghép từ các lớp ảnh, <code>/etc/hosts</code> là một file lẻ Docker bind-mount từ đĩa ext4 của VM, còn <code>/mnt/lab</code> là "đĩa" ext4 8 MB của ta (một file gắn qua loop device). Chương trình không quan tâm. Chương trình C nhỏ này đọc mỗi nơi một file bằng đúng ba lời gọi hệ thống:</p>
${src('ch09/vfs.c', 'c')}
${run('c91-inode', 'strace -e trace=openat,read,close')}
<p>Cùng <code>openat</code>, cùng <code>read</code>, cùng <code>close</code> — và bốn driver khác nhau trả lời. Tầng làm được điều đó là <strong>Virtual File System (VFS — hệ thống file ảo)</strong>. Mỗi hệ thống file đăng ký cùng một bộ thao tác nhỏ (mở, đọc, ghi, tìm một tên, tạo, đổi tên…) và VFS chuyển mỗi lời gọi hệ thống tới đúng driver. Vì vậy <code>cat /proc/loadavg</code> chạy được, app Node của bạn đọc được file cấu hình từ ConfigMap của Kubernetes gắn dạng tmpfs mà không cần biết, và câu "mọi thứ là file" đúng trên Linux. VFS nghĩ bằng bốn đối tượng: <strong>superblock</strong> (một hệ thống file đã gắn), <strong>inode</strong> (một file), <strong>dentry</strong> (một tên trong một thư mục) và <strong>file</strong> (một lần mở — bài 9.2).</p>
<p>Ghi chú về phòng lab: trên Ubuntu 26.04, <code>cat</code> đến từ <em>uutils</em> (coreutils viết bằng Rust) và chép bằng <code>splice()</code> thay vì <code>read()</code>, nên ta dùng chương trình riêng để thấy các lời gọi kinh điển.</p>

<h3>Inode: mọi thứ trừ cái tên</h3>
${run('c91-inode', 'cd /mnt/lab', 4)}
<p><code>ls -i</code> in số inode đầu tiên: <strong>14</strong>. <code>stat</code> in những gì inode chứa: loại (file thường), <code>Size: 10</code> byte, <code>Blocks: 8</code> (đếm theo đơn vị 512 byte, tức một khối 4 KiB trên đĩa), <code>Links: 1</code>, các bit quyền <code>0644</code>, chủ và nhóm, và bốn mốc thời gian — <em>Access</em> (lần đọc cuối), <em>Modify</em> (nội dung đổi), <em>Change</em> (chính inode đổi: quyền, chủ, số liên kết) và <em>Birth</em> (lúc tạo). Hãy tìm cái tên: không có. <code>stat</code> in "File: app.env" chỉ vì ta đã gõ tên đó.</p>

<h3>Hard link và symbolic link</h3>
${run('c91-inode', 'ln app.env app.env.bak', 3)}
<p><code>ln</code> tạo một <strong>hard link (liên kết cứng)</strong>: một mục thư mục thứ hai trỏ tới cùng inode. Cả hai tên đều hiện inode 14 và số liên kết tăng từ 1 lên 2 — không tên nào là "bản gốc". <code>ln -s</code> tạo một <strong>symbolic link (liên kết mềm)</strong>: một inode hoàn toàn mới (15) loại <code>l</code>, nội dung là chuỗi <code>app.env</code> — đúng 7 byte, cũng là kích thước của nó. Nhân đi theo chuỗi đó mỗi lần có ai mở <code>current.env</code>.</p>
${run('c91-inode', 'mkdir -p releases', 2)}
<p>Thư mục cũng có số liên kết. <code>releases/v1</code> có 2: tên của nó trong <code>releases</code> cộng mục <code>.</code> của chính nó. <code>releases</code> có 4: tên của nó, <code>.</code> của nó, và <code>..</code> của hai thư mục con. Vì thế trên ext4, số liên kết của một thư mục trừ 2 chính là số thư mục con.</p>

<h3>rm xoá một cái tên, không xoá file</h3>
${run('c91-inode', 'rm app.env', 4)}
<p>Sau <code>rm app.env</code>, dữ liệu vẫn tới được qua <code>app.env.bak</code>: inode mất một tên và số liên kết về lại 1. Symlink, vốn chỉ lưu <em>chuỗi</em> "app.env", giờ trỏ vào hư không: <code>ls</code> vẫn thấy nó, <code>cat</code> thì hỏng. Nhân chỉ giải phóng inode và các khối của nó khi <strong>cả hai</strong> bộ đếm về 0: số tên (link count) và số mô tả file đang mở. Chương 2 đã gặp bộ đếm thứ hai ngoài production — file log 30 MB mà <code>rm</code> không giải phóng vì app vẫn đang mở nó (<a href="${OS('os-2-4-dia-io')}">bài 2.4</a>). Đây là cơ chế nằm bên dưới.</p>
${lab('sysmon', 'diskfull', 'vi', 'Log làm đầy đĩa; rm nó khi app vẫn đang giữ thì df không nhúc nhích — inode còn 0 tên nhưng 1 file đang mở. Tìm bằng lsof +L1 rồi truncate.')}
${lab('fdtable', 'deleted', 'vi', 'Cùng chuyện đó nhìn xuống một tầng — một cái tên, một mô tả file mở, một inode: rm khi file còn mở, du báo 0 trong khi df vẫn tính 900 MiB; rồi close fd và nhìn inode cùng các khối cuối cùng mới được giải phóng.', { tour: 'fdtable-deleted' })}

<h3>Nhìn đĩa bằng debugfs</h3>
<p><code>debugfs</code> đọc thẳng hệ thống file ext4 từ thiết bị, không qua nhân. Ta tháo đĩa ra rồi hỏi nó thật sự đang lưu gì:</p>
${run('c91-inode', "debugfs -R 'ls -l /'")}
<p><strong>Thư mục chỉ là một file có nội dung là danh sách bản ghi (tên → số inode)</strong>. <code>app.env</code> đã biến khỏi danh sách; <code>app.env.bak</code> → 14 và <code>current.env</code> → 15 còn lại. (Số trong ngoặc là loại file của mục: 1 file thường, 2 thư mục, 7 symlink.)</p>
${run('c91-inode', "debugfs -R 'stat /app.env.bak'")}
<p>Inode 14 trên đĩa: mode, chủ, kích thước 10, <code>Links: 1</code>, các mốc thời gian, và <code>EXTENTS: (0):1071</code> — khối logic 0 của file nằm ở khối vật lý 1071. Vẫn không có tên ở đâu cả.</p>
${run('c91-inode', "debugfs -R 'stat /current.env'")}
<p>Inode của symlink dùng 0 khối: đích ngắn được cất <em>ngay trong</em> inode (<code>Fast link dest: "app.env"</code>).</p>
${run('c91-inode', "debugfs -R 'blocks /'", 2)}
<p>Đây là byte thô của thư mục gốc (khối 3; <code>bd</code> in độ dời theo hệ bát phân). Mỗi bản ghi gồm: số inode (4 byte, little-endian), độ dài bản ghi (2), độ dài tên (1), loại file (1), rồi tới tên. Đọc dòng ở độ dời 0120: <code>0e00 0000</code> = inode 14, <code>1400</code> = bản ghi dài 20, <code>0b</code> = 11 ký tự, <code>01</code> = file thường, rồi <code>app.env.bak</code>. Bản ghi kế, <code>0f00 0000 … 07</code>, là inode 15, loại 7, <code>current.env</code>. Còn <code>app.env</code> đã xoá? Byte của nó ở độ dời 0100 toàn số 0: <code>rm</code> không xoá trắng đĩa, nó nới dài bản ghi đứng trước (<code>status.txt</code>, độ dài <code>2400</code> = 36 byte) để nuốt luôn bản ghi bị xoá. Xoá một cái tên là sửa vài byte trong một khối thư mục.</p>

<h3>Giới hạn của hard link</h3>
${run('c91-inode', 'ln /mnt/lab/app.env.bak', 3)}
<p>Hard link lưu một <em>số</em> inode, mà số inode chỉ có nghĩa trong một hệ thống file — nên liên kết sang hệ thống file khác thất bại với <code>EXDEV</code> ("Invalid cross-device link"). Hard link tới thư mục bị từ chối vì nó có thể tạo vòng lặp mà <code>find</code>, <code>du</code> và chính đường duyệt tên của nhân không bao giờ thoát ra được. Và nhìn xem <code>mv</code> làm gì khi qua hệ thống file khác: <code>renameat2()</code> trả về <code>EXDEV</code>, nên <code>mv</code> lặng lẽ chuyển sang <strong>chép rồi xoá</strong>. Trong cùng một hệ thống file, <code>mv</code> là một lần đổi tên chỉ sửa các mục thư mục (tức thì, nguyên tử, giữ nguyên inode); qua hệ thống file khác nó là một lần chép chậm tạo inode mới và có thể đứt giữa chừng. Bài 9.3 dựng tiếp trên đúng khác biệt này.</p>

<h3>Số inode bị dùng lại</h3>
${run('c91-inode', 'rm /mnt/lab/current.env')}
<p>Lệnh <code>mv</code> ở trên đã chuyển <code>app.env.bak</code> sang hệ thống file khác (chép rồi xoá — nên inode 14 được giải phóng), giờ ta xoá thêm symlink. File mới ngay sau đó lại nhận inode <strong>14</strong>. Số inode chỉ định danh một file khi file đó còn tồn tại. Thứ gì nhớ file chỉ bằng số inode — công cụ sao lưu, cache dùng <code>st_ino</code> làm khoá, phép kiểm "file này đổi chưa?" — đều có thể bị lừa sau một lần xoá rồi tạo. Hãy dùng (thiết bị, inode, thời điểm change), số <em>generation</em> của ext4, hoặc băm nội dung.</p>
${lab('fdtable', 'links', 'vi', 'Tên → inode, tự tay làm: ln thêm một tên và tăng link count, ln -s tạo inode mới chỉ chứa chữ (và treo khi đích mất), mv sang file system khác là chép + xoá, và số inode vừa giải phóng (14) được cấp lại.', { tour: 'fdtable-deleted' })}

<h3>Cache tên và inode của nhân</h3>
${run('c91-inode', 'cat /proc/sys/fs/dentry-state', 2)}
<p>Phân giải <code>/srv/app/node_modules/express/index.js</code> nghĩa là tra một lần cho mỗi thành phần đường dẫn. Để khỏi đọc khối thư mục mỗi lần, nhân giữ <strong>dentry cache</strong> (tên → inode, theo từng thư mục) và <strong>inode cache</strong>. Trên VM này có 240.480 dentry (×192 byte ≈ 46 MB) và 172.872 inode ext4 trong cache (×1.128 byte ≈ 195 MB). Số thứ năm của <code>dentry-state</code> — 48.950 — đếm <strong>negative dentry (dentry âm)</strong>: các câu trả lời "tên này không tồn tại" được cache lại. Chúng quan trọng với lập trình viên: cơ chế tìm module của Node và mọi lần dò <code>$PATH</code> đều thử rất nhiều đường dẫn không tồn tại, và việc nhớ các lần trượt giữ cho chúng nhanh. Bộ nhớ này là phần slab thu hồi được của nhân mà Chương 8 đã tính vào <em>available</em> (<a href="${OS('os-8-1-page-cache')}">bài 8.1</a>).</p>

<div class="pitfall co-tieu-de">
<p><strong>Symlink tương đối được phân giải từ nơi link nằm, không phải từ nơi bạn đứng.</strong> <code>ln -s app.env current.env</code> lưu chuỗi "app.env"; nghĩa là "app.env cạnh tôi". Chuyển link sang thư mục khác, chép nó vào ảnh Docker bằng <code>COPY</code>, hoặc tạo nó từ một script có thư mục làm việc ở chỗ khác (<code>ln -s releases/v2 /srv/app/current</code> chạy từ <code>/home/deploy</code>) — và nó trỏ vào hư không, không báo lỗi gì cho tới khi có thứ mở nó. Với symlink deploy, hãy dùng đích tuyệt đối, hoặc <code>cd</code> vào thư mục của link trước, và kiểm bằng <code>readlink -f</code>.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> script deploy của nhóm giữ <code>releases/v1</code>, <code>releases/v2</code> và symlink <code>current</code>; nó còn hard-link <code>shared/.env</code> vào từng bản release. Sau khi ai đó "dọn" các bản cũ, web trả 404 và không ai biết tên nào còn trỏ tới đâu.</p>
<ol>
<li>Trong một container lab <code>--privileged</code>, dựng ảnh ext4 8 MB, gắn qua loop, và dựng lại bố cục: hai thư mục release, <code>shared/.env</code> hard-link vào cả hai, <code>current</code> → <code>releases/v2</code>.</li>
<li>Chạy <code>ls -li</code> và <code>stat -c '%n %i %h'</code> để ghi lại mọi số inode và số liên kết.</li>
<li>Xoá <code>releases/v2</code> bằng <code>rm -r</code>. Tên nào còn dùng được? Số liên kết của <code>.env</code> giờ là bao nhiêu?</li>
<li>Tháo đĩa ra và dùng <code>debugfs -R 'ls -l /releases'</code>, <code>debugfs -R 'stat /current'</code> để giải thích lỗi 404 từ byte trên đĩa.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được, bằng số inode, những tên nào từng dùng chung một dữ liệu, và trích được dòng <code>Fast link dest</code> chứng minh <code>current</code> trỏ tới một cái tên không còn tồn tại.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['VFS (hệ thống file ảo)', 'Tầng của nhân cho mọi hệ thống file cùng một giao diện mở/đọc/ghi/tra tên.'],
  ['inode', 'Bản ghi trên đĩa của một file: loại, kích thước, chủ, quyền, mốc thời gian, số liên kết và vị trí các khối dữ liệu — nhưng không có tên.'],
  ['directory entry / dentry (mục thư mục)', 'Bản ghi (tên → số inode) trong một thư mục; nhân cache chúng dưới dạng dentry.'],
  ['hard link (liên kết cứng)', 'Tên thứ hai cho cùng inode; mọi tên ngang hàng, dữ liệu bị giải phóng khi tên cuối cùng mất (và không ai còn mở).'],
  ['symbolic link (liên kết mềm)', 'Một inode riêng chứa chuỗi đường dẫn, được phân giải mỗi lần mở; có thể trỏ vào hư không.'],
  ['link count (số liên kết)', 'Số mục thư mục trỏ tới một inode (stat %h, cột thứ 2 của ls -l).'],
  ['EXDEV', '"Invalid cross-device link": đổi tên hay tạo link qua hệ thống file khác; mv chuyển sang chép + xoá.'],
  ['negative dentry (dentry âm)', 'Câu trả lời "tên này không tồn tại" được cache, giúp các lần tra trượt lặp lại rất rẻ.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>VFS cho proc, tmpfs, overlay và ext4 cùng một bộ lời gọi hệ thống; fstatfs cho biết driver nào đã trả lời.</li>
<li>Inode giữ mọi thứ về file trừ cái tên; thư mục là danh sách bản ghi tên → inode.</li>
<li>Hard link là thêm tên cho một inode; symlink là một file tí hon chứa đường dẫn, cất ngay trong inode khi ngắn.</li>
<li>rm xoá một cái tên; dữ liệu chỉ chết khi số liên kết và số file đang mở đều về 0.</li>
<li>Trong một hệ thống file mv là đổi tên; qua hệ thống file khác nó là chép + xoá (EXDEV), và số inode bị dùng lại.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/inode.7.html', '📄', 'man 7 inode', 'Từng trường của inode, loại file, các bit mode và bốn mốc thời gian.', 'Mở')}
${L('https://www.kernel.org/doc/html/latest/filesystems/vfs.html', '🐧', 'kernel.org — Overview of the Linux Virtual File System', 'Superblock, inode, dentry và file: các đối tượng mà mọi hệ thống file phải cài đặt.', 'Mở')}
${L(LNX('lnx-2-4-lien-ket-va-nen'), '🐧', 'Linux &amp; Bash · 2.4 — Liên kết và nén', 'Tạo và dùng liên kết ở mức lệnh.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 9.2 — fd và bảng file mở ───────────────────────── */
    {
      title: '9.2 — File descriptors and the open-file table: who shares an offset|||9.2 — File descriptor và bảng file mở: ai dùng chung offset',
      slug: 'os-9-5-fd',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba tầng giữa số fd và đĩa: bảng fd của tiến trình → mô tả file mở (offset, cờ) → inode; đọc /proc/PID/fd và fdinfo; dup và fork chung offset, mở hai lần thì ghi đè nhau, O_APPEND sửa; chuyển hướng của shell chính là dup2 (vì sao 2>&1 > f khác > f 2>&1); fd lọt qua exec và O_CLOEXEC.',
      content: `${G92}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Three tables between "fd 3" and the disk</h2>
<p class="lead">Two worker processes append to the same log file, and some lines come out cut in half. <code>cmd 2&gt;&amp;1 &gt; out.txt</code> leaves the errors on your screen. A tool you launched from your app can read your <code>.env</code> although it never opened it. All three are explained by what a file descriptor really is: <strong>a small number that indexes a per-process table, which points to an "open file description" holding the offset, which points to the inode</strong>. This lesson shows each table with real output. (Chapter 2 counted descriptors when they ran out with <code>EMFILE</code> — <a href="${OS('os-2-5-mang-fd')}">lesson 2.5</a>; here is what each one is.)</p>

<h3>Your process's descriptor table</h3>
${run('c92-fd', 'ls -l /proc/$$/fd')}
<p>Every process has a <strong>file descriptor table</strong>, and <code>/proc/PID/fd</code> shows it as symlinks. This shell (the lab's script runner) has 0 = <code>/dev/null</code> (stdin), 1 and 2 = the same pipe (stdout and stderr both go to our output file), and 255, where bash keeps the script it is reading. A descriptor is only an index into this table: the lowest free number is used for the next <code>open()</code>, which is why your first file is almost always fd 3.</p>

<h3>Behind every fd: an open file description</h3>
${run('c92-fd', 'exec 3< /tmp/users.txt', 1)}
${run('c92-fd', 'read -r first', 3)}
${run('c92-fd', 'read -r second', 1)}
<p><code>exec 3&lt; file</code> opens a file as fd 3 in the shell itself. <code>/proc/PID/fdinfo/3</code> shows what the kernel keeps for it: <code>pos: 13</code> — the <strong>file offset</strong>, right after "alice:x:1001\n" (13 bytes); <code>flags</code> — how it was opened (here read-only plus O_LARGEFILE, which the kernel adds on 64-bit; on arm64 that is 0400000 in octal); <code>mnt_id</code> and <code>ino</code> — which mount and which inode it leads to. After the second <code>read</code> the offset is 24. The offset does <em>not</em> live in the inode (other processes reading the same file have their own) and not in your program: it lives in the kernel object called the <strong>open file description</strong>, created by each <code>open()</code>. So there are three levels:</p>
<ol>
<li><strong>fd table</strong> (per process): number → pointer to an open file description.</li>
<li><strong>open file descriptions</strong> (kernel-wide, "the open file table"): offset, open flags (O_APPEND, O_NONBLOCK…), a reference to the inode.</li>
<li><strong>inodes</strong> (lesson 9.1): the file itself — size, permissions, data blocks.</li>
</ol>

<h3>Two fds, one description — or two descriptions, one file</h3>
${src('ch09/ofd.c', 'c')}
${run('c92-fd', './ofd dup')}
<p><code>dup()</code> makes a second descriptor for the <em>same</em> description: both report <code>pos: 39</code>, and the two writes land one after the other.</p>
${run('c92-fd', './ofd twice')}
<p>Opening the file a second time creates a <em>second</em> description with its own offset starting at 0. Worker A writes 26 bytes (offset 26); worker B writes "worker B: hi\n" at its own offset 0 — <strong>over</strong> A's line. The file now holds <code>worker B: hi</code> followed by the leftover tail <code>er 1001 paid</code>. No error, no warning: one order record quietly destroyed.</p>
${run('c92-fd', './ofd append')}
<p>With <code>O_APPEND</code>, every <code>write()</code> first moves that description's offset to the current end of the file, as one step in the kernel. B's offset jumped to 39 and both lines survived.</p>
${lab('fdtable', 'twice', 'en', 'The three layers — fd table, open file description, inode — for the two-worker log: two opens ⇒ two offsets (26 and 13) and “er 1001 paid” left over; dup ⇒ one shared offset; O_APPEND ⇒ B jumps to 39. Step it and watch which layer each call changes.', { tour: 'fdtable-offsets' })}

<div class="pitfall co-tieu-de">
<p><strong>Several processes, one log file, opened without O_APPEND.</strong> PM2 cluster mode, gunicorn workers, two cron jobs: each process opens the log itself, gets its own description and its own offset, and they overwrite each other exactly as above. In Node, <code>fs.createWriteStream(path, { flags: 'a' })</code> (and <code>appendFileSync</code>) open with O_APPEND; the default <code>'w'</code> does not and also truncates the file on open. Safer still: log to stdout and let Docker/systemd collect it — one writer, one offset.</p>
</div>

<h3>fork() shares the description</h3>
${run('c92-fd', './ofd fork')}
<p>After <code>fork()</code> the child gets a <strong>copy of the fd table</strong>, but the copies point to the <strong>same</strong> open file descriptions. The child wrote two lines (offset 28), and the parent's next write continued at 28, not at 0 — the final offset is 42 and all three lines are intact. This is why <code>(npm run build; npm test) &gt; ci.log</code> produces one coherent log: every child of that shell shares stdout's offset.</p>
${lab('fdtable', 'fork', 'en', 'fork() copies the fd table, not the descriptions behind it: the child writes two lines (offset 28), the parent continues at 28, and the file ends at 42 with every line intact.', { tour: 'fdtable-offsets' })}

<h3>Redirection is dup2()</h3>
${run('c92-fd', "strace -f -e trace=openat,dup2,dup3,close,execve bash")}
<p>Between <code>fork()</code> and <code>exec()</code>, the child shell builds the new program's descriptor table: <code>openat</code> returns 3, <code>dup3(3, 1)</code> makes fd 1 point to that description (<code>&gt; /tmp/out.txt</code>), <code>dup3(1, 2)</code> makes fd 2 point to whatever fd 1 points to <em>right now</em> (<code>2&gt;&amp;1</code>), then <code>execve</code> starts <code>ls</code>, which simply writes to 1 and 2. Redirections are applied left to right, and each <code>2&gt;&amp;1</code> copies the current target of fd 1. So the order matters:</p>
${run('c92-fd', 'ls /nope > /tmp/out.txt 2>&1', 2)}
<p>In the second command, <code>2&gt;&amp;1</code> ran first, while fd 1 was still the terminal; only then did fd 1 move to the file. The error went to the screen and the file is empty. Read redirections as "dup2 from left to right" and you will never get this wrong again.</p>
${lab('fdtable', 'redirect', 'en', 'Redirections as dup2 from left to right: compare “&gt; out.txt 2&gt;&amp;1” with the swapped order and see where fd 2 ends up pointing; exec then replaces the program but keeps the table.', { tour: 'fdtable-offsets' })}

<h3>Descriptors survive exec — unless O_CLOEXEC</h3>
${src('ch09/leak.c', 'c')}
${run('c92-fd', './leak', 2)}
<p><code>exec()</code> replaces the program but keeps the descriptor table. Our program opened <code>/tmp/app/.env</code> and forgot to close it, then ran a third-party tool (<code>ls</code>): the tool received fd 3, open on the secrets file, without ever opening it (fd 4 / fd 3 → <code>/proc/…/fd</code> is just <code>ls</code> reading the directory). A plugin, an image converter, or a shell command your app launches could read it, and it keeps the file busy. With <code>O_CLOEXEC</code> the kernel closes the descriptor during <code>exec</code> and the tool sees only 0, 1, 2. Modern runtimes do this for you:</p>
${run('c92-fd', 'node -e')}
<p>Node opened the file (it would be fd 3 or higher in the parent), yet the child spawned by <code>execSync</code> sees only its three pipes/sockets: Node opens everything with O_CLOEXEC. Python does the same since 3.4 (PEP 446). In C, Go's syscall package, or when you call <code>open()</code> yourself, it is your job.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the team runs the API in PM2 cluster mode with 2 workers, both writing to <code>logs/orders.log</code>. Support reports that some order lines are missing and others start in the middle of a word.</p>
<ol>
<li>Compile <code>ofd.c</code> in the lab and run the <code>twice</code> and <code>append</code> modes; save both outputs and the <code>pos:</code> lines.</li>
<li>Write a 10-line Node script that opens the same file twice with <code>fs.openSync(path, 'w')</code> and writes from both; then change the flags to <code>'a'</code>. Compare the files.</li>
<li>While the script sleeps with the files open, look at <code>/proc/PID/fdinfo/*</code>: how many descriptions, which offsets?</li>
<li>Write one sentence for the team on how to log safely from several workers.</li>
</ol>
<p><strong>Done when:</strong> you show a clobbered file and a correct one, two fdinfo excerpts with different <code>pos</code> values, and a fix that the team can apply (O_APPEND / flags 'a', or one logger writing to stdout).</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['file descriptor (fd)', 'A small integer that indexes the process’s fd table; 0, 1, 2 are stdin, stdout, stderr.'],
  ['open file description', 'The kernel object created by each open(): file offset, open flags, reference to the inode. Shared by dup() and fork().'],
  ['file offset', 'Where the next read/write happens; lives in the open file description, not in the inode.'],
  ['O_APPEND', 'Every write first moves the offset to the end of the file, atomically — safe for several writers.'],
  ['dup / dup2', 'Make another fd point to the same open file description; how the shell implements redirection.'],
  ['O_CLOEXEC', 'Close this fd automatically on exec(), so launched programs do not inherit it.'],
  ['/proc/PID/fd, fdinfo', 'The fd table as symlinks, and per-fd pos/flags/mnt_id/ino.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>fd → open file description (offset, flags) → inode: three levels, three different owners.</li>
<li>dup() and fork() share a description and its offset; a second open() creates a new offset and can overwrite.</li>
<li>O_APPEND makes each write go to the end; several log writers need it.</li>
<li>Redirections are dup2 calls applied left to right: <code>&gt; f 2&gt;&amp;1</code> is not <code>2&gt;&amp;1 &gt; f</code>.</li>
<li>exec keeps open fds; O_CLOEXEC (default in Node and Python) stops secrets from leaking into child programs.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/open.2.html', '📄', 'man 2 open', 'Open file descriptions, O_APPEND, O_CLOEXEC and every other open flag.', 'Open')}
${L('https://man7.org/linux/man-pages/man2/dup.2.html', '📄', 'man 2 dup', 'dup, dup2, dup3: what is shared between duplicated descriptors.', 'Open')}
${L(LNX('lnx-3-1-dong-chuan-chuyen-huong'), '🐧', 'Linux &amp; Bash · 3.1 — Standard streams and redirection', 'Redirection at the command level.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Ba tầng bảng nằm giữa "fd 3" và cái đĩa</h2>
<p class="lead">Hai tiến trình worker cùng ghi nối vào một file log, và có dòng bị cắt làm đôi. <code>cmd 2&gt;&amp;1 &gt; out.txt</code> để lỗi vẫn hiện trên màn hình. Một công cụ app của bạn chạy lại đọc được <code>.env</code> dù nó chưa từng mở file đó. Cả ba được giải thích bằng bản chất của file descriptor: <strong>một số nhỏ làm chỉ số vào bảng của tiến trình, trỏ tới một "mô tả file mở" giữ offset, rồi trỏ tiếp tới inode</strong>. Bài này cho thấy từng bảng bằng output thật. (Chương 2 đếm descriptor khi chúng cạn với <code>EMFILE</code> — <a href="${OS('os-2-5-mang-fd')}">bài 2.5</a>; đây là bản chất của từng cái.)</p>

<h3>Bảng descriptor của tiến trình</h3>
${run('c92-fd', 'ls -l /proc/$$/fd')}
<p>Mỗi tiến trình có một <strong>bảng file descriptor</strong>, và <code>/proc/PID/fd</code> hiện nó dưới dạng symlink. Shell này (bộ chạy kịch bản của lab) có 0 = <code>/dev/null</code> (stdin), 1 và 2 = cùng một pipe (stdout và stderr đều đổ vào file output của ta), và 255, nơi bash giữ script nó đang đọc. Descriptor chỉ là chỉ số vào bảng này: số trống nhỏ nhất được dùng cho lần <code>open()</code> kế tiếp, vì vậy file đầu tiên của bạn gần như luôn là fd 3.</p>

<h3>Sau mỗi fd: một mô tả file mở</h3>
${run('c92-fd', 'exec 3< /tmp/users.txt', 1)}
${run('c92-fd', 'read -r first', 3)}
${run('c92-fd', 'read -r second', 1)}
<p><code>exec 3&lt; file</code> mở một file làm fd 3 ngay trong shell. <code>/proc/PID/fdinfo/3</code> cho thấy nhân giữ gì cho nó: <code>pos: 13</code> — <strong>offset của file</strong>, ngay sau "alice:x:1001\n" (13 byte); <code>flags</code> — cách nó được mở (ở đây chỉ đọc cộng O_LARGEFILE, cờ nhân tự thêm trên máy 64 bit; trên arm64 đó là 0400000 hệ bát phân); <code>mnt_id</code> và <code>ino</code> — dẫn tới mount nào, inode nào. Sau lần <code>read</code> thứ hai, offset là 24. Offset <em>không</em> nằm trong inode (tiến trình khác đọc cùng file có offset riêng) và cũng không nằm trong chương trình của bạn: nó nằm trong đối tượng của nhân gọi là <strong>open file description (mô tả file mở)</strong>, do mỗi lần <code>open()</code> tạo ra. Vậy có ba tầng:</p>
<ol>
<li><strong>bảng fd</strong> (riêng từng tiến trình): số → con trỏ tới một mô tả file mở.</li>
<li><strong>các mô tả file mở</strong> (chung cả nhân, "bảng file mở"): offset, cờ mở (O_APPEND, O_NONBLOCK…), tham chiếu tới inode.</li>
<li><strong>các inode</strong> (bài 9.1): chính cái file — kích thước, quyền, khối dữ liệu.</li>
</ol>

<h3>Hai fd, một mô tả — hay hai mô tả, một file</h3>
${src('ch09/ofd.c', 'c')}
${run('c92-fd', './ofd dup')}
<p><code>dup()</code> tạo descriptor thứ hai cho <em>cùng</em> mô tả: cả hai báo <code>pos: 39</code>, và hai lần ghi nằm nối tiếp nhau.</p>
${run('c92-fd', './ofd twice')}
<p>Mở file lần thứ hai tạo ra một mô tả <em>thứ hai</em> với offset riêng bắt đầu từ 0. Worker A ghi 26 byte (offset 26); worker B ghi "worker B: hi\n" tại offset 0 của nó — <strong>đè lên</strong> dòng của A. File giờ chứa <code>worker B: hi</code> rồi tới phần đuôi sót lại <code>er 1001 paid</code>. Không lỗi, không cảnh báo: một bản ghi đơn hàng bị huỷ âm thầm.</p>
${run('c92-fd', './ofd append')}
<p>Với <code>O_APPEND</code>, mỗi lần <code>write()</code> trước tiên dời offset của mô tả đó tới cuối file hiện tại, trong một bước duy nhất trong nhân. Offset của B nhảy tới 39 và cả hai dòng còn nguyên.</p>
${lab('fdtable', 'twice', 'vi', 'Ba tầng — bảng fd, mô tả file mở, inode — cho log của hai worker: open hai lần ⇒ hai offset (26 và 13) và còn sót “er 1001 paid”; dup ⇒ một offset chung; O_APPEND ⇒ B nhảy tới 39. Bước từng lệnh và nhìn mỗi lời gọi đổi tầng nào.', { tour: 'fdtable-offsets' })}

<div class="pitfall co-tieu-de">
<p><strong>Nhiều tiến trình, một file log, mở không có O_APPEND.</strong> PM2 chế độ cluster, các worker của gunicorn, hai cron job: mỗi tiến trình tự mở log, có mô tả riêng và offset riêng, và chúng ghi đè lên nhau đúng như trên. Trong Node, <code>fs.createWriteStream(path, { flags: 'a' })</code> (và <code>appendFileSync</code>) mở với O_APPEND; cờ mặc định <code>'w'</code> thì không và còn cắt rỗng file lúc mở. An toàn hơn nữa: ghi log ra stdout và để Docker/systemd gom lại — một người ghi, một offset.</p>
</div>

<h3>fork() dùng chung mô tả</h3>
${run('c92-fd', './ofd fork')}
<p>Sau <code>fork()</code>, tiến trình con nhận một <strong>bản sao bảng fd</strong>, nhưng các bản sao trỏ tới <strong>cùng</strong> những mô tả file mở. Con ghi hai dòng (offset 28), và lần ghi kế của cha tiếp tục tại 28, không phải 0 — offset cuối là 42 và cả ba dòng nguyên vẹn. Vì vậy <code>(npm run build; npm test) &gt; ci.log</code> cho ra một log liền mạch: mọi tiến trình con của shell đó dùng chung offset của stdout.</p>
${lab('fdtable', 'fork', 'vi', 'fork() chép bảng fd, không chép các mô tả phía sau: con ghi hai dòng (offset 28), cha ghi tiếp từ 28, và file kết thúc ở 42 với đủ mọi dòng.', { tour: 'fdtable-offsets' })}

<h3>Chuyển hướng chính là dup2()</h3>
${run('c92-fd', "strace -f -e trace=openat,dup2,dup3,close,execve bash")}
<p>Giữa <code>fork()</code> và <code>exec()</code>, shell con dựng bảng descriptor cho chương trình mới: <code>openat</code> trả về 3, <code>dup3(3, 1)</code> cho fd 1 trỏ tới mô tả đó (<code>&gt; /tmp/out.txt</code>), <code>dup3(1, 2)</code> cho fd 2 trỏ tới thứ fd 1 đang trỏ <em>ngay lúc này</em> (<code>2&gt;&amp;1</code>), rồi <code>execve</code> chạy <code>ls</code>, vốn chỉ việc ghi vào 1 và 2. Các chuyển hướng được áp từ trái sang phải, và mỗi <code>2&gt;&amp;1</code> chép đích hiện tại của fd 1. Nên thứ tự quan trọng:</p>
${run('c92-fd', 'ls /nope > /tmp/out.txt 2>&1', 2)}
<p>Ở lệnh thứ hai, <code>2&gt;&amp;1</code> chạy trước, lúc fd 1 vẫn là terminal; sau đó fd 1 mới chuyển sang file. Lỗi hiện ra màn hình và file rỗng. Hãy đọc chuyển hướng là "dup2 từ trái sang phải" và bạn sẽ không bao giờ nhầm nữa.</p>
${lab('fdtable', 'redirect', 'vi', 'Chuyển hướng là dup2 từ trái sang phải: so “&gt; out.txt 2&gt;&amp;1” với thứ tự đảo ngược và xem fd 2 rốt cuộc trỏ vào đâu; exec sau đó thay chương trình nhưng giữ nguyên bảng.', { tour: 'fdtable-offsets' })}

<h3>Descriptor sống qua exec — trừ khi có O_CLOEXEC</h3>
${src('ch09/leak.c', 'c')}
${run('c92-fd', './leak', 2)}
<p><code>exec()</code> thay chương trình nhưng giữ nguyên bảng descriptor. Chương trình của ta mở <code>/tmp/app/.env</code> rồi quên đóng, sau đó chạy một công cụ bên thứ ba (<code>ls</code>): công cụ nhận luôn fd 3 đang mở trên file bí mật mà chẳng cần mở (fd 4 / fd 3 → <code>/proc/…/fd</code> chỉ là <code>ls</code> đang đọc thư mục). Một plugin, một công cụ chuyển ảnh, hay một lệnh shell mà app của bạn chạy đều có thể đọc nó, và file bị giữ bận. Với <code>O_CLOEXEC</code>, nhân đóng descriptor trong lúc <code>exec</code> và công cụ chỉ thấy 0, 1, 2. Các runtime hiện đại làm sẵn việc này:</p>
${run('c92-fd', 'node -e')}
<p>Node đã mở file (ở tiến trình cha nó là fd 3 trở lên), vậy mà tiến trình con do <code>execSync</code> sinh ra chỉ thấy ba pipe/socket của nó: Node mở mọi thứ với O_CLOEXEC. Python làm y vậy từ bản 3.4 (PEP 446). Trong C, gói syscall của Go, hay khi bạn tự gọi <code>open()</code>, đó là việc của bạn.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> nhóm chạy API bằng PM2 chế độ cluster với 2 worker, cả hai ghi vào <code>logs/orders.log</code>. Bộ phận hỗ trợ báo có dòng đơn hàng bị mất, có dòng lại bắt đầu giữa một chữ.</p>
<ol>
<li>Biên dịch <code>ofd.c</code> trong lab và chạy chế độ <code>twice</code> và <code>append</code>; lưu cả hai output cùng các dòng <code>pos:</code>.</li>
<li>Viết một script Node 10 dòng mở cùng một file hai lần bằng <code>fs.openSync(path, 'w')</code> và ghi từ cả hai; rồi đổi cờ thành <code>'a'</code>. So hai file.</li>
<li>Trong lúc script ngủ mà file còn mở, xem <code>/proc/PID/fdinfo/*</code>: có bao nhiêu mô tả, offset nào?</li>
<li>Viết một câu cho nhóm về cách ghi log an toàn từ nhiều worker.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đưa ra một file bị ghi đè và một file đúng, hai trích đoạn fdinfo có giá trị <code>pos</code> khác nhau, và một cách sửa nhóm áp dụng được (O_APPEND / cờ 'a', hoặc một logger duy nhất ghi ra stdout).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['file descriptor — fd (mô tả tệp)', 'Một số nguyên nhỏ làm chỉ số vào bảng fd của tiến trình; 0, 1, 2 là stdin, stdout, stderr.'],
  ['open file description (mô tả file mở)', 'Đối tượng của nhân do mỗi open() tạo: offset, cờ mở, tham chiếu tới inode. Được dup() và fork() dùng chung.'],
  ['file offset (vị trí đọc/ghi)', 'Chỗ lần đọc/ghi kế tiếp xảy ra; nằm trong mô tả file mở, không nằm trong inode.'],
  ['O_APPEND', 'Mỗi lần ghi trước tiên dời offset tới cuối file, nguyên tử — an toàn cho nhiều người ghi.'],
  ['dup / dup2', 'Cho thêm một fd trỏ tới cùng mô tả file mở; shell dùng nó để làm chuyển hướng.'],
  ['O_CLOEXEC', 'Tự đóng fd này khi exec(), để chương trình được chạy không thừa hưởng nó.'],
  ['/proc/PID/fd, fdinfo', 'Bảng fd dưới dạng symlink, và pos/flags/mnt_id/ino của từng fd.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>fd → mô tả file mở (offset, cờ) → inode: ba tầng, ba chủ sở hữu khác nhau.</li>
<li>dup() và fork() dùng chung một mô tả và offset của nó; open() lần hai tạo offset mới và có thể ghi đè.</li>
<li>O_APPEND đưa mỗi lần ghi về cuối file; nhiều người cùng ghi log thì cần nó.</li>
<li>Chuyển hướng là các lời gọi dup2 áp từ trái sang phải: <code>&gt; f 2&gt;&amp;1</code> khác <code>2&gt;&amp;1 &gt; f</code>.</li>
<li>exec giữ các fd đang mở; O_CLOEXEC (mặc định trong Node và Python) chặn bí mật lọt sang chương trình con.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/open.2.html', '📄', 'man 2 open', 'Mô tả file mở, O_APPEND, O_CLOEXEC và mọi cờ mở khác.', 'Mở')}
${L('https://man7.org/linux/man-pages/man2/dup.2.html', '📄', 'man 2 dup', 'dup, dup2, dup3: các descriptor nhân bản dùng chung những gì.', 'Mở')}
${L(LNX('lnx-3-1-dong-chuan-chuyen-huong'), '🐧', 'Linux &amp; Bash · 3.1 — Dòng chuẩn và chuyển hướng', 'Chuyển hướng ở mức lệnh.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 9.3 — đệm, fsync, rename ───────────────────────── */
    {
      title: '9.3 — write() is not on disk: buffering, fsync, O_DIRECT and the atomic rename|||9.3 — write() chưa phải đã lên đĩa: đệm, fsync, O_DIRECT và rename nguyên tử',
      slug: 'os-9-2-fsync',
      type: 'LESSON',
      isFreePreview: true,
      description: 'write() chỉ chép vào page cache (Dirty tăng 24 MB, flusher ghi sau tới 30 s); đo thật: ghi đệm ~1,8 µs, fsync/fdatasync/O_DSYNC ~0,65–1,1 ms, O_DIRECT ~48 µs; O_DIRECT cần căn lề và dd của uutils lặng lẽ lùi về ghi có cache; "rút điện" bằng chép ảnh đĩa: file biến mất → 0 byte → đủ; rename không fsync có thể để lại file 0 byte; mẫu ghi an toàn tạm → fsync → rename → fsync thư mục; người đọc thấy JSON rỗng/hỏng khi ghi đè tại chỗ; fsyncgate của PostgreSQL.',
      content: `${G93}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>write() returned — so where is your data?</h2>
<p class="lead">Your API saves an order, <code>fs.writeFileSync</code> returns without error, you answer "200 OK". Ten seconds later the VPS loses power. Is the order on disk? Usually <strong>no</strong>. This lesson measures the gap between "the system call returned" and "the bytes are on the device", pulls the power (safely, on a copy of a disk image) at chosen moments, and ends with the four-step pattern that makes a file write both <strong>atomic</strong> (readers see old or new, never half) and <strong>durable</strong> (it survives a crash).</p>

<h3>write() copies into the page cache — and returns</h3>
${run('c93-fsync', 'sysctl vm.dirty_expire_centisecs')}
${run('c93-fsync', "grep -E '^(Dirty|Writeback):' /proc/meminfo", 3)}
<p>We wrote 24 MiB and, one second later, <code>Dirty</code> is 24,584 kB: the data sits in the page cache (Chapter 8), marked "dirty" — newer than the disk. Nothing has been written yet. The kernel's flusher threads wake every <code>dirty_writeback_centisecs</code> (15 s on this Docker Desktop VM; the kernel default is 5 s) and write pages that have been dirty longer than <code>dirty_expire_centisecs</code> (30 s). They also start early when dirty data passes <code>dirty_background_ratio</code> (10% of memory), and above <code>dirty_ratio</code> (20%) the writing process itself is made to wait. <code>sync</code> forced everything out in 0.017 s and <code>Dirty</code> fell to 0. So by default, data you "wrote" can stay only in RAM for <strong>up to about 30–45 seconds</strong>.</p>
${lab('pagecache', 'mmap', 'en', 'read()/write() copy between your buffer and the page cache; mmap maps the cache pages straight into your memory. Either way the disk is updated later, by writeback.')}

<h3>What durability costs: six ways to write, measured</h3>
${src('ch09/wbench.c', 'c')}
${run('c93-fsync', './wbench /srv/data/bench.dat 2000', 2)}
<p>2,000 writes of 4 KiB to the ext4 test disk:</p>
<ul>
<li><strong>buffered</strong> — about <strong>1.8 µs</strong> per write: a memory copy into the page cache.</li>
<li><strong>fsync after each write</strong> — 0.88–0.96 ms: wait until data <em>and</em> metadata (size, timestamps) are on the device, which on ext4 also means a journal commit (lesson 9.4).</li>
<li><strong>fdatasync</strong> — 0.65–1.1 ms here: skips metadata that is not needed to read the data back (an mtime change alone), but our file grows with every write, so the size must be committed anyway and the gain is small. It shines when you overwrite a preallocated file — which is exactly how databases lay out their logs.</li>
<li><strong>O_DSYNC</strong> — the same guarantee as fdatasync, built into every <code>write()</code>.</li>
<li><strong>O_DIRECT</strong> — about <strong>48 µs</strong>: data goes from your buffer straight to the device, skipping the page cache, but <em>without</em> waiting for the device's own cache to be flushed. O_DIRECT alone is <strong>not</strong> durability.</li>
<li><strong>O_DIRECT + fdatasync</strong> — back near 1 ms: durability always costs the flush.</li>
</ul>
<p>Four runs agree on the shape: durable writes are about <strong>500 times slower</strong> than buffered ones here. The exact milliseconds depend on the device — this "disk" is a file on the Mac, and how far Docker Desktop pushes a flush toward the physical SSD was not measured. The lesson is the ratio. It is why PostgreSQL commits a transaction with one WAL fsync and lets many commits share it, why Redis offers <code>appendfsync always</code> (one fsync per write), <code>everysec</code> or <code>no</code>, and why "batch your writes" is the first optimisation for anything that must be durable.</p>
${run('c93-fsync', './wbench /dev/shm/bench.dat 2000')}
<p>On tmpfs an fsync costs 1.4 µs: there is no device, nothing to flush — and nothing survives a reboot.</p>

<h3>O_DIRECT: no cache, strict rules</h3>
${run('c93-fsync', 'head -c 8M /dev/urandom > /srv/data/a.bin', 2)}
<p>A normal write left all 2,048 pages in the page cache; GNU <code>dd oflag=direct</code> left none. Databases with their own cache (MySQL InnoDB with <code>innodb_flush_method=O_DIRECT</code>, Oracle, the backup job of Chapter 2) use O_DIRECT to avoid caching every page twice. The price: the buffer address, the file offset and the length must be aligned (usually to 512 B or 4 KiB) — <code>wbench</code> above got <code>EINVAL</code> for a buffer at an odd address — and you lose read-ahead, so sequential reads are only fast if you do your own large reads.</p>
${lab('pagecache', 'seq', 'en', 'A cold sequential read: read-ahead grows its window 4→8→16→32 pages and hides the disk. O_DIRECT bypasses the page cache and gives up exactly this help.')}
${run('c93-fsync', 'dd --version', 2)}
<div class="pitfall co-tieu-de">
<p><strong>"oflag=direct" did not mean direct.</strong> On Ubuntu 26.04, <code>dd</code> is uutils. Its 1 MiB buffer was not aligned, the kernel answered <code>EINVAL</code>, and dd silently removed O_DIRECT with <code>fcntl(F_SETFL)</code>, wrote through the page cache, and turned the flag back on — the file ended up 100% cached and the command printed no warning. A benchmark or a "don't pollute the cache" backup built on it measures the wrong thing. Verify with a cache check (<code>incore</code>/<code>fincore</code>) or <code>strace</code>, and use <code>gnudd</code> (GNU coreutils, also installed) when you need the old behaviour.</p>
</div>

<h3>Pulling the power, safely</h3>
<p>We cannot cut the power of the lab VM, but we can do the next best thing: copy the disk image <em>while the file system is idle</em>. The copy holds exactly what has reached the "device" — nothing that is still only in the page cache — and mounting it makes the kernel replay the journal, just like a reboot after a power cut:</p>
${src('ch09/crash.sh', 'bash')}
${run('c93-fsync', 'echo "order #1001 paid"', 4)}
<p>The same tiny write, "crashed" at three moments:</p>
<ul>
<li><strong>at 0 s</strong> — the file does not exist. Not even the name has reached the disk.</li>
<li><strong>at 6 s</strong> — the file exists with <strong>0 bytes</strong>. ext4 committed the metadata (the name, an empty inode) in its 5-second journal commit, but the data was still waiting for <em>delayed allocation</em> — ext4 chooses data blocks only at writeback time.</li>
<li><strong>at 40 s</strong> — complete, after the flusher wrote the expired page.</li>
<li>with <code>sync</code> on the file first — complete immediately.</li>
</ul>
<p>An API that answered "order saved" at 0 s, 6 s or 39 s would have lied.</p>

<h3>Replacing a file: atomic is not durable</h3>
<p>Config files, JSON stores, upload manifests: code usually <em>replaces</em> a whole file. Three ways Node code does it:</p>
${src('ch09/luu.js', 'javascript')}
${run('c93-fsync', "node luu.js rename /srv/data/config.json", 2)}
<p>Write a temporary file, then <code>rename()</code> it over the old one. A crash at 0 s gives the <strong>old</strong> version — complete and valid; at 6 s the new one. Never anything in between: POSIX guarantees that rename atomically replaces the target, so there is no moment when the name is missing or points to a half-written file. That is <strong>atomicity</strong>. But is it <strong>durable</strong>? On default ext4, yes after a few seconds — only because ext4 has a heuristic (<code>auto_da_alloc</code>) that notices "rename over an existing file" and starts writing the new data early. That heuristic was added in 2009 after exactly this pattern produced empty files on ext4 after crashes. Turn it off — as XFS and other file systems never had it — and see:</p>
${run('c93-fsync', 'mount -o remount,noauto_da_alloc', 3)}
<p>Crash 9 seconds after a "successful" rename: <code>config.json</code> is <strong>0 bytes</strong> — neither the old version nor the new one. The rename (metadata) was committed by the journal, the data was not. Your app restarts, reads an empty config, and fails — or worse, starts with defaults.</p>
${run('c93-fsync', 'node luu.js safe')}
<p>The safe version — <strong>write the temporary file → fsync it → rename → fsync the directory</strong> — survived a crash at 0 s with the new content, even with the heuristic off. fsync on the file makes the data durable before the name switches; fsync on the directory makes the new name itself durable.</p>

<h3>Readers see half-written files too</h3>
${src('ch09/doc-ghi.js', 'javascript')}
${run('c93-fsync', 'node doc-ghi.js inplace', 2)}
<p>No crash needed. One process rewrites a config 5,000 times, another reads it in a loop, like a server that reloads its config on change. Writing <strong>in place</strong> (<code>writeFileSync</code> = open with O_TRUNC, then write) let the reader see an empty file 374,998 times and broken JSON 165 times (empty reads are cheap, so the reader loops faster while the file is empty — the exact count is inflated; any number above zero is a bug). With write-then-rename: <strong>0 and 0</strong>. Rename is the only way to change a whole file that a running reader can never see half-done.</p>
<p>One more consequence, and it comes back in lesson 9.5: rename installs a <strong>new inode</strong> under the old name. Anything that holds the old inode — an open fd, or a bind mount of that single file — keeps seeing the old content. That is the nginx.conf incident of this project.</p>

<div class="pitfall co-tieu-de">
<p><strong>Checking the result of write() is not enough; check fsync() too — and do not retry it blindly.</strong> Errors from writeback (disk full on a thin volume, I/O error, network storage gone) are often reported only by the next <code>fsync()</code> or <code>close()</code>. In 2018 PostgreSQL developers found that after a failed fsync, Linux could mark the dirty pages clean, so a retried fsync returned success while the data was gone ("fsyncgate"). Since the 2019 releases PostgreSQL treats an fsync failure as fatal (PANIC, then recovery from the WAL) instead of retrying. In your own code: if fsync fails, consider the file lost and rewrite it from a source you still trust.</p>
</div>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the admin panel stores feature flags in <code>settings.json</code> with <code>fs.writeFileSync</code>. After the hosting provider restarted the VPS, the app came up with an empty settings file and every flag was off.</p>
<ol>
<li>In a <code>--privileged</code> lab container, create and loop-mount a 64 MB ext4 image, write <code>{"v":1}</code>, <code>sync</code>.</li>
<li>Save <code>{"v":2}</code> with <code>luu.js inplace</code>, then with <code>rename</code>, each followed by <code>./crash.sh</code> at 0 s and 9 s; repeat with <code>-o remount,noauto_da_alloc</code>.</li>
<li>Write the safe version as a 15-line function <code>saveJsonAtomic(path, obj)</code> for the project and crash-test it at 0 s.</li>
<li>Run <code>wbench</code> and estimate how many settings saves per second the safe version allows.</li>
</ol>
<p><strong>Done when:</strong> you have a table "method × crash time → content after crash" with at least one 0-byte result, and your function returns the new content after a crash at 0 s.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['dirty page', 'A page-cache page newer than the disk; written back later by flusher threads.'],
  ['writeback', 'The kernel writing dirty pages to the device: after dirty_expire (30 s), under memory pressure, or on fsync/sync.'],
  ['fsync / fdatasync', 'Wait until a file’s data (and metadata / only the metadata needed to read it back) is on stable storage.'],
  ['O_DIRECT', 'Bypass the page cache; needs aligned buffers, offsets and sizes; not durable without fsync.'],
  ['delayed allocation', 'ext4 picks data blocks at writeback time; until then a crash can leave a name with 0 bytes.'],
  ['atomic rename', 'rename() replaces the target in one step: readers see the old or the new file, never a mix.'],
  ['safe write pattern', 'Write temp → fsync temp → rename over target → fsync the directory.'],
  ['fsyncgate', 'The 2018 discovery that a retried fsync can falsely succeed after a writeback error; PostgreSQL now panics instead.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>write() returns once data is in the page cache; Dirty grew 24 MB and writeback can lag about 30–45 s.</li>
<li>Durability costs a device flush: ~1 ms per fsync here vs ~1.8 µs buffered — batch durable writes.</li>
<li>O_DIRECT skips the cache but is not durable; it needs alignment, and uutils dd silently falls back.</li>
<li>A crash after a plain write gave: no file → 0 bytes → complete; rename without fsync can leave 0 bytes.</li>
<li>Atomic + durable replace = temp → fsync → rename → fsync dir; in-place rewrites show readers empty or broken JSON.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/fsync.2.html', '📄', 'man 2 fsync', 'fsync and fdatasync, and why the directory needs its own fsync.', 'Open')}
${L('https://man7.org/linux/man-pages/man2/rename.2.html', '📄', 'man 2 rename', 'The atomic-replacement guarantee of rename(), and EXDEV.', 'Open')}
${L('https://wiki.postgresql.org/wiki/Fsync_Errors', '🐘', 'PostgreSQL wiki — Fsync Errors', 'What fsyncgate was and how PostgreSQL handles fsync failures now.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>write() đã trả về — vậy dữ liệu của bạn đang ở đâu?</h2>
<p class="lead">API của bạn lưu một đơn hàng, <code>fs.writeFileSync</code> trả về không lỗi, bạn đáp "200 OK". Mười giây sau VPS mất điện. Đơn hàng đã nằm trên đĩa chưa? Thường là <strong>chưa</strong>. Bài này đo khoảng cách giữa "lời gọi hệ thống đã trả về" và "byte đã nằm trên thiết bị", rút điện (an toàn, trên bản chép của một ảnh đĩa) vào những thời điểm chọn trước, và kết thúc bằng mẫu bốn bước giúp việc ghi file vừa <strong>nguyên tử</strong> (người đọc thấy bản cũ hoặc bản mới, không bao giờ một nửa) vừa <strong>bền</strong> (sống sót qua sự cố sập).</p>

<h3>write() chép vào page cache — rồi trả về</h3>
${run('c93-fsync', 'sysctl vm.dirty_expire_centisecs')}
${run('c93-fsync', "grep -E '^(Dirty|Writeback):' /proc/meminfo", 3)}
<p>Ta ghi 24 MiB và một giây sau <code>Dirty</code> là 24.584 kB: dữ liệu nằm trong page cache (Chương 8), bị đánh dấu "bẩn" — mới hơn bản trên đĩa. Chưa có gì được ghi xuống. Các luồng flusher của nhân thức dậy mỗi <code>dirty_writeback_centisecs</code> (15 s trên VM Docker Desktop này; mặc định của nhân là 5 s) và ghi những trang đã bẩn lâu hơn <code>dirty_expire_centisecs</code> (30 s). Chúng cũng bắt đầu sớm khi dữ liệu bẩn vượt <code>dirty_background_ratio</code> (10% bộ nhớ), và trên <code>dirty_ratio</code> (20%) thì chính tiến trình đang ghi bị bắt chờ. <code>sync</code> đẩy hết xuống trong 0,017 s và <code>Dirty</code> về 0. Vậy theo mặc định, dữ liệu bạn "đã ghi" có thể chỉ nằm trong RAM <strong>tới khoảng 30–45 giây</strong>.</p>
${lab('pagecache', 'mmap', 'vi', 'read()/write() chép giữa bộ đệm của bạn và page cache; mmap ánh xạ thẳng trang cache vào bộ nhớ của bạn. Cách nào thì đĩa cũng được cập nhật sau, bởi writeback.')}

<h3>Cái giá của độ bền: sáu cách ghi, đo thật</h3>
${src('ch09/wbench.c', 'c')}
${run('c93-fsync', './wbench /srv/data/bench.dat 2000', 2)}
<p>2.000 lần ghi 4 KiB lên đĩa thử ext4:</p>
<ul>
<li><strong>buffered (có đệm)</strong> — khoảng <strong>1,8 µs</strong> mỗi lần: một lần chép bộ nhớ vào page cache.</li>
<li><strong>fsync sau mỗi lần ghi</strong> — 0,88–0,96 ms: chờ tới khi dữ liệu <em>và</em> metadata (kích thước, mốc thời gian) nằm trên thiết bị, trên ext4 nghĩa là còn phải commit journal (bài 9.4).</li>
<li><strong>fdatasync</strong> — 0,65–1,1 ms ở đây: bỏ qua metadata không cần để đọc lại dữ liệu (chỉ đổi mtime), nhưng file của ta lớn dần sau mỗi lần ghi nên kích thước vẫn phải commit và lợi rất ít. Nó toả sáng khi bạn ghi đè lên một file đã cấp phát sẵn — đúng cách các CSDL bố trí file log của chúng.</li>
<li><strong>O_DSYNC</strong> — cùng bảo đảm như fdatasync, gắn sẵn vào mỗi <code>write()</code>.</li>
<li><strong>O_DIRECT</strong> — khoảng <strong>48 µs</strong>: dữ liệu đi thẳng từ bộ đệm của bạn xuống thiết bị, bỏ qua page cache, nhưng <em>không</em> chờ cache riêng của thiết bị được xả. Chỉ O_DIRECT thôi thì <strong>chưa</strong> phải là bền.</li>
<li><strong>O_DIRECT + fdatasync</strong> — lại gần 1 ms: độ bền luôn tốn một lần xả.</li>
</ul>
<p>Bốn lượt chạy cùng một hình dạng: ghi bền chậm hơn ghi có đệm khoảng <strong>500 lần</strong> ở đây. Số mili-giây chính xác tuỳ thiết bị — "đĩa" này là một file trên máy Mac, và Docker Desktop đẩy một lần xả tới SSD vật lý xa tới đâu thì chưa đo. Bài học là tỉ lệ. Đó là lý do PostgreSQL commit một giao dịch bằng một lần fsync WAL và cho nhiều commit dùng chung nó, lý do Redis có <code>appendfsync always</code> (mỗi lần ghi một fsync), <code>everysec</code> hay <code>no</code>, và lý do "gom các lần ghi lại" là tối ưu đầu tiên cho mọi thứ cần bền.</p>
${run('c93-fsync', './wbench /dev/shm/bench.dat 2000')}
<p>Trên tmpfs một lần fsync tốn 1,4 µs: không có thiết bị, không có gì để xả — và không có gì sống qua lần khởi động lại.</p>

<h3>O_DIRECT: không cache, luật chặt</h3>
${run('c93-fsync', 'head -c 8M /dev/urandom > /srv/data/a.bin', 2)}
<p>Ghi bình thường để lại đủ 2.048 trang trong page cache; <code>dd oflag=direct</code> của GNU không để lại trang nào. Các CSDL có cache riêng (MySQL InnoDB với <code>innodb_flush_method=O_DIRECT</code>, Oracle, job sao lưu ở Chương 2) dùng O_DIRECT để khỏi cache mỗi trang hai lần. Cái giá: địa chỉ bộ đệm, offset trong file và độ dài phải căn lề (thường 512 B hoặc 4 KiB) — <code>wbench</code> ở trên nhận <code>EINVAL</code> với bộ đệm ở địa chỉ lẻ — và bạn mất read-ahead, nên đọc tuần tự chỉ nhanh nếu bạn tự đọc từng khúc lớn.</p>
${lab('pagecache', 'seq', 'vi', 'Đọc tuần tự một file nguội: read-ahead nới cửa sổ 4→8→16→32 trang và che đi đĩa. O_DIRECT bỏ qua page cache và từ bỏ đúng sự trợ giúp này.')}
${run('c93-fsync', 'dd --version', 2)}
<div class="pitfall co-tieu-de">
<p><strong>"oflag=direct" mà không direct.</strong> Trên Ubuntu 26.04, <code>dd</code> là uutils. Bộ đệm 1 MiB của nó không căn lề, nhân trả <code>EINVAL</code>, và dd lặng lẽ gỡ O_DIRECT bằng <code>fcntl(F_SETFL)</code>, ghi qua page cache, rồi bật cờ lại — file nằm trong cache 100% và lệnh không in cảnh báo nào. Một phép đo hay một job sao lưu "không làm bẩn cache" dựa trên nó đo sai thứ. Hãy kiểm bằng công cụ xem cache (<code>incore</code>/<code>fincore</code>) hoặc <code>strace</code>, và dùng <code>gnudd</code> (GNU coreutils, cũng có sẵn) khi cần hành vi cũ.</p>
</div>

<h3>Rút điện, một cách an toàn</h3>
<p>Ta không thể cắt điện VM lab, nhưng làm được điều gần nhất: chép ảnh đĩa <em>khi hệ thống file đang rảnh</em>. Bản chép chứa đúng những gì đã tới "thiết bị" — không có gì còn nằm riêng trong page cache — và gắn nó vào khiến nhân phát lại journal, y như khởi động lại sau mất điện:</p>
${src('ch09/crash.sh', 'bash')}
${run('c93-fsync', 'echo "order #1001 paid"', 4)}
<p>Cùng một lần ghi bé xíu, "sập" ở ba thời điểm:</p>
<ul>
<li><strong>ở giây 0</strong> — file không tồn tại. Đến cái tên cũng chưa tới đĩa.</li>
<li><strong>ở giây 6</strong> — file có, <strong>0 byte</strong>. ext4 đã commit metadata (cái tên, một inode rỗng) trong lần commit journal mỗi 5 giây, nhưng dữ liệu vẫn chờ <em>cấp phát trễ (delayed allocation)</em> — ext4 chỉ chọn khối dữ liệu lúc writeback.</li>
<li><strong>ở giây 40</strong> — đủ, sau khi flusher ghi trang đã hết hạn.</li>
<li>có <code>sync</code> file trước — đủ ngay lập tức.</li>
</ul>
<p>Một API đáp "đã lưu đơn" ở giây 0, 6 hay 39 đều đã nói dối.</p>

<h3>Thay một file: nguyên tử chưa phải là bền</h3>
<p>File cấu hình, kho JSON, danh sách upload: code thường <em>thay</em> cả một file. Ba cách code Node hay làm:</p>
${src('ch09/luu.js', 'javascript')}
${run('c93-fsync', "node luu.js rename /srv/data/config.json", 2)}
<p>Ghi file tạm, rồi <code>rename()</code> đè lên file cũ. Sập ở giây 0 cho ra bản <strong>cũ</strong> — đủ và hợp lệ; ở giây 6 là bản mới. Không bao giờ có gì ở giữa: POSIX bảo đảm rename thay đích một cách nguyên tử, nên không có lúc nào cái tên biến mất hay trỏ tới file ghi dở. Đó là <strong>tính nguyên tử</strong>. Nhưng nó có <strong>bền</strong> không? Trên ext4 mặc định, có, sau vài giây — chỉ vì ext4 có một mẹo (<code>auto_da_alloc</code>) nhận ra kiểu "rename đè lên file có sẵn" và bắt đầu ghi dữ liệu mới sớm. Mẹo đó được thêm vào năm 2009, sau khi đúng kiểu này sinh ra file rỗng trên ext4 sau các lần sập. Tắt nó đi — như XFS và các hệ thống file khác vốn không có — và xem:</p>
${run('c93-fsync', 'mount -o remount,noauto_da_alloc', 3)}
<p>Sập 9 giây sau một lần rename "thành công": <code>config.json</code> còn <strong>0 byte</strong> — không phải bản cũ, cũng chẳng phải bản mới. Việc đổi tên (metadata) đã được journal commit, dữ liệu thì chưa. App khởi động lại, đọc một cấu hình rỗng, và hỏng — tệ hơn, chạy với giá trị mặc định.</p>
${run('c93-fsync', 'node luu.js safe')}
<p>Bản an toàn — <strong>ghi file tạm → fsync nó → rename → fsync thư mục</strong> — sống qua cú sập ở giây 0 với nội dung mới, kể cả khi đã tắt mẹo. fsync file làm dữ liệu bền trước khi cái tên chuyển sang; fsync thư mục làm chính cái tên mới bền.</p>

<h3>Người đọc cũng thấy file ghi dở</h3>
${src('ch09/doc-ghi.js', 'javascript')}
${run('c93-fsync', 'node doc-ghi.js inplace', 2)}
<p>Không cần sập. Một tiến trình ghi lại cấu hình 5.000 lần, tiến trình kia đọc liên tục, như một máy chủ nạp lại cấu hình khi nó đổi. Ghi <strong>tại chỗ</strong> (<code>writeFileSync</code> = mở với O_TRUNC rồi ghi) để người đọc thấy file rỗng 374.998 lần và JSON hỏng 165 lần (đọc file rỗng rất rẻ nên người đọc lặp nhanh hơn lúc file đang rỗng — con số tuyệt đối bị thổi phồng; cứ lớn hơn 0 là có lỗi). Với ghi-rồi-đổi-tên: <strong>0 và 0</strong>. Rename là cách duy nhất thay cả một file mà người đọc đang chạy không bao giờ thấy nửa chừng.</p>
<p>Thêm một hệ quả, sẽ quay lại ở bài 9.5: rename gắn một <strong>inode mới</strong> vào cái tên cũ. Thứ gì đang giữ inode cũ — một fd đang mở, hay một bind mount của riêng file đó — sẽ cứ thấy nội dung cũ. Đó chính là sự cố nginx.conf của dự án này.</p>

<div class="pitfall co-tieu-de">
<p><strong>Kiểm kết quả write() là chưa đủ; phải kiểm cả fsync() — và đừng thử lại nó một cách mù quáng.</strong> Lỗi từ writeback (đầy đĩa trên volume cấp phát mỏng, lỗi I/O, ổ mạng biến mất) thường chỉ được báo ở lần <code>fsync()</code> hay <code>close()</code> kế tiếp. Năm 2018 các nhà phát triển PostgreSQL phát hiện rằng sau một lần fsync thất bại, Linux có thể đánh dấu các trang bẩn là sạch, nên lần fsync thử lại trả về thành công trong khi dữ liệu đã mất ("fsyncgate"). Từ các bản phát hành năm 2019, PostgreSQL coi lỗi fsync là chí mạng (PANIC, rồi phục hồi từ WAL) thay vì thử lại. Trong code của bạn: nếu fsync thất bại, coi như file đã mất và ghi lại từ một nguồn bạn vẫn còn tin.</p>
</div>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> trang admin lưu cờ tính năng trong <code>settings.json</code> bằng <code>fs.writeFileSync</code>. Sau khi nhà cung cấp hosting khởi động lại VPS, app lên với một file cấu hình rỗng và mọi cờ đều tắt.</p>
<ol>
<li>Trong container lab <code>--privileged</code>, tạo và gắn loop một ảnh ext4 64 MB, ghi <code>{"v":1}</code>, <code>sync</code>.</li>
<li>Lưu <code>{"v":2}</code> bằng <code>luu.js inplace</code>, rồi bằng <code>rename</code>, mỗi lần kèm <code>./crash.sh</code> ở giây 0 và giây 9; lặp lại với <code>-o remount,noauto_da_alloc</code>.</li>
<li>Viết bản an toàn thành hàm 15 dòng <code>saveJsonAtomic(path, obj)</code> cho dự án và thử sập nó ở giây 0.</li>
<li>Chạy <code>wbench</code> và ước lượng bản an toàn cho phép lưu cấu hình bao nhiêu lần mỗi giây.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có bảng "cách ghi × thời điểm sập → nội dung sau sập" với ít nhất một kết quả 0 byte, và hàm của bạn trả về nội dung mới sau cú sập ở giây 0.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['dirty page (trang bẩn)', 'Trang page cache mới hơn bản trên đĩa; được các luồng flusher ghi xuống sau.'],
  ['writeback (ghi về)', 'Nhân ghi trang bẩn xuống thiết bị: sau dirty_expire (30 s), khi thiếu bộ nhớ, hoặc khi fsync/sync.'],
  ['fsync / fdatasync', 'Chờ tới khi dữ liệu của file (và metadata / chỉ phần metadata cần để đọc lại) nằm trên bộ lưu trữ bền.'],
  ['O_DIRECT', 'Bỏ qua page cache; cần bộ đệm, offset, kích thước căn lề; không bền nếu thiếu fsync.'],
  ['delayed allocation (cấp phát trễ)', 'ext4 chọn khối dữ liệu lúc writeback; trước đó một cú sập có thể để lại cái tên với 0 byte.'],
  ['atomic rename (đổi tên nguyên tử)', 'rename() thay đích trong một bước: người đọc thấy file cũ hoặc mới, không bao giờ lẫn lộn.'],
  ['safe write pattern (mẫu ghi an toàn)', 'Ghi file tạm → fsync file tạm → rename đè đích → fsync thư mục.'],
  ['fsyncgate', 'Phát hiện năm 2018 rằng fsync thử lại có thể báo thành công giả sau lỗi writeback; PostgreSQL nay PANIC thay vì thử lại.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>write() trả về khi dữ liệu đã vào page cache; Dirty tăng 24 MB và writeback có thể trễ khoảng 30–45 s.</li>
<li>Độ bền tốn một lần xả thiết bị: ~1 ms mỗi fsync ở đây so với ~1,8 µs ghi có đệm — hãy gom các lần ghi bền.</li>
<li>O_DIRECT bỏ qua cache nhưng không bền; nó cần căn lề, và dd của uutils lặng lẽ lùi về cách cũ.</li>
<li>Sập sau một lần ghi thường cho ra: không có file → 0 byte → đủ; rename không fsync có thể để lại 0 byte.</li>
<li>Thay file vừa nguyên tử vừa bền = tạm → fsync → rename → fsync thư mục; ghi đè tại chỗ cho người đọc thấy JSON rỗng hoặc hỏng.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/fsync.2.html', '📄', 'man 2 fsync', 'fsync và fdatasync, và vì sao thư mục cần fsync riêng.', 'Mở')}
${L('https://man7.org/linux/man-pages/man2/rename.2.html', '📄', 'man 2 rename', 'Bảo đảm thay thế nguyên tử của rename(), và EXDEV.', 'Mở')}
${L('https://wiki.postgresql.org/wiki/Fsync_Errors', '🐘', 'PostgreSQL wiki — Fsync Errors', 'fsyncgate là gì và PostgreSQL xử lý lỗi fsync ra sao hiện nay.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 9.4 — journaling ───────────────────────── */
    {
      title: '9.4 — Journaling and crash consistency: what ext4 writes before it writes|||9.4 — Journaling và nhất quán khi sập: ext4 ghi gì trước khi ghi',
      slug: 'os-9-3-journaling',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bài toán nhất quán khi sập (một lần nối thêm khối = 3 lần ghi); ext2 không journal: dựng tay trạng thái "chỉ inode kịp xuống" ⇒ file hoá đơn chứa mật khẩu đã xoá của người khác, fsck chỉ thấy lệch bitmap; journal ghi trước: soi tận một giao dịch thật bằng debugfs logdump (7 khối metadata + khối commit) rồi phát lại sau "mất điện"; data=ordered/writeback/journal (journal ghi 2 lần: 32→64 MB); giá mỗi commit; chép ảnh đĩa đang chạy không phải bản sao lưu (8/12 bản hỏng); copy-on-write và WAL của PostgreSQL.',
      content: `${G94}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Journaling: how a file system survives losing power in the middle of a write</h2>
<p class="lead">Lesson 9.3 crashed a disk and the file system always came back <em>mountable</em> — some data was missing, but nothing was corrupted. That is not luck; it is the <strong>journal</strong>. This lesson shows the problem a journal solves (on a file system without one, with a result you will not forget), then opens a real ext4 journal transaction block by block, replays it, measures what the different journaling modes cost, and ends with a backup mistake that defeats even a journal.</p>

<h3>One small append is three writes</h3>
<p>Appending one block to a file changes three separate places on disk: the <strong>data block</strong> itself, the file's <strong>inode</strong> (new size, pointer to the new block), and the <strong>block bitmap</strong> (mark that block as used). A disk writes blocks one at a time and may reorder them. If the power fails after some of them, the file system is left in a state that never existed logically: an inode pointing at a block the bitmap calls free, a bitmap marking a block nobody uses, or a pointer to a block that still holds old data. Before journaling, the only cure was <code>fsck</code>: scan <em>every</em> inode and bitmap of the disk at boot — hours on a large server.</p>

<h3>Without a journal: the crash state, built by hand</h3>
<p>We cannot pull the plug at a precise microsecond, so we build the crash state ourselves on an <strong>ext2</strong> disk (no journal) with <code>debugfs</code>, exactly as if only one of the three writes had reached the disk. First, two files, then one of them deleted — its block is free again, but its old bytes are still there:</p>
${run('c94-journal', 'truncate -s 8M /tmp/old.img', 4)}
<p>Now the crash: the program was appending a second 1 KiB block to <code>invoice.txt</code>; the allocator picked free block 7170; only the <strong>inode</strong> update reached the disk (size 2048, 4 sectors, block[1] = 7170), not the new data and not the bitmap:</p>
${run('c94-journal', 'debugfs -w -R "sif /invoice.txt size 2048"')}
${run('c94-journal', 'mount -o loop,ro /tmp/old.img')}
<p>After the "reboot", the customer's invoice contains <strong>another user's deleted password</strong>. Nothing is broken from the file system's point of view — the inode simply points at a block, and that block holds whatever was there before. Now ask fsck:</p>
${run('c94-journal', 'e2fsck -fn /tmp/old.img')}
<p>fsck finds one inconsistency — the bitmap says block 7170 is free although an inode uses it — and would fix the bitmap. It <strong>cannot</strong> know that the content is garbage: metadata checks never look at your data. Stale data exposure after a crash is a real security issue, and it is exactly what ext4's default mode prevents.</p>

<h3>The idea: write it down before you do it</h3>
<p>A journal (write-ahead log) is a reserved area of the disk. Before changing anything in place, the file system writes every block it is about to change into the journal, followed by a <strong>commit block</strong>. Only after the commit is safely on disk does it write the blocks to their real locations (the <em>checkpoint</em>). After a crash, the kernel reads the journal: a transaction with a commit block is replayed (written again — harmless if it was already done); a transaction without one is ignored, as if it never started. Either all three writes happen or none.</p>
${run('c94-journal', 'dumpe2fs -h /tmp/vps.img')}
${run('c94-journal', "grep -E '^(data=")}
${run('c94-journal', 'dumpe2fs /tmp/vps.img')}
<p>Our 32 MB ext4 disk has a 4 MiB journal; it commits every 5 seconds (<code>commit=5</code>), with checksums and write barriers, in <code>data=ordered</code> mode. And here is its map: superblock in block 0, group descriptors in block 1, the block bitmap in block 5, the inode bitmap in block 21, inodes from block 37.</p>

<h3>A real transaction, block by block</h3>
${run('c94-journal', 'mkdir /srv/data/uploads', 2)}
<p>We created a folder with three photos, waited 7 seconds (long enough for one commit, too short for the checkpoint), and copied the image while the file system was idle — a faithful "power cut at this moment".</p>
${run('c94-journal', "debugfs -R 'ls /' /tmp/crash.img", 2)}
<p>In the main area of the copy, <code>uploads</code> does not exist yet and the superblock carries the <code>needs_recovery</code> flag. Now look in the journal:</p>
${run('c94-journal', "debugfs -R 'logdump -a'")}
<p>Transaction 2 is complete: a descriptor block, seven logged blocks, a commit block. Using the map above and <code>icheck</code> below, every one of the seven is accounted for: <strong>21</strong> inode bitmap (four new inodes in use), <strong>1</strong> group descriptors (free counts), <strong>37</strong> the inode-table block holding the new inodes, <strong>5</strong> block bitmap (one new block for the directory), <strong>1581</strong> the new <code>uploads</code> directory block, <strong>6</strong> the root directory block (new entry "uploads"), <strong>0</strong> the superblock. Seven metadata blocks, and no photo data.</p>
${run('c94-journal', 'mount -o loop /tmp/crash.img', 2)}
<p>Mounting the copy replays transaction 2 ("recovery complete"): the folder and the three names are back, and <code>icheck</code> confirms block 6 belongs to inode 2 (the root) and 1581 to inode 13 (<code>uploads</code>). The photos are <strong>0 bytes</strong> — in ordered mode the journal protects the file system's structure, and it guarantees that an inode never points at blocks whose data was not written first (no stale data, unlike ext2 above). It does <em>not</em> make your data durable: for that you call fsync (lesson 9.3).</p>
${lab('sysmon', 'iostorm', 'en', 'Heavy synchronous writing: load climbs while the CPU idles, processes wait in state D and iowait rises. Every fsync means a journal commit and a device flush.')}

<h3>Three modes, and what each one costs</h3>
${run('c94-journal', 'for mode in ordered')}
<ul>
<li><strong>data=ordered</strong> (default): only metadata goes through the journal, but data blocks are forced to disk before the metadata that points to them is committed. 32 MiB written → 32.8 MiB on the device.</li>
<li><strong>data=writeback</strong>: metadata journaled, data written whenever. Same cost here, but after a crash a file can point to blocks holding old data — the ext2 problem returns for data.</li>
<li><strong>data=journal</strong>: data goes through the journal too. Strongest guarantee, and the disk received <strong>65.9 MiB for 32 MiB</strong> written: every byte twice.</li>
</ul>
${run('c94-journal', 'D=$(basename')}
<p>500 appends, each followed by fsync: the journal now counts 501 transactions, 500 of them "requested" — an fsync forces the current transaction to commit now instead of in 5 seconds. Each commit took about half a millisecond here (471 µs on average). When many processes fsync at the same moment, jbd2 lets them share one commit (group commit) — the same trick PostgreSQL uses for its WAL.</p>

<h3>Copying a running disk is not a backup</h3>
<p>The crash copies above were taken while the file system was <em>idle</em>. What if you copy the disk while it is busy — <code>dd</code> of a mounted disk, or copying a running VM's image file "for a quick backup"?</p>
${run('c94-journal', '( for i in $(seq 1 6000)', 3)}
<p>Twelve copies of a disk taken while 6,000 files were being created; e2fsck replayed the journal of each and then checked it. <strong>8 of 12 were still corrupt</strong> — directory entries pointing at inodes marked unused. A real power cut stops all writes at one instant, in the order the journal relies on. A copy that takes tens of milliseconds reads the start of the disk at one moment and the end at another — a mix of states that never existed, which no journal can repair. Back up with something that freezes one instant (LVM/ZFS/cloud snapshots, <code>fsfreeze</code>) or with the application's own tool (<code>pg_dump</code>/<code>pg_basebackup</code>).</p>

<h3>Beyond the journal</h3>
<p><strong>Copy-on-write</strong> file systems (Btrfs, ZFS, APFS on your Mac) never overwrite live blocks: they write new versions elsewhere and then switch one pointer at the top of the tree, so every committed state is consistent and snapshots are nearly free (not measured in this lab — the image has no Btrfs tools). And databases repeat the whole idea one level up: PostgreSQL's <strong>WAL</strong> is a journal for table pages, and <code>full_page_writes</code> protects against a half-written 8 KiB page on a disk that writes 4 KiB at a time. You watched that recovery run in Chapter 2, when Postgres replayed its WAL after the disk filled up ("redo done", <a href="${OS('os-2-4-dia-io')}">lesson 2.4</a>).</p>

<div class="pitfall co-tieu-de">
<p><strong>A journal is only as honest as the disk's flush.</strong> Journaling relies on one ordering rule: the commit block must reach stable storage after the blocks it commits. ext4 enforces it with flush/FUA requests (<code>barrier</code> in the options above). Mounting with <code>nobarrier</code> "for speed", a RAID card with a write cache and no battery, or a cheap SSD without power-loss protection that acknowledges a flush it has not done, all break that rule silently — and then a power cut can corrupt the file system despite the journal. On a VPS you trust the provider here; on your own hardware, check it.</p>
</div>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a classmate's "backup" script runs every night as <code>dd if=/dev/vda of=/backup/vps.img</code> on the live VPS. He says the journal makes it safe. You have one hour and a lab container to show him, with evidence, what the journal does and does not protect.</p>
<ol>
<li>In a <code>--privileged</code> container, create a 32 MB ext4 image with <code>-E lazy_itable_init=0,lazy_journal_init=0</code>, mount it, create a folder with three files, wait 7 s, copy the image while idle.</li>
<li>Use <code>debugfs -R 'logdump -a'</code> on the copy and name every logged block (use <code>dumpe2fs</code> and <code>debugfs -R 'icheck N'</code>).</li>
<li>Mount the copy and confirm the replay; then repeat the copy while a loop creates thousands of files, and run <code>e2fsck -fy</code> on several copies.</li>
<li>Write three lines for him: what the journal guaranteed, what it did not, and what to use instead of <code>dd</code>.</li>
</ol>
<p><strong>Done when:</strong> you can explain each logged block of one real transaction, and you have at least one copy whose e2fsck output still lists errors after "recovering journal".</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['crash consistency', 'Keeping the on-disk structures valid whatever subset of pending writes reached the disk before a crash.'],
  ['fsck', 'File system checker: scans all metadata for inconsistencies; slow, and blind to garbage data.'],
  ['journal (write-ahead log)', 'Reserved area where changes are written, with a commit block, before they are applied in place.'],
  ['commit block / checkpoint', 'The mark that a transaction is complete / writing journaled blocks to their real locations.'],
  ['replay (recovery)', 'After a crash, re-applying committed journal transactions and dropping incomplete ones.'],
  ['data=ordered / writeback / journal', 'ext4 modes: data before metadata commit (default) / metadata only / data through the journal too (written twice).'],
  ['write barrier / flush', 'A request that forces the device to persist earlier writes before later ones; journaling depends on it.'],
  ['copy-on-write file system', 'Never overwrites live blocks; switches a root pointer to commit (Btrfs, ZFS, APFS).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>One append = data block + inode + bitmap; a crash between them leaves inconsistencies or stale data.</li>
<li>On ext2, an inode-only crash state exposed a deleted password, and fsck saw only a bitmap mismatch.</li>
<li>ext4 writes changed metadata blocks plus a commit block to the journal first; mount replays committed transactions.</li>
<li>data=ordered prevents stale data; data=journal writes everything twice (32 → 65.9 MiB); each fsync costs a journal commit (~0.5 ms here).</li>
<li>A copy of a busy disk is not crash-consistent (8 of 12 copies corrupt): use snapshots or the application's backup tool.</li>
</ul>
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/file-journaling.pdf', '📘', 'OSTEP — Crash Consistency: FSCK and Journaling', 'The free textbook chapter on the three-writes problem, fsck, and data vs metadata journaling.', 'Open')}
${L('https://www.kernel.org/doc/html/latest/filesystems/ext4/journal.html', '🐧', 'kernel.org — ext4 Journal (jbd2)', 'The on-disk layout of descriptor, data and commit blocks, and the three data modes.', 'Open')}
${L(OSG('osg202-4-1-he-thong-tep'), '🎓', 'OSG202 · File systems', 'If you take OSG202: the textbook view of file-system implementation.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Journaling: hệ thống file sống sót thế nào khi mất điện giữa lúc ghi</h2>
<p class="lead">Bài 9.3 cho đĩa sập và hệ thống file lúc nào cũng quay lại <em>gắn được</em> — có dữ liệu bị thiếu, nhưng không có gì hỏng. Đó không phải may mắn; đó là <strong>journal (nhật ký ghi trước)</strong>. Bài này cho thấy vấn đề mà journal giải quyết (trên một hệ thống file không có journal, với một kết quả bạn sẽ không quên), rồi mở một giao dịch journal ext4 thật ra từng khối, phát lại nó, đo cái giá của các chế độ journal, và kết thúc bằng một sai lầm sao lưu mà đến journal cũng chịu thua.</p>

<h3>Một lần nối thêm nhỏ là ba lần ghi</h3>
<p>Nối thêm một khối vào file làm thay đổi ba chỗ riêng biệt trên đĩa: chính <strong>khối dữ liệu</strong>, <strong>inode</strong> của file (kích thước mới, con trỏ tới khối mới), và <strong>bitmap khối</strong> (đánh dấu khối đó đã dùng). Đĩa ghi từng khối một và có thể đổi thứ tự. Nếu mất điện sau khi chỉ vài khối đã xuống, hệ thống file rơi vào một trạng thái chưa từng tồn tại về mặt logic: inode trỏ tới khối mà bitmap bảo là trống, bitmap đánh dấu một khối chẳng ai dùng, hay con trỏ tới một khối vẫn chứa dữ liệu cũ. Trước khi có journaling, cách chữa duy nhất là <code>fsck</code>: quét <em>mọi</em> inode và bitmap của đĩa lúc khởi động — hàng giờ trên một máy chủ lớn.</p>

<h3>Không có journal: dựng tay trạng thái sập</h3>
<p>Ta không thể rút điện đúng một micro-giây chọn trước, nên tự dựng trạng thái sập trên một đĩa <strong>ext2</strong> (không journal) bằng <code>debugfs</code>, y như chỉ một trong ba lần ghi kịp xuống đĩa. Trước hết, hai file, rồi xoá một — khối của nó trống trở lại, nhưng byte cũ vẫn nằm đó:</p>
${run('c94-journal', 'truncate -s 8M /tmp/old.img', 4)}
<p>Giờ là cú sập: chương trình đang nối khối 1 KiB thứ hai vào <code>invoice.txt</code>; bộ cấp phát chọn khối trống 7170; chỉ phần cập nhật <strong>inode</strong> kịp xuống đĩa (kích thước 2048, 4 sector, block[1] = 7170), dữ liệu mới và bitmap thì không:</p>
${run('c94-journal', 'debugfs -w -R "sif /invoice.txt size 2048"')}
${run('c94-journal', 'mount -o loop,ro /tmp/old.img')}
<p>Sau khi "khởi động lại", hoá đơn của khách chứa <strong>mật khẩu đã xoá của một người dùng khác</strong>. Theo góc nhìn của hệ thống file thì chẳng có gì hỏng — inode chỉ trỏ tới một khối, và khối đó chứa thứ gì có sẵn từ trước. Giờ hỏi fsck:</p>
${run('c94-journal', 'e2fsck -fn /tmp/old.img')}
<p>fsck tìm thấy một chỗ lệch — bitmap bảo khối 7170 trống dù có inode đang dùng — và sẽ sửa bitmap. Nó <strong>không thể</strong> biết nội dung là rác: phép kiểm metadata không bao giờ nhìn vào dữ liệu của bạn. Lộ dữ liệu cũ sau sự cố sập là một vấn đề bảo mật thật, và đó chính là thứ chế độ mặc định của ext4 ngăn chặn.</p>

<h3>Ý tưởng: ghi lại trước khi làm</h3>
<p>Journal (nhật ký ghi trước) là một vùng dành riêng trên đĩa. Trước khi sửa bất cứ thứ gì tại chỗ, hệ thống file ghi mọi khối nó sắp đổi vào journal, kèm theo một <strong>khối commit</strong>. Chỉ khi khối commit đã nằm an toàn trên đĩa, nó mới ghi các khối về vị trí thật (bước <em>checkpoint</em>). Sau sự cố sập, nhân đọc journal: giao dịch có khối commit thì được phát lại (ghi thêm lần nữa — vô hại nếu đã làm rồi); giao dịch không có thì bị bỏ qua, như chưa từng bắt đầu. Hoặc cả ba lần ghi xảy ra, hoặc không lần nào.</p>
${run('c94-journal', 'dumpe2fs -h /tmp/vps.img')}
${run('c94-journal', "grep -E '^(data=")}
${run('c94-journal', 'dumpe2fs /tmp/vps.img')}
<p>Đĩa ext4 32 MB của ta có journal 4 MiB; nó commit mỗi 5 giây (<code>commit=5</code>), có checksum và write barrier, ở chế độ <code>data=ordered</code>. Và đây là bản đồ của nó: superblock ở khối 0, bảng mô tả nhóm ở khối 1, bitmap khối ở khối 5, bitmap inode ở khối 21, các inode từ khối 37.</p>

<h3>Một giao dịch thật, từng khối</h3>
${run('c94-journal', 'mkdir /srv/data/uploads', 2)}
<p>Ta tạo một thư mục với ba ảnh, chờ 7 giây (đủ cho một lần commit, chưa đủ cho checkpoint), và chép ảnh đĩa lúc hệ thống file đang rảnh — đúng nghĩa "cúp điện ngay lúc này".</p>
${run('c94-journal', "debugfs -R 'ls /' /tmp/crash.img", 2)}
<p>Ở vùng chính của bản chép, <code>uploads</code> chưa tồn tại và superblock mang cờ <code>needs_recovery</code>. Giờ nhìn vào journal:</p>
${run('c94-journal', "debugfs -R 'logdump -a'")}
<p>Giao dịch 2 đã đủ: một khối mô tả, bảy khối được ghi lại, một khối commit. Dùng bản đồ ở trên và <code>icheck</code> bên dưới, cả bảy đều giải thích được: <strong>21</strong> bitmap inode (bốn inode mới được dùng), <strong>1</strong> bảng mô tả nhóm (số đếm còn trống), <strong>37</strong> khối bảng inode chứa các inode mới, <strong>5</strong> bitmap khối (một khối mới cho thư mục), <strong>1581</strong> khối của thư mục <code>uploads</code> mới, <strong>6</strong> khối của thư mục gốc (mục mới "uploads"), <strong>0</strong> superblock. Bảy khối metadata, và không có dữ liệu ảnh nào.</p>
${run('c94-journal', 'mount -o loop /tmp/crash.img', 2)}
<p>Gắn bản chép làm nhân phát lại giao dịch 2 ("recovery complete"): thư mục và ba cái tên đã trở lại, và <code>icheck</code> xác nhận khối 6 thuộc inode 2 (thư mục gốc), khối 1581 thuộc inode 13 (<code>uploads</code>). Các ảnh còn <strong>0 byte</strong> — ở chế độ ordered, journal bảo vệ cấu trúc của hệ thống file, và bảo đảm inode không bao giờ trỏ tới khối mà dữ liệu chưa được ghi trước (không lộ dữ liệu cũ, khác ext2 ở trên). Nó <em>không</em> làm dữ liệu của bạn bền: muốn vậy bạn phải gọi fsync (bài 9.3).</p>
${lab('sysmon', 'iostorm', 'vi', 'Ghi đồng bộ dồn dập: load tăng trong khi CPU rảnh, tiến trình chờ ở trạng thái D và iowait tăng. Mỗi lần fsync là một lần commit journal và một lần xả thiết bị.')}

<h3>Ba chế độ, và cái giá của từng chế độ</h3>
${run('c94-journal', 'for mode in ordered')}
<ul>
<li><strong>data=ordered</strong> (mặc định): chỉ metadata đi qua journal, nhưng khối dữ liệu bị ép xuống đĩa trước khi metadata trỏ tới nó được commit. Ghi 32 MiB → thiết bị nhận 32,8 MiB.</li>
<li><strong>data=writeback</strong>: journal metadata, dữ liệu ghi lúc nào cũng được. Cùng giá ở đây, nhưng sau sự cố sập một file có thể trỏ tới khối chứa dữ liệu cũ — vấn đề của ext2 quay lại với dữ liệu.</li>
<li><strong>data=journal</strong>: dữ liệu cũng đi qua journal. Bảo đảm mạnh nhất, và đĩa nhận <strong>65,9 MiB cho 32 MiB</strong> được ghi: mỗi byte hai lần.</li>
</ul>
${run('c94-journal', 'D=$(basename')}
<p>500 lần nối thêm, mỗi lần kèm fsync: journal giờ đếm 501 giao dịch, 500 trong số đó là "requested" (bị yêu cầu) — một lần fsync ép giao dịch hiện tại commit ngay thay vì đợi 5 giây. Mỗi lần commit tốn khoảng nửa mili-giây ở đây (trung bình 471 µs). Khi nhiều tiến trình fsync cùng lúc, jbd2 cho chúng dùng chung một lần commit (group commit) — đúng mẹo PostgreSQL dùng cho WAL của nó.</p>

<h3>Chép một đĩa đang chạy không phải là sao lưu</h3>
<p>Các bản chép "sập" ở trên được lấy khi hệ thống file đang <em>rảnh</em>. Nếu bạn chép đĩa lúc nó đang bận thì sao — <code>dd</code> một đĩa đang gắn, hay chép file ảnh của một VM đang chạy "để sao lưu nhanh"?</p>
${run('c94-journal', '( for i in $(seq 1 6000)', 3)}
<p>Mười hai bản chép của một đĩa, lấy trong lúc 6.000 file đang được tạo; e2fsck phát lại journal của từng bản rồi kiểm. <strong>8 trên 12 bản vẫn hỏng</strong> — mục thư mục trỏ tới inode được đánh dấu chưa dùng. Một lần mất điện thật dừng mọi lần ghi tại một khoảnh khắc, đúng thứ tự mà journal dựa vào. Một lần chép kéo dài hàng chục mili-giây đọc đầu đĩa ở một lúc và cuối đĩa ở lúc khác — một hỗn hợp các trạng thái chưa từng tồn tại, journal nào cũng không sửa được. Hãy sao lưu bằng thứ đóng băng một khoảnh khắc (snapshot của LVM/ZFS/nhà cung cấp cloud, <code>fsfreeze</code>) hoặc bằng công cụ của chính ứng dụng (<code>pg_dump</code>/<code>pg_basebackup</code>).</p>

<h3>Xa hơn journal</h3>
<p>Hệ thống file <strong>copy-on-write</strong> (Btrfs, ZFS, APFS trên máy Mac của bạn) không bao giờ ghi đè khối đang sống: chúng ghi phiên bản mới ở chỗ khác rồi đổi một con trỏ ở đỉnh cây, nên mọi trạng thái đã commit đều nhất quán và snapshot gần như miễn phí (chưa đo trong lab này — ảnh không có công cụ Btrfs). Và các CSDL lặp lại cả ý tưởng ở một tầng cao hơn: <strong>WAL</strong> của PostgreSQL là journal cho các trang bảng, còn <code>full_page_writes</code> chống trang 8 KiB bị ghi dở trên đĩa ghi mỗi lần 4 KiB. Bạn đã xem quá trình phục hồi đó chạy ở Chương 2, khi Postgres phát lại WAL sau lúc đĩa đầy ("redo done", <a href="${OS('os-2-4-dia-io')}">bài 2.4</a>).</p>

<div class="pitfall co-tieu-de">
<p><strong>Journal chỉ trung thực bằng lệnh xả của đĩa.</strong> Journaling dựa vào một luật thứ tự: khối commit phải tới bộ lưu trữ bền sau các khối mà nó commit. ext4 ép luật đó bằng các yêu cầu flush/FUA (<code>barrier</code> trong các tuỳ chọn ở trên). Gắn với <code>nobarrier</code> "cho nhanh", card RAID có cache ghi mà không có pin, hay SSD rẻ không có bảo vệ mất điện mà báo đã xả dù chưa xả — đều âm thầm phá luật đó, và khi ấy một lần mất điện có thể làm hỏng hệ thống file bất chấp journal. Trên VPS bạn phải tin nhà cung cấp ở chỗ này; trên phần cứng của chính bạn, hãy kiểm tra.</p>
</div>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> script "sao lưu" của một bạn cùng lớp chạy mỗi đêm là <code>dd if=/dev/vda of=/backup/vps.img</code> trên VPS đang chạy. Bạn ấy nói journal làm nó an toàn. Bạn có một giờ và một container lab để cho bạn ấy thấy, bằng bằng chứng, journal bảo vệ gì và không bảo vệ gì.</p>
<ol>
<li>Trong container <code>--privileged</code>, tạo ảnh ext4 32 MB với <code>-E lazy_itable_init=0,lazy_journal_init=0</code>, gắn vào, tạo một thư mục với ba file, chờ 7 s, chép ảnh lúc rảnh.</li>
<li>Dùng <code>debugfs -R 'logdump -a'</code> trên bản chép và gọi tên từng khối được ghi lại (dùng <code>dumpe2fs</code> và <code>debugfs -R 'icheck N'</code>).</li>
<li>Gắn bản chép và xác nhận việc phát lại; rồi lặp lại việc chép trong lúc một vòng lặp tạo hàng nghìn file, và chạy <code>e2fsck -fy</code> trên vài bản chép.</li>
<li>Viết ba dòng cho bạn ấy: journal đã bảo đảm gì, không bảo đảm gì, và nên dùng gì thay cho <code>dd</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được từng khối được ghi lại của một giao dịch thật, và có ít nhất một bản chép mà output e2fsck vẫn liệt kê lỗi sau dòng "recovering journal".</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['crash consistency (nhất quán khi sập)', 'Giữ cấu trúc trên đĩa hợp lệ bất kể tập con nào của các lần ghi đang chờ đã kịp xuống trước khi sập.'],
  ['fsck', 'Trình kiểm hệ thống file: quét toàn bộ metadata tìm chỗ lệch; chậm, và mù với dữ liệu rác.'],
  ['journal (nhật ký ghi trước)', 'Vùng dành riêng nơi các thay đổi được ghi, kèm khối commit, trước khi được áp vào chỗ thật.'],
  ['commit block / checkpoint', 'Dấu hiệu một giao dịch đã đủ / việc ghi các khối trong journal về vị trí thật.'],
  ['replay — recovery (phát lại)', 'Sau sự cố sập, áp lại các giao dịch journal đã commit và bỏ các giao dịch dở.'],
  ['data=ordered / writeback / journal', 'Chế độ ext4: dữ liệu xuống trước khi commit metadata (mặc định) / chỉ metadata / cả dữ liệu qua journal (ghi hai lần).'],
  ['write barrier / flush (rào ghi / xả)', 'Yêu cầu buộc thiết bị lưu bền các lần ghi trước rồi mới tới lần sau; journaling phụ thuộc vào nó.'],
  ['copy-on-write file system', 'Không bao giờ ghi đè khối đang sống; commit bằng cách đổi con trỏ gốc (Btrfs, ZFS, APFS).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một lần nối thêm = khối dữ liệu + inode + bitmap; sập giữa chừng để lại chỗ lệch hoặc dữ liệu cũ.</li>
<li>Trên ext2, trạng thái sập "chỉ có inode" làm lộ một mật khẩu đã xoá, và fsck chỉ thấy lệch bitmap.</li>
<li>ext4 ghi các khối metadata bị đổi cùng một khối commit vào journal trước; lúc gắn, nhân phát lại các giao dịch đã commit.</li>
<li>data=ordered chặn lộ dữ liệu cũ; data=journal ghi mọi thứ hai lần (32 → 65,9 MiB); mỗi fsync tốn một lần commit journal (~0,5 ms ở đây).</li>
<li>Bản chép của một đĩa đang bận không nhất quán (8 trên 12 bản hỏng): hãy dùng snapshot hoặc công cụ sao lưu của ứng dụng.</li>
</ul>
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/file-journaling.pdf', '📘', 'OSTEP — Crash Consistency: FSCK and Journaling', 'Chương sách miễn phí về bài toán ba lần ghi, fsck, và journaling dữ liệu vs metadata.', 'Mở')}
${L('https://www.kernel.org/doc/html/latest/filesystems/ext4/journal.html', '🐧', 'kernel.org — ext4 Journal (jbd2)', 'Bố cục trên đĩa của khối mô tả, khối dữ liệu và khối commit, và ba chế độ dữ liệu.', 'Mở')}
${L(OSG('osg202-4-1-he-thong-tep'), '🎓', 'OSG202 · Hệ thống tệp', 'Nếu bạn học OSG202: góc nhìn giáo trình về cài đặt hệ thống file.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 9.5 — mount và bind mount ───────────────────────── */
    {
      title: '9.5 — Mount points and bind mounts: why sed -i did not reach the container|||9.5 — Điểm gắn và bind mount: vì sao sed -i không tới được container',
      slug: 'os-9-6-mount',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cây thư mục là nhiều hệ thống file gắn chồng; Docker tự bind-mount /etc/hosts, /etc/hostname, /etc/resolv.conf; đọc /proc/self/mountinfo; gắn đè lên thư mục có sẵn file làm file "biến mất" mà vẫn chiếm đĩa; bind mount thư mục vs MỘT file: sed -i (strace: file tạm + renameat) đổi inode nên bind mount một file đứng yên ở inode cũ (//deleted) — tái hiện sự cố nginx.conf 25/08/2026; ghi tại chỗ thì thấy; bind mount chỉ đọc; noexec/nosuid/nodev cho thư mục upload và giới hạn của chúng.',
      content: `${G95}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Mount points and bind mounts: one tree, many file systems, and a file that would not update</h2>
<p class="lead">On 25/08/2026 this project's deploy script updated <code>nginx/nginx.conf</code> on the VPS, ran <code>nginx -t</code> (OK) and <code>nginx -s reload</code> (OK) — and nothing changed, two deploys in a row: HTTP/2 stayed off and every cache header stayed <code>no-store</code>. The config file was bind-mounted into the nginx container as a single file, and the script replaced it with <code>mv</code>. This lesson rebuilds that incident in a lab container and explains it with what you learned in 9.1 and 9.3. On the way: what a mount point is, how files hide under one, and what <code>noexec</code> really protects.</p>

<h3>One tree, many file systems</h3>
<p>Linux has one directory tree. A <strong>mount</strong> attaches a file system's root at some directory of that tree (the <strong>mount point</strong>); from then on, path lookup crosses into the other file system there. Lesson 9.1 showed overlay, proc, tmpfs and ext4 side by side. Look closer at three files every container has:</p>
${run('c95-mount', 'findmnt -lo TARGET,SOURCE,FSTYPE')}
${run('c95-mount', "grep ' /etc/hosts '")}
<p><code>/etc/hostname</code>, <code>/etc/hosts</code> and <code>/etc/resolv.conf</code> are not part of the image. Docker generated them in its own directory on the VM's disk (<code>/dev/vda1</code>) and <strong>bind-mounted each single file</strong> over the image's version. <code>/proc/self/mountinfo</code> is the full truth for each mount: mount ID 406, parent 363, device 254:1, then the <em>root</em> — which file inside the source file system is mounted (<code>/docker/containers/&lt;id&gt;/hosts</code>) — the mount point <code>/etc/hosts</code>, options, file system type and source.</p>

<h3>A mount hides what was underneath</h3>
${run('c95-mount', 'mkdir -p /srv/uploads', 3)}
<p>A user uploaded <code>avatar-17.txt</code> while the data disk was not mounted (say the container started before the volume, or the mount failed at boot), so it went to the root file system. After the mount, <code>/srv/uploads</code> shows the data disk and the file is gone from view — but not from the root disk. A <strong>bind mount</strong> of <code>/</code> elsewhere (a bind mount attaches an existing directory at a second place, without what is mounted on top of it) shows it is still there, using space that <code>du /srv/uploads</code> will never count. This is one more way for <code>df</code> and <code>du</code> to disagree, after the deleted-but-open file of Chapter 2.</p>
${lab('sysmon', 'diskfull', 'en', 'df says the disk is full, du cannot find the bytes. Here the culprit is a deleted file still held open; files hidden under a mount point give the same df/du gap.')}

<h3>Bind mount a directory, or a single file</h3>
<p>Now the incident. A "host" directory holds <code>nginx.conf</code>; we bind-mount it into a "container" path two ways, as Docker Compose does with <code>./nginx:/etc/nginx/conf.d</code> and <code>./nginx/nginx.conf:/etc/nginx/nginx.conf</code>:</p>
${run('c95-mount', 'mkdir -p /host/nginx', 6)}
<p>All three paths reach inode 396552. Writing the file <em>in place</em> (open with O_TRUNC, write) changes that inode, so both views see <code>worker_connections 1024</code> immediately.</p>

<h3>sed -i replaces the inode — and the single-file mount stays behind</h3>
${run('c95-mount', 'strace -f -e trace=openat,rename', 3)}
<p><code>sed -i</code> never edits in place: it writes a new temporary file <code>sedEwm4hl</code> in the same directory and <code>renameat</code>s it over <code>nginx.conf</code> — the safe-write pattern of lesson 9.3. The name <code>/host/nginx/nginx.conf</code> now points to a <strong>new inode, 396554</strong>. The directory mount looks names up each time, so it sees the new inode and <code>4096</code>. The <strong>single-file mount</strong> was attached to inode 396552 when it was created, and it stays there: it still shows <code>1024</code>.</p>
${run('c95-mount', "grep '/ctr/etc/nginx.conf'")}
<p>The kernel says it plainly: the mount's root is <code>/host/nginx/nginx.conf//deleted</code> — the inode it holds no longer has a name. Inside a container, nginx reads the deleted file, <code>nginx -t</code> validates the deleted file, <code>reload</code> reloads the deleted file. Every check is green and nothing changes.</p>
${run('c95-mount', "echo 'worker_connections 8192;'", 2)}
<p>Once the mount points to an orphaned inode, even a correct in-place write to the host path does not help: it writes the <em>new</em> inode. Only re-creating the mount (for Docker: recreate the container, <code>docker compose up -d --force-recreate nginx</code>) re-resolves the name. And editors differ:</p>
${run('c95-mount', 'vi -es')}
<p>This <code>vim.tiny</code> rewrote the file in place (inode unchanged), so the mount saw <code>2048</code>. Full vim may instead write a new file and rename it, depending on its <code>backupcopy</code> option. <code>sed -i</code> replaced the inode (measured above), and so does any <code>mv</code> onto the file — it is a rename; <code>rsync</code> without <code>--inplace</code>, <code>git checkout</code> and Ansible's <code>copy</code> module are documented to write a new file and rename it too (not measured here). Do not guess: compare <code>stat -c %i</code> before and after.</p>

<h3>What this project changed</h3>
<p>The fix recorded in the project's CLAUDE.md after 25/08/2026: write the bind-mounted file <strong>in place</strong> (<code>cat new &gt; nginx.conf</code>, never <code>mv</code>, <code>rsync</code>, <code>sed -i</code> or an editor that renames), and <strong>verify from inside the container</strong> — compare <code>sha256sum</code> of the host file with <code>docker exec … sha256sum /etc/nginx/nginx.conf</code>, and restore the old file and stop if they differ. The general lesson: <em>"written" is not "seen by the container"</em>. Two alternatives avoid the trap altogether: bind-mount the <strong>directory</strong> (then name lookups always find the newest file — but a half-written file can be seen, so write temp + rename inside it), or bake the config into the image.</p>
${run('c95-mount', 'mount --bind -o ro')}
<p>A bind mount can also be read-only (<code>-v ./nginx:/etc/nginx/conf.d:ro</code> in Docker): the container cannot change the host's config even as root. Use it for every config you mount.</p>

<h3>Mount options as a safety net: noexec, nosuid, nodev</h3>
${run('c95-mount', 'mkdir -p /srv/public-uploads', 5)}
<p>A directory where users upload files should never run them. Mounting it with <code>noexec</code> makes the kernel refuse <code>execve()</code> of any file there, even with the x bit set: <code>Permission denied</code>. <code>nosuid</code> ignores setuid/setgid bits (lesson 9.6), <code>nodev</code> ignores device files. But look at the next line: <code>sh shell.sh</code> ran the "attacker code" anyway, because the program executed was <code>/bin/sh</code>, which merely <em>reads</em> the file. The same holds for <code>node evil.js</code> or <code>python3 evil.py</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>noexec is a seatbelt, not a sandbox.</strong> It stops one path (exec of the uploaded file) and does nothing against an interpreter reading it, a path-traversal bug writing outside the upload folder, or your app <code>require()</code>-ing a file by user-controlled name. Combine it with: storing uploads outside the web root and outside the code tree, generated file names, a content-type allow-list, serving uploads through nginx as static files only, and an app user that cannot write its own code (lesson 9.7).</p>
</div>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you join the deploy rotation. The runbook says "edit <code>/home/deployer/repo/nginx/nginx.conf</code>, then reload nginx". You want to prove to the team which edit methods work with the single-file bind mount in <code>docker-compose.yml</code> and which do not.</p>
<ol>
<li>In a <code>--privileged</code> lab container, create <code>/host/nginx/nginx.conf</code> and bind-mount it alone onto <code>/ctr/etc/nginx.conf</code>.</li>
<li>Change it with: <code>echo &gt;</code>, <code>sed -i</code>, <code>cp new nginx.conf</code>, <code>mv new nginx.conf</code>, <code>vi</code>. After each, record <code>stat -c %i</code> of both paths and <code>cat</code> the mounted one; re-create the mount after each break.</li>
<li>Write the deploy step that updates the file safely and verifies it the way the project does (hash from inside).</li>
</ol>
<p><strong>Done when:</strong> you have a five-row table "method → inode changed? → mount sees the change?" and the <code>//deleted</code> line from mountinfo for at least one method.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['mount / mount point', 'Attaching a file system at a directory of the single tree; lookups cross into it there.'],
  ['bind mount', 'Making an existing directory or file visible at a second path; a file bind mount pins the inode it found.'],
  ['/proc/self/mountinfo', 'One line per mount: IDs, device, root inside the source, mount point, options, type, source.'],
  ['//deleted', 'Shown in mountinfo when the inode a mount holds no longer has a name.'],
  ['read-only bind mount', 'A bind mount with ro: writes fail with "Read-only file system", even for root.'],
  ['noexec / nosuid / nodev', 'Mount options: refuse exec of files here / ignore setuid-setgid / ignore device files.'],
  ['shadowed files', 'Files in a directory before something was mounted on it: invisible but still using space.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>One tree, many file systems; Docker itself bind-mounts /etc/hosts, /etc/hostname and /etc/resolv.conf as single files.</li>
<li>Mounting over a non-empty directory hides its files; they still use space on the lower disk.</li>
<li>A single-file bind mount holds one inode; sed -i, mv and rsync install a new inode, so the container keeps the old one (//deleted).</li>
<li>Update such files in place and verify from inside the container — or mount the directory, read-only.</li>
<li>noexec/nosuid/nodev help on upload folders, but an interpreter can still read and run the file.</li>
</ul>
${L('https://man7.org/linux/man-pages/man8/mount.8.html', '📄', 'man 8 mount', 'Bind mounts, read-only binds and the noexec, nosuid, nodev options.', 'Open')}
${L('https://docs.docker.com/engine/storage/bind-mounts/', '🐳', 'Docker docs — Bind mounts', 'How -v / --mount bind a host file or directory into a container, including read-only.', 'Open')}
${L(OS('os-12-1-namespaces'), '📦', 'Chapter 12 — Namespaces', 'Mount namespaces: why each container has its own mount table.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Điểm gắn và bind mount: một cây, nhiều hệ thống file, và một file không chịu cập nhật</h2>
<p class="lead">Ngày 25/08/2026, script deploy của dự án này cập nhật <code>nginx/nginx.conf</code> trên VPS, chạy <code>nginx -t</code> (OK) và <code>nginx -s reload</code> (OK) — và không có gì thay đổi, hai lần deploy liền: HTTP/2 vẫn tắt và mọi header cache vẫn là <code>no-store</code>. File cấu hình được bind-mount vào container nginx dưới dạng một file đơn, và script thay nó bằng <code>mv</code>. Bài này dựng lại sự cố đó trong container lab và giải thích nó bằng những gì bạn đã học ở 9.1 và 9.3. Dọc đường: điểm gắn là gì, file trốn dưới nó ra sao, và <code>noexec</code> thật ra bảo vệ được gì.</p>

<h3>Một cây, nhiều hệ thống file</h3>
<p>Linux chỉ có một cây thư mục. <strong>Mount (gắn)</strong> là gắn gốc của một hệ thống file vào một thư mục nào đó của cây (<strong>điểm gắn</strong>); từ đó, việc tra đường dẫn đi sang hệ thống file kia tại chỗ đó. Bài 9.1 đã cho thấy overlay, proc, tmpfs và ext4 nằm cạnh nhau. Nhìn kỹ hơn ba file mà container nào cũng có:</p>
${run('c95-mount', 'findmnt -lo TARGET,SOURCE,FSTYPE')}
${run('c95-mount', "grep ' /etc/hosts '")}
<p><code>/etc/hostname</code>, <code>/etc/hosts</code> và <code>/etc/resolv.conf</code> không thuộc ảnh. Docker sinh chúng trong thư mục riêng của nó trên đĩa của VM (<code>/dev/vda1</code>) rồi <strong>bind-mount từng file đơn</strong> đè lên bản của ảnh. <code>/proc/self/mountinfo</code> là sự thật đầy đủ về mỗi mount: ID 406, cha 363, thiết bị 254:1, rồi tới <em>root</em> — file nào bên trong hệ thống file nguồn được gắn (<code>/docker/containers/&lt;id&gt;/hosts</code>) — điểm gắn <code>/etc/hosts</code>, tuỳ chọn, loại hệ thống file và nguồn.</p>

<h3>Mount che mất thứ nằm bên dưới</h3>
${run('c95-mount', 'mkdir -p /srv/uploads', 3)}
<p>Một người dùng tải lên <code>avatar-17.txt</code> lúc đĩa dữ liệu chưa được gắn (giả sử container khởi động trước volume, hoặc mount hỏng lúc boot), nên nó rơi vào hệ thống file gốc. Sau khi gắn, <code>/srv/uploads</code> hiện đĩa dữ liệu và file biến mất khỏi tầm nhìn — nhưng không biến khỏi đĩa gốc. Một <strong>bind mount</strong> của <code>/</code> sang chỗ khác (bind mount gắn một thư mục có sẵn vào chỗ thứ hai, không kèm những thứ đang gắn chồng lên nó) cho thấy file vẫn nằm đó, chiếm chỗ mà <code>du /srv/uploads</code> sẽ không bao giờ đếm. Đây là thêm một cách để <code>df</code> và <code>du</code> nói khác nhau, sau file đã xoá còn mở ở Chương 2.</p>
${lab('sysmon', 'diskfull', 'vi', 'df bảo đĩa đầy, du không tìm ra byte nào. Ở đây thủ phạm là file đã xoá còn mở; file bị che dưới điểm gắn cũng gây đúng khoảng lệch df/du như vậy.')}

<h3>Bind mount một thư mục, hay một file đơn</h3>
<p>Giờ tới sự cố. Một thư mục "máy chủ" chứa <code>nginx.conf</code>; ta bind-mount nó vào đường dẫn "container" theo hai cách, đúng như Docker Compose làm với <code>./nginx:/etc/nginx/conf.d</code> và <code>./nginx/nginx.conf:/etc/nginx/nginx.conf</code>:</p>
${run('c95-mount', 'mkdir -p /host/nginx', 6)}
<p>Cả ba đường dẫn đều tới inode 396552. Ghi file <em>tại chỗ</em> (mở với O_TRUNC, ghi) là thay đổi chính inode đó, nên cả hai góc nhìn đều thấy <code>worker_connections 1024</code> ngay lập tức.</p>

<h3>sed -i thay inode — và mount một file bị bỏ lại phía sau</h3>
${run('c95-mount', 'strace -f -e trace=openat,rename', 3)}
<p><code>sed -i</code> không bao giờ sửa tại chỗ: nó ghi một file tạm mới <code>sedEwm4hl</code> trong cùng thư mục rồi <code>renameat</code> đè lên <code>nginx.conf</code> — đúng mẫu ghi an toàn của bài 9.3. Cái tên <code>/host/nginx/nginx.conf</code> giờ trỏ tới một <strong>inode mới, 396554</strong>. Mount thư mục tra tên mỗi lần, nên nó thấy inode mới và <code>4096</code>. Còn <strong>mount một file</strong> đã được gắn vào inode 396552 lúc tạo, và nó ở yên đó: vẫn hiện <code>1024</code>.</p>
${run('c95-mount', "grep '/ctr/etc/nginx.conf'")}
<p>Nhân nói thẳng: root của mount là <code>/host/nginx/nginx.conf//deleted</code> — inode nó giữ không còn tên nào. Trong container, nginx đọc file đã xoá, <code>nginx -t</code> kiểm file đã xoá, <code>reload</code> nạp lại file đã xoá. Mọi phép kiểm đều xanh mà chẳng có gì thay đổi.</p>
${run('c95-mount', "echo 'worker_connections 8192;'", 2)}
<p>Một khi mount đã trỏ vào inode mồ côi, đến cả một lần ghi tại chỗ đúng cách vào đường dẫn máy chủ cũng vô ích: nó ghi vào inode <em>mới</em>. Chỉ có tạo lại mount (với Docker: tạo lại container, <code>docker compose up -d --force-recreate nginx</code>) mới tra lại cái tên. Và mỗi trình soạn thảo một kiểu:</p>
${run('c95-mount', 'vi -es')}
<p><code>vim.tiny</code> này ghi lại file tại chỗ (inode không đổi), nên mount thấy <code>2048</code>. vim đầy đủ có thể ghi file mới rồi đổi tên, tuỳ tuỳ chọn <code>backupcopy</code>. <code>sed -i</code> đã thay inode (đo ở trên), và mọi lệnh <code>mv</code> đè lên file cũng vậy — nó là một lần đổi tên; <code>rsync</code> không có <code>--inplace</code>, <code>git checkout</code> và module <code>copy</code> của Ansible theo tài liệu cũng ghi file mới rồi đổi tên (chưa đo ở đây). Đừng đoán: so <code>stat -c %i</code> trước và sau.</p>

<h3>Dự án này đã đổi gì</h3>
<p>Cách sửa ghi trong CLAUDE.md của dự án sau ngày 25/08/2026: ghi file được bind-mount <strong>tại chỗ</strong> (<code>cat new &gt; nginx.conf</code>, không bao giờ <code>mv</code>, <code>rsync</code>, <code>sed -i</code> hay trình soạn thảo đổi tên), và <strong>kiểm từ bên trong container</strong> — so <code>sha256sum</code> của file trên máy chủ với <code>docker exec … sha256sum /etc/nginx/nginx.conf</code>, lệch thì trả bản cũ về và dừng. Bài học chung: <em>"đã ghi" không phải là "container đã thấy"</em>. Hai cách khác tránh hẳn cái bẫy: bind-mount <strong>thư mục</strong> (khi đó tra tên luôn ra file mới nhất — nhưng có thể thấy file ghi dở, nên bên trong vẫn ghi tạm + rename), hoặc đóng gói cấu hình vào ảnh.</p>
${run('c95-mount', 'mount --bind -o ro')}
<p>Bind mount còn có thể chỉ đọc (<code>-v ./nginx:/etc/nginx/conf.d:ro</code> trong Docker): container không đổi được cấu hình của máy chủ, kể cả khi là root. Hãy dùng nó cho mọi cấu hình bạn gắn vào.</p>

<h3>Tuỳ chọn mount làm lưới an toàn: noexec, nosuid, nodev</h3>
${run('c95-mount', 'mkdir -p /srv/public-uploads', 5)}
<p>Thư mục người dùng tải file lên không bao giờ nên chạy chúng. Gắn nó với <code>noexec</code> khiến nhân từ chối <code>execve()</code> mọi file trong đó, kể cả khi có bit x: <code>Permission denied</code>. <code>nosuid</code> bỏ qua bit setuid/setgid (bài 9.6), <code>nodev</code> bỏ qua file thiết bị. Nhưng nhìn dòng kế: <code>sh shell.sh</code> vẫn chạy "mã của kẻ tấn công", vì chương trình được exec là <code>/bin/sh</code>, nó chỉ <em>đọc</em> file. <code>node evil.js</code> hay <code>python3 evil.py</code> cũng y vậy.</p>

<div class="pitfall co-tieu-de">
<p><strong>noexec là dây an toàn, không phải hộp cát.</strong> Nó chặn đúng một đường (exec file được tải lên) và chẳng làm gì với một trình thông dịch đọc file đó, một lỗi path traversal ghi ra ngoài thư mục upload, hay app của bạn <code>require()</code> một file theo tên do người dùng điều khiển. Hãy kết hợp: cất upload ngoài thư mục web và ngoài cây mã nguồn, tên file do server sinh, danh sách loại nội dung được phép, phục vụ upload qua nginx chỉ như file tĩnh, và một user chạy app không ghi được vào mã của chính nó (bài 9.7).</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn vào ca trực deploy. Sổ tay vận hành ghi "sửa <code>/home/deployer/repo/nginx/nginx.conf</code>, rồi reload nginx". Bạn muốn chứng minh cho nhóm cách sửa nào chạy được với bind mount một file trong <code>docker-compose.yml</code> và cách nào không.</p>
<ol>
<li>Trong container lab <code>--privileged</code>, tạo <code>/host/nginx/nginx.conf</code> và bind-mount riêng nó lên <code>/ctr/etc/nginx.conf</code>.</li>
<li>Sửa nó bằng: <code>echo &gt;</code>, <code>sed -i</code>, <code>cp new nginx.conf</code>, <code>mv new nginx.conf</code>, <code>vi</code>. Sau mỗi lần, ghi lại <code>stat -c %i</code> của cả hai đường dẫn và <code>cat</code> bản đã gắn; tạo lại mount sau mỗi lần hỏng.</li>
<li>Viết bước deploy cập nhật file an toàn và kiểm nó theo cách dự án làm (băm từ bên trong).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có bảng năm dòng "cách sửa → inode có đổi? → mount có thấy thay đổi?" và dòng <code>//deleted</code> trong mountinfo cho ít nhất một cách.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['mount / mount point (gắn / điểm gắn)', 'Gắn một hệ thống file vào một thư mục của cây duy nhất; tra đường dẫn đi sang nó tại đó.'],
  ['bind mount (gắn buộc)', 'Cho một thư mục hay file có sẵn hiện ra ở đường dẫn thứ hai; bind mount một file ghim chặt inode nó tìm thấy.'],
  ['/proc/self/mountinfo', 'Mỗi mount một dòng: ID, thiết bị, root bên trong nguồn, điểm gắn, tuỳ chọn, loại, nguồn.'],
  ['//deleted', 'Hiện trong mountinfo khi inode mà một mount giữ không còn tên nào.'],
  ['read-only bind mount (gắn buộc chỉ đọc)', 'Bind mount với ro: ghi sẽ lỗi "Read-only file system", kể cả với root.'],
  ['noexec / nosuid / nodev', 'Tuỳ chọn mount: từ chối exec file ở đây / bỏ qua setuid-setgid / bỏ qua file thiết bị.'],
  ['shadowed files (file bị che)', 'File có trong thư mục trước khi thứ gì đó được gắn lên: vô hình nhưng vẫn chiếm chỗ.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một cây, nhiều hệ thống file; chính Docker bind-mount /etc/hosts, /etc/hostname và /etc/resolv.conf dưới dạng file đơn.</li>
<li>Gắn đè lên một thư mục có sẵn file sẽ che các file đó; chúng vẫn chiếm chỗ trên đĩa bên dưới.</li>
<li>Bind mount một file giữ một inode; sed -i, mv và rsync gắn inode mới vào tên, nên container giữ inode cũ (//deleted).</li>
<li>Cập nhật các file đó tại chỗ và kiểm từ bên trong container — hoặc gắn cả thư mục, chỉ đọc.</li>
<li>noexec/nosuid/nodev giúp ích cho thư mục upload, nhưng trình thông dịch vẫn đọc và chạy được file.</li>
</ul>
${L('https://man7.org/linux/man-pages/man8/mount.8.html', '📄', 'man 8 mount', 'Bind mount, bind chỉ đọc và các tuỳ chọn noexec, nosuid, nodev.', 'Mở')}
${L('https://docs.docker.com/engine/storage/bind-mounts/', '🐳', 'Docker docs — Bind mounts', 'Cách -v / --mount gắn file hay thư mục của máy chủ vào container, kể cả chỉ đọc.', 'Mở')}
${L(OS('os-12-1-namespaces'), '📦', 'Chương 12 — Namespace', 'Mount namespace: vì sao mỗi container có bảng mount riêng.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 9.6 — quyền rwx, umask, setuid ───────────────────────── */
    {
      title: '9.6 — How the kernel says no: rwx, umask, owners, who may delete, setuid, setgid and sticky|||9.6 — Nhân nói "không" thế nào: rwx, umask, chủ sở hữu, ai được xoá, setuid, setgid và sticky',
      slug: 'os-9-4-quyen',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Thuật toán kiểm quyền của nhân: chủ khớp thì CHỈ dùng bit chủ (file 077 của dev: dev bị từ chối, bob đọc được), rồi nhóm, rồi other, rồi capability của root; rwx trên thư mục (r liệt kê tên, x đi qua, w tạo/xoá); umask (Node mode 0o666 vẫn ra 644); xoá file do quyền THƯ MỤC quyết định, sticky /tmp trả EPERM; setgid thư mục cho nhóm làm chung; setuid đổi uid hiệu lực (ids.c: euid 0 đọc được .env 600), find -perm -4000; root đọc được file 000 nhưng không exec được file thiếu bit x.',
      content: `${G96}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.6</span>
<h2>How the kernel decides "Permission denied"</h2>
<p class="lead">"Permission denied" is the most common error a backend developer meets on a server, and the most common reaction is <code>sudo</code> or <code>chmod 777</code>. Both work and both are wrong. This lesson is not the command tour (that is Linux &amp; Bash Chapter 4); it is the <strong>algorithm</strong> the kernel runs every time a process touches a file, with experiments where the answer surprises people: an owner who cannot read his own file, a user who can delete a file she cannot read, and a program that reads a root-only secret for a normal user.</p>

<h3>Every process carries an identity</h3>
${run('c96-quyen', 'id dev; id bob')}
<p>A user is just a number (uid) plus a primary group (gid) and a list of supplementary groups. Every process carries the uid/gids of whoever started it, inherited across <code>fork()</code> and kept across <code>exec()</code> (lesson 9.2) — with one exception you will meet below. Each inode stores an owner uid, a group gid and 12 mode bits.</p>
${run('c96-quyen', 'ls -l /srv/app/.env')}
<p><code>rw-r--r--</code> = 644 in octal: owner read+write (4+2), group read (4), others read (4). Three more bits in front — setuid (4000), setgid (2000), sticky (1000) — come later in this lesson.</p>
${lab('sysmon', 'calm', 'en', 'A live process table: read the USER column — every process runs as some uid, and that uid (not the program) is what the kernel checks against rwx.')}

<h3>The check, in order — and the first match wins</h3>
<p>When a process opens a file, the kernel compares the process's (effective) uid and groups with the inode, in this order:</p>
<ol>
<li>If the process's uid <strong>is the owner</strong>, only the <em>owner</em> bits are used — the result is final.</li>
<li>Else, if one of the process's groups <strong>is the file's group</strong>, only the <em>group</em> bits are used.</li>
<li>Else the <em>other</em> bits are used.</li>
<li>If that said no, the kernel checks <strong>capabilities</strong>: root normally has <code>CAP_DAC_OVERRIDE</code> and passes (lesson 9.7).</li>
</ol>
<p>"Only" matters. Watch:</p>
${run('c96-quyen', 'ls -l /tmp/own.txt', 3)}
<p>Mode 077: nothing for the owner, everything for group and others. <code>dev</code> owns the file, so step 1 applies, the owner bits say <code>---</code>, and dev is refused. <code>bob</code> is not the owner and not in group <code>dev</code>, so he gets the "other" bits — and reads it. The kernel does not fall through to a more generous class. (Nobody sets 077 on purpose; but <code>chmod 604</code> on a file whose group should read it, or <code>chmod o+r</code> "because the group bits did not work", produce the same surprise.)</p>
${lab('perm', 'owner', 'en', 'Ask the kernel “may dev read /tmp/own.txt?” and watch the check run in order: dev is the owner, so only the owner bits (---) count and the answer is no — while bob falls through to “other” and reads it.', { tour: 'perm-check' })}

<h3>umask: the bits you never asked for</h3>
${run('c96-quyen', 'umask', 4)}
<p>Programs ask for a mode when they create something — usually 0666 for files, 0777 for directories — and the kernel removes the bits set in the process's <strong>umask</strong>. With the common 022, files become 644 and directories 755; with 077, 600 and 700. Even Node's explicit <code>{ mode: 0o666 }</code> came out 644, because umask applies to every <code>open()</code>/<code>mkdir()</code>. To get an exact mode, <code>chmod</code> after creating, or set the umask of the service (<code>UMask=0027</code> in a systemd unit, <code>umask 027</code> in the container's entrypoint).</p>

<h3>rwx on a directory means something else</h3>
<p>A directory is a file of name → inode records (lesson 9.1), so its bits control that list: <strong>r</strong> = read the names, <strong>x</strong> = use a name to reach the inode (traverse, "search"), <strong>w</strong> = add or remove names (needs x too).</p>
${run('c96-quyen', 'chmod 744 /srv/box')}
<p>With r but no x, dev can read the <em>names</em> (<code>q3.txt</code>) but not reach the inodes: <code>ls -l</code> prints question marks for everything it would need to <code>stat</code>, and <code>cat</code> is refused.</p>
${run('c96-quyen', 'chmod 711 /srv/box')}
<p>With x but no r, it is the opposite: dev cannot list the folder, but anyone who knows the exact name can open the file. That is how home directories are often set (711) so a web server can reach <code>~/public_html</code> without listing the home.</p>
${lab('perm', 'dirx', 'en', 'r and x on a directory, separately: with 744 dev reads the names but cannot reach the inodes (ls -l prints ????); with 711 he opens a file he can name but cannot list the folder.', { tour: 'perm-check' })}

<h3>Who may delete a file? The directory decides</h3>
${run('c96-quyen', 'ls -l /srv/devdir/owned-by-root')}
<p>A read-only file owned by <strong>root</strong>, inside a folder owned by dev: dev deleted it. Deleting removes a <em>name</em> from the directory, so the kernel checks write + search permission on the <strong>directory</strong>, not on the file.</p>
${run('c96-quyen', 'ls -ld /srv/app; ls -l')}
<p>And the reverse: dev owns <code>dev-notes.txt</code> but cannot delete it, because the directory <code>/srv/app</code> (755, root) does not let him change its list of names.</p>
${run('c96-quyen', 'ls -ld /tmp', 2)}
<p>So in a world-writable directory anyone could delete anyone's files — exactly what <code>/srv/drop</code> (777) allowed: dev deleted bob's session file. <code>/tmp</code> has the <strong>sticky bit</strong> (the <code>t</code> in <code>drwxrwxrwt</code>, mode 1777): there you may delete a name only if you own the file or the directory. Note the different error: <code>Operation not permitted</code> (EPERM, a rule) instead of <code>Permission denied</code> (EACCES, the rwx bits).</p>
${lab('perm', 'sticky', 'en', 'Deleting is a write to the directory: dev removes bob’s file in /srv/drop (777), gets EPERM in /tmp (sticky bit), and EACCES for his own file inside /srv/app (755, root). Watch which inode the check looks at.', { tour: 'perm-check' })}

<h3>setgid on a directory: a folder a team can share</h3>
${run('c96-quyen', 'mkdir /srv/team', 2)}
<p>Normally a new file gets the creator's primary group (dev's file would be group <code>dev</code>, bob's group <code>bob</code>) and teammates cannot edit each other's work. With the setgid bit on the directory (the <code>s</code> in <code>rwxrwsr-x</code>, mode 2775), new files inherit the <strong>directory's</strong> group: both files are group <code>team</code>. Add <code>umask 002</code> for the team's processes and the group can write them too.</p>
${lab('perm', 'setgid', 'en', 'A shared team folder: with mode 2775 new files inherit the directory’s group (team) instead of the creator’s; then compare umask 022 with 077 to see whether teammates can actually write them.', { tour: 'perm-acl' })}

<h3>setuid: running with the file owner's identity</h3>
${src('ch09/ids.c', 'c')}
${run('c96-quyen', 'ls -l /usr/bin/passwd /usr/bin/su')}
${run('c96-quyen', 'chmod 600 /srv/app/.env; runuser -u dev -- ids', 2)}
<p>A process has a <em>real</em> uid (who started it) and an <em>effective</em> uid (whose permissions it uses). Normally they are equal. When a process <code>exec</code>s a file with the <strong>setuid</strong> bit (the <code>s</code> in <code>rwsr-xr-x</code>), the kernel sets the effective uid to the <strong>file's owner</strong>: our <code>ids</code>, owned by root, ran for dev with effective uid 0 and opened the root-only <code>.env</code>. That is how <code>passwd</code> lets you change your own line in <code>/etc/shadow</code>. It is also why every setuid-root program is a privilege boundary: any bug in it is a bug running as root. Know which ones you have:</p>
${run('c96-quyen', 'find / -xdev -perm -4000')}
<p>A clean image has a handful (passwd, su, mount…). Our <code>/usr/local/bin/ids</code> stands out — exactly what an attacker's backdoor looks like. Chapter 13 shows how misplaced setuid bits are abused; the kernel already ignores setuid on scripts (<code>#!</code> files) and on file systems mounted <code>nosuid</code> (lesson 9.5).</p>
${lab('perm', 'setuid', 'en', 'The setuid helper ids: dev runs it, the kernel sets the effective uid to the file’s owner (0), and the check on .env (600) now passes. Watch the real and effective uid split.', { tour: 'perm-acl' })}

<h3>And root?</h3>
${run('c96-quyen', 'chmod 000 /srv/app/.env')}
${run('c96-quyen', "printf '#!/bin/sh")}
<p>Root read a mode-000 file: the rwx check failed and <code>CAP_DAC_OVERRIDE</code> overrode it. But root could not execute a script with no x bit at all — for execution, the override needs at least one x bit somewhere in the mode. Root is not "no rules"; it is a set of capabilities, which the next lesson takes apart.</p>

<div class="pitfall co-tieu-de">
<p><strong><code>chmod -R 777</code> "to fix Permission denied".</strong> It works instantly, so it survives in tutorials. What it really does on a web project: every user and every process on the machine — including a compromised dependency running as another user — can now <em>write</em> your code and config, and, without a sticky bit, delete anyone's files. Instead, find which path component refuses (<code>namei -l</code>, lesson 9.7), give the right group read/traverse (<code>chgrp</code> + <code>chmod g+rX</code>) or an ACL, and leave others at nothing.</p>
</div>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> three students share <code>/srv/team</code> on the group's VPS. Files one of them creates cannot be edited by the others, and last week someone deleted another member's report by accident.</p>
<ol>
<li>In the lab, create users <code>an</code>, <code>binh</code>, <code>chi</code> and a group <code>team</code>; reproduce the problem with a plain 777 folder.</li>
<li>Fix it: group <code>team</code>, mode <strong>3770</strong> (setgid + sticky + rwx for owner and group), and <code>umask 002</code> for the members.</li>
<li>Test with <code>runuser -u</code>: each creates a file, edits a teammate's file, and tries to delete a teammate's file.</li>
<li>Explain each result with the four-step check and the directory rules.</li>
</ol>
<p><strong>Done when:</strong> teammates can edit each other's files, cannot delete them (<code>Operation not permitted</code>), and an outsider cannot even list the folder.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['uid / gid / supplementary groups', 'The numeric identity a process carries and the kernel compares with each inode.'],
  ['permission check order', 'Owner bits if you own it, else group bits if in its group, else other bits; first match is final; then capabilities.'],
  ['umask', 'Bits removed from every new file/directory mode (022 → 644/755, 077 → 600/700).'],
  ['directory r / x / w', 'List names / traverse to the inodes / add and remove names (needs x).'],
  ['sticky bit (1000)', 'In a writable directory, only a file’s owner (or the directory’s owner) may delete or rename it.'],
  ['setgid on a directory (2000)', 'New files inherit the directory’s group; subdirectories inherit the bit.'],
  ['setuid (4000)', 'Exec of the file sets the effective uid to the file’s owner; real uid stays the caller.'],
  ['EACCES vs EPERM', '"Permission denied" from rwx bits vs "Operation not permitted" from a rule such as sticky or a missing capability.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>The kernel picks one class — owner, else group, else other — and uses only those bits; root then passes via capabilities.</li>
<li>umask strips bits from every create, even Node’s explicit mode 0o666 (→ 644).</li>
<li>On directories r lists, x traverses, w changes names; deleting needs w+x on the directory, not rights on the file.</li>
<li>Sticky protects files in shared writable folders (EPERM); setgid on a folder gives a team one group.</li>
<li>setuid runs a program with its owner’s uid (euid 0 read a 600 root file); audit with find -perm -4000.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/path_resolution.7.html', '📄', 'man 7 path_resolution', 'The exact permission-check algorithm, directory search permission and capabilities.', 'Open')}
${L('https://man7.org/linux/man-pages/man7/credentials.7.html', '📄', 'man 7 credentials', 'Real, effective, saved and filesystem user and group IDs.', 'Open')}
${L(LNX('lnx-4-5-chan-doan-permission-denied'), '🐧', 'Linux &amp; Bash · 4.5 — Diagnosing "Permission denied"', 'The command-level workflow: chmod, chown, groups, sudo.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.6</span>
<h2>Nhân quyết định "Permission denied" như thế nào</h2>
<p class="lead">"Permission denied" là lỗi lập trình viên backend gặp nhiều nhất trên máy chủ, và phản xạ phổ biến nhất là <code>sudo</code> hoặc <code>chmod 777</code>. Cả hai đều chạy và cả hai đều sai. Bài này không phải chuyến tham quan lệnh (đó là Chương 4 của Linux &amp; Bash); nó là <strong>thuật toán</strong> nhân chạy mỗi lần một tiến trình chạm vào file, kèm những thí nghiệm có đáp án làm người ta bất ngờ: chủ file không đọc được file của chính mình, một người xoá được file mà cô ấy không đọc được, và một chương trình đọc được bí mật chỉ-root cho một người dùng thường.</p>

<h3>Mỗi tiến trình mang theo một danh tính</h3>
${run('c96-quyen', 'id dev; id bob')}
<p>Người dùng chỉ là một con số (uid) cộng một nhóm chính (gid) và danh sách nhóm phụ. Mỗi tiến trình mang uid/gid của người đã khởi động nó, thừa hưởng qua <code>fork()</code> và giữ nguyên qua <code>exec()</code> (bài 9.2) — với một ngoại lệ bạn sẽ gặp bên dưới. Mỗi inode lưu một uid chủ, một gid nhóm và 12 bit mode.</p>
${run('c96-quyen', 'ls -l /srv/app/.env')}
<p><code>rw-r--r--</code> = 644 hệ bát phân: chủ đọc+ghi (4+2), nhóm đọc (4), người khác đọc (4). Ba bit nữa ở phía trước — setuid (4000), setgid (2000), sticky (1000) — sẽ tới ở phần sau bài.</p>
${lab('sysmon', 'calm', 'vi', 'Bảng tiến trình đang chạy: đọc cột USER — tiến trình nào cũng chạy dưới một uid nào đó, và uid đó (không phải chương trình) mới là thứ nhân đem so với rwx.')}

<h3>Phép kiểm, theo thứ tự — và khớp đầu tiên là thắng</h3>
<p>Khi một tiến trình mở file, nhân so uid và các nhóm (hiệu lực) của tiến trình với inode, theo thứ tự:</p>
<ol>
<li>Nếu uid của tiến trình <strong>là chủ</strong>, chỉ dùng bit của <em>chủ</em> — kết quả là cuối cùng.</li>
<li>Nếu không, và một trong các nhóm của tiến trình <strong>là nhóm của file</strong>, chỉ dùng bit của <em>nhóm</em>.</li>
<li>Nếu không, dùng bit của <em>người khác</em>.</li>
<li>Nếu bước đó nói không, nhân kiểm <strong>capability</strong>: root thường có <code>CAP_DAC_OVERRIDE</code> và được qua (bài 9.7).</li>
</ol>
<p>Chữ "chỉ" rất quan trọng. Xem này:</p>
${run('c96-quyen', 'ls -l /tmp/own.txt', 3)}
<p>Mode 077: chủ không có gì, nhóm và người khác có tất cả. <code>dev</code> là chủ file, nên áp bước 1, bit chủ là <code>---</code>, và dev bị từ chối. <code>bob</code> không phải chủ và không thuộc nhóm <code>dev</code>, nên nhận bit "người khác" — và đọc được. Nhân không trượt xuống một lớp hào phóng hơn. (Chẳng ai cố ý đặt 077; nhưng <code>chmod 604</code> cho một file mà nhóm lẽ ra được đọc, hay <code>chmod o+r</code> "vì bit nhóm không ăn", tạo ra đúng sự bất ngờ này.)</p>
${lab('perm', 'owner', 'vi', 'Hỏi nhân “dev có đọc được /tmp/own.txt không?” và nhìn phép kiểm chạy theo thứ tự: dev là chủ nên chỉ bit chủ (---) được tính và câu trả lời là không — còn bob rơi xuống “other” và đọc được.', { tour: 'perm-check' })}

<h3>umask: những bit bạn chưa từng xin</h3>
${run('c96-quyen', 'umask', 4)}
<p>Chương trình xin một mode khi tạo thứ gì đó — thường 0666 cho file, 0777 cho thư mục — và nhân gỡ đi các bit có trong <strong>umask</strong> của tiến trình. Với 022 phổ biến, file thành 644 và thư mục 755; với 077, thành 600 và 700. Đến cả <code>{ mode: 0o666 }</code> tường minh của Node cũng ra 644, vì umask áp cho mọi <code>open()</code>/<code>mkdir()</code>. Muốn đúng mode, hãy <code>chmod</code> sau khi tạo, hoặc đặt umask cho dịch vụ (<code>UMask=0027</code> trong unit systemd, <code>umask 027</code> trong entrypoint của container).</p>

<h3>rwx trên thư mục mang nghĩa khác</h3>
<p>Thư mục là một file chứa bản ghi tên → inode (bài 9.1), nên các bit của nó điều khiển danh sách đó: <strong>r</strong> = đọc các tên, <strong>x</strong> = dùng một tên để tới inode (đi qua, "search"), <strong>w</strong> = thêm hoặc bớt tên (cần cả x).</p>
${run('c96-quyen', 'chmod 744 /srv/box')}
<p>Có r mà không có x, dev đọc được <em>tên</em> (<code>q3.txt</code>) nhưng không tới được inode: <code>ls -l</code> in dấu hỏi cho mọi thứ nó cần <code>stat</code>, và <code>cat</code> bị từ chối.</p>
${run('c96-quyen', 'chmod 711 /srv/box')}
<p>Có x mà không có r thì ngược lại: dev không liệt kê được thư mục, nhưng ai biết chính xác tên thì mở được file. Thư mục home hay được đặt như vậy (711) để web server tới được <code>~/public_html</code> mà không liệt kê được home.</p>
${lab('perm', 'dirx', 'vi', 'r và x trên thư mục, tách riêng: với 744 dev đọc được tên nhưng không tới được inode (ls -l in ra ????); với 711 mở được file nếu biết tên nhưng không liệt kê được thư mục.', { tour: 'perm-check' })}

<h3>Ai được xoá một file? Thư mục quyết định</h3>
${run('c96-quyen', 'ls -l /srv/devdir/owned-by-root')}
<p>Một file chỉ đọc của <strong>root</strong>, nằm trong thư mục của dev: dev đã xoá được nó. Xoá là bỏ một <em>cái tên</em> khỏi thư mục, nên nhân kiểm quyền ghi + đi qua trên <strong>thư mục</strong>, không phải trên file.</p>
${run('c96-quyen', 'ls -ld /srv/app; ls -l')}
<p>Và chiều ngược lại: dev là chủ <code>dev-notes.txt</code> nhưng không xoá được, vì thư mục <code>/srv/app</code> (755, root) không cho anh ấy sửa danh sách tên của nó.</p>
${run('c96-quyen', 'ls -ld /tmp', 2)}
<p>Vậy trong một thư mục ai cũng ghi được, ai cũng xoá được file của bất kỳ ai — đúng thứ <code>/srv/drop</code> (777) cho phép: dev đã xoá file phiên của bob. <code>/tmp</code> có <strong>sticky bit</strong> (chữ <code>t</code> trong <code>drwxrwxrwt</code>, mode 1777): ở đó bạn chỉ được xoá một tên nếu bạn là chủ file hoặc chủ thư mục. Để ý lỗi khác đi: <code>Operation not permitted</code> (EPERM, một luật) thay vì <code>Permission denied</code> (EACCES, các bit rwx).</p>
${lab('perm', 'sticky', 'vi', 'Xoá là ghi vào thư mục: dev xoá được file của bob trong /srv/drop (777), bị EPERM ở /tmp (sticky bit), và EACCES với chính file của mình trong /srv/app (755, root). Nhìn xem phép kiểm soi vào inode nào.', { tour: 'perm-check' })}

<h3>setgid trên thư mục: một thư mục cả nhóm dùng chung</h3>
${run('c96-quyen', 'mkdir /srv/team', 2)}
<p>Bình thường file mới nhận nhóm chính của người tạo (file của dev sẽ thuộc nhóm <code>dev</code>, của bob thuộc <code>bob</code>) và đồng đội không sửa được bài của nhau. Với bit setgid trên thư mục (chữ <code>s</code> trong <code>rwxrwsr-x</code>, mode 2775), file mới thừa hưởng nhóm của <strong>thư mục</strong>: cả hai file đều thuộc nhóm <code>team</code>. Thêm <code>umask 002</code> cho các tiến trình của nhóm là cả nhóm ghi được.</p>
${lab('perm', 'setgid', 'vi', 'Thư mục chung của nhóm: với mode 2775 file mới thừa hưởng nhóm của thư mục (team) thay vì nhóm của người tạo; rồi so umask 022 với 077 để xem đồng đội có thật sự ghi được không.', { tour: 'perm-acl' })}

<h3>setuid: chạy với danh tính của chủ file</h3>
${src('ch09/ids.c', 'c')}
${run('c96-quyen', 'ls -l /usr/bin/passwd /usr/bin/su')}
${run('c96-quyen', 'chmod 600 /srv/app/.env; runuser -u dev -- ids', 2)}
<p>Một tiến trình có uid <em>thật</em> (ai khởi động nó) và uid <em>hiệu lực</em> (dùng quyền của ai). Bình thường hai số bằng nhau. Khi một tiến trình <code>exec</code> một file có bit <strong>setuid</strong> (chữ <code>s</code> trong <code>rwsr-xr-x</code>), nhân đặt uid hiệu lực thành <strong>chủ của file</strong>: <code>ids</code> của ta, chủ là root, chạy cho dev với uid hiệu lực 0 và mở được <code>.env</code> chỉ-root. Đó là cách <code>passwd</code> cho bạn sửa dòng của chính mình trong <code>/etc/shadow</code>. Cũng vì vậy mỗi chương trình setuid-root là một ranh giới đặc quyền: lỗi nào trong nó cũng là lỗi chạy dưới quyền root. Hãy biết máy mình có những cái nào:</p>
${run('c96-quyen', 'find / -xdev -perm -4000')}
<p>Một ảnh sạch có vài cái (passwd, su, mount…). <code>/usr/local/bin/ids</code> của ta nổi bật hẳn — đúng hình dạng một cửa hậu của kẻ tấn công. Chương 13 cho thấy bit setuid đặt sai chỗ bị lạm dụng ra sao; nhân vốn đã bỏ qua setuid trên script (file <code>#!</code>) và trên hệ thống file gắn <code>nosuid</code> (bài 9.5).</p>
${lab('perm', 'setuid', 'vi', 'Helper setuid ids: dev chạy nó, nhân đặt uid hiệu lực thành chủ của file (0), và phép kiểm trên .env (600) giờ lọt qua. Nhìn uid thật và uid hiệu lực tách ra.', { tour: 'perm-acl' })}

<h3>Còn root?</h3>
${run('c96-quyen', 'chmod 000 /srv/app/.env')}
${run('c96-quyen', "printf '#!/bin/sh")}
<p>Root đọc được file mode 000: phép kiểm rwx thất bại và <code>CAP_DAC_OVERRIDE</code> vượt qua nó. Nhưng root không chạy được một script không có bit x nào — với việc thực thi, quyền vượt cần ít nhất một bit x ở đâu đó trong mode. Root không phải là "không có luật"; nó là một bộ capability, thứ bài sau sẽ tháo ra từng mảnh.</p>

<div class="pitfall co-tieu-de">
<p><strong><code>chmod -R 777</code> "để sửa Permission denied".</strong> Nó chạy ngay tức thì, nên nó sống mãi trong các bài hướng dẫn. Điều nó thật sự làm với một dự án web: mọi người dùng và mọi tiến trình trên máy — kể cả một thư viện bị chiếm quyền đang chạy dưới user khác — giờ đều <em>ghi</em> được mã và cấu hình của bạn, và, không có sticky bit, xoá được file của bất kỳ ai. Thay vào đó, hãy tìm thành phần đường dẫn nào đang từ chối (<code>namei -l</code>, bài 9.7), cho đúng nhóm quyền đọc/đi qua (<code>chgrp</code> + <code>chmod g+rX</code>) hoặc một ACL, và để người khác ở mức không có gì.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> ba sinh viên dùng chung <code>/srv/team</code> trên VPS của nhóm. File một người tạo thì người khác không sửa được, và tuần trước có người lỡ tay xoá báo cáo của thành viên khác.</p>
<ol>
<li>Trong lab, tạo người dùng <code>an</code>, <code>binh</code>, <code>chi</code> và nhóm <code>team</code>; tái hiện vấn đề với một thư mục 777 trơn.</li>
<li>Sửa: nhóm <code>team</code>, mode <strong>3770</strong> (setgid + sticky + rwx cho chủ và nhóm), và <code>umask 002</code> cho các thành viên.</li>
<li>Thử bằng <code>runuser -u</code>: mỗi người tạo một file, sửa file của đồng đội, và thử xoá file của đồng đội.</li>
<li>Giải thích từng kết quả bằng phép kiểm bốn bước và các luật của thư mục.</li>
</ol>
<p><strong>Đạt khi:</strong> đồng đội sửa được file của nhau, không xoá được (<code>Operation not permitted</code>), và người ngoài đến liệt kê thư mục cũng không được.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['uid / gid / nhóm phụ', 'Danh tính dạng số mà tiến trình mang theo và nhân đem so với từng inode.'],
  ['thứ tự kiểm quyền', 'Bit chủ nếu bạn là chủ, nếu không thì bit nhóm nếu thuộc nhóm, nếu không thì bit người khác; khớp đầu là cuối; rồi tới capability.'],
  ['umask (mặt nạ quyền)', 'Các bit bị gỡ khỏi mode của mọi file/thư mục mới (022 → 644/755, 077 → 600/700).'],
  ['r / x / w của thư mục', 'Liệt kê tên / đi qua tới inode / thêm và bớt tên (cần x).'],
  ['sticky bit (1000)', 'Trong thư mục ghi được, chỉ chủ file (hoặc chủ thư mục) mới được xoá hay đổi tên nó.'],
  ['setgid trên thư mục (2000)', 'File mới thừa hưởng nhóm của thư mục; thư mục con thừa hưởng luôn bit này.'],
  ['setuid (4000)', 'Exec file sẽ đặt uid hiệu lực thành chủ file; uid thật vẫn là người gọi.'],
  ['EACCES vs EPERM', '"Permission denied" do bit rwx vs "Operation not permitted" do một luật như sticky hay thiếu capability.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Nhân chọn một lớp — chủ, nếu không thì nhóm, nếu không thì người khác — và chỉ dùng các bit đó; sau đó root qua bằng capability.</li>
<li>umask gỡ bit khỏi mọi lần tạo, kể cả mode 0o666 tường minh của Node (→ 644).</li>
<li>Trên thư mục r để liệt kê, x để đi qua, w để đổi tên; xoá cần w+x trên thư mục, không cần quyền trên file.</li>
<li>Sticky bảo vệ file trong thư mục dùng chung ghi được (EPERM); setgid trên thư mục cho cả nhóm một group.</li>
<li>setuid chạy chương trình với uid của chủ (euid 0 đọc được file 600 của root); kiểm bằng find -perm -4000.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/path_resolution.7.html', '📄', 'man 7 path_resolution', 'Thuật toán kiểm quyền chính xác, quyền đi qua thư mục và capability.', 'Mở')}
${L('https://man7.org/linux/man-pages/man7/credentials.7.html', '📄', 'man 7 credentials', 'uid/gid thật, hiệu lực, đã lưu và của hệ thống file.', 'Mở')}
${L(LNX('lnx-4-5-chan-doan-permission-denied'), '🐧', 'Linux &amp; Bash · 4.5 — Chẩn đoán "Permission denied"', 'Quy trình ở mức lệnh: chmod, chown, nhóm, sudo.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 9.7 — capabilities, ACL, container, 4 tình huống ───────────────────────── */
    {
      title: '9.7 — Beyond rwx: capabilities, ACLs, container users — and four permission incidents|||9.7 — Vượt khỏi rwx: capabilities, ACL, người dùng trong container — và bốn sự cố về quyền',
      slug: 'os-9-7-capabilities',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Root là một bộ capability: root trong container Docker chỉ có 14 cái, bỏ CAP_DAC_OVERRIDE là root hết đọc được file 600 của người khác; Node không phải root nghe cổng 80 nhờ setcap cap_net_bind_service; ping và ping_group_range; ACL (namei -l tìm chỗ chặn, setfacl, mask, ACL mặc định); root trong container là uid 0 thật, --user và volume, --cap-drop ALL, user namespace (0 trong, 1001 ngoài); bốn sự cố: nginx 403 thư mục upload, thư mục log của root, .env ai cũng đọc, khoá SSH 0644 bị từ chối.',
      content: `${G97}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.7</span>
<h2>Beyond rwx: what "root" really is, finer-grained permissions, and four incidents</h2>
<p class="lead">Lesson 9.6 ended with root reading a mode-000 file. Root is not magic: it is a uid that, by default, holds a set of <strong>capabilities</strong> — and you can take them away, or give one of them to a normal program. rwx also has a limit: one owner, one group, everyone else. <strong>ACLs</strong> go beyond it. Then containers: who is "root" inside one, and who owns the files it writes. The lesson ends with four permission incidents a backend developer will actually meet, each reproduced and fixed.</p>

<h3>Root is a set of capabilities</h3>
${run('c97-cap', "grep -E '^Cap(Eff|Bnd)'")}
${run('c97-cap', 'capsh --decode')}
${run('c97-cap', 'runuser -u dev -- grep CapEff')}
<p>Since Linux 2.2, the power of root is split into about 40 <strong>capabilities</strong>: <code>CAP_DAC_OVERRIDE</code> (ignore rwx), <code>CAP_CHOWN</code>, <code>CAP_NET_BIND_SERVICE</code> (ports below 1024), <code>CAP_NET_RAW</code> (raw sockets), <code>CAP_SYS_ADMIN</code> (mount and much more)… The kernel checks the specific capability, not "uid == 0". Root in a default Docker container holds only <strong>14</strong> (the mask <code>a80425fb</code> decoded above); <code>CAP_SYS_ADMIN</code>, <code>CAP_NET_ADMIN</code> and the rest are gone from the bounding set, so they can never be gained inside. A normal user holds none.</p>
${run('c97-cap', 'ls -l /srv/app/.env; cat')}
<p>The same root, the same file (600, owned by dev): with <code>CAP_DAC_OVERRIDE</code> it reads it, after <code>capsh --drop=cap_dac_override</code> it gets <code>Permission denied</code> like anybody else. "Root can read everything" is really "this capability can".</p>
${lab('perm', 'caps', 'en', 'Root as a set of capabilities: root reads a mode-000 .env because CAP_DAC_OVERRIDE overrides the rwx check, cannot execute a file with no x bit at all, and after --cap-drop dac_override is refused like anyone else.', { tour: 'perm-acl' })}

<h3>Giving one capability to one program: Node on port 80</h3>
${run('c97-cap', 'sysctl net.ipv4.ip_unprivileged_port_start', 4)}
<p>On a normal server ports below 1024 are privileged (we set the container's <code>ip_unprivileged_port_start</code> to 1024, like a VPS; Docker's default is 0). Node running as <code>dev</code> gets <code>EACCES</code> on port 80. Instead of running the whole app as root, give the binary exactly one capability with <code>setcap cap_net_bind_service=+ep</code> — stored in an extended attribute of the file — and dev can listen on 80 with nothing else. (In practice, let nginx or Docker's port mapping own port 80 and run Node on 3000; the point is the mechanism.)</p>
${run('c97-cap', 'getcap /usr/bin/ping', 4)}
<p><code>ping</code> is the classic example: it used to be setuid-root to open a raw ICMP socket; now it carries only <code>cap_net_raw</code>, visible as the <code>security.capability</code> extended attribute (the <code>+</code> that this uutils <code>ls</code> prints after the mode marks that attribute). Yet a <em>copy</em> without the capability works too: <code>net.ipv4.ping_group_range</code> = 0–2147483647 lets every group open unprivileged ICMP "datagram" sockets, so modern ping needs no privilege at all. Fewer privileged binaries, smaller attack surface.</p>

<h3>ACLs: more than one owner, one group, everyone else</h3>
<p>A web server (user <code>www-data</code>) must read uploads that the Node app (user <code>dev</code>) writes into a private folder. You do not want to make the files world-readable, and you cannot put both users as "the owner".</p>
${run('c97-cap', 'runuser -u www-data -- cat /srv/app/uploads/a.jpg')}
${run('c97-cap', 'namei -l')}
<p><code>namei -l</code> walks the path one component at a time and prints each one's mode and owner — the fastest way to find <em>which</em> directory refuses. Here: <code>uploads</code> is <code>drwx------ dev dev</code>, so www-data cannot even traverse it.</p>
${run('c97-cap', 'setfacl -m u:www-data:x')}
${run('c97-cap', 'getfacl -p /srv/app/uploads/a.jpg', 3)}
<p>An <strong>ACL</strong> adds entries for named users and groups: www-data gets traverse on the folder and read on the file. <code>ls</code> shows a <code>+</code>; <code>getfacl</code> lists the entries. Now www-data can read the file by name but still cannot list the folder — exactly the least privilege it needs. The <strong>mask</strong> line is the ceiling for all named entries and the group; it is what <code>ls</code> shows in the group position.</p>
${run('c97-cap', 'setfacl -d -m')}
<p>A <strong>default ACL</strong> on the folder is copied to every new file, so new uploads are readable by www-data without anyone remembering to run setfacl.</p>
${lab('perm', 'acl', 'en', 'The ACL entry user:www-data inside the check: the named-user entry grants read, the mask caps it. Then chmod 600 and watch the mask turn that entry into #effective:--- (the trap right below); a default ACL on the folder covers new uploads.', { tour: 'perm-acl' })}
${run('c97-cap', 'chmod 600 /srv/app/uploads/a.jpg')}
<div class="pitfall co-tieu-de">
<p><strong>chmod silently disables ACLs.</strong> On a file with an ACL, the group bits of <code>chmod</code> set the <em>mask</em>. A routine <code>chmod 600</code> (or an app that sets mode 0600 on upload) turned the mask into <code>---</code>: the entry still says <code>user:www-data:r--</code>, but <code>#effective:---</code>, and nginx gets 403 again. Read <code>getfacl</code>'s <em>effective</em> column, and prefer setting the mode through the default ACL or <code>chmod g+r</code> (which raises the mask) on ACL'd trees.</p>
</div>

<h3>Containers: who is root, and who owns the files</h3>
${run('c97-host', 'docker run --rm --label oslab=1 os-lab cat /proc/self/uid_map')}
<p>The <code>uid_map</code> "0 0 4294967295" means no translation: uid 0 inside this container <strong>is</strong> uid 0 for the kernel. It is fenced by namespaces, cgroups, the 14-capability bounding set and seccomp — but if it escapes (Chapter 13), it is root on the host. That is why images should run as a normal user.</p>
${run('c97-host', "docker run --rm --label oslab=1 -v os-c97-vol:/data os-lab bash -c 'id -un", 4)}
<p>Files a root container writes into a volume are owned by uid 0. Switch the same image to <code>--user 1001:1001</code> and it cannot write the volume at all — the most common "it worked as root" bug when hardening a Dockerfile with <code>USER node</code>. The fix is ownership, set once: <code>chown</code> the volume's directory (or create it in the Dockerfile with the right owner before <code>USER</code>). Then files carry 1001.</p>
${run('c97-host', 'docker run --rm --label oslab=1 --cap-drop ALL')}
<p><code>--cap-drop ALL</code>: still "root", but <code>chown</code> fails — no <code>CAP_CHOWN</code>. Drop everything, add back only what you need (<code>--cap-add NET_BIND_SERVICE</code>).</p>
${run('c97-host', 'docker run --rm --label oslab=1 --privileged')}
<p>A <strong>user namespace</strong> maps ids: here unprivileged dev created a namespace where it is uid 0 (<code>uid_map</code> "0 1001 1": inside 0 = outside 1001). Inside, the new file is owned by 0; seen from outside, by 1001 — "root" in there has no power over anything dev could not touch. This is the mechanism behind <strong>rootless</strong> Docker and Podman: the whole container engine runs as your user, and container root maps to an unprivileged range from <code>/etc/subuid</code>. (Docker Desktop is not rootless; Chapter 12 builds namespaces by hand.)</p>
${lab('process', 'sandbox', 'en', 'Build a process tree by hand: credentials (uid, groups, capabilities) are copied at fork and kept at exec — except when the exec’d file is setuid or carries file capabilities.')}

<h3>Incident 1: nginx answers 403 for uploaded files</h3>
${run('c97-host', "docker exec os-c97web sh -c 'mkdir", 5)}
<p>The app saved uploads in a folder with mode 700, owned by root. nginx returns <strong>403</strong>, and its error log gives the exact system call that failed: <code>open() "/srv/uploads/a.jpg" failed (13: Permission denied)</code> — 13 is EACCES. <code>ps</code> shows why: the master process is root, but the <strong>workers that serve requests run as <code>nginx</code></strong>, and they are "other" for that folder.</p>
${run('c97-host', "docker exec os-c97web sh -c 'chgrp", 2)}
<p>Fix by group, not by 777: group <code>nginx</code>, folder 750 (traverse), file 640 (read). The same image, now 200 OK. On a host where the app writes as a different user, use the ACL recipe above or a shared group with setgid on the folder (9.6).</p>

<h3>Incident 2: the app cannot write its log directory</h3>
${run('c97-cap', "runuser -u dev -- node -e \"require('fs')", 3)}
<p>First <code>ENOENT</code> (the directory does not exist), then, after someone created it as root, <code>EACCES</code> — the service runs as <code>dev</code> and <code>/var/log/app</code> is 755 root. <code>install -d -o dev -g dev -m 750</code> creates it with the right owner and mode in one step (systemd's <code>LogsDirectory=app</code> does the same automatically). Better still for containers: log to stdout (lesson 9.2) and own no log files at all.</p>

<h3>Incident 3: .env readable by everyone</h3>
${run('c97-cap', "find /srv -name '.env*'", 3)}
<p>With the default umask 022, a <code>.env</code> created by an editor, <code>git</code>, <code>scp</code> or <code>echo &gt;</code> is <strong>644</strong>: any user or compromised process on the box can read your database password — bob just did. <code>find -perm -o=r</code> lists every such file; the fix is the owner who runs the app plus mode 600, after which the count is 0 and bob is refused. Also check what else can read it: backups, a world-readable parent directory with a <code>.git</code> in it, and container images (<code>.env</code> belongs in <code>.dockerignore</code>).</p>

<h3>Incident 4: the deploy key is "too open"</h3>
${run('c97-ssh', 'ssh-keygen -q', 3)}
<p>Copying a key with the wrong tool (a Windows share, <code>git</code>, a zip) often leaves it 644. OpenSSH refuses to use a private key that others could read — <strong>"UNPROTECTED PRIVATE KEY FILE … This private key will be ignored"</strong> — and a CI job then fails with a confusing "Permission denied (publickey)". The rule is enforced by the client itself: private key 600 (or 400), and on the server <code>~/.ssh</code> 700 and <code>authorized_keys</code> not writable by group/others, or sshd ignores it (StrictModes — server side, not measured here; Linux &amp; Bash 9.3 covers it). This ran in the <code>node:22-bookworm</code> image (OpenSSH 9.2) because the lab image has no SSH client.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Just run the container as root" / <code>--privileged</code> to make a permission error go away.</strong> It hides the four incidents above instead of fixing them, and it turns any bug in your app into root on the container — with <code>--privileged</code>, all capabilities and all devices, which Chapter 13 shows is a short step to the host. Run as a named user, fix ownership at build time, drop capabilities, mount config read-only.</p>
</div>

<h3>🧪 Practice (35 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you are hardening the project's Docker setup: the API image must run as a non-root user, nginx must serve <code>/srv/uploads</code> written by the API, the API must write <code>/var/log/app</code>, and no <code>.env</code> may be readable by other users.</p>
<ol>
<li>In a lab container, create users <code>api</code> and <code>www-data</code> style roles; reproduce the nginx-403 and log-EACCES incidents with <code>runuser</code>.</li>
<li>Fix uploads with either a shared group + setgid folder or a default ACL; prove that a later <code>chmod 600</code> does or does not break your solution.</li>
<li>Make <code>node</code> listen on port 80 as <code>api</code> without root (setcap) — then write down why you would still use nginx in production.</li>
<li>Run the final <code>find / -xdev \\( -perm -4000 -o -name '.env*' -perm -o=r \\)</code> audit and get it to print nothing from your app.</li>
</ol>
<p><strong>Done when:</strong> nginx (as www-data) reads a new upload, the API writes its log as <code>api</code>, the audit prints nothing, and <code>grep CapEff /proc/PID/status</code> of the API shows only what you granted.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['capability', 'One slice of root’s power (CAP_DAC_OVERRIDE, CAP_CHOWN, CAP_NET_BIND_SERVICE…), checked individually by the kernel.'],
  ['bounding set', 'Capabilities a process (and its children) can ever have; Docker leaves 14 for container root.'],
  ['file capabilities (setcap/getcap)', 'Capabilities stored in a file’s security.capability attribute, granted when it is exec’d.'],
  ['ACL', 'Extra permission entries for named users/groups (setfacl, getfacl), shown as + after the mode.'],
  ['ACL mask', 'The ceiling for named entries and the group; chmod’s group bits set it.'],
  ['default ACL', 'An ACL on a directory that new files and subdirectories inherit.'],
  ['user namespace / uid_map', 'Maps uids inside to uids outside; root inside can be an ordinary user outside (rootless containers).'],
  ['namei -l', 'Prints mode and owner of every component of a path — finds which directory refuses.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Root is a set of capabilities; container root has 14, and dropping CAP_DAC_OVERRIDE makes root obey rwx.</li>
<li>setcap gives one program one power (Node on port 80 as a normal user); modern ping needs none.</li>
<li>ACLs add named users and groups; watch the mask (chmod 600 made the entry ineffective) and use default ACLs.</li>
<li>Container root is host uid 0 unless a user namespace maps it; --user needs volume ownership fixed; --cap-drop ALL then add back.</li>
<li>Four real fixes: group/ACL for nginx uploads, install -d for log dirs, 600 + owner for .env, 600 for SSH keys.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/capabilities.7.html', '📄', 'man 7 capabilities', 'Every capability, the bounding set, and file capabilities.', 'Open')}
${L('https://man7.org/linux/man-pages/man5/acl.5.html', '📄', 'man 5 acl', 'ACL entries, the mask, default ACLs and the access-check algorithm.', 'Open')}
${L(OS('os-13-3-leo-thang'), '🛡️', 'Chapter 13 — Privilege escalation via SUID and misconfig', 'Where the permissions of this chapter are attacked — and defended.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.7</span>
<h2>Vượt khỏi rwx: "root" thật ra là gì, quyền chi tiết hơn, và bốn sự cố</h2>
<p class="lead">Bài 9.6 kết thúc bằng cảnh root đọc một file mode 000. Root không có phép màu: nó là một uid mà theo mặc định giữ một bộ <strong>capability (năng lực)</strong> — và bạn có thể tước chúng đi, hay trao một cái cho một chương trình thường. rwx cũng có giới hạn: một chủ, một nhóm, mọi người còn lại. <strong>ACL</strong> vượt qua giới hạn đó. Rồi tới container: ai là "root" trong đó, và ai sở hữu file nó ghi ra. Bài kết thúc bằng bốn sự cố về quyền mà lập trình viên backend sẽ thật sự gặp, mỗi cái đều được tái hiện và sửa.</p>

<h3>Root là một bộ capability</h3>
${run('c97-cap', "grep -E '^Cap(Eff|Bnd)'")}
${run('c97-cap', 'capsh --decode')}
${run('c97-cap', 'runuser -u dev -- grep CapEff')}
<p>Từ Linux 2.2, quyền lực của root được chia thành khoảng 40 <strong>capability</strong>: <code>CAP_DAC_OVERRIDE</code> (bỏ qua rwx), <code>CAP_CHOWN</code>, <code>CAP_NET_BIND_SERVICE</code> (cổng dưới 1024), <code>CAP_NET_RAW</code> (socket thô), <code>CAP_SYS_ADMIN</code> (mount và rất nhiều thứ khác)… Nhân kiểm đúng capability cần thiết, không kiểm "uid == 0". Root trong một container Docker mặc định chỉ giữ <strong>14</strong> cái (mặt nạ <code>a80425fb</code> giải mã ở trên); <code>CAP_SYS_ADMIN</code>, <code>CAP_NET_ADMIN</code> và phần còn lại đã bị gỡ khỏi bounding set, nên ở bên trong không bao giờ lấy lại được. Người dùng thường không giữ cái nào.</p>
${run('c97-cap', 'ls -l /srv/app/.env; cat')}
<p>Cùng root, cùng file (600, chủ là dev): có <code>CAP_DAC_OVERRIDE</code> thì đọc được, sau <code>capsh --drop=cap_dac_override</code> thì nhận <code>Permission denied</code> như bất kỳ ai. "Root đọc được mọi thứ" thật ra là "capability này đọc được".</p>
${lab('perm', 'caps', 'vi', 'Root là một tập capability: root đọc được .env mode 000 vì CAP_DAC_OVERRIDE vượt qua phép kiểm rwx, không chạy được file không có bit x nào, và sau --cap-drop dac_override thì bị từ chối như mọi người.', { tour: 'perm-acl' })}

<h3>Trao một capability cho một chương trình: Node ở cổng 80</h3>
${run('c97-cap', 'sysctl net.ipv4.ip_unprivileged_port_start', 4)}
<p>Trên một máy chủ bình thường, cổng dưới 1024 là cổng đặc quyền (ta đặt <code>ip_unprivileged_port_start</code> của container là 1024, như một VPS; mặc định của Docker là 0). Node chạy dưới <code>dev</code> nhận <code>EACCES</code> ở cổng 80. Thay vì chạy cả app bằng root, hãy trao cho file thực thi đúng một capability bằng <code>setcap cap_net_bind_service=+ep</code> — lưu trong một thuộc tính mở rộng của file — và dev nghe được cổng 80 mà không có gì khác. (Thực tế, hãy để nginx hoặc ánh xạ cổng của Docker giữ cổng 80 và chạy Node ở 3000; điều cần thấy ở đây là cơ chế.)</p>
${run('c97-cap', 'getcap /usr/bin/ping', 4)}
<p><code>ping</code> là ví dụ kinh điển: nó từng là setuid-root để mở socket ICMP thô; giờ nó chỉ mang <code>cap_net_raw</code>, thấy được qua thuộc tính mở rộng <code>security.capability</code> (dấu <code>+</code> mà <code>ls</code> của uutils in sau mode chính là đánh dấu thuộc tính đó). Vậy mà một <em>bản chép</em> không có capability vẫn chạy: <code>net.ipv4.ping_group_range</code> = 0–2147483647 cho mọi nhóm mở socket ICMP "datagram" không đặc quyền, nên ping hiện đại chẳng cần đặc quyền nào. Càng ít chương trình đặc quyền, bề mặt tấn công càng nhỏ.</p>

<h3>ACL: nhiều hơn một chủ, một nhóm, mọi người còn lại</h3>
<p>Web server (user <code>www-data</code>) phải đọc các file upload mà app Node (user <code>dev</code>) ghi vào một thư mục riêng. Bạn không muốn cho cả thế giới đọc, và không thể để cả hai user cùng làm "chủ".</p>
${run('c97-cap', 'runuser -u www-data -- cat /srv/app/uploads/a.jpg')}
${run('c97-cap', 'namei -l')}
<p><code>namei -l</code> đi qua đường dẫn từng thành phần một và in mode, chủ của từng cái — cách nhanh nhất tìm ra <em>thư mục nào</em> đang từ chối. Ở đây: <code>uploads</code> là <code>drwx------ dev dev</code>, nên www-data đến đi qua cũng không được.</p>
${run('c97-cap', 'setfacl -m u:www-data:x')}
${run('c97-cap', 'getfacl -p /srv/app/uploads/a.jpg', 3)}
<p>Một <strong>ACL (danh sách kiểm soát truy cập)</strong> thêm các mục cho user và nhóm có tên: www-data được đi qua thư mục và đọc file. <code>ls</code> hiện dấu <code>+</code>; <code>getfacl</code> liệt kê các mục. Giờ www-data đọc được file theo tên nhưng vẫn không liệt kê được thư mục — đúng mức quyền tối thiểu nó cần. Dòng <strong>mask</strong> là trần cho mọi mục có tên và cho nhóm; nó là thứ <code>ls</code> hiện ở vị trí bit nhóm.</p>
${run('c97-cap', 'setfacl -d -m')}
<p>Một <strong>ACL mặc định</strong> trên thư mục được chép sang mọi file mới, nên file upload mới tự đọc được bởi www-data mà không cần ai nhớ chạy setfacl.</p>
${lab('perm', 'acl', 'vi', 'Mục ACL user:www-data trong phép kiểm: mục người dùng có tên cho quyền đọc, mask chặn trần. Rồi chmod 600 và nhìn mask biến mục đó thành #effective:--- (cái bẫy ngay dưới); ACL mặc định trên thư mục lo cho các upload mới.', { tour: 'perm-acl' })}
${run('c97-cap', 'chmod 600 /srv/app/uploads/a.jpg')}
<div class="pitfall co-tieu-de">
<p><strong>chmod âm thầm vô hiệu hoá ACL.</strong> Trên file có ACL, bit nhóm của <code>chmod</code> đặt <em>mask</em>. Một lệnh <code>chmod 600</code> thường ngày (hay app đặt mode 0600 cho file upload) biến mask thành <code>---</code>: mục vẫn ghi <code>user:www-data:r--</code>, nhưng <code>#effective:---</code>, và nginx lại trả 403. Hãy đọc cột <em>effective</em> của <code>getfacl</code>, và trên cây có ACL hãy ưu tiên đặt mode qua ACL mặc định hoặc <code>chmod g+r</code> (nâng mask lên).</p>
</div>

<h3>Container: ai là root, và ai sở hữu file</h3>
${run('c97-host', 'docker run --rm --label oslab=1 os-lab cat /proc/self/uid_map')}
<p><code>uid_map</code> "0 0 4294967295" nghĩa là không dịch gì cả: uid 0 trong container này <strong>chính là</strong> uid 0 đối với nhân. Nó bị rào bởi namespace, cgroup, bounding set 14 capability và seccomp — nhưng nếu thoát ra được (Chương 13), nó là root trên máy chủ. Vì vậy ảnh nên chạy bằng người dùng thường.</p>
${run('c97-host', "docker run --rm --label oslab=1 -v os-c97-vol:/data os-lab bash -c 'id -un", 4)}
<p>File một container root ghi vào volume thuộc uid 0. Chuyển cùng ảnh đó sang <code>--user 1001:1001</code> là nó không ghi được volume nữa — lỗi "chạy bằng root thì được" phổ biến nhất khi cứng hoá Dockerfile bằng <code>USER node</code>. Cách sửa là quyền sở hữu, đặt một lần: <code>chown</code> thư mục của volume (hoặc tạo nó trong Dockerfile với đúng chủ trước dòng <code>USER</code>). Khi đó file mang uid 1001.</p>
${run('c97-host', 'docker run --rm --label oslab=1 --cap-drop ALL')}
<p><code>--cap-drop ALL</code>: vẫn là "root", nhưng <code>chown</code> thất bại — không có <code>CAP_CHOWN</code>. Hãy bỏ hết, rồi chỉ thêm lại thứ cần (<code>--cap-add NET_BIND_SERVICE</code>).</p>
${run('c97-host', 'docker run --rm --label oslab=1 --privileged')}
<p>Một <strong>user namespace</strong> ánh xạ các id: ở đây dev không đặc quyền tạo một namespace mà trong đó nó là uid 0 (<code>uid_map</code> "0 1001 1": 0 bên trong = 1001 bên ngoài). Bên trong, file mới thuộc 0; nhìn từ ngoài, thuộc 1001 — "root" trong đó không có quyền gì với thứ dev không chạm được. Đó là cơ chế đằng sau Docker và Podman <strong>rootless</strong>: cả bộ máy container chạy dưới user của bạn, và root trong container ánh xạ tới một dải id không đặc quyền lấy từ <code>/etc/subuid</code>. (Docker Desktop không chạy rootless; Chương 12 dựng namespace bằng tay.)</p>
${lab('process', 'sandbox', 'vi', 'Tự dựng một cây tiến trình: danh tính (uid, nhóm, capability) được chép khi fork và giữ nguyên khi exec — trừ khi file được exec có setuid hoặc mang file capability.')}

<h3>Sự cố 1: nginx trả 403 cho file đã tải lên</h3>
${run('c97-host', "docker exec os-c97web sh -c 'mkdir", 5)}
<p>App lưu upload trong một thư mục mode 700, chủ là root. nginx trả <strong>403</strong>, và log lỗi của nó cho đúng lời gọi hệ thống bị từ chối: <code>open() "/srv/uploads/a.jpg" failed (13: Permission denied)</code> — 13 là EACCES. <code>ps</code> cho biết vì sao: tiến trình master là root, nhưng <strong>các worker phục vụ request chạy dưới <code>nginx</code></strong>, và với thư mục đó chúng là "người khác".</p>
${run('c97-host', "docker exec os-c97web sh -c 'chgrp", 2)}
<p>Sửa bằng nhóm, không bằng 777: nhóm <code>nginx</code>, thư mục 750 (đi qua), file 640 (đọc). Cùng ảnh đó, giờ 200 OK. Trên máy chủ mà app ghi dưới một user khác, dùng công thức ACL ở trên hoặc một nhóm chung kèm setgid trên thư mục (9.6).</p>

<h3>Sự cố 2: app không ghi được thư mục log</h3>
${run('c97-cap', "runuser -u dev -- node -e \"require('fs')", 3)}
<p>Đầu tiên <code>ENOENT</code> (thư mục chưa có), rồi, sau khi ai đó tạo nó bằng root, <code>EACCES</code> — dịch vụ chạy dưới <code>dev</code> còn <code>/var/log/app</code> là 755 của root. <code>install -d -o dev -g dev -m 750</code> tạo thư mục với đúng chủ và mode trong một bước (<code>LogsDirectory=app</code> của systemd tự làm y vậy). Tốt hơn nữa với container: ghi log ra stdout (bài 9.2) và chẳng sở hữu file log nào.</p>

<h3>Sự cố 3: .env ai cũng đọc được</h3>
${run('c97-cap', "find /srv -name '.env*'", 3)}
<p>Với umask mặc định 022, một <code>.env</code> do trình soạn thảo, <code>git</code>, <code>scp</code> hay <code>echo &gt;</code> tạo ra sẽ là <strong>644</strong>: mọi user hay tiến trình bị chiếm quyền trên máy đều đọc được mật khẩu CSDL của bạn — bob vừa làm thế. <code>find -perm -o=r</code> liệt kê mọi file như vậy; cách sửa là chủ chạy app cộng mode 600, sau đó số đếm về 0 và bob bị từ chối. Kiểm thêm những gì khác đọc được nó: bản sao lưu, thư mục cha ai cũng đọc được có <code>.git</code> bên trong, và ảnh container (<code>.env</code> phải nằm trong <code>.dockerignore</code>).</p>

<h3>Sự cố 4: khoá deploy "quá mở"</h3>
${run('c97-ssh', 'ssh-keygen -q', 3)}
<p>Chép khoá bằng sai công cụ (thư mục chia sẻ của Windows, <code>git</code>, một file zip) thường để lại mode 644. OpenSSH từ chối dùng khoá riêng mà người khác đọc được — <strong>"UNPROTECTED PRIVATE KEY FILE … This private key will be ignored"</strong> — và job CI sau đó thất bại với câu khó hiểu "Permission denied (publickey)". Luật này do chính client ép: khoá riêng 600 (hoặc 400), còn trên máy chủ thì <code>~/.ssh</code> 700 và <code>authorized_keys</code> không được để nhóm/người khác ghi, nếu không sshd bỏ qua nó (StrictModes — phía máy chủ, chưa đo ở đây; Linux &amp; Bash 9.3 có nói). Phần này chạy trong ảnh <code>node:22-bookworm</code> (OpenSSH 9.2) vì ảnh lab không có client SSH.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Cứ chạy container bằng root" / <code>--privileged</code> cho hết lỗi quyền.</strong> Nó che bốn sự cố ở trên thay vì sửa, và biến mọi lỗi trong app của bạn thành root trong container — với <code>--privileged</code> là mọi capability và mọi thiết bị, thứ mà Chương 13 cho thấy chỉ cách máy chủ một bước ngắn. Hãy chạy bằng user có tên, sửa quyền sở hữu lúc build, bỏ bớt capability, gắn cấu hình chỉ đọc.</p>
</div>

<h3>🧪 Thực hành (35 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn đang cứng hoá cấu hình Docker của dự án: ảnh API phải chạy bằng user không phải root, nginx phải phục vụ <code>/srv/uploads</code> do API ghi, API phải ghi được <code>/var/log/app</code>, và không <code>.env</code> nào được để user khác đọc.</p>
<ol>
<li>Trong container lab, tạo các vai kiểu user <code>api</code> và <code>www-data</code>; tái hiện sự cố nginx-403 và log-EACCES bằng <code>runuser</code>.</li>
<li>Sửa upload bằng nhóm chung + thư mục setgid hoặc bằng ACL mặc định; chứng minh một lần <code>chmod 600</code> về sau có làm hỏng cách của bạn không.</li>
<li>Cho <code>node</code> nghe cổng 80 dưới <code>api</code> mà không cần root (setcap) — rồi ghi ra vì sao trên production bạn vẫn dùng nginx.</li>
<li>Chạy lệnh kiểm cuối <code>find / -xdev \\( -perm -4000 -o -name '.env*' -perm -o=r \\)</code> và làm cho nó không in gì từ app của bạn.</li>
</ol>
<p><strong>Đạt khi:</strong> nginx (dưới www-data) đọc được file upload mới, API ghi log dưới <code>api</code>, lệnh kiểm không in gì, và <code>grep CapEff /proc/PID/status</code> của API chỉ hiện đúng thứ bạn đã trao.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['capability (năng lực)', 'Một lát cắt quyền lực của root (CAP_DAC_OVERRIDE, CAP_CHOWN, CAP_NET_BIND_SERVICE…), được nhân kiểm riêng từng cái.'],
  ['bounding set (tập giới hạn)', 'Các capability mà một tiến trình (và con của nó) có thể từng có; Docker để lại 14 cho root trong container.'],
  ['file capabilities (setcap/getcap)', 'Capability lưu trong thuộc tính security.capability của file, được trao khi file được exec.'],
  ['ACL (danh sách kiểm soát truy cập)', 'Các mục quyền thêm cho user/nhóm có tên (setfacl, getfacl), hiện bằng dấu + sau mode.'],
  ['ACL mask (mặt nạ ACL)', 'Trần cho các mục có tên và cho nhóm; bit nhóm của chmod đặt nó.'],
  ['default ACL (ACL mặc định)', 'ACL trên thư mục mà file và thư mục con mới thừa hưởng.'],
  ['user namespace / uid_map', 'Ánh xạ uid bên trong sang uid bên ngoài; root bên trong có thể là user thường bên ngoài (container rootless).'],
  ['namei -l', 'In mode và chủ của từng thành phần một đường dẫn — tìm ra thư mục nào đang từ chối.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Root là một bộ capability; root trong container có 14 cái, và bỏ CAP_DAC_OVERRIDE thì root phải tuân rwx.</li>
<li>setcap trao một quyền cho một chương trình (Node ở cổng 80 dưới user thường); ping hiện đại chẳng cần quyền nào.</li>
<li>ACL thêm user và nhóm có tên; coi chừng mask (chmod 600 làm mục mất hiệu lực) và dùng ACL mặc định.</li>
<li>Root trong container là uid 0 của máy chủ trừ khi user namespace ánh xạ nó; --user cần sửa quyền sở hữu volume; --cap-drop ALL rồi thêm lại.</li>
<li>Bốn cách sửa thật: nhóm/ACL cho upload của nginx, install -d cho thư mục log, 600 + chủ cho .env, 600 cho khoá SSH.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/capabilities.7.html', '📄', 'man 7 capabilities', 'Mọi capability, bounding set, và file capability.', 'Mở')}
${L('https://man7.org/linux/man-pages/man5/acl.5.html', '📄', 'man 5 acl', 'Các mục ACL, mask, ACL mặc định và thuật toán kiểm quyền truy cập.', 'Mở')}
${L(OS('os-13-3-leo-thang'), '🛡️', 'Chương 13 — Leo thang đặc quyền qua SUID và cấu hình sai', 'Nơi các quyền của chương này bị tấn công — và được phòng thủ.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 9.8 — Kiểm tra chương ───────────────────────── */
    {
      title: '9.8 — Chapter 9 check|||9.8 — Kiểm tra Chương 9',
      slug: 'os-9-8-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về hệ thống file và quyền: hard link và rm, hai worker ghi đè log, O_DIRECT không phải bền, file 0 byte sau sập, mẫu ghi an toàn, ext2 lộ dữ liệu cũ, sed -i với bind mount một file, ai được xoá file, mask ACL, và --user với volume.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Check</span>
<h2>Where is the data, who may touch it, and will it survive a crash?</h2>
<p class="lead">Ten scenario questions, each built on something measured in this chapter. Most show you an output and ask what it means, because file and permission bugs are rarely loud: a line silently overwritten, a config that never reloads, a file that is empty after a reboot.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain inode, directory entry, hard link and symlink, and read them with stat, ls -i and debugfs.</li>
<li>I can draw fd table → open file description → inode, and predict what dup, fork and O_APPEND share.</li>
<li>I can say when written data is really on disk, and write a file atomically and durably.</li>
<li>I can explain what a journal replays and why a single-file bind mount misses a sed -i.</li>
<li>I can run the kernel's permission check in my head, including directories, sticky, setuid, capabilities and ACL masks.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Dữ liệu nằm đâu, ai được chạm vào, và nó có sống qua một cú sập không?</h2>
<p class="lead">Mười câu tình huống, câu nào cũng dựng trên một thứ đã đo trong chương này. Phần lớn đưa cho bạn một output và hỏi nó nghĩa là gì, vì lỗi về file và quyền hiếm khi ồn ào: một dòng bị ghi đè âm thầm, một cấu hình không bao giờ được nạp lại, một file rỗng sau lần khởi động lại.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được inode, mục thư mục, hard link và symlink, và đọc chúng bằng stat, ls -i và debugfs.</li>
<li>Tôi vẽ được bảng fd → mô tả file mở → inode, và đoán được dup, fork, O_APPEND dùng chung gì.</li>
<li>Tôi nói được khi nào dữ liệu đã ghi thật sự nằm trên đĩa, và ghi được một file vừa nguyên tử vừa bền.</li>
<li>Tôi giải thích được journal phát lại gì và vì sao bind mount một file bỏ lỡ sed -i.</li>
<li>Tôi chạy được trong đầu phép kiểm quyền của nhân, kể cả thư mục, sticky, setuid, capability và mask của ACL.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: '<code>ls -li</code> shows <code>14 -rw-r--r-- 2 … app.env</code> and <code>14 -rw-r--r-- 2 … app.env.bak</code>. You run <code>rm app.env</code>. What happens to the data?|||<code>ls -li</code> hiện <code>14 -rw-r--r-- 2 … app.env</code> và <code>14 -rw-r--r-- 2 … app.env.bak</code>. Bạn chạy <code>rm app.env</code>. Dữ liệu ra sao?',
            options: ['It is deleted; app.env.bak now points to freed blocks|||Bị xoá; app.env.bak giờ trỏ tới các khối đã giải phóng', 'Nothing is freed: inode 14 loses one name, its link count becomes 1, and app.env.bak still reads it|||Không có gì bị giải phóng: inode 14 mất một tên, số liên kết còn 1, và app.env.bak vẫn đọc được', 'app.env.bak becomes a dangling symbolic link|||app.env.bak trở thành symlink trỏ vào hư không', 'The data moves to app.env.bak, which gets a new inode number|||Dữ liệu chuyển sang app.env.bak, file này nhận số inode mới'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Both names are hard links to inode 14 (link count 2). rm removes one directory entry; the inode and its blocks are freed only when the link count reaches 0 and no process holds it open. In lesson 9.1, cat app.env.bak still printed PORT=3000. A dangling link is what happened to the symlink current.env, which stored only the text "app.env"; hard links never change inode numbers.|||VI: Cả hai tên đều là hard link tới inode 14 (số liên kết 2). rm bỏ một mục thư mục; inode và các khối của nó chỉ được giải phóng khi số liên kết về 0 và không tiến trình nào còn mở. Ở bài 9.1, cat app.env.bak vẫn in PORT=3000. Trỏ vào hư không là chuyện xảy ra với symlink current.env, vốn chỉ lưu chuỗi "app.env"; hard link không bao giờ đổi số inode.' },
          { question: 'Two PM2 workers each call <code>fs.openSync(\'logs/orders.log\', \'w\')</code> and write lines. The file contains <code>worker B: hi</code> followed by <code>er 1001 paid</code>. What happened, and what is the fix?|||Hai worker PM2 mỗi bên gọi <code>fs.openSync(\'logs/orders.log\', \'w\')</code> rồi ghi các dòng. File chứa <code>worker B: hi</code> rồi tới <code>er 1001 paid</code>. Chuyện gì đã xảy ra, và sửa thế nào?',
            options: ['The page cache mixed the two writes; call fsync after each line|||Page cache trộn hai lần ghi; gọi fsync sau mỗi dòng', 'JavaScript has no lock; wrap the writes in a mutex inside each worker|||JavaScript không có khoá; bọc các lần ghi trong mutex ở mỗi worker', 'The journal lost half of a transaction; mount with data=journal|||Journal làm mất nửa giao dịch; gắn với data=journal', 'Each open() created its own open file description with its own offset starting at 0, so B overwrote A; open with flag \'a\' (O_APPEND) or log to stdout|||Mỗi open() tạo một mô tả file mở riêng với offset riêng bắt đầu từ 0, nên B ghi đè A; mở với cờ \'a\' (O_APPEND) hoặc ghi log ra stdout'],
            correctIndex: 3, points: 1,
            explanation: 'EN: ./ofd twice reproduced exactly this: A at pos 26, B at pos 13 over A’s line. With O_APPEND every write first moves to the end (B’s pos jumped to 39, both lines intact). A mutex inside each process cannot coordinate two processes; fsync and the journal are about durability, not about where a write lands.|||VI: ./ofd twice tái hiện đúng điều này: A ở pos 26, B ở pos 13 đè lên dòng của A. Với O_APPEND mỗi lần ghi trước tiên dời tới cuối (pos của B nhảy lên 39, cả hai dòng nguyên vẹn). Mutex trong từng tiến trình không phối hợp được hai tiến trình; fsync và journal nói về độ bền, không quyết định lần ghi rơi vào đâu.' },
          { question: 'In the lab, 4 KiB writes cost 1.8 µs buffered, about 0.9 ms with fsync each, and 48 µs with O_DIRECT. A teammate proposes "switch the order log to O_DIRECT: it is durable and 20× faster than fsync". What is wrong?|||Trong lab, ghi 4 KiB tốn 1,8 µs khi có đệm, khoảng 0,9 ms khi fsync từng lần, và 48 µs với O_DIRECT. Một bạn đề xuất "chuyển log đơn hàng sang O_DIRECT: nó bền mà nhanh hơn fsync 20 lần". Sai ở đâu?',
            options: ['Nothing; O_DIRECT writes go straight to the platters|||Không sai; O_DIRECT ghi thẳng xuống đĩa từ', 'O_DIRECT is slower than buffered, so it cannot be used for logs|||O_DIRECT chậm hơn ghi có đệm nên không dùng cho log được', 'O_DIRECT skips the page cache but does not wait for the device to flush its own cache; durability still needs fsync/fdatasync, which brought it back to ~0.85–1.1 ms|||O_DIRECT bỏ qua page cache nhưng không chờ thiết bị xả cache riêng; muốn bền vẫn cần fsync/fdatasync, và khi đó nó quay lại ~0,85–1,1 ms', 'O_DIRECT only works on tmpfs|||O_DIRECT chỉ chạy trên tmpfs'],
            correctIndex: 2, points: 1,
            explanation: 'EN: The O_DIRECT+fdsync row cost 0.85–1.13 ms in four runs, the same as fsync: the flush is the expensive part. O_DIRECT also needs aligned buffers (EINVAL otherwise) and loses read-ahead. tmpfs is the one place where O_DIRECT is usually refused, not the only place it works.|||VI: Dòng O_DIRECT+fdsync tốn 0,85–1,13 ms qua bốn lượt, ngang fsync: lần xả mới là phần đắt. O_DIRECT còn cần bộ đệm căn lề (không thì EINVAL) và mất read-ahead. tmpfs chính là nơi O_DIRECT thường bị từ chối, chứ không phải nơi duy nhất nó chạy.' },
          { question: 'An app writes <code>order #1001 paid</code> with a plain write and returns 200. A crash 6 seconds later (simulated by copying the disk image) leaves <code>orders.log</code> existing with <strong>0 bytes</strong>; at 40 s it would have been complete. Why 0 bytes?|||Một app ghi <code>order #1001 paid</code> bằng một lần ghi thường rồi trả 200. Một cú sập 6 giây sau (giả lập bằng chép ảnh đĩa) để lại <code>orders.log</code> có tồn tại nhưng <strong>0 byte</strong>; ở giây 40 thì nó đã đủ. Vì sao 0 byte?',
            options: ['The disk is broken and lost the data block|||Đĩa hỏng và làm mất khối dữ liệu', 'The journal replay truncates files that were open at crash time|||Việc phát lại journal cắt cụt các file đang mở lúc sập', 'ext4 committed the name and inode in its 5-second journal commit, but delayed allocation had not written the data yet; writeback happens after ~30 s|||ext4 đã commit tên và inode trong lần commit journal mỗi 5 giây, nhưng cấp phát trễ chưa ghi dữ liệu; writeback xảy ra sau ~30 s', 'The page cache was dropped by drop_caches|||Page cache bị drop_caches vứt đi'],
            correctIndex: 2, points: 1,
            explanation: 'EN: Measured: at 0 s no file, at 6 s 0 bytes, at 40 s 17 bytes, and with sync before the crash 17 bytes at once. Metadata commits every 5 s (commit=5); data waits for dirty_expire (30 s). Replay re-applies committed metadata, it never truncates; drop_caches only discards clean pages.|||VI: Đo được: ở giây 0 không có file, giây 6 còn 0 byte, giây 40 đủ 17 byte, và có sync trước cú sập thì đủ 17 byte ngay. Metadata commit mỗi 5 s (commit=5); dữ liệu chờ dirty_expire (30 s). Phát lại journal áp lại metadata đã commit, không bao giờ cắt file; drop_caches chỉ bỏ trang sạch.' },
          { question: 'Which sequence replaces <code>config.json</code> so that a reader never sees a half-written file <strong>and</strong> a crash right after it returns keeps the new version?|||Trình tự nào thay <code>config.json</code> sao cho người đọc không bao giờ thấy file ghi dở <strong>và</strong> một cú sập ngay sau khi nó trả về vẫn giữ bản mới?',
            options: ['Write config.json.tmp → fsync it → rename it over config.json → fsync the directory|||Ghi config.json.tmp → fsync nó → rename đè lên config.json → fsync thư mục', 'writeFileSync(config.json) → fsync(config.json)|||writeFileSync(config.json) → fsync(config.json)', 'Write config.json.tmp → rename it over config.json → fsync config.json.tmp|||Ghi config.json.tmp → rename đè lên config.json → fsync config.json.tmp', 'Copy config.json.tmp to config.json with cp, then delete the temporary file|||Chép config.json.tmp sang config.json bằng cp, rồi xoá file tạm'],
            correctIndex: 0, points: 1,
            explanation: 'EN: In-place writeFileSync opens with O_TRUNC, so readers saw an empty file 374,998 times and broken JSON 165 times, even with fsync afterwards. Rename without fsync left a 0-byte file after a crash at 9 s once the ext4 heuristic was off. cp writes in place too. Only temp → fsync → rename → fsync dir survived a crash at 0 s with the new content.|||VI: writeFileSync tại chỗ mở với O_TRUNC, nên người đọc thấy file rỗng 374.998 lần và JSON hỏng 165 lần, dù có fsync sau đó. Rename không fsync để lại file 0 byte sau cú sập ở giây 9 khi đã tắt mẹo của ext4. cp cũng ghi tại chỗ. Chỉ tạm → fsync → rename → fsync thư mục sống qua cú sập ở giây 0 với nội dung mới.' },
          { question: 'On an ext2 disk, a crash left an inode updated (new size, pointer to block 7170) but not the data or the bitmap. After reboot the invoice contains another user\'s deleted password. What does <code>e2fsck -fn</code> report?|||Trên đĩa ext2, một cú sập để lại inode đã cập nhật (kích thước mới, con trỏ tới khối 7170) nhưng chưa có dữ liệu lẫn bitmap. Sau khi khởi động lại, hoá đơn chứa mật khẩu đã xoá của người khác. <code>e2fsck -fn</code> báo gì?',
            options: ['Only "Block bitmap differences: +7170" — fsck checks metadata and cannot know the block’s content is stale|||Chỉ "Block bitmap differences: +7170" — fsck kiểm metadata và không thể biết nội dung khối là dữ liệu cũ', 'That invoice.txt contains foreign data, and it deletes the block|||Rằng invoice.txt chứa dữ liệu lạ, và nó xoá khối đó', 'Nothing: ext2 has no metadata to check|||Không gì cả: ext2 không có metadata để kiểm', 'That the journal must be replayed first|||Rằng phải phát lại journal trước'],
            correctIndex: 0, points: 1,
            explanation: 'EN: That was the only complaint in the real output. fsck repairs structure (it would mark 7170 used), never content. ext4’s default data=ordered prevents this case by writing data before committing the metadata that points to it; ext2 has no journal to replay.|||VI: Đó là lời phàn nàn duy nhất trong output thật. fsck sửa cấu trúc (nó sẽ đánh dấu 7170 đã dùng), không bao giờ sửa nội dung. data=ordered mặc định của ext4 chặn trường hợp này bằng cách ghi dữ liệu trước khi commit metadata trỏ tới nó; ext2 không có journal để phát lại.' },
          { question: 'nginx.conf is bind-mounted into the nginx container as a single file. A deploy step runs <code>sed -i \'s/512/4096/\' nginx.conf</code> on the host, then <code>nginx -t</code> and <code>nginx -s reload</code> — both OK — but nginx still uses 512. What explains it, and what is a correct fix?|||nginx.conf được bind-mount vào container nginx dưới dạng một file đơn. Một bước deploy chạy <code>sed -i \'s/512/4096/\' nginx.conf</code> trên máy chủ, rồi <code>nginx -t</code> và <code>nginx -s reload</code> — đều OK — nhưng nginx vẫn dùng 512. Điều gì giải thích, và cách sửa đúng là gì?',
            options: ['nginx caches its config for 10 minutes; wait and reload again|||nginx cache cấu hình 10 phút; chờ rồi reload lại', 'reload does not reread files; use restart|||reload không đọc lại file; dùng restart', 'The host file system has not flushed the write yet; run sync before reload|||Hệ thống file máy chủ chưa xả lần ghi; chạy sync trước reload', 'sed -i writes a temp file and renames it, giving the name a new inode; the single-file mount still holds the old one (//deleted). Write in place (cat new > file) and verify the hash inside the container, or mount the directory|||sed -i ghi file tạm rồi đổi tên, gắn inode mới cho cái tên; mount một file vẫn giữ inode cũ (//deleted). Ghi tại chỗ (cat new > file) và kiểm băm bên trong container, hoặc gắn cả thư mục'],
            correctIndex: 3, points: 1,
            explanation: 'EN: strace showed sed creating sedEwm4hl and renameat-ing it; stat showed 396552 in the mount vs 396554 on the host; mountinfo printed nginx.conf//deleted. nginx -t and reload validate and load the deleted inode, so they pass. sync is irrelevant (the page cache is shared), and a restart of nginx inside the same container reads the same mount — only re-creating the mount helps.|||VI: strace cho thấy sed tạo sedEwm4hl rồi renameat nó; stat cho thấy 396552 trong mount và 396554 trên máy chủ; mountinfo in nginx.conf//deleted. nginx -t và reload kiểm và nạp inode đã xoá, nên đều qua. sync chẳng liên quan (page cache dùng chung), và restart nginx trong cùng container vẫn đọc cùng mount — chỉ tạo lại mount mới giúp được.' },
          { question: 'User dev owns <code>/srv/app/dev-notes.txt</code> but <code>rm</code> fails with Permission denied; in <code>/srv/devdir</code> (owned by dev) he deletes a read-only file owned by root without trouble. Why?|||User dev là chủ <code>/srv/app/dev-notes.txt</code> nhưng <code>rm</code> thất bại với Permission denied; trong <code>/srv/devdir</code> (chủ là dev) anh ấy xoá một file chỉ đọc của root mà không gặp khó khăn gì. Vì sao?',
            options: ['rm needs write permission on the file itself|||rm cần quyền ghi trên chính file', 'Deleting removes a name from the directory, so the kernel checks write + search on the directory, not the file’s bits (unless the directory is sticky)|||Xoá là bỏ một tên khỏi thư mục, nên nhân kiểm quyền ghi + đi qua trên thư mục, không phải các bit của file (trừ khi thư mục có sticky)', 'root-owned files can always be deleted by anyone|||File của root thì ai cũng luôn xoá được', '/srv/app has the sticky bit|||/srv/app có sticky bit'],
            correctIndex: 1, points: 1,
            explanation: 'EN: /srv/app was 755 root, so dev cannot change its list of names; /srv/devdir belongs to dev. The file’s own mode does not matter for unlink. /srv/app has no sticky bit (drwxr-xr-x); in sticky /tmp the error was "Operation not permitted" (EPERM), not "Permission denied".|||VI: /srv/app là 755 của root, nên dev không đổi được danh sách tên của nó; /srv/devdir là của dev. Mode của chính file không quan trọng với unlink. /srv/app không có sticky bit (drwxr-xr-x); trong /tmp có sticky, lỗi là "Operation not permitted" (EPERM), không phải "Permission denied".' },
          { question: 'nginx (www-data) served uploads through an ACL entry <code>user:www-data:r--</code>. After the app started saving files with mode 0600, nginx returns 403 and <code>getfacl</code> shows <code>user:www-data:r--  #effective:---</code> and <code>mask::---</code>. Why?|||nginx (www-data) phục vụ file upload nhờ mục ACL <code>user:www-data:r--</code>. Sau khi app bắt đầu lưu file với mode 0600, nginx trả 403 và <code>getfacl</code> hiện <code>user:www-data:r--  #effective:---</code> và <code>mask::---</code>. Vì sao?',
            options: ['On a file with an ACL, the group bits of the mode are the ACL mask; mode 0600 set the mask to ---, which caps every named entry|||Trên file có ACL, bit nhóm của mode chính là mask của ACL; mode 0600 đặt mask thành ---, chặn mọi mục có tên', 'ACLs expire when the file is modified|||ACL hết hạn khi file bị sửa', 'www-data lost its capabilities|||www-data mất capability của nó', 'The default ACL of the directory was deleted|||ACL mặc định của thư mục đã bị xoá'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Exactly what chmod 600 did in lesson 9.7: the entry stayed, the effective permission became ---. Fix with chmod g+r (raises the mask) or let the default ACL set it. ACLs do not expire; www-data never had capabilities; the default ACL only matters for new files.|||VI: Đúng điều chmod 600 đã làm ở bài 9.7: mục vẫn còn, quyền hiệu lực thành ---. Sửa bằng chmod g+r (nâng mask) hoặc để ACL mặc định đặt nó. ACL không hết hạn; www-data chưa từng có capability; ACL mặc định chỉ có tác dụng với file mới.' },
          { question: 'You harden the API image with <code>--user 1001:1001</code>. It now fails with <code>touch: cannot touch \'/data/export.csv\': Permission denied</code> on the named volume that worked when the container ran as root. What is the right fix?|||Bạn cứng hoá ảnh API bằng <code>--user 1001:1001</code>. Giờ nó thất bại với <code>touch: cannot touch \'/data/export.csv\': Permission denied</code> trên volume có tên vốn chạy được khi container là root. Cách sửa đúng là gì?',
            options: ['Run the container with --privileged|||Chạy container với --privileged', 'chmod -R 777 /data|||chmod -R 777 /data', 'Give the volume directory to uid 1001 once (chown, or create it in the Dockerfile with the right owner before USER)|||Giao thư mục của volume cho uid 1001 một lần (chown, hoặc tạo nó trong Dockerfile với đúng chủ trước dòng USER)', 'Add --cap-add CHOWN so the user can write|||Thêm --cap-add CHOWN để user ghi được'],
            correctIndex: 2, points: 1,
            explanation: 'EN: The volume’s root directory was created by a root container, so it is owned by 0 and 1001 is "other". After chown 1001:1001 /data the same --user container wrote export.csv (owned 1001). --privileged gives every capability and device; 777 lets any user write; capabilities are not granted to a non-root process this way and CHOWN would not fix write permission anyway.|||VI: Thư mục gốc của volume do một container root tạo, nên chủ là 0 và 1001 là "người khác". Sau chown 1001:1001 /data, cùng container --user đó ghi được export.csv (chủ 1001). --privileged trao mọi capability và thiết bị; 777 cho mọi user ghi; capability không được trao cho tiến trình không phải root theo cách đó, và CHOWN cũng chẳng sửa được quyền ghi.' },
        ],
      },
    },
  ],
};
