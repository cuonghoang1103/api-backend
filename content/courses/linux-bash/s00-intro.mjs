/**
 * Linux & Bash — Mục 0: Giới thiệu · Shell là gì · Cài đặt · Cách học.
 * Song ngữ EN/VI qua .ml-en / .ml-vi (số khối phải bằng nhau).
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out (output chạy thật) LUÔN đóng bằng </div>, KHÔNG </code></pre>.
 * KHÔNG dùng <svg> — sanitizeHtml() xoá sạch nó, sơ đồ biến mất không báo lỗi.
 *
 * Nâng cấp 09/2026: hai bài "Bắt đầu tại đây" (0.5, 0.6) + bài 0.0 slide (deck lx-00, 39 slide) + slide/🧪/🗂/📌
 * và phần "Chạy thử từng bước" / "Trên macOS·WSL khác gì" trong 0.1–0.4; quiz 0.7 (10 câu). Output MỚI chạy thật
 * 28/09/2026 trên ubuntu:24.04 (container lx00-*, Docker Desktop, Mac M1), Fedora 44 (linux-nha) và macOS 27 (zsh 5.9,
 * /bin/bash 3.2.57). Mốc lịch sử / số liệu / sự cố: kiểm nguồn cùng ngày, link-card trong bài.
 */
import { gallery, slide } from './_slides.mjs';
const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Section 0 — Introduction, what a shell is & setup|||Mục 0 — Giới thiệu, shell là gì & cài đặt',
  description: 'Đọc trước tiên: khoá này dành cho ai, vì sao dòng lệnh vẫn là công cụ mạnh nhất sau năm mươi năm, phân biệt kernel/shell/terminal (chỗ ai cũng lẫn), cách có một shell Linux thật trên Windows/macOS/Linux, và bộ lệnh sinh tồn để không bao giờ bị kẹt.',
  lessons: [
    /* ─────────────────── 0.5 · BẮT ĐẦU TẠI ĐÂY (1/2) ─────────────────── */
    {
      title: 'Start here (1/2) — What Linux and the shell are, where they came from, why they matter|||Bắt đầu tại đây (1/2) — Linux và shell là gì, ra đời thế nào, vì sao quan trọng với bạn',
      slug: 'lnx-0-5-bat-dau-tai-day',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bài mở cửa cho người chưa từng dùng dòng lệnh: Linux, shell, terminal là gì (bằng hình ảnh đời thường trước), năm thứ hay bị gọi chung là “Linux”, nửa thế kỷ lịch sử từ Unix 1969 tới WSL2 và zsh trên Mac 2019 (mọi mốc có nguồn), vì sao 92,1% website và 500/500 siêu máy tính chạy họ Unix, và nó giúp gì cho đồ án, phỏng vấn, công việc của bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>Hello. Before your first command, know what you are stepping into — and why it is worth it</h2>
<p class="lead">Welcome. Maybe you have never opened a terminal on purpose. Maybe you have — you pasted <code>sudo apt install …</code> from a tutorial, it printed a hundred lines, something worked, and you had no idea why. Or a teammate SSH-ed into the group's server while you watched, and the black window felt like a room you were not allowed into. This lesson is the door into that room. There is nothing to memorise here. In about twenty-five minutes you will know what Linux, the shell and the terminal actually are, where they came from, why half a century later they still run most of the internet, and what they will do for you — at school, in an interview and at work.</p>
<p>This lesson and the next are the front door of the course. The next one tells real stories of what goes wrong when people do not understand the command line — with sources — and then gives you a way to study that does not burn you out. After that, lessons 0.1–0.4 cover the course map, the layers behind the black window, installing a shell on any machine, and how never to be stuck.</p>

<h3>An everyday picture first: a restaurant and its waiter</h3>
${slide('lx-00', 3, 'Shell là người phục vụ: bạn gọi món, nó chuyển xuống bếp')}
<p>Forget the textbook for a minute. Picture a restaurant. You sit at the counter and order. You never walk into the kitchen yourself — you tell the <strong>waiter</strong>, who understands your order, translates it into what the kitchen needs, hands it to the right <strong>cook</strong> (one grills, one makes soup), and brings the result back to you. The <strong>kitchen</strong> itself — the fire, the knives, the fridge — belongs to nobody at the counter; only the cooks touch it, and only in the ways the kitchen allows.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">🪟 The counter window</span><span class="v">The <strong>terminal</strong>: the app with the black window (Terminal on a Mac, Windows Terminal, the panel inside VS Code). It shows text and takes your keystrokes. It runs nothing by itself.</span></div>
  <div class="kv"><span class="k">🧑‍🍳 The waiter</span><span class="v">The <strong>shell</strong> — <code>bash</code>, <code>zsh</code>. A program that reads the line you type, works out what you meant, finds the right program and starts it.</span></div>
  <div class="kv"><span class="k">👩‍🍳 The cooks</span><span class="v">The <strong>programs</strong>: <code>ls</code> lists files, <code>grep</code> searches text, <code>cp</code> copies. Each is a separate file on disk that does one job.</span></div>
  <div class="kv"><span class="k">🔥 The kitchen</span><span class="v">The <strong>kernel</strong> — Linux itself. The only software that touches the CPU, memory, disks and network. Every program asks it for everything.</span></div>
</div>
<p>Now the proper definitions, and they will make sense. <strong>Linux</strong>, strictly speaking, is only the kernel: the core of an operating system, started by Linus Torvalds in 1991. The <strong>shell</strong> is a command interpreter — the program you talk to. The <strong>terminal</strong> is the window you talk through. And <strong>the command line</strong> is simply the way of working where you type commands instead of clicking.</p>
<div class="callout ok"><strong>One sentence to keep:</strong> you type into a terminal; the shell reads what you typed and starts programs; the programs ask the kernel to do the real work. When something breaks, the first question is always "which of these four layers is complaining?"</div>

<h3>Five things people call "Linux"</h3>
${slide('lx-00', 4, 'Năm thứ hay bị gọi chung là “Linux”')}
<p>Much of the confusion beginners feel comes from one word covering five different things. When someone says "I use Linux" or "Linux is broken", ask which of these they mean:</p>
<table>
  <tr><th>Name</th><th>What it really is</th><th>Examples</th><th>Check it on your machine</th></tr>
  <tr><td><strong>Kernel</strong></td><td>The core that talks to the hardware</td><td>Linux 7.x, XNU (macOS), NT (Windows)</td><td><code>uname -r</code></td></tr>
  <tr><td><strong>Distribution</strong> ("distro")</td><td>A kernel plus tools, a package manager and defaults, packaged and tested together</td><td>Ubuntu, Debian, Fedora, Alpine, Arch</td><td><code>cat /etc/os-release</code></td></tr>
  <tr><td><strong>Shell</strong></td><td>The program that reads your commands</td><td>bash, zsh, sh/dash, fish, PowerShell</td><td><code>ps -p $$ -o comm=</code></td></tr>
  <tr><td><strong>Terminal</strong></td><td>The window app that draws text</td><td>Terminal.app, iTerm2, Windows Terminal, VS Code</td><td>(it is an app, not a command)</td></tr>
  <tr><td><strong>Core utilities</strong></td><td>The basic commands, each a separate program</td><td>GNU coreutils (Linux), BSD tools (macOS), BusyBox (Alpine)</td><td><code>ls --version</code></td></tr>
</table>
<p>The last row surprises people most. The same <code>ls</code> exists in three families that behave slightly differently. Here are the same two commands, run for real on the course's Ubuntu container and on a Mac:</p>
<pre><code class="language-bash">uname -r
ls --version | head -1</code></pre>
<div class="out">7.0.12-linuxkit
ls (GNU coreutils) 9.4</div>
<p>That was Ubuntu 24.04. On the Mac (macOS 27, Apple M1) the kernel answers <code>27.0.0</code> — that is Apple's Darwin kernel, not Linux — and <code>ls</code> refuses the flag outright:</p>
<div class="out">ls: unrecognized option &#96;--version'
usage: ls [-@ABCFGHILOPRSTUWXabcdefghiklmnopqrstuvwxy1%,] [--color=when] [-D format] [file ...]</div>
<p>Nothing is broken: macOS ships BSD versions of the basic tools, Linux ships GNU versions. That single fact explains a whole class of "it works on my server but not on my Mac" bugs, and the course flags it wherever it matters.</p>

<h3>The shell — and why there are several</h3>
<p>A shell is just a program, so anyone can write one — and over fifty years many people did. You will meet these:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">sh</span><span class="v">The original name. Ken Thompson's shell (1971), then Stephen Bourne's (1979) — the first shell that was a real programming language. Today <code>/bin/sh</code> means "a POSIX-compatible shell": dash on Ubuntu, bash on Fedora.</span></div>
  <div class="kv"><span class="k">bash</span><span class="v">The "Bourne-Again SHell", written by Brian Fox for the GNU project, first released on 8 June 1989. The default on nearly every Linux server and the language of almost every script you will inherit. This course teaches it.</span></div>
  <div class="kv"><span class="k">zsh</span><span class="v">The default login shell on macOS since 10.15 Catalina (2019). Almost everything in this course works in it unchanged.</span></div>
  <div class="kv"><span class="k">fish, PowerShell</span><span class="v">fish is friendly but deliberately not POSIX; PowerShell is Windows' shell, which passes objects instead of text. Both are fine to use; neither is what servers run scripts in.</span></div>
</div>

<h3>Half a century in one picture: 1969 → 2019</h3>
${slide('lx-00', 5, 'Nửa thế kỷ trong một hình: 1969 → 2019')}
<p>Every date below was checked against its source in September 2026 (links at the end of the lesson). You do not need to remember them. Read it as a story, because the story explains why things are the way they are.</p>
<p><strong>A failed giant, and a small replacement (1964–1971).</strong> In 1964 MIT, General Electric and Bell Labs started Multics, an ambitious time-sharing system. By 1969 Bell Labs had pulled out: it "would not deliver a working system in the short term". Two of its programmers, <strong>Ken Thompson</strong> and <strong>Dennis Ritchie</strong>, then built something much smaller on a spare PDP-7 — the system that became <strong>Unix</strong>. Thompson later said what he kept from Multics: "the hierarchical file system and the shell — a separate process that you can replace with some other process". That second idea is why you can choose between bash and zsh today. The first <em>UNIX Programmer's Manual</em> is dated 3 November 1971, already in the "man page" format you will use in lesson 0.4, and the first Unix shell — the Thompson shell — shipped with it.</p>
<p><strong>C and the pipe (1972–1973).</strong> Ritchie created the C language between 1972 and 1973, and in 1973 Version 4 of Unix was rewritten in C — unusual at the time, and the reason Unix could later be carried to almost any computer. The same year Doug McIlroy finally got the idea he had proposed back in 1964: connecting programs like garden hoses. Thompson added pipes "in one feverish night", and McIlroy recalled "an unforgettable orgy of one-liners" the next day. The <code>|</code> you will use in Chapter 3 dates from then.</p>
<p><strong>Berkeley, Bourne and a standard (1978–1988).</strong> At the University of California, Berkeley, Bill Joy released the first Berkeley Software Distribution (BSD) on 9 March 1978 — the family that leads, through FreeBSD, to today's macOS and iOS. In 1979 Version 7 Unix shipped Stephen Bourne's shell, <code>sh</code>, which turned the shell into a programming language. Because many Unix versions drifted apart, the IEEE published <strong>POSIX</strong> in 1988: a common standard for how commands and the shell must behave. When this course says "POSIX", it means "works on every Unix-like system".</p>
<p><strong>Free software (1983–1989).</strong> Unix belonged to AT&amp;T and cost money. On 27 September 1983 Richard Stallman announced <strong>GNU</strong> ("GNU's Not Unix") — a complete Unix-compatible system that anyone could use, study, change and share — and on 4 October 1985 founded the Free Software Foundation. GNU wrote the tools (the <code>gcc</code> compiler, the core utilities, Emacs) and, in 1989, <strong>bash</strong>, a free replacement for the Bourne shell. By 1991 GNU had almost everything except one piece: a working kernel.</p>
<p><strong>"Just a hobby" (1991–1995).</strong> On 25 August 1991 a 21-year-old student in Helsinki, <strong>Linus Torvalds</strong>, posted to the comp.os.minix newsgroup: "I'm doing a (free) operating system (just a hobby, won't be big and professional like gnu) for 386(486) AT clones." In the same message: "I've currently ported bash(1.08) and gcc(1.40), and things seem to work." Linux and bash have travelled together from the very first day. Version 0.01 appeared on 17 September 1991; from version 0.12 (1992) the kernel was licensed under the GNU GPL, which kept it free forever; Linux 1.0 came on 14 March 1994. Distributions appeared to package the kernel with the GNU tools: Debian (announced 16 August 1993), Red Hat Linux (first release May 1995), later Ubuntu (20 October 2004, built on Debian).</p>
<p><strong>Everywhere (2008–2019).</strong> The first Android phone, the HTC Dream, was announced on 23 September 2008 — on a modified Linux kernel. Microsoft, once Linux's fiercest opponent, shipped the Windows Subsystem for Linux in the Windows 10 Anniversary Update (2 August 2016), announced WSL 2 — a real Linux kernel in a lightweight virtual machine — in May 2019, and shipped it with Windows 10 version 2004 in 2020. The same year, 2019, Apple made zsh the default shell in macOS Catalina, leaving the old bash 3.2 behind (lesson 0.3 explains why that matters for your scripts).</p>

<h3>The family tree: macOS is a cousin, Linux is an adopted child</h3>
${slide('lx-00', 6, 'Cây họ Unix: Mac là “anh em họ”, Linux là “con nuôi”')}
<p>Two lines come out of 1969. One carries real Unix code: Unix → BSD → FreeBSD → Darwin, the core of macOS and iOS ("based on 4.4BSD-Lite2 and FreeBSD"). That is why a Mac feels so familiar in a terminal. The other line shares <em>ideas</em> but no code: Andrew Tanenbaum wrote Minix (1987) as a Unix clone for teaching, Torvalds developed early Linux on a Minix machine, and wrote the kernel from scratch. Linux is therefore "Unix-like", not Unix. Combine the Linux kernel with the GNU tools and you get what people call Linux (the FSF prefers "GNU/Linux" — both names are in use). From that come the distributions you will meet: Debian and Ubuntu, Red Hat and Fedora, Alpine in Docker images, and the kernels inside Android and WSL 2.</p>

<h3>Why it was born — the Unix philosophy</h3>
<p>Unix was a reaction to Multics being too big. Its designers kept things small on purpose, and Doug McIlroy wrote the idea down in 1978: "Make each program do one thing well." Peter Salus later summarised it in three sentences: "Write programs that do one thing and do it well. Write programs to work together. Write programs to handle text streams, because that is a universal interface." You can feel it in one line. Four separate programs, none of which knows the others exist, count which shell names appear most often in a list:</p>
<pre><code class="language-bash">printf "linux\\nbash\\nlinux\\nzsh\\nlinux\\nbash\\n" | sort | uniq -c | sort -rn</code></pre>
<div class="out">      3 linux
      2 bash
      1 zsh</div>
<p><code>printf</code> writes six lines, <code>sort</code> puts equal lines next to each other, <code>uniq -c</code> counts neighbours that are equal, <code>sort -rn</code> puts the biggest number first. Nobody wrote a "count words" tool; you just built one. Replace the <code>printf</code> with a real web server log and you have the first command every engineer runs during an incident — Chapter 3 teaches every piece of it.</p>

<h3>What it is used for — concrete jobs</h3>
<table>
  <tr><th>Where</th><th>What Linux and the shell do there</th><th>In this course</th></tr>
  <tr><td>Web servers and VPS</td><td>Run nginx, Node.js, PostgreSQL; you manage them over SSH with no screen at all</td><td>Ch 9–12</td></tr>
  <tr><td>Docker and the cloud</td><td>Every Linux container uses the Linux kernel; cloud machines are Linux by default</td><td>Ch 5, 14 · <code>/courses/docker</code></td></tr>
  <tr><td>CI/CD</td><td>GitHub Actions' <code>ubuntu-latest</code> runners execute your <code>run:</code> steps in bash</td><td>Ch 6–7 · <code>/courses/github-actions</code></td></tr>
  <tr><td>AI and GPU machines</td><td>Model training and inference servers run Linux; you drive them from a terminal</td><td>Ch 5, 10, 14</td></tr>
  <tr><td>Phones and devices</td><td>Android, routers (OpenWrt), Raspberry Pi, robots, smart TVs</td><td>Ch 1–2 (the same filesystem)</td></tr>
  <tr><td>Your own laptop</td><td>Renaming 4,000 files, searching logs, automating the boring parts of a project</td><td>Ch 2–3, 6–7</td></tr>
</table>

<h3>Does it really matter? The numbers</h3>
${slide('lx-00', 7, 'Linux chạy phần lớn Internet — con số có nguồn')}
<table>
  <tr><th>Number</th><th>What it measures</th><th>Source and date</th></tr>
  <tr><td><strong>92.1%</strong></td><td>Websites whose operating system is known that run a Unix-like system; 62.6% are identifiably Linux (the rest do not reveal which Unix-like system they run)</td><td>W3Techs, 28 September 2026</td></tr>
  <tr><td><strong>500 of 500</strong></td><td>Supercomputers on the TOP500 list running Linux — every single list from November 2017 to June 2026</td><td>TOP500, list of June 2026</td></tr>
  <tr><td><strong>48.7%</strong></td><td>Developers who did extensive work in Bash/Shell during the year — fifth most-used language, ahead of TypeScript</td><td>Stack Overflow Developer Survey 2025</td></tr>
  <tr><td><strong>27.7% · 16.8%</strong></td><td>Developers whose main professional OS is Ubuntu · WSL (macOS 32.9%, Windows 49.5%)</td><td>Stack Overflow Developer Survey 2025</td></tr>
</table>
<p>Read the last row carefully: half of professional developers work on Windows, a third on macOS — and they still need Linux, because what they build runs on it. That is why this course keeps saying "on macOS this differs" and "on WSL do this".</p>

<h3>What it does for YOU</h3>
${slide('lx-00', 8, 'Học Linux giúp gì cho BẠN — bốn chỗ dùng ngay')}
<div class="kv-grid">
  <div class="kv"><span class="k">🎓 Your group project</span><span class="v">SWP391-style projects end with "deploy it to a VPS". With this course you SSH in, read the logs, restart the service and see why the disk is full — instead of waiting for the one teammate who "knows Linux" at 2 a.m. before the demo.</span></div>
  <div class="kv"><span class="k">💼 Internships and interviews</span><span class="v">Common questions: what does <code>chmod 755</code> mean? How do you find what is holding port 3000? What is the difference between <code>df</code> and <code>du</code>? How do you find the errors in a 2 GB log? What is the difference between a process and a thread, and what does <code>kill -9</code> send? Each has a chapter.</span></div>
  <div class="kv"><span class="k">🛠 Backend, DevOps, AI</span><span class="v">Docker, CI, cloud machines and GPU servers are Linux. A server has no desktop: the terminal is its entire interface.</span></div>
  <div class="kv"><span class="k">💻 Mac and Windows too</span><span class="v">macOS is a Unix cousin with zsh; Windows has WSL 2 (a real Linux kernel) and Git Bash. You learn once and use it on all three — Chapter 15 covers the differences in depth.</span></div>
</div>

<h3>Where this course takes you: 17 parts</h3>
<p>Section 0 (you are here) → Chapters 1–3: moving around, files, text and pipes → Chapters 4–5: permissions, processes and signals → Chapters 6–8: the shell as a language, production scripts, the environment → Chapters 9–12: networking and SSH, disks and logs, systemd and cron, diagnosing a real server → Chapters 13–16, added in 2026: advanced Bash, Linux in depth (kernel, performance, storage, security), your Linux skills on macOS and Windows, and a capstone where you build, automate and run a real server. Lesson 0.1 shows the full map.</p>

<div class="pitfall co-tieu-de"><strong>Two ideas that trip beginners up.</strong> First: "My Mac is basically Linux." It is Unix — a close cousin — but its kernel, its core tools and its default shell differ, and scripts copied between them break in small, confusing ways (lesson 0.3 shows real errors). Second: "I will learn Linux by reading about it." You will not. Every lesson here has commands and a 🧪 practice block; the understanding comes from typing them, getting an error, and reading it. That is why lesson 0.3 gives you a machine you are allowed to break.</div>

<h3>🧪 Practice (10 minutes — guaranteed to work)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a new course, a new notebook. Open a terminal (Mac: Terminal; Windows: the "Ubuntu" app if WSL is installed, otherwise do this after lesson 0.3; Linux: any terminal) and create the practice folder the whole course will use.</p><ol>
<li>Ask the machine who and what it is: <code>whoami</code>, then <code>uname -srm</code>. Which kernel answered — Linux or Darwin?</li>
<li>Ask which shell you are talking to: <code>echo $SHELL</code> and <code>ps -p $$ -o comm=</code>.</li>
<li>Create the course sandbox and step into it: <code>mkdir -p ~/thu-linux &amp;&amp; cd ~/thu-linux</code>, then <code>pwd</code>.</li>
<li>Write your first file with the shell and read it back (block below).</li>
<li>Build your first pipe: count the lines of <code>shell.txt</code> with <code>sort | uniq -c | sort -rn</code>.</li></ol>
<pre><code class="language-bash">printf "Name: An\\nMachine: %s\\nShell: %s\\n" "$(uname -s)" "$(basename "$SHELL")" &gt; gioi-thieu.txt
cat gioi-thieu.txt
printf "linux\\nbash\\nlinux\\nzsh\\nlinux\\nbash\\n" &gt; shell.txt
sort shell.txt | uniq -c | sort -rn</code></pre>
<div class="out">Name: An
Machine: Linux
Shell: bash
      3 linux
      2 bash
      1 zsh</div>
<p>Real output from the course's Ubuntu 24.04 container. On a Mac the second line says <code>Machine: Darwin</code> and the third <code>Shell: zsh</code> — both correct.</p>
<p><strong>Done when:</strong> <code>~/thu-linux</code> exists and contains <code>gioi-thieu.txt</code> and <code>shell.txt</code>, the pipe prints <code>3 linux</code> on its first line, and you can say in one sentence which of your four layers (terminal, shell, programs, kernel) answered each of steps 1–2.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Kernel</span><span class="v">The core of the operating system, the only software that talks directly to the hardware. "Linux" strictly means this.</span></div>
  <div class="kv"><span class="k">Distribution (distro)</span><span class="v">A kernel plus tools, package manager and defaults, released together: Ubuntu, Fedora, Debian, Alpine.</span></div>
  <div class="kv"><span class="k">Shell</span><span class="v">The program that reads the commands you type and starts other programs: bash, zsh.</span></div>
  <div class="kv"><span class="k">Terminal (emulator)</span><span class="v">The window application that shows text and sends your keystrokes to the shell.</span></div>
  <div class="kv"><span class="k">Command line</span><span class="v">Working by typing commands instead of clicking.</span></div>
  <div class="kv"><span class="k">GNU / coreutils</span><span class="v">The free-software project that wrote bash and the basic commands (<code>ls</code>, <code>cp</code>, <code>sort</code>…) used on Linux.</span></div>
  <div class="kv"><span class="k">Unix-like</span><span class="v">Behaves like Unix without containing Unix code — Linux is the famous example.</span></div>
  <div class="kv"><span class="k">POSIX</span><span class="v">The 1988 standard describing how a Unix-like system and its shell must behave, so scripts can run everywhere.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>You type into a terminal, the shell interprets it, programs do the job, the kernel touches the hardware — four layers, four different things.</li>
<li>"Linux" is strictly the kernel; Ubuntu, Fedora and friends are distributions that add the GNU tools, a shell and a package manager.</li>
<li>Unix was born at Bell Labs in 1969; pipes arrived in 1973, the Bourne shell in 1979, bash in 1989 and Linux in 1991 — with bash on board from day one.</li>
<li>macOS descends from BSD Unix, Linux only imitates Unix; that is why their commands look alike but differ in details.</li>
<li>The Unix philosophy — small programs, joined by pipes, speaking text — is why a one-line pipeline can replace a tool nobody wrote.</li>
<li>92.1% of websites, all 500 top supercomputers, CI runners and Android run the Unix family; knowing the shell pays off in projects, interviews and every backend, DevOps or AI job.</li>
</ul>

<a class="link-card" href="https://en.wikipedia.org/wiki/History_of_Unix" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">History of Unix — Wikipedia</span><span class="lc-sub">Multics, the PDP-7, the 1971 manual, the rewrite in C, Version 7 and POSIX, with references to the original papers.</span></span>
</a>
<a class="link-card" href="https://www.cs.cmu.edu/~awb/linux.history.html" target="_blank" rel="noopener">
  <span class="lc-ico">✉️</span>
  <span class="lc-body"><span class="lc-title">Linus Torvalds' first posts about Linux (1991)</span><span class="lc-sub">The full "just a hobby" message of 25 August 1991, including "I've currently ported bash(1.08)".</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/History_of_Linux" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">History of Linux — Wikipedia</span><span class="lc-sub">From version 0.01 through the GPL switch, Linux 1.0 and the first distributions.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Bash_(Unix_shell)" target="_blank" rel="noopener">
  <span class="lc-ico">🐚</span>
  <span class="lc-body"><span class="lc-title">Bash (Unix shell) — Wikipedia</span><span class="lc-sub">Brian Fox, 8 June 1989, the license history (GPLv2 up to 3.2, GPLv3 from 4.0) and the current 5.3 release.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Unix_philosophy" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">The Unix philosophy — McIlroy 1978 and Salus 1994</span><span class="lc-sub">The sentences behind pipes and small tools.</span></span>
</a>
<a class="link-card" href="https://w3techs.com/technologies/details/os-linux" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">W3Techs — usage of Linux for websites</span><span class="lc-sub">Updated daily: Unix 92.1%, Linux 62.6% on 28 September 2026.</span></span>
</a>
<a class="link-card" href="https://www.top500.org/statistics/details/osfam/1/" target="_blank" rel="noopener">
  <span class="lc-ico">🖥</span>
  <span class="lc-body"><span class="lc-title">TOP500 — Linux share of the fastest supercomputers</span><span class="lc-sub">The chart that has sat at 500 of 500 since November 2017.</span></span>
</a>
<a class="link-card" href="https://survey.stackoverflow.co/2025/technology" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Stack Overflow Developer Survey 2025 — Technology</span><span class="lc-sub">Languages (Bash/Shell 48.7%) and operating systems developers really work on.</span></span>
</a>
<p class="note-ct"><strong>Next:</strong> "Start here (2/2)" — real incidents caused by not understanding a single line of shell, each checked against its source, and a way of studying this course that does not make you quit in week one.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>Chào bạn. Trước lệnh đầu tiên, hãy biết mình đang bước vào đâu — và vì sao đáng học</h2>
<p class="lead">Chào mừng bạn. Có thể bạn chưa từng chủ động mở một cửa sổ terminal. Có thể bạn đã từng — dán một dòng <code>sudo apt install …</code> lấy từ hướng dẫn trên mạng, màn hình chạy cả trăm dòng chữ, cái gì đó chạy được, và bạn chẳng biết vì sao. Hoặc bạn ngồi xem bạn cùng nhóm SSH vào máy chủ của đồ án, và cái cửa sổ đen trông như một căn phòng mình không được phép bước vào. Bài này là cánh cửa vào căn phòng đó. Ở đây không có gì phải học thuộc. Trong khoảng hai mươi lăm phút, bạn sẽ biết Linux, shell và terminal thật ra là gì, chúng từ đâu tới, vì sao sau nửa thế kỷ chúng vẫn chạy phần lớn Internet, và chúng sẽ giúp gì cho bạn — ở trường, lúc phỏng vấn và khi đi làm.</p>
<p>Bài này và bài kế tiếp là cửa chính của khoá. Bài sau kể những sự cố thật khi người ta không hiểu dòng lệnh — có nguồn đàng hoàng — rồi đưa bạn một cách học không làm bạn kiệt sức. Sau đó, các bài 0.1–0.4 đi qua bản đồ khoá học, các lớp đằng sau cửa sổ đen, cách có một shell trên mọi loại máy, và cách để không bao giờ bị kẹt.</p>

<h3>Hình dung trước đã: một nhà hàng và người phục vụ</h3>
${slide('lx-00', 3, 'Shell là người phục vụ: bạn gọi món, nó chuyển xuống bếp')}
<p>Tạm quên sách giáo khoa một phút. Hãy hình dung một nhà hàng. Bạn ngồi ở quầy và gọi món. Bạn không bao giờ tự đi vào bếp — bạn nói với <strong>người phục vụ</strong>, người hiểu món bạn gọi, chuyển nó thành thứ bếp cần, đưa cho đúng <strong>đầu bếp</strong> (người chuyên nướng, người chuyên nấu canh), rồi mang kết quả ra cho bạn. Còn bản thân <strong>cái bếp</strong> — lửa, dao, tủ lạnh — không thuộc về ai ngồi ở quầy; chỉ đầu bếp chạm vào, và chỉ theo những cách mà bếp cho phép.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">🪟 Ô cửa gọi món</span><span class="v"><strong>Terminal</strong> (trình giả lập terminal): ứng dụng có cái cửa sổ đen (Terminal trên Mac, Windows Terminal, ô terminal trong VS Code). Nó hiện chữ và nhận phím bạn gõ. Tự nó không chạy gì cả.</span></div>
  <div class="kv"><span class="k">🧑‍🍳 Người phục vụ</span><span class="v"><strong>Shell</strong> (trình thông dịch lệnh) — <code>bash</code>, <code>zsh</code>. Một chương trình đọc dòng bạn gõ, hiểu ý bạn, tìm đúng chương trình và khởi động nó.</span></div>
  <div class="kv"><span class="k">👩‍🍳 Các đầu bếp</span><span class="v">Các <strong>chương trình</strong>: <code>ls</code> liệt kê file, <code>grep</code> tìm chữ, <code>cp</code> sao chép. Mỗi cái là một file riêng trên đĩa, làm đúng một việc.</span></div>
  <div class="kv"><span class="k">🔥 Cái bếp</span><span class="v"><strong>Kernel</strong> (nhân) — chính là Linux. Phần mềm duy nhất chạm vào CPU, bộ nhớ, ổ đĩa và mạng. Mọi chương trình đều phải xin nó mọi thứ.</span></div>
</div>
<p>Giờ mới tới định nghĩa chính thức, và chúng sẽ dễ hiểu. <strong>Linux</strong>, nói cho đúng, chỉ là cái kernel: lõi của một hệ điều hành, do Linus Torvalds khởi đầu năm 1991. <strong>Shell</strong> là trình thông dịch lệnh — chương trình mà bạn nói chuyện cùng. <strong>Terminal</strong> là cái cửa sổ mà bạn nói chuyện qua đó. Còn <strong>dòng lệnh</strong> (command line) đơn giản là cách làm việc bằng gõ lệnh thay vì bấm chuột.</p>
<div class="callout ok"><strong>Một câu cần nhớ:</strong> bạn gõ vào terminal; shell đọc thứ bạn gõ và khởi động các chương trình; các chương trình nhờ kernel làm việc thật. Khi có gì hỏng, câu hỏi đầu tiên luôn là “trong bốn lớp này, lớp nào đang kêu?”.</div>

<h3>Năm thứ hay bị gọi chung là “Linux”</h3>
${slide('lx-00', 4, 'Năm thứ hay bị gọi chung là “Linux”')}
<p>Phần lớn sự bối rối của người mới đến từ việc một chữ phải gánh năm thứ khác nhau. Khi ai đó nói “mình dùng Linux” hay “Linux lỗi rồi”, hãy hỏi xem họ đang nói về cái nào:</p>
<table>
  <tr><th>Tên</th><th>Thật ra là gì</th><th>Ví dụ</th><th>Kiểm trên máy bạn</th></tr>
  <tr><td><strong>Kernel</strong> (nhân)</td><td>Phần lõi nói chuyện với phần cứng</td><td>Linux 7.x, XNU (macOS), NT (Windows)</td><td><code>uname -r</code></td></tr>
  <tr><td><strong>Distribution</strong> (bản phân phối, “distro”)</td><td>Kernel cộng công cụ, trình quản lý gói và cấu hình mặc định, được đóng gói và thử cùng nhau</td><td>Ubuntu, Debian, Fedora, Alpine, Arch</td><td><code>cat /etc/os-release</code></td></tr>
  <tr><td><strong>Shell</strong></td><td>Chương trình đọc lệnh của bạn</td><td>bash, zsh, sh/dash, fish, PowerShell</td><td><code>ps -p $$ -o comm=</code></td></tr>
  <tr><td><strong>Terminal</strong></td><td>Ứng dụng cửa sổ vẽ chữ</td><td>Terminal.app, iTerm2, Windows Terminal, VS Code</td><td>(là ứng dụng, không phải lệnh)</td></tr>
  <tr><td><strong>Core utilities</strong> (bộ lệnh lõi)</td><td>Các lệnh cơ bản, mỗi lệnh là một chương trình riêng</td><td>GNU coreutils (Linux), bộ BSD (macOS), BusyBox (Alpine)</td><td><code>ls --version</code></td></tr>
</table>
<p>Dòng cuối là dòng làm người ta ngạc nhiên nhất. Cùng một lệnh <code>ls</code> tồn tại trong ba “họ”, cư xử hơi khác nhau. Đây là cùng hai lệnh, chạy thật trên container Ubuntu của khoá và trên một máy Mac:</p>
<pre><code class="language-bash">uname -r
ls --version | head -1</code></pre>
<div class="out">7.0.12-linuxkit
ls (GNU coreutils) 9.4</div>
<p>Đó là Ubuntu 24.04. Trên máy Mac (macOS 27, chip Apple M1), kernel trả lời <code>27.0.0</code> — đó là nhân Darwin của Apple, không phải Linux — còn <code>ls</code> thì từ chối thẳng cái cờ đó:</p>
<div class="out">ls: unrecognized option &#96;--version'
usage: ls [-@ABCFGHILOPRSTUWXabcdefghiklmnopqrstuvwxy1%,] [--color=when] [-D format] [file ...]</div>
<p>Không có gì hỏng cả: macOS đi kèm phiên bản BSD của các công cụ cơ bản, Linux đi kèm phiên bản GNU. Chỉ riêng sự thật đó đã giải thích cả một loại lỗi “chạy trên máy chủ được mà trên Mac thì không”, và khoá này sẽ đánh dấu nó ở mọi chỗ quan trọng.</p>

<h3>Shell — và vì sao lại có nhiều shell</h3>
<p>Shell chỉ là một chương trình, nên ai cũng có thể viết một cái — và suốt năm mươi năm, rất nhiều người đã viết. Bạn sẽ gặp những cái này:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">sh</span><span class="v">Cái tên gốc. Shell của Ken Thompson (1971), rồi của Stephen Bourne (1979) — shell đầu tiên là một ngôn ngữ lập trình thực thụ. Ngày nay <code>/bin/sh</code> nghĩa là “một shell tương thích POSIX”: trên Ubuntu là dash, trên Fedora là bash.</span></div>
  <div class="kv"><span class="k">bash</span><span class="v">“Bourne-Again SHell”, do Brian Fox viết cho dự án GNU, phát hành lần đầu ngày 8/6/1989. Mặc định trên gần như mọi máy chủ Linux và là ngôn ngữ của gần như mọi script bạn sẽ tiếp quản. Khoá này dạy nó.</span></div>
  <div class="kv"><span class="k">zsh</span><span class="v">Shell đăng nhập mặc định của macOS từ bản 10.15 Catalina (2019). Gần như mọi thứ trong khoá này chạy nguyên vẹn trên nó.</span></div>
  <div class="kv"><span class="k">fish, PowerShell</span><span class="v">fish thân thiện nhưng cố tình không theo POSIX; PowerShell là shell của Windows, truyền đối tượng thay vì văn bản. Dùng cả hai đều ổn; nhưng máy chủ không chạy script bằng chúng.</span></div>
</div>

<h3>Nửa thế kỷ trong một hình: 1969 → 2019</h3>
${slide('lx-00', 5, 'Nửa thế kỷ trong một hình: 1969 → 2019')}
<p>Mọi mốc dưới đây đã được đối chiếu với nguồn vào tháng 9/2026 (link ở cuối bài). Bạn không cần nhớ chúng. Hãy đọc như một câu chuyện, vì chính câu chuyện giải thích vì sao mọi thứ lại như bây giờ.</p>
<p><strong>Một gã khổng lồ thất bại, và một kẻ thay thế nhỏ bé (1964–1971).</strong> Năm 1964, MIT, General Electric và Bell Labs bắt đầu Multics, một hệ thống chia sẻ thời gian đầy tham vọng. Tới năm 1969 Bell Labs rút lui: dự án “sẽ không cho ra một hệ thống chạy được trong ngắn hạn”. Hai lập trình viên của nó, <strong>Ken Thompson</strong> và <strong>Dennis Ritchie</strong>, liền dựng một thứ nhỏ hơn nhiều trên một cái máy PDP-7 bỏ không — hệ thống sau này thành <strong>Unix</strong>. Về sau Thompson kể ông giữ lại gì từ Multics: “hệ thống file phân cấp và shell — một tiến trình riêng mà bạn có thể thay bằng tiến trình khác”. Ý thứ hai chính là lý do hôm nay bạn được chọn giữa bash và zsh. Cuốn <em>UNIX Programmer’s Manual</em> đầu tiên đề ngày 3/11/1971, đã theo đúng định dạng “trang man” mà bạn sẽ dùng ở bài 0.4, và shell Unix đầu tiên — Thompson shell — ra đời cùng nó.</p>
<p><strong>C và cái ống (1972–1973).</strong> Ritchie tạo ra ngôn ngữ C trong khoảng 1972–1973, và năm 1973 Unix bản 4 được viết lại bằng C — điều hiếm thấy thời đó, và là lý do Unix về sau mang được sang gần như mọi loại máy. Cùng năm ấy Doug McIlroy cuối cùng cũng có được thứ ông đề xuất từ năm 1964: nối các chương trình với nhau như nối ống nước tưới vườn. Thompson thêm ống dẫn (pipe) “trong một đêm hăng say”, và McIlroy nhớ lại hôm sau là “một cuộc bùng nổ one-liner không thể quên”. Dấu <code>|</code> bạn dùng ở Chương 3 có từ lúc đó.</p>
<p><strong>Berkeley, Bourne và một tiêu chuẩn (1978–1988).</strong> Ở Đại học California, Berkeley, Bill Joy phát hành bản Berkeley Software Distribution (BSD) đầu tiên ngày 9/3/1978 — dòng họ dẫn, qua FreeBSD, tới macOS và iOS ngày nay. Năm 1979 Unix bản 7 đi kèm shell của Stephen Bourne, <code>sh</code>, biến shell thành một ngôn ngữ lập trình. Vì các bản Unix ngày càng lệch nhau, năm 1988 IEEE công bố <strong>POSIX</strong>: một tiêu chuẩn chung về cách lệnh và shell phải cư xử. Khi khoá này nói “POSIX”, nghĩa là “chạy được trên mọi hệ giống Unix”.</p>
<p><strong>Phần mềm tự do (1983–1989).</strong> Unix thuộc về AT&amp;T và phải trả tiền. Ngày 27/9/1983 Richard Stallman công bố <strong>GNU</strong> (“GNU’s Not Unix”) — một hệ thống trọn vẹn tương thích Unix mà ai cũng được dùng, tìm hiểu, sửa và chia sẻ — và ngày 4/10/1985 lập ra Quỹ Phần mềm Tự do (FSF). GNU viết các công cụ (trình biên dịch <code>gcc</code>, bộ lệnh lõi, Emacs) và năm 1989 viết <strong>bash</strong>, một bản thay thế tự do cho Bourne shell. Tới năm 1991 GNU đã có gần như mọi thứ, trừ một mảnh: một kernel chạy được.</p>
<p><strong>“Chỉ là sở thích” (1991–1995).</strong> Ngày 25/8/1991, một sinh viên 21 tuổi ở Helsinki, <strong>Linus Torvalds</strong>, đăng lên nhóm tin comp.os.minix: “Tôi đang làm một hệ điều hành (tự do) (chỉ là sở thích, sẽ không to và chuyên nghiệp như gnu) cho máy AT 386(486).” Cũng trong thư đó: “Tôi đã port được bash(1.08) và gcc(1.40), và mọi thứ có vẻ chạy.” Linux và bash đã đi cùng nhau từ đúng ngày đầu tiên. Bản 0.01 ra ngày 17/9/1991; từ bản 0.12 (1992) kernel dùng giấy phép GNU GPL, thứ giữ nó tự do mãi mãi; Linux 1.0 ra ngày 14/3/1994. Các bản phân phối xuất hiện để đóng gói kernel cùng công cụ GNU: Debian (công bố 16/8/1993), Red Hat Linux (bản đầu tháng 5/1995), rồi Ubuntu (20/10/2004, dựng trên Debian).</p>
<p><strong>Ở khắp nơi (2008–2019).</strong> Chiếc điện thoại Android đầu tiên, HTC Dream, được công bố ngày 23/9/2008 — chạy trên một nhân Linux đã sửa đổi. Microsoft, từng là đối thủ gay gắt nhất của Linux, đưa Windows Subsystem for Linux vào bản cập nhật Windows 10 Anniversary (2/8/2016), công bố WSL 2 — một nhân Linux thật trong máy ảo nhẹ — vào tháng 5/2019 và phát hành nó cùng Windows 10 bản 2004 năm 2020. Cũng năm 2019, Apple đặt zsh làm shell mặc định trên macOS Catalina, để lại phía sau bash 3.2 cũ (bài 0.3 giải thích vì sao điều đó quan trọng với script của bạn).</p>

<h3>Cây họ: Mac là “anh em họ”, Linux là “con nuôi”</h3>
${slide('lx-00', 6, 'Cây họ Unix: Mac là “anh em họ”, Linux là “con nuôi”')}
<p>Từ năm 1969 tách ra hai nhánh. Một nhánh mang mã nguồn Unix thật: Unix → BSD → FreeBSD → Darwin, lõi của macOS và iOS (“dựa trên 4.4BSD-Lite2 và FreeBSD”). Đó là lý do một máy Mac trông rất quen trong terminal. Nhánh kia chung <em>ý tưởng</em> nhưng không chung dòng mã nào: Andrew Tanenbaum viết Minix (1987) như một bản sao Unix để dạy học, Torvalds phát triển Linux thời đầu trên một máy chạy Minix, và viết kernel từ con số không. Vì thế Linux là “giống Unix” (Unix-like), không phải Unix. Ghép kernel Linux với bộ công cụ GNU là ra thứ người ta gọi là Linux (FSF thích gọi là “GNU/Linux” — cả hai tên đều được dùng). Từ đó sinh ra các bản phân phối bạn sẽ gặp: Debian và Ubuntu, Red Hat và Fedora, Alpine trong các ảnh Docker, và các nhân nằm trong Android và WSL 2.</p>

<h3>Vì sao nó ra đời — triết lý Unix</h3>
<p>Unix là phản ứng trước việc Multics quá đồ sộ. Những người thiết kế cố tình giữ mọi thứ nhỏ, và năm 1978 Doug McIlroy viết ý tưởng đó ra: “Hãy làm cho mỗi chương trình làm tốt một việc.” Về sau Peter Salus tóm lại trong ba câu: “Viết chương trình làm một việc và làm giỏi. Viết chương trình để phối hợp với nhau. Viết chương trình xử lý dòng văn bản, vì đó là giao diện chung.” Bạn cảm được nó trong một dòng lệnh. Bốn chương trình riêng biệt, không cái nào biết những cái kia tồn tại, cùng đếm xem tên shell nào xuất hiện nhiều nhất trong một danh sách:</p>
<pre><code class="language-bash">printf "linux\\nbash\\nlinux\\nzsh\\nlinux\\nbash\\n" | sort | uniq -c | sort -rn</code></pre>
<div class="out">      3 linux
      2 bash
      1 zsh</div>
<p><code>printf</code> in ra sáu dòng, <code>sort</code> xếp các dòng giống nhau đứng cạnh nhau, <code>uniq -c</code> đếm những dòng liền kề giống nhau, <code>sort -rn</code> đưa số lớn nhất lên đầu. Chẳng ai viết sẵn công cụ “đếm từ”; bạn vừa tự dựng một cái. Thay <code>printf</code> bằng file log thật của máy chủ web là bạn có đúng lệnh đầu tiên mà mọi kỹ sư chạy khi có sự cố — Chương 3 dạy từng mảnh của nó.</p>

<h3>Dùng để làm gì — những việc cụ thể</h3>
<table>
  <tr><th>Ở đâu</th><th>Linux và shell làm gì ở đó</th><th>Trong khoá này</th></tr>
  <tr><td>Máy chủ web và VPS</td><td>Chạy nginx, Node.js, PostgreSQL; bạn quản lý qua SSH mà không hề có màn hình</td><td>Ch 9–12</td></tr>
  <tr><td>Docker và điện toán đám mây</td><td>Mọi container Linux dùng nhân Linux; máy trên cloud mặc định là Linux</td><td>Ch 5, 14 · <code>/courses/docker</code></td></tr>
  <tr><td>CI/CD</td><td>Máy chạy <code>ubuntu-latest</code> của GitHub Actions thực thi các bước <code>run:</code> của bạn bằng bash</td><td>Ch 6–7 · <code>/courses/github-actions</code></td></tr>
  <tr><td>AI và máy GPU</td><td>Máy huấn luyện và phục vụ model chạy Linux; bạn điều khiển chúng từ terminal</td><td>Ch 5, 10, 14</td></tr>
  <tr><td>Điện thoại và thiết bị</td><td>Android, router (OpenWrt), Raspberry Pi, robot, TV thông minh</td><td>Ch 1–2 (cùng một hệ thống file)</td></tr>
  <tr><td>Chính laptop của bạn</td><td>Đổi tên 4.000 file, tìm trong log, tự động hoá phần nhàm chán của đồ án</td><td>Ch 2–3, 6–7</td></tr>
</table>

<h3>Có thật sự quan trọng không? Nhìn con số</h3>
${slide('lx-00', 7, 'Linux chạy phần lớn Internet — con số có nguồn')}
<table>
  <tr><th>Con số</th><th>Đo cái gì</th><th>Nguồn và thời điểm</th></tr>
  <tr><td><strong>92,1%</strong></td><td>Số website (trong những site biết được hệ điều hành) chạy hệ họ Unix; 62,6% xác định được là Linux (phần còn lại không để lộ mình chạy hệ giống Unix nào)</td><td>W3Techs, 28/09/2026</td></tr>
  <tr><td><strong>500 trên 500</strong></td><td>Siêu máy tính trong danh sách TOP500 chạy Linux — mọi danh sách từ 11/2017 tới 06/2026</td><td>TOP500, danh sách tháng 6/2026</td></tr>
  <tr><td><strong>48,7%</strong></td><td>Lập trình viên đã làm việc nhiều với Bash/Shell trong năm — ngôn ngữ dùng nhiều thứ năm, trên cả TypeScript</td><td>Khảo sát lập trình viên Stack Overflow 2025</td></tr>
  <tr><td><strong>27,7% · 16,8%</strong></td><td>Lập trình viên có hệ điều hành làm việc chính là Ubuntu · WSL (macOS 32,9%, Windows 49,5%)</td><td>Khảo sát Stack Overflow 2025</td></tr>
</table>
<p>Đọc kỹ dòng cuối: một nửa lập trình viên chuyên nghiệp làm việc trên Windows, một phần ba trên macOS — và họ vẫn cần Linux, vì thứ họ làm ra chạy trên nó. Đó là lý do khoá này cứ nhắc “trên macOS thì khác” và “trên WSL thì làm thế này”.</p>

<h3>Nó giúp gì cho chính BẠN</h3>
${slide('lx-00', 8, 'Học Linux giúp gì cho BẠN — bốn chỗ dùng ngay')}
<div class="kv-grid">
  <div class="kv"><span class="k">🎓 Đồ án nhóm</span><span class="v">Đồ án kiểu SWP391 kết thúc bằng “deploy lên VPS”. Học xong khoá này bạn tự SSH vào, đọc log, khởi động lại dịch vụ và biết vì sao đĩa đầy — thay vì chờ đúng một bạn “biết Linux” lúc 2 giờ sáng trước buổi demo.</span></div>
  <div class="kv"><span class="k">💼 Thực tập và phỏng vấn</span><span class="v">Câu hỏi hay gặp: <code>chmod 755</code> nghĩa là gì? Làm sao tìm ra cái gì đang giữ cổng 3000? <code>df</code> và <code>du</code> khác nhau thế nào? Tìm lỗi trong một file log 2 GB ra sao? Tiến trình khác luồng chỗ nào, <code>kill -9</code> gửi đi cái gì? Câu nào cũng có một chương.</span></div>
  <div class="kv"><span class="k">🛠 Backend, DevOps, AI</span><span class="v">Docker, CI, máy cloud và máy GPU đều là Linux. Một máy chủ không có màn hình: terminal là toàn bộ giao diện của nó.</span></div>
  <div class="kv"><span class="k">💻 Cả Mac và Windows</span><span class="v">macOS là anh em họ của Unix, dùng zsh; Windows có WSL 2 (nhân Linux thật) và Git Bash. Học một lần, dùng được cả ba nơi — Chương 15 đi sâu vào những chỗ khác nhau.</span></div>
</div>

<h3>Khoá này đưa bạn tới đâu: 17 phần</h3>
<p>Mục 0 (bạn đang ở đây) → Chương 1–3: đi lại trong máy, file, văn bản và ống dẫn → Chương 4–5: quyền, tiến trình và tín hiệu → Chương 6–8: shell như một ngôn ngữ, script cho production, môi trường → Chương 9–12: mạng và SSH, đĩa và log, systemd và cron, chẩn đoán một máy chủ thật → Chương 13–16, bổ sung năm 2026: Bash nâng cao, Linux chuyên sâu (nhân, hiệu năng, lưu trữ, bảo mật), dùng kỹ năng Linux trên macOS và Windows, và một dự án cuối khoá nơi bạn tự dựng, tự động hoá và vận hành một máy chủ thật. Bài 0.1 có bản đồ đầy đủ.</p>

<div class="pitfall co-tieu-de"><strong>Hai ý nghĩ làm người mới vấp.</strong> Thứ nhất: “Mac của mình cũng gần như Linux rồi.” Nó là Unix — một người anh em họ gần — nhưng kernel, bộ lệnh lõi và shell mặc định đều khác, và script chép qua lại giữa hai bên hỏng theo những kiểu nhỏ, khó hiểu (bài 0.3 cho bạn xem lỗi thật). Thứ hai: “Mình sẽ học Linux bằng cách đọc.” Sẽ không được đâu. Mọi bài ở đây đều có lệnh và một khối 🧪 thực hành; hiểu biết đến từ việc gõ chúng, gặp lỗi, và đọc cái lỗi đó. Vì thế bài 0.3 đưa bạn một cái máy mà bạn được phép phá.</div>

<h3>🧪 Thực hành (10 phút — chắc chắn làm được)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> khoá học mới, vở mới. Mở một terminal (Mac: ứng dụng Terminal; Windows: ứng dụng “Ubuntu” nếu đã cài WSL, chưa có thì làm phần này sau bài 0.3; Linux: terminal nào cũng được) và tạo thư mục sân tập mà cả khoá sẽ dùng.</p><ol>
<li>Hỏi máy xem nó là ai, là gì: <code>whoami</code>, rồi <code>uname -srm</code>. Kernel nào trả lời — Linux hay Darwin?</li>
<li>Hỏi xem bạn đang nói chuyện với shell nào: <code>echo $SHELL</code> và <code>ps -p $$ -o comm=</code>.</li>
<li>Tạo sân tập của khoá và bước vào: <code>mkdir -p ~/thu-linux &amp;&amp; cd ~/thu-linux</code>, rồi <code>pwd</code>.</li>
<li>Viết file đầu tiên bằng shell rồi đọc lại (khối bên dưới).</li>
<li>Dựng ống dẫn đầu tiên: đếm các dòng của <code>shell.txt</code> bằng <code>sort | uniq -c | sort -rn</code>.</li></ol>
<pre><code class="language-bash">printf "Tên: An\\nMáy: %s\\nShell: %s\\n" "$(uname -s)" "$(basename "$SHELL")" &gt; gioi-thieu.txt
cat gioi-thieu.txt
printf "linux\\nbash\\nlinux\\nzsh\\nlinux\\nbash\\n" &gt; shell.txt
sort shell.txt | uniq -c | sort -rn</code></pre>
<div class="out">Tên: An
Máy: Linux
Shell: bash
      3 linux
      2 bash
      1 zsh</div>
<p>Output thật từ container Ubuntu 24.04 của khoá. Trên Mac dòng thứ hai là <code>Máy: Darwin</code> và dòng thứ ba là <code>Shell: zsh</code> — cả hai đều đúng.</p>
<p><strong>Đạt khi:</strong> <code>~/thu-linux</code> tồn tại và chứa <code>gioi-thieu.txt</code> với <code>shell.txt</code>, ống dẫn in <code>3 linux</code> ở dòng đầu, và bạn nói được trong một câu lớp nào trong bốn lớp (terminal, shell, chương trình, kernel) đã trả lời ở bước 1 và bước 2.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Kernel (nhân)</span><span class="v">Lõi của hệ điều hành, phần mềm duy nhất nói chuyện trực tiếp với phần cứng. Nói cho đúng, “Linux” là cái này.</span></div>
  <div class="kv"><span class="k">Distribution (bản phân phối, distro)</span><span class="v">Kernel cộng công cụ, trình quản lý gói và cấu hình mặc định, phát hành cùng nhau: Ubuntu, Fedora, Debian, Alpine.</span></div>
  <div class="kv"><span class="k">Shell (trình thông dịch lệnh)</span><span class="v">Chương trình đọc lệnh bạn gõ và khởi động các chương trình khác: bash, zsh.</span></div>
  <div class="kv"><span class="k">Terminal (trình giả lập terminal)</span><span class="v">Ứng dụng cửa sổ hiện chữ và gửi phím bạn gõ tới shell.</span></div>
  <div class="kv"><span class="k">Command line (dòng lệnh)</span><span class="v">Cách làm việc bằng gõ lệnh thay vì bấm chuột.</span></div>
  <div class="kv"><span class="k">GNU / coreutils (bộ lệnh lõi)</span><span class="v">Dự án phần mềm tự do đã viết bash và các lệnh cơ bản (<code>ls</code>, <code>cp</code>, <code>sort</code>…) dùng trên Linux.</span></div>
  <div class="kv"><span class="k">Unix-like (giống Unix)</span><span class="v">Cư xử như Unix nhưng không chứa mã Unix — Linux là ví dụ nổi tiếng nhất.</span></div>
  <div class="kv"><span class="k">POSIX (tiêu chuẩn chung)</span><span class="v">Tiêu chuẩn năm 1988 mô tả hệ giống Unix và shell của nó phải cư xử thế nào, để script chạy được ở mọi nơi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bạn gõ vào terminal, shell diễn giải, chương trình làm việc, kernel chạm vào phần cứng — bốn lớp, bốn thứ khác nhau.</li>
<li>“Linux” nói đúng là kernel; Ubuntu, Fedora và các bạn của chúng là bản phân phối, thêm công cụ GNU, một shell và trình quản lý gói.</li>
<li>Unix ra đời ở Bell Labs năm 1969; ống dẫn có năm 1973, Bourne shell năm 1979, bash năm 1989 và Linux năm 1991 — có bash đi cùng ngay từ ngày đầu.</li>
<li>macOS là hậu duệ của BSD Unix, Linux chỉ bắt chước Unix; vì thế lệnh hai bên trông giống nhau nhưng khác ở chi tiết.</li>
<li>Triết lý Unix — chương trình nhỏ, nối bằng ống, nói bằng văn bản — là lý do một ống dẫn một dòng thay được một công cụ chưa ai viết.</li>
<li>92,1% website, cả 500 siêu máy tính hàng đầu, máy chạy CI và Android đều thuộc họ Unix; biết shell sinh lời ở đồ án, phỏng vấn và mọi công việc backend, DevOps hay AI.</li>
</ul>

<a class="link-card" href="https://en.wikipedia.org/wiki/History_of_Unix" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Lịch sử Unix — Wikipedia</span><span class="lc-sub">Multics, máy PDP-7, cuốn sách hướng dẫn 1971, việc viết lại bằng C, Unix bản 7 và POSIX, có dẫn tới tài liệu gốc.</span></span>
</a>
<a class="link-card" href="https://www.cs.cmu.edu/~awb/linux.history.html" target="_blank" rel="noopener">
  <span class="lc-ico">✉️</span>
  <span class="lc-body"><span class="lc-title">Những thư đầu tiên của Linus Torvalds về Linux (1991)</span><span class="lc-sub">Nguyên văn bức thư “just a hobby” ngày 25/8/1991, có cả câu “I’ve currently ported bash(1.08)”.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/History_of_Linux" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Lịch sử Linux — Wikipedia</span><span class="lc-sub">Từ bản 0.01 qua lần chuyển sang GPL, Linux 1.0 và những bản phân phối đầu tiên.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Bash_(Unix_shell)" target="_blank" rel="noopener">
  <span class="lc-ico">🐚</span>
  <span class="lc-body"><span class="lc-title">Bash (Unix shell) — Wikipedia</span><span class="lc-sub">Brian Fox, 8/6/1989, lịch sử giấy phép (GPLv2 tới bản 3.2, GPLv3 từ 4.0) và bản 5.3 hiện tại.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Unix_philosophy" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Triết lý Unix — McIlroy 1978 và Salus 1994</span><span class="lc-sub">Những câu nằm sau ống dẫn và các công cụ nhỏ.</span></span>
</a>
<a class="link-card" href="https://w3techs.com/technologies/details/os-linux" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">W3Techs — tỉ lệ website chạy Linux</span><span class="lc-sub">Cập nhật mỗi ngày: Unix 92,1%, Linux 62,6% vào ngày 28/09/2026.</span></span>
</a>
<a class="link-card" href="https://www.top500.org/statistics/details/osfam/1/" target="_blank" rel="noopener">
  <span class="lc-ico">🖥</span>
  <span class="lc-body"><span class="lc-title">TOP500 — tỉ lệ Linux trong các siêu máy tính nhanh nhất</span><span class="lc-sub">Biểu đồ đứng yên ở 500/500 từ tháng 11/2017.</span></span>
</a>
<a class="link-card" href="https://survey.stackoverflow.co/2025/technology" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Khảo sát lập trình viên Stack Overflow 2025 — Công nghệ</span><span class="lc-sub">Ngôn ngữ (Bash/Shell 48,7%) và hệ điều hành mà lập trình viên thật sự làm việc trên đó.</span></span>
</a>
<p class="note-ct"><strong>Tiếp theo:</strong> “Bắt đầu tại đây (2/2)” — những sự cố thật gây ra bởi việc không hiểu một dòng shell, cái nào cũng đã đối chiếu nguồn, và một cách học khoá này không khiến bạn bỏ cuộc ngay tuần đầu.</p>
</div>
`,
    },

    /* ─────────────────── 0.6 · BẮT ĐẦU TẠI ĐÂY (2/2) ─────────────────── */
    {
      title: 'Start here (2/2) — Life without it: real disasters, and how to learn without giving up|||Bắt đầu tại đây (2/2) — Khi không biết nó: những sự cố thật, và cách học để không bỏ cuộc',
      slug: 'lnx-0-6-bat-dau-khi-khong-co',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Năm sự cố có thật và kiểm được (Steam xoá sạch máy người dùng 2015, Bumblebee xoá /usr 2011, GitLab mất dữ liệu 2017, AWS S3 sập 2017, Shellshock 2014) cùng những sự cố thật của một dự án sinh viên — mỗi cái: chuyện gì, hậu quả, biết Linux thì ngăn thế nào, học ở chương nào; rồi cách học không nản: đọc thông báo lỗi, tra cứu, hỏi khi bí, mẹo cho người yếu tiếng Anh và lộ trình 2 tuần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>Life without it — real disasters, and how to learn this without giving up</h2>
<p class="lead">The previous lesson told you what Linux and the shell are. This one shows what happens when people use them without understanding them. Every story below either comes with a public source you can read — a bug report, an official post-mortem, a CVE — or is a real incident from one student project, told as it happened. None of them is here to scare you. Each one ends with the same two questions: what one piece of knowledge would have prevented it, and in which chapter of this course do you learn it? The second half of the lesson is about you: why beginners quit the command line, and a way of studying that keeps you going.</p>

<h3>Steam, 2015: one empty variable deleted a user's whole home</h3>
${slide('lx-00', 9, 'Steam 2015: một biến RỖNG biến rm thành “xoá cả máy”')}
<p>In January 2015 a Linux user moved Steam's folder (<code>~/.local/share/Steam</code>) to another drive and left a symlink behind. Steam failed to start, reinstalled itself — and then, in the reporter's words, "deleted everything owned by my user recursively from the root directory. Including my 3tb external drive I back everything up to that was mounted under /media." The bug report, <em>valvesoftware/steam-for-linux</em> issue #3671, is still public. Readers of Valve's script <code>steam.sh</code> quickly found the line, with a comment above it that became famous — <code># Scary!</code>:</p>
<pre><code class="language-bash">rm -rf "$STEAMROOT/"*</code></pre>
<p>The script had computed <code>STEAMROOT</code> from the location of the Steam folder. After the move, that computation produced an empty string. The shell does not care: it substitutes whatever the variable holds. With <code>STEAMROOT</code> empty, <code>"$STEAMROOT/"*</code> becomes <code>/*</code> — every top-level directory on the machine. You can watch this happen safely, with <code>echo</code> in front so nothing is deleted, in the course container:</p>
<pre><code class="language-bash">cd /
STEAMROOT=""
echo rm -rf "$STEAMROOT/"*</code></pre>
<div class="out">rm -rf /bin /bin.usr-is-merged /boot /dev /etc /home /lib /media /mnt /opt /proc /root /run /sbin /sbin.usr-is-merged /srv /sys /tmp /usr /var</div>
<p>Chapters 6 and 7 teach two lines of defence, and it matters which one fits. <code>set -u</code> makes the shell refuse a variable that was <em>never set</em> — it catches a misspelled name. <code>\${VAR:?message}</code> refuses a variable that is <em>unset or empty</em>. Watch all three cases (the first two run with <code>set -u</code> switched on):</p>
<pre><code class="language-bash">bash -uc 'echo rm -rf "$STEAMROOT/"*'
bash -uc 'STEAMROOT=""; echo rm -rf "$STEAMROOT/"*'
bash -c 'STEAMROOT=""; echo rm -rf "\${STEAMROOT:?chua dat STEAMROOT}/"*'</code></pre>
<div class="out">bash: line 1: STEAMROOT: unbound variable
rm -rf /bin /bin.usr-is-merged /boot /dev /etc /home /lib /media /mnt …
bash: line 1: STEAMROOT: chua dat STEAMROOT</div>
<p>Read the middle line twice. In Steam's case the variable <em>was</em> set — to an empty string — so <code>set -u</code> alone would not have saved that user. <code>\${STEAMROOT:?}</code> would: it stops with an error before <code>rm</code> ever runs. That is the whole difference between a script that fails loudly and one that fails by destroying your files, and it is why Chapter 7 uses both.</p>

<h3>Four more real incidents — checked against their sources</h3>
${slide('lx-00', 10, 'Bốn sự cố thật — mỗi cái dạy một thói quen')}
<p><strong>Bumblebee, 24 May 2011 — one extra space.</strong> The install script of Bumblebee, a Linux graphics-switching project, contained this line (issue #123 on GitHub):</p>
<pre><code class="language-bash">rm -rf /usr /lib/nvidia-current/xorg/xorg</code></pre>
<p>The author meant <code>/usr/lib/nvidia-current/xorg/xorg</code>. A single space turned one path into two, and the shell splits words on spaces before <code>rm</code> sees anything. Here is exactly what <code>rm</code> received — <code>printf</code> prints each argument in brackets:</p>
<pre><code class="language-bash">printf "[%s]\\n" rm -rf /usr /lib/nvidia-current/xorg/xorg</code></pre>
<div class="out">[rm]
[-rf]
[/usr]
[/lib/nvidia-current/xorg/xorg]</div>
<p>The reporter: "The script deletes everything under /usr. I just had to reinstall linux on my pc to recover." How the shell splits a line into words is Chapter 6; reading a destructive line argument by argument before running it is a habit from lesson 0.4.</p>
<p><strong>GitLab.com, 31 January 2017 — the right command on the wrong machine.</strong> During a database replication problem, an engineer ran a deletion of the database directory on the <em>primary</em> server, db1, instead of the secondary, db2. According to GitLab's official post-mortem he stopped it "a second or two after noticing" — by then about 300 GB were gone. The backups failed as well: <code>pg_dump</code> was version 9.2 against a 9.6 database and had been failing silently, the S3 backup bucket was empty, and the failure emails had been rejected. GitLab restored from a snapshot taken six hours earlier; database changes from roughly 17:20 to 00:00 UTC — around 5,000 projects, 5,000 comments and 700 new user accounts — were lost. Lessons for you: always know which machine a terminal is on (a clear prompt with the hostname — Chapters 8 and 9), and check that your backups actually restore (Chapter 10).</p>
<p><strong>Amazon S3, 28 February 2017 — one wrong input.</strong> Amazon's own summary says an engineer, following an established playbook, "executed a command which was intended to remove a small number of servers", but "one of the inputs to the command was entered incorrectly and a larger set of servers was removed than intended". S3 in the us-east-1 region was disrupted for about four and a half hours, taking many websites with it. Amazon changed the tool to remove capacity more slowly and to refuse to go below a safe minimum. The same idea applies to your own scripts: validate arguments and show what will happen before doing it (Chapter 7).</p>
<p><strong>Shellshock, disclosed 24 September 2014 — a bug in bash itself.</strong> Stéphane Chazelas found that bash executed commands hidden in an environment variable that looked like a function definition — a bug present since bash 1.03 in 1989 (CVE-2014-6271). Because web servers passed request data to CGI scripts through environment variables, attackers could run commands on servers by sending one crafted header; security firms recorded millions of probes within days. The famous test line is harmless on a patched system:</p>
<pre><code class="language-bash">env x='() { :;}; echo vulnerable' bash -c "echo this is a test"</code></pre>
<div class="out">this is a test</div>
<p>That is the output on the course's Ubuntu 24.04 (bash 5.2.21). A vulnerable bash would print <code>vulnerable</code> first. Lesson: keep packages updated (<code>apt</code>, Chapter 10) — the tools you trust most are software too.</p>

<h3>Real incidents from one student project</h3>
${slide('lx-00', 11, 'Sự cố của một dự án sinh viên — chuyện thật, lệnh thật')}
<p>The next stories come from one real student project: a Next.js + Express + PostgreSQL site running in Docker Compose on a single Ubuntu VPS, deployed by a long bash script. Nobody in them was careless; each time the knowledge was simply missing.</p>
<table>
  <tr><th>What happened</th><th>Consequence</th><th>What knowing Linux changes</th><th>Chapter</th></tr>
  <tr><td>A deploy filled the disk with 7.6 GB of build cache</td><td>PostgreSQL died in the middle of the deploy</td><td><code>df -h</code> to see a full disk, <code>du -xh -d1</code> / <code>ncdu</code> to find what filled it, and cleaning up before it happens</td><td>10</td></tr>
  <tr><td><code>PasswordAuthentication no</code> added to an SSH config file</td><td>Password login stayed ON</td><td>Another file, <code>50-cloud-init.conf</code>, was read first, and for sshd the first value wins; check the effective value with <code>sshd -T</code>, not by <code>cat</code>-ing the file you wrote</td><td>11</td></tr>
  <tr><td><code>Port 993</code> added to <code>sshd_config</code></td><td>No effect at all</td><td>On Ubuntu 24.04, <code>ssh.socket</code> (systemd socket activation) owns the port; check with <code>systemctl is-enabled ssh.socket</code></td><td>11</td></tr>
  <tr><td>A config file replaced with <code>mv</code></td><td>The container kept reading the OLD file</td><td>A bind-mounted single file is tied to its inode; <code>mv</code> and <code>sed -i</code> create a new inode — overwrite in place instead</td><td>2</td></tr>
  <tr><td><code>pkill -f "next start"</code> matched nothing</td><td>The old server kept the port; the new one died</td><td>The process had renamed itself <code>next-server</code>; find it by port with <code>lsof -ti:3000</code></td><td>5</td></tr>
  <tr><td>A script written for the VPS run on a Mac</td><td>Errors about <code>timeout</code> and <code>grep</code></td><td>macOS has bash 3.2, no <code>timeout</code>, BSD <code>grep</code></td><td>15</td></tr>
  <tr><td>A scheduled job in a container ran 7 hours off</td><td>Reports arrived at the wrong time</td><td>Containers default to UTC, the machine is +07</td><td>11</td></tr>
</table>

<h3>Illustrative situations — probably your team</h3>
<p>These are not from a public report; they are the kind of thing that happens in every group project. The outputs are real, from the course container.</p>
<p><strong>"It works on my machine" — the Windows line ending.</strong> A teammate writes a script in Notepad on Windows and pushes it. The four-line test file below has a <code>#!/bin/bash</code> line, an empty line, <code>echo xin chao</code> and <code>cd /tmp</code>. On Linux it fails in three different ways:</p>
<pre><code class="language-bash">bash crlf.sh
./crlf.sh
file crlf.sh</code></pre>
<div class="out">crlf.sh: line 2: $'\\r': command not found
xin chao
crlf.sh: line 4: cd: $'/tmp\\r': No such file or directory
bash: line 1: ./crlf.sh: cannot execute: required file not found
crlf.sh: Bourne-Again shell script, ASCII text executable, with CRLF line terminators</div>
<p>Windows ends lines with two characters (<code>\\r\\n</code>), Linux with one (<code>\\n</code>). Bash sees the invisible <code>\\r</code> as part of each word — even the <code>#!/bin/bash</code> line, which is why running the file directly says "required file not found". Fix: save with LF line endings in VS Code, or <code>sed -i 's/\\r$//' crlf.sh</code> (Chapters 8 and 15).</p>
<p><strong>"The deploy printed nothing and did nothing."</strong> A script line <code>cd /srv/app &amp;&amp; git pull &amp;&amp; npm run build</code> fails at the first step because the folder is <code>/srv/apps</code>. With <code>&amp;&amp;</code> every following step is skipped — which is what you want, but only if someone reads the error. With <code>;</code> instead, <code>git pull</code> would have run in whatever directory the script happened to be in. Chapter 6 covers exit codes and <code>&amp;&amp;</code>/<code>||</code>.</p>

<h3>Why beginners give up on the command line</h3>
${slide('lx-00', 12, 'Vì sao người mới bỏ cuộc — và cách chữa từng lý do')}
<ul>
<li><strong>The black screen is frightening.</strong> No buttons, no hints, and the fear that one wrong key will break the computer. <em>Cure:</em> a machine you are allowed to break. Lesson 0.3 gives you a Docker container: break it, type <code>exit</code>, and a fresh one starts in about a second and a half.</li>
<li><strong>Every error is in English.</strong> <em>Cure:</em> errors in this course are explained word by word, each lesson has a 🗂 box with English terms and their Vietnamese meaning, and the table below covers the dozen error messages you will see most.</li>
<li><strong>Memorising commands instead of understanding them.</strong> It works until the situation changes slightly. <em>Cure:</em> learn the model — files, processes, streams, permissions — and about forty commands; look everything else up in seconds (lesson 0.4).</li>
<li><strong>A week of theory and nothing to show.</strong> <em>Cure:</em> every lesson ends with a 🧪 task you can finish in 15–20 minutes, with a "Done when" line so you know you succeeded.</li>
<li><strong>Stuck on one error for two hours.</strong> <em>Cure:</em> the 20-minute rule below.</li>
</ul>

<h3>Reading an error message — four parts</h3>
${slide('lx-00', 13, 'Đọc thông báo lỗi: AI kêu · kêu về CÁI GÌ · VÌ SAO · mã thoát')}
<p>Error messages on Linux follow a pattern: <strong>who is complaining</strong>, <strong>about what</strong>, <strong>why</strong> — and, invisibly, an exit code. Real output from the course container:</p>
<pre><code class="language-bash">sl
echo $?
ls khong-co
echo $?
./ghi-chu.txt
echo $?</code></pre>
<div class="out">bash: sl: command not found
127
ls: cannot access 'khong-co': No such file or directory
2
bash: ./ghi-chu.txt: Permission denied
126</div>
<p>Read the first word. <code>bash:</code> means the shell could not even start the program — it did not find it (<code>127</code>) or was not allowed to execute it (<code>126</code>). <code>ls:</code> means the program ran and then complained. The middle part repeats what you typed — very often it reveals a typo (<code>sl</code> instead of <code>ls</code>). The last part is the reason. <code>$?</code> holds the exit code of the last command: <code>0</code> means success, anything else is a failure, and Chapter 6 builds on this.</p>
<table>
  <tr><th>Message (real, Ubuntu 24.04)</th><th>What it means</th><th>First thing to check</th></tr>
  <tr><td><code>command not found</code></td><td>No program with that name in your <code>PATH</code></td><td>Spelling; is it installed? (Ch 8, 10)</td></tr>
  <tr><td><code>No such file or directory</code></td><td>The path does not exist</td><td><code>pwd</code>, then <code>ls</code> the parent folder</td></tr>
  <tr><td><code>Permission denied</code></td><td>You lack r, w or x on the file</td><td><code>ls -l</code> — do not jump to <code>sudo</code> (Ch 4)</td></tr>
  <tr><td><code>Operation not permitted</code></td><td>Even the right permission would not allow it (e.g. killing another user's process)</td><td>Who owns it? (Ch 4, 5)</td></tr>
  <tr><td><code>Not a directory</code> / <code>Is a directory</code></td><td>You used a file as a folder, or the reverse</td><td><code>ls -l</code> the path</td></tr>
  <tr><td><code>File exists</code></td><td><code>mkdir</code> on a name that already exists</td><td><code>mkdir -p</code> if that is fine</td></tr>
  <tr><td><code>Directory not empty</code></td><td><code>rmdir</code> only removes empty folders</td><td>Look inside before deleting</td></tr>
  <tr><td><code>unbound variable</code></td><td><code>set -u</code> caught a variable that was never set</td><td>Spelling of the variable (Ch 6–7)</td></tr>
  <tr><td><code>syntax error near unexpected token</code></td><td>The shell could not parse the line — often a missing <code>;</code> or <code>then</code></td><td>The token it names, and the line before (Ch 6)</td></tr>
  <tr><td><code>Couldn't connect to server</code></td><td>Nothing listens on that port</td><td>Is the service running? <code>ss -ltn</code> (Ch 9)</td></tr>
</table>

<h3>When you are stuck: look it up, then ask</h3>
<ol>
<li><strong>Look it up in the machine</strong> (lesson 0.4): <code>command --help | grep -i word</code>, <code>man command</code>, <code>help cd</code> for shell builtins, <code>tldr command</code> for examples.</li>
<li><strong>Take a long command apart</strong>: paste it into explainshell.com, or run it one pipe stage at a time.</li>
<li><strong>Search the exact error text</strong> in quotes, without your own file names in it.</li>
<li><strong>The 20-minute rule:</strong> if you have made no progress for 20 minutes, ask. Write four lines: your machine (<code>uname -srm</code>), the exact command, the exact error (copied as text, not a blurry photo), and what you already tried. Half the time, writing those four lines shows you the answer.</li>
<li><strong>Check a script before running it</strong>: shellcheck.net points out the empty-variable and quoting mistakes behind the Steam and Bumblebee stories.</li>
</ol>

<h3>For learners who find English hard</h3>
<ul>
<li>Commands are English abbreviations. Say them in full once and they stick: <code>ls</code> = list, <code>cd</code> = change directory, <code>pwd</code> = print working directory, <code>mkdir</code> = make directory, <code>rm</code> = remove, <code>grep</code> = global regular expression print.</li>
<li>Keep your own glossary in <code>~/thu-linux/meo.txt</code>: one line per command, with a Vietnamese note.</li>
<li>You do not need to read a whole man page. Search it: <code>/</code> then the word, <code>n</code> for the next match, <code>q</code> to quit.</li>
<li>Translating an error is fine — but keep the original error text when you search or ask; the English words are what search engines match.</li>
</ul>

<h3>A minimum route and a full route</h3>
${slide('lx-00', 14, 'Lộ trình: 2 tuần để tự tin, 17 phần để thành thạo')}
<table>
  <tr><th>Route</th><th>What to study</th><th>You can then…</th></tr>
  <tr><td><strong>Minimum — 2 weeks</strong>, about an hour a day</td><td>Section 0, Chapters 1–7</td><td>move around any machine, find and filter files and logs, fix "Permission denied", kill the right process, and write a script with <code>set -euo pipefail</code></td></tr>
  <tr><td><strong>For the group project</strong>, +1–2 weeks</td><td>Chapters 8–12</td><td>SSH into the VPS, read logs, run the app as a systemd service, and diagnose a full disk or a busy port</td></tr>
  <tr><td><strong>Full — 17 parts</strong></td><td>Chapters 13–16</td><td>advanced Bash, the kernel and performance, macOS/Windows differences, and a capstone server you build and run yourself</td></tr>
</table>
<p><strong>The rhythm of one sitting (about 60 minutes):</strong> look at the lesson's slides (5 min) → read the lesson and <em>type</em> every command yourself, do not paste (25 min) → do the 🧪 task (15–20 min) → write three commands you learned into <code>meo.txt</code> (5 min). At the end of a chapter, take its quiz and read the explanations, even for the questions you got right.</p>
<p><strong>Milestones worth celebrating:</strong> the first pipe you wrote yourself; the first "Permission denied" you fixed without <code>sudo</code>; the first script that stopped itself with <code>set -u</code> instead of doing damage; the first time you SSH-ed into a server and found out why it was slow.</p>

<div class="pitfall co-tieu-de"><strong>Do not learn the wrong lesson from these stories.</strong> The lesson is not "the terminal is dangerous, stay away". Every incident above happened to experienced people, and every one of them is prevented by a small, learnable habit: quote your variables, stop on empty ones, read a destructive line argument by argument, know which machine you are on, keep packages updated. The people who never make these mistakes are not braver — they practised on machines where mistakes cost nothing. That is exactly what the next lessons set up for you.</div>

<h3>🧪 Practice (10 minutes — your first errors, on purpose)</h3>
<div class="callout ok"><p><strong>Situation:</strong> you want to stop being afraid of error messages. Produce four of them on purpose, safely, and read each one.</p><ol>
<li>In <code>~/thu-linux</code>, type a command that does not exist: <code>sl</code>, then <code>echo $?</code>. Who complained, and what was the code?</li>
<li><code>ls khong-co</code>, then <code>echo $?</code>. Who complained this time — the shell or the program?</li>
<li>Recreate the Steam bug <strong>with <code>echo</code></strong> — never without it: <code>cd / ; STEAMROOT="" ; echo rm -rf "$STEAMROOT/"*</code>. Read the list it would have deleted.</li>
<li>Try to stop it two ways: <code>bash -uc 'STEAMROOT=""; echo rm -rf "$STEAMROOT/"*'</code> (does <code>set -u</code> stop it?), then <code>bash -c 'STEAMROOT=""; echo rm -rf "\${STEAMROOT:?}/"*'</code>. Note which one printed an error.</li>
<li><code>cd ~/thu-linux</code> and add the four error messages to <code>meo.txt</code>, each with one Vietnamese sentence explaining it.</li></ol>
<p><strong>Done when:</strong> you can explain why <code>sl</code> gives <code>127</code> but <code>ls khong-co</code> gives <code>2</code>, you have seen the list starting <code>rm -rf /bin …</code> without anything being deleted, you can say why <code>set -u</code> did NOT stop step 4 but <code>\${STEAMROOT:?}</code> did (<code>parameter null or not set</code>), and <code>meo.txt</code> has four new lines.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Variable expansion</span><span class="v">The shell replacing <code>$NAME</code> with its value before running the command — even when the value is empty.</span></div>
  <div class="kv"><span class="k">Word splitting</span><span class="v">The shell cutting a line into separate arguments at spaces; one extra space means one extra argument.</span></div>
  <div class="kv"><span class="k">Exit code</span><span class="v">A number every command returns: 0 is success, anything else is a failure. Stored in <code>$?</code>.</span></div>
  <div class="kv"><span class="k">set -u</span><span class="v">A shell option that turns "use of an unset variable" into an error that stops the script. It does not catch a variable set to an empty string — <code>\${VAR:?}</code> does.</span></div>
  <div class="kv"><span class="k">Post-mortem</span><span class="v">A written report after an incident: what happened, why, and what changes so it does not happen again.</span></div>
  <div class="kv"><span class="k">CVE</span><span class="v">A public ID for a security vulnerability, like CVE-2014-6271 for Shellshock.</span></div>
  <div class="kv"><span class="k">CRLF / LF</span><span class="v">Line endings: Windows uses two characters (<code>\\r\\n</code>), Linux one (<code>\\n</code>). Mixing them breaks scripts.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An empty variable in <code>rm -rf "$VAR/"*</code> means <code>rm -rf /*</code>; <code>\${VAR:?}</code> stops it, while <code>set -u</code> only catches variables that were never set.</li>
<li>One extra space splits a path into two arguments — Bumblebee deleted <code>/usr</code> that way; read destructive lines argument by argument.</li>
<li>GitLab and AWS show that the right command on the wrong machine, or with one wrong input, is enough; know where you are and validate inputs.</li>
<li>Error messages have a pattern: who complains, about what, why, plus an exit code in <code>$?</code>.</li>
<li>Stuck for 20 minutes? Ask with four lines: machine, command, error, what you tried.</li>
<li>Two weeks of an hour a day covers the minimum; type every command yourself and end each sitting with a 🧪.</li>
</ul>

<a class="link-card" href="https://github.com/valvesoftware/steam-for-linux/issues/3671" target="_blank" rel="noopener">
  <span class="lc-ico">🎮</span>
  <span class="lc-body"><span class="lc-title">steam-for-linux #3671 — "It deleted everything on system owned by user"</span><span class="lc-sub">The original report (14 January 2015) and the discussion that found <code>rm -rf "$STEAMROOT/"*</code>.</span></span>
</a>
<a class="link-card" href="https://github.com/MrMEEE/bumblebee-Old-and-abbandoned/issues/123" target="_blank" rel="noopener">
  <span class="lc-ico">🐝</span>
  <span class="lc-body"><span class="lc-title">Bumblebee #123 — "install script does rm -rf /usr for ubuntu"</span><span class="lc-sub">The one-space bug of May 2011.</span></span>
</a>
<a class="link-card" href="https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/" target="_blank" rel="noopener">
  <span class="lc-ico">🦊</span>
  <span class="lc-body"><span class="lc-title">GitLab — Postmortem of database outage of January 31</span><span class="lc-sub">An unusually honest account: the wrong host, backups that had been failing silently, and what changed afterwards.</span></span>
</a>
<a class="link-card" href="https://aws.amazon.com/message/41926/" target="_blank" rel="noopener">
  <span class="lc-ico">☁️</span>
  <span class="lc-body"><span class="lc-title">Summary of the Amazon S3 Service Disruption (28 February 2017)</span><span class="lc-sub">How one mistyped input in a playbook command took down S3 in us-east-1 for hours.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Shellshock_(software_bug)" target="_blank" rel="noopener">
  <span class="lc-ico">🐚</span>
  <span class="lc-body"><span class="lc-title">Shellshock (CVE-2014-6271) — Wikipedia</span><span class="lc-sub">Discovery, the 25-year-old bug in bash, the attack vectors and the follow-up CVEs.</span></span>
</a>
<a class="link-card" href="https://www.shellcheck.net/" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">ShellCheck — find bugs in your shell scripts</span><span class="lc-sub">Paste a script and it warns about unquoted and possibly empty variables — the root of the Steam bug.</span></span>
</a>
<a class="link-card" href="https://explainshell.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">ExplainShell — every part of a command, explained</span><span class="lc-sub">For the moment a line from Stack Overflow has six flags you have never seen.</span></span>
</a>
<p class="note-ct"><strong>Next:</strong> lesson 0.1 — who this course is for, what the terminal is truly better at, and the full map of all 17 parts.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Khi không biết nó — những sự cố thật, và cách học để không bỏ cuộc</h2>
<p class="lead">Bài trước kể cho bạn Linux và shell là gì. Bài này cho bạn thấy chuyện gì xảy ra khi người ta dùng chúng mà không hiểu chúng. Mọi câu chuyện dưới đây hoặc có nguồn công khai để bạn tự đọc — một báo lỗi, một bản post-mortem chính thức, một mã CVE — hoặc là sự cố thật của một dự án sinh viên, kể đúng như đã xảy ra. Không câu chuyện nào ở đây để doạ bạn. Mỗi chuyện đều kết thúc bằng hai câu hỏi: một mẩu kiến thức nào lẽ ra đã ngăn được nó, và bạn học mẩu đó ở chương nào của khoá? Nửa sau của bài nói về chính bạn: vì sao người mới hay bỏ dòng lệnh, và một cách học giúp bạn đi tiếp.</p>

<h3>Steam, 2015: một biến rỗng xoá sạch nhà của người dùng</h3>
${slide('lx-00', 9, 'Steam 2015: một biến RỖNG biến rm thành “xoá cả máy”')}
<p>Tháng 1/2015, một người dùng Linux chuyển thư mục của Steam (<code>~/.local/share/Steam</code>) sang một ổ khác và để lại một liên kết tượng trưng (symlink). Steam không khởi động được, tự cài lại — rồi, theo lời người báo lỗi, “đã xoá đệ quy mọi thứ thuộc về user của tôi, tính từ thư mục gốc. Kể cả ổ ngoài 3 TB tôi dùng để sao lưu mọi thứ, đang gắn ở /media.” Báo lỗi đó, issue #3671 của <em>valvesoftware/steam-for-linux</em>, vẫn còn công khai. Những người đọc script <code>steam.sh</code> của Valve nhanh chóng tìm ra dòng lệnh, với một chú thích phía trên đã trở nên nổi tiếng — <code># Scary!</code> (“Đáng sợ!”):</p>
<pre><code class="language-bash">rm -rf "$STEAMROOT/"*</code></pre>
<p>Script tính <code>STEAMROOT</code> từ vị trí thư mục Steam. Sau khi thư mục bị chuyển đi, phép tính đó cho ra một chuỗi rỗng. Shell không quan tâm: nó thay vào đúng thứ biến đang giữ. Với <code>STEAMROOT</code> rỗng, <code>"$STEAMROOT/"*</code> trở thành <code>/*</code> — mọi thư mục cấp cao nhất của cả máy. Bạn có thể nhìn tận mắt chuyện này một cách an toàn, với <code>echo</code> đứng trước để không gì bị xoá, trong container của khoá:</p>
<pre><code class="language-bash">cd /
STEAMROOT=""
echo rm -rf "$STEAMROOT/"*</code></pre>
<div class="out">rm -rf /bin /bin.usr-is-merged /boot /dev /etc /home /lib /media /mnt /opt /proc /root /run /sbin /sbin.usr-is-merged /srv /sys /tmp /usr /var</div>
<p>Chương 6 và 7 dạy hai lớp phòng thủ, và dùng đúng cái nào mới quan trọng. <code>set -u</code> bắt shell từ chối một biến <em>chưa từng được đặt</em> — nó bắt được lỗi gõ sai tên biến. <code>\${VAR:?thông báo}</code> từ chối một biến <em>chưa đặt hoặc rỗng</em>. Xem cả ba trường hợp (hai lệnh đầu chạy với <code>set -u</code> đang bật):</p>
<pre><code class="language-bash">bash -uc 'echo rm -rf "$STEAMROOT/"*'
bash -uc 'STEAMROOT=""; echo rm -rf "$STEAMROOT/"*'
bash -c 'STEAMROOT=""; echo rm -rf "\${STEAMROOT:?chua dat STEAMROOT}/"*'</code></pre>
<div class="out">bash: line 1: STEAMROOT: unbound variable
rm -rf /bin /bin.usr-is-merged /boot /dev /etc /home /lib /media /mnt …
bash: line 1: STEAMROOT: chua dat STEAMROOT</div>
<p>Đọc dòng giữa hai lần. Trong vụ Steam, biến <em>đã được đặt</em> — thành một chuỗi rỗng — nên chỉ riêng <code>set -u</code> sẽ không cứu được người dùng đó. <code>\${STEAMROOT:?}</code> thì cứu được: nó dừng bằng một lỗi trước khi <code>rm</code> kịp chạy. Đó là toàn bộ khác biệt giữa một script hỏng thì kêu to và một script hỏng bằng cách phá file của bạn, và là lý do Chương 7 dùng cả hai.</p>

<h3>Bốn sự cố thật nữa — đã đối chiếu nguồn</h3>
${slide('lx-00', 10, 'Bốn sự cố thật — mỗi cái dạy một thói quen')}
<p><strong>Bumblebee, 24/5/2011 — thừa một dấu cách.</strong> Script cài đặt của Bumblebee, một dự án chuyển card đồ hoạ trên Linux, có dòng này (issue #123 trên GitHub):</p>
<pre><code class="language-bash">rm -rf /usr /lib/nvidia-current/xorg/xorg</code></pre>
<p>Tác giả định viết <code>/usr/lib/nvidia-current/xorg/xorg</code>. Một dấu cách biến một đường dẫn thành hai, và shell tách từ theo dấu cách trước khi <code>rm</code> nhìn thấy gì. Đây chính xác là thứ <code>rm</code> nhận được — <code>printf</code> in từng tham số trong ngoặc vuông:</p>
<pre><code class="language-bash">printf "[%s]\\n" rm -rf /usr /lib/nvidia-current/xorg/xorg</code></pre>
<div class="out">[rm]
[-rf]
[/usr]
[/lib/nvidia-current/xorg/xorg]</div>
<p>Người báo lỗi viết: “Script xoá mọi thứ dưới /usr. Tôi vừa phải cài lại Linux để khôi phục máy.” Shell tách một dòng thành các từ ra sao là Chương 6; đọc một dòng phá huỷ theo từng tham số trước khi chạy là thói quen ở bài 0.4.</p>
<p><strong>GitLab.com, 31/1/2017 — đúng lệnh, sai máy.</strong> Trong lúc xử lý sự cố sao chép cơ sở dữ liệu, một kỹ sư chạy lệnh xoá thư mục dữ liệu trên máy chủ <em>chính</em>, db1, thay vì máy phụ db2. Theo bản post-mortem chính thức của GitLab, anh dừng lệnh “một hai giây sau khi nhận ra” — lúc đó khoảng 300 GB đã mất. Các bản sao lưu cũng hỏng: <code>pg_dump</code> bản 9.2 chạy trên cơ sở dữ liệu 9.6 và đã thất bại âm thầm từ lâu, bucket S3 chứa bản sao lưu thì trống, còn email báo lỗi bị từ chối. GitLab khôi phục từ một bản chụp (snapshot) làm sáu tiếng trước đó; các thay đổi dữ liệu từ khoảng 17:20 tới 00:00 UTC — chừng 5.000 dự án, 5.000 bình luận và 700 tài khoản mới — bị mất. Bài học cho bạn: luôn biết terminal đang ở máy nào (dấu nhắc rõ ràng có tên máy — Chương 8 và 9), và kiểm xem bản sao lưu có thật sự khôi phục được không (Chương 10).</p>
<p><strong>Amazon S3, 28/2/2017 — một tham số gõ sai.</strong> Chính bản tóm tắt của Amazon nói một kỹ sư, làm theo một playbook (sổ quy trình) có sẵn, “đã chạy một lệnh nhằm gỡ một số ít máy chủ”, nhưng “một tham số của lệnh bị nhập sai và một nhóm máy chủ lớn hơn dự định đã bị gỡ”. S3 ở vùng us-east-1 gián đoạn khoảng bốn tiếng rưỡi, kéo theo rất nhiều website. Amazon sửa công cụ để gỡ bớt năng lực chậm hơn và từ chối xuống dưới mức tối thiểu an toàn. Ý tưởng đó áp dụng ngay cho script của bạn: kiểm tham số và cho xem trước điều sẽ xảy ra rồi mới làm (Chương 7).</p>
<p><strong>Shellshock, công bố 24/9/2014 — lỗi nằm ngay trong bash.</strong> Stéphane Chazelas phát hiện bash thực thi các lệnh giấu trong một biến môi trường trông giống định nghĩa hàm — một lỗi có từ bash 1.03 năm 1989 (CVE-2014-6271). Vì máy chủ web truyền dữ liệu của request cho script CGI qua biến môi trường, kẻ tấn công có thể chạy lệnh trên máy chủ chỉ bằng một header được chế sẵn; các công ty bảo mật ghi nhận hàng triệu lượt dò chỉ trong vài ngày. Dòng thử nổi tiếng là vô hại trên hệ đã vá:</p>
<pre><code class="language-bash">env x='() { :;}; echo vulnerable' bash -c "echo this is a test"</code></pre>
<div class="out">this is a test</div>
<p>Đó là output trên Ubuntu 24.04 của khoá (bash 5.2.21). Một bash còn lỗi sẽ in <code>vulnerable</code> trước. Bài học: giữ các gói luôn được cập nhật (<code>apt</code>, Chương 10) — những công cụ bạn tin nhất cũng là phần mềm.</p>

<h3>Sự cố thật của một dự án sinh viên</h3>
${slide('lx-00', 11, 'Sự cố của một dự án sinh viên — chuyện thật, lệnh thật')}
<p>Những chuyện tiếp theo đến từ một dự án sinh viên có thật: một website Next.js + Express + PostgreSQL chạy bằng Docker Compose trên một VPS Ubuntu duy nhất, deploy bằng một script bash dài. Không ai trong đó cẩu thả; lần nào cũng chỉ là thiếu đúng một mẩu kiến thức.</p>
<table>
  <tr><th>Chuyện gì xảy ra</th><th>Hậu quả</th><th>Biết Linux thì khác gì</th><th>Chương</th></tr>
  <tr><td>Một lần deploy làm đầy đĩa bằng 7,6 GB cache build</td><td>PostgreSQL chết giữa lúc deploy</td><td><code>df -h</code> thấy đĩa đầy, <code>du -xh -d1</code> / <code>ncdu</code> tìm thủ phạm, và dọn trước khi nó xảy ra</td><td>10</td></tr>
  <tr><td>Thêm <code>PasswordAuthentication no</code> vào file cấu hình SSH</td><td>Đăng nhập bằng mật khẩu vẫn BẬT</td><td>Một file khác, <code>50-cloud-init.conf</code>, được đọc trước, và với sshd giá trị đầu tiên thắng; kiểm giá trị đang hiệu lực bằng <code>sshd -T</code>, đừng <code>cat</code> cái file mình vừa ghi</td><td>11</td></tr>
  <tr><td>Thêm <code>Port 993</code> vào <code>sshd_config</code></td><td>Không có tác dụng gì</td><td>Trên Ubuntu 24.04, <code>ssh.socket</code> (kích hoạt qua socket của systemd) giữ cổng; kiểm bằng <code>systemctl is-enabled ssh.socket</code></td><td>11</td></tr>
  <tr><td>Thay một file cấu hình bằng <code>mv</code></td><td>Container vẫn đọc file CŨ</td><td>Một file đơn được bind-mount gắn theo inode; <code>mv</code> và <code>sed -i</code> tạo inode mới — hãy ghi đè tại chỗ</td><td>2</td></tr>
  <tr><td><code>pkill -f "next start"</code> không khớp gì</td><td>Server cũ giữ cổng, server mới chết</td><td>Tiến trình đã tự đổi tên thành <code>next-server</code>; tìm nó theo cổng bằng <code>lsof -ti:3000</code></td><td>5</td></tr>
  <tr><td>Chạy trên Mac một script viết cho VPS</td><td>Lỗi về <code>timeout</code> và <code>grep</code></td><td>macOS có bash 3.2, không có <code>timeout</code>, <code>grep</code> là bản BSD</td><td>15</td></tr>
  <tr><td>Một việc hẹn giờ trong container chạy lệch 7 tiếng</td><td>Báo cáo tới sai giờ</td><td>Container mặc định giờ UTC, máy dùng +07</td><td>11</td></tr>
</table>

<h3>Tình huống minh hoạ — rất có thể là nhóm bạn</h3>
<p>Những chuyện này không lấy từ báo cáo công khai nào; chúng là kiểu chuyện xảy ra ở mọi đồ án nhóm. Output là thật, chạy trong container của khoá.</p>
<p><strong>“Máy em chạy được mà” — kiểu xuống dòng của Windows.</strong> Một bạn trong nhóm viết script bằng Notepad trên Windows rồi đẩy lên. File thử bốn dòng dưới đây gồm dòng <code>#!/bin/bash</code>, một dòng trống, <code>echo xin chao</code> và <code>cd /tmp</code>. Trên Linux nó hỏng theo ba kiểu khác nhau:</p>
<pre><code class="language-bash">bash crlf.sh
./crlf.sh
file crlf.sh</code></pre>
<div class="out">crlf.sh: line 2: $'\\r': command not found
xin chao
crlf.sh: line 4: cd: $'/tmp\\r': No such file or directory
bash: line 1: ./crlf.sh: cannot execute: required file not found
crlf.sh: Bourne-Again shell script, ASCII text executable, with CRLF line terminators</div>
<p>Windows kết thúc dòng bằng hai ký tự (<code>\\r\\n</code>), Linux bằng một (<code>\\n</code>). Bash coi cái <code>\\r</code> vô hình là một phần của từng từ — kể cả dòng <code>#!/bin/bash</code>, và đó là lý do chạy thẳng file thì báo “required file not found”. Sửa: lưu với kiểu xuống dòng LF trong VS Code, hoặc <code>sed -i 's/\\r$//' crlf.sh</code> (Chương 8 và 15).</p>
<p><strong>“Deploy không in gì mà cũng chẳng làm gì.”</strong> Dòng <code>cd /srv/app &amp;&amp; git pull &amp;&amp; npm run build</code> trong script hỏng ngay bước đầu vì thư mục thật là <code>/srv/apps</code>. Với <code>&amp;&amp;</code>, mọi bước phía sau bị bỏ qua — đúng điều bạn muốn, nhưng chỉ khi có người đọc cái lỗi. Nếu dùng <code>;</code> thay vào, <code>git pull</code> đã chạy ở bất kỳ thư mục nào mà script đang đứng. Chương 6 nói về mã thoát và <code>&amp;&amp;</code>/<code>||</code>.</p>

<h3>Vì sao người mới hay bỏ dòng lệnh</h3>
${slide('lx-00', 12, 'Vì sao người mới bỏ cuộc — và cách chữa từng lý do')}
<ul>
<li><strong>Màn hình đen đáng sợ.</strong> Không nút bấm, không gợi ý, và nỗi sợ gõ sai một phím là hỏng máy. <em>Cách chữa:</em> một cái máy bạn được phép phá. Bài 0.3 cho bạn một container Docker: phá nó, gõ <code>exit</code>, một cái mới tinh khởi động trong khoảng một giây rưỡi.</li>
<li><strong>Lỗi nào cũng bằng tiếng Anh.</strong> <em>Cách chữa:</em> lỗi trong khoá này được giải thích từng chữ, bài nào cũng có ô 🗂 thuật ngữ tiếng Anh kèm nghĩa tiếng Việt, và bảng bên dưới gom khoảng mười thông báo lỗi bạn gặp nhiều nhất.</li>
<li><strong>Học thuộc lệnh thay vì hiểu.</strong> Nó chạy cho tới khi tình huống khác đi một chút. <em>Cách chữa:</em> học mô hình — file, tiến trình, dòng dữ liệu, quyền — cùng khoảng bốn mươi lệnh; còn lại tra trong vài giây (bài 0.4).</li>
<li><strong>Một tuần lý thuyết mà chưa làm được gì.</strong> <em>Cách chữa:</em> bài nào cũng kết thúc bằng một việc 🧪 làm xong trong 15–20 phút, có dòng “Đạt khi” để bạn biết mình đã làm được.</li>
<li><strong>Kẹt một lỗi suốt hai tiếng.</strong> <em>Cách chữa:</em> quy tắc 20 phút ở dưới.</li>
</ul>

<h3>Đọc một thông báo lỗi — bốn phần</h3>
${slide('lx-00', 13, 'Đọc thông báo lỗi: AI kêu · kêu về CÁI GÌ · VÌ SAO · mã thoát')}
<p>Thông báo lỗi trên Linux theo một khuôn: <strong>ai đang kêu</strong>, <strong>kêu về cái gì</strong>, <strong>vì sao</strong> — và, vô hình, một mã thoát (exit code). Output thật từ container của khoá:</p>
<pre><code class="language-bash">sl
echo $?
ls khong-co
echo $?
./ghi-chu.txt
echo $?</code></pre>
<div class="out">bash: sl: command not found
127
ls: cannot access 'khong-co': No such file or directory
2
bash: ./ghi-chu.txt: Permission denied
126</div>
<p>Đọc chữ đầu tiên. <code>bash:</code> nghĩa là shell còn chưa khởi động được chương trình — nó không tìm thấy (<code>127</code>) hoặc không được phép thực thi (<code>126</code>). <code>ls:</code> nghĩa là chương trình đã chạy rồi mới kêu. Phần giữa lặp lại thứ bạn gõ — rất hay để lộ lỗi chính tả (<code>sl</code> thay vì <code>ls</code>). Phần cuối là lý do. <code>$?</code> giữ mã thoát của lệnh vừa chạy: <code>0</code> là thành công, khác 0 là thất bại, và Chương 6 xây trên điều này.</p>
<table>
  <tr><th>Thông báo (thật, Ubuntu 24.04)</th><th>Nghĩa là</th><th>Kiểm gì trước</th></tr>
  <tr><td><code>command not found</code> (không tìm thấy lệnh)</td><td>Không có chương trình tên đó trong <code>PATH</code></td><td>Chính tả; đã cài chưa? (Ch 8, 10)</td></tr>
  <tr><td><code>No such file or directory</code> (không có file hay thư mục đó)</td><td>Đường dẫn không tồn tại</td><td><code>pwd</code>, rồi <code>ls</code> thư mục cha</td></tr>
  <tr><td><code>Permission denied</code> (bị từ chối quyền)</td><td>Bạn thiếu quyền r, w hoặc x trên file</td><td><code>ls -l</code> — đừng vội <code>sudo</code> (Ch 4)</td></tr>
  <tr><td><code>Operation not permitted</code> (thao tác không được phép)</td><td>Có đúng quyền cũng không được (ví dụ giết tiến trình của user khác)</td><td>Nó thuộc về ai? (Ch 4, 5)</td></tr>
  <tr><td><code>Not a directory</code> / <code>Is a directory</code></td><td>Bạn dùng file như thư mục, hoặc ngược lại</td><td><code>ls -l</code> đường dẫn đó</td></tr>
  <tr><td><code>File exists</code> (file đã tồn tại)</td><td><code>mkdir</code> một cái tên đã có</td><td><code>mkdir -p</code> nếu vậy là ổn</td></tr>
  <tr><td><code>Directory not empty</code> (thư mục không rỗng)</td><td><code>rmdir</code> chỉ xoá thư mục rỗng</td><td>Nhìn vào trong trước khi xoá</td></tr>
  <tr><td><code>unbound variable</code> (biến chưa gán)</td><td><code>set -u</code> bắt được một biến chưa từng đặt</td><td>Chính tả tên biến (Ch 6–7)</td></tr>
  <tr><td><code>syntax error near unexpected token</code> (lỗi cú pháp gần ký hiệu bất ngờ)</td><td>Shell không phân tích được dòng — hay thiếu <code>;</code> hoặc <code>then</code></td><td>Ký hiệu được nêu tên, và dòng phía trước (Ch 6)</td></tr>
  <tr><td><code>Couldn't connect to server</code> (không kết nối được)</td><td>Không có gì đang nghe ở cổng đó</td><td>Dịch vụ có chạy không? <code>ss -ltn</code> (Ch 9)</td></tr>
</table>

<h3>Khi bí: tra, rồi hỏi</h3>
<ol>
<li><strong>Tra ngay trong máy</strong> (bài 0.4): <code>lệnh --help | grep -i từ</code>, <code>man lệnh</code>, <code>help cd</code> cho lệnh có sẵn của shell, <code>tldr lệnh</code> để xem ví dụ.</li>
<li><strong>Tháo một lệnh dài ra từng mảnh</strong>: dán vào explainshell.com, hoặc chạy từng chặng của ống dẫn một.</li>
<li><strong>Tìm nguyên văn câu lỗi</strong> trong ngoặc kép, bỏ tên file riêng của bạn ra.</li>
<li><strong>Quy tắc 20 phút:</strong> 20 phút không tiến thêm được bước nào thì hỏi. Viết bốn dòng: máy của bạn (<code>uname -srm</code>), lệnh nguyên văn, lỗi nguyên văn (chép dạng chữ, đừng chụp ảnh mờ), và bạn đã thử gì. Một nửa số lần, chỉ viết ra bốn dòng đó là bạn tự thấy đáp án.</li>
<li><strong>Soát script trước khi chạy</strong>: shellcheck.net chỉ ra những lỗi biến rỗng và thiếu dấu nháy nằm sau chuyện của Steam và Bumblebee.</li>
</ol>

<h3>Mẹo cho người thấy tiếng Anh khó</h3>
<ul>
<li>Tên lệnh là chữ viết tắt tiếng Anh. Đọc đầy đủ một lần là nhớ: <code>ls</code> = list (liệt kê), <code>cd</code> = change directory (đổi thư mục), <code>pwd</code> = print working directory (in thư mục đang đứng), <code>mkdir</code> = make directory (tạo thư mục), <code>rm</code> = remove (xoá), <code>grep</code> = global regular expression print (in các dòng khớp mẫu).</li>
<li>Giữ một bảng thuật ngữ của riêng bạn trong <code>~/thu-linux/meo.txt</code>: mỗi lệnh một dòng, kèm ghi chú tiếng Việt.</li>
<li>Bạn không cần đọc hết một trang man. Tìm trong nó: <code>/</code> rồi gõ từ, <code>n</code> tới chỗ khớp kế tiếp, <code>q</code> để thoát.</li>
<li>Dịch lỗi sang tiếng Việt cũng được — nhưng giữ nguyên văn câu lỗi khi tìm kiếm hay đi hỏi; chính những chữ tiếng Anh đó là thứ công cụ tìm kiếm khớp.</li>
</ul>

<h3>Lộ trình tối thiểu và lộ trình đầy đủ</h3>
${slide('lx-00', 14, 'Lộ trình: 2 tuần để tự tin, 17 phần để thành thạo')}
<table>
  <tr><th>Lộ trình</th><th>Học gì</th><th>Học xong thì…</th></tr>
  <tr><td><strong>Tối thiểu — 2 tuần</strong>, khoảng một giờ mỗi ngày</td><td>Mục 0, Chương 1–7</td><td>đi lại trong mọi máy, tìm và lọc file, log; sửa được “Permission denied”, diệt đúng tiến trình, và viết script có <code>set -euo pipefail</code></td></tr>
  <tr><td><strong>Cho đồ án nhóm</strong>, thêm 1–2 tuần</td><td>Chương 8–12</td><td>SSH vào VPS, đọc log, chạy ứng dụng như một dịch vụ systemd, và chẩn đoán đĩa đầy hay cổng bị chiếm</td></tr>
  <tr><td><strong>Đầy đủ — 17 phần</strong></td><td>Chương 13–16</td><td>Bash nâng cao, nhân và hiệu năng, khác biệt macOS/Windows, và một máy chủ cuối khoá do bạn tự dựng và vận hành</td></tr>
</table>
<p><strong>Nhịp một buổi học (khoảng 60 phút):</strong> xem slide của bài (5 phút) → đọc bài và <em>tự gõ</em> từng lệnh, đừng dán (25 phút) → làm việc 🧪 (15–20 phút) → ghi ba lệnh vừa học vào <code>meo.txt</code> (5 phút). Hết một chương thì làm quiz và đọc phần giải thích, kể cả câu bạn làm đúng.</p>
<p><strong>Những mốc đáng ăn mừng:</strong> ống dẫn đầu tiên bạn tự viết; lần đầu sửa được “Permission denied” mà không cần <code>sudo</code>; script đầu tiên tự dừng nhờ <code>set -u</code> thay vì gây hại; lần đầu SSH vào một máy chủ và tìm ra vì sao nó chậm.</p>

<div class="pitfall co-tieu-de"><strong>Đừng rút ra bài học sai từ những câu chuyện này.</strong> Bài học không phải là “terminal nguy hiểm, tránh xa ra”. Mọi sự cố ở trên đều xảy ra với người có kinh nghiệm, và cái nào cũng được ngăn bởi một thói quen nhỏ, học được: bọc biến trong dấu nháy, dừng lại khi biến rỗng, đọc một dòng phá huỷ theo từng tham số, biết mình đang ở máy nào, giữ các gói được cập nhật. Những người không bao giờ mắc các lỗi này không gan dạ hơn — họ đã luyện trên những cái máy mà sai lầm chẳng tốn gì. Đó chính là thứ các bài tiếp theo dựng cho bạn.</div>

<h3>🧪 Thực hành (10 phút — những lỗi đầu tiên, gây ra có chủ đích)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn muốn thôi sợ thông báo lỗi. Hãy cố tình tạo ra bốn cái, một cách an toàn, và đọc từng cái.</p><ol>
<li>Trong <code>~/thu-linux</code>, gõ một lệnh không tồn tại: <code>sl</code>, rồi <code>echo $?</code>. Ai kêu, và mã là bao nhiêu?</li>
<li><code>ls khong-co</code>, rồi <code>echo $?</code>. Lần này ai kêu — shell hay chương trình?</li>
<li>Tái hiện lỗi của Steam <strong>có <code>echo</code></strong> — không bao giờ bỏ nó: <code>cd / ; STEAMROOT="" ; echo rm -rf "$STEAMROOT/"*</code>. Đọc danh sách lẽ ra đã bị xoá.</li>
<li>Thử chặn nó theo hai cách: <code>bash -uc 'STEAMROOT=""; echo rm -rf "$STEAMROOT/"*'</code> (<code>set -u</code> có chặn không?), rồi <code>bash -c 'STEAMROOT=""; echo rm -rf "\${STEAMROOT:?}/"*'</code>. Ghi lại cách nào in ra lỗi.</li>
<li><code>cd ~/thu-linux</code> rồi thêm bốn thông báo lỗi vào <code>meo.txt</code>, mỗi cái kèm một câu tiếng Việt giải thích.</li></ol>
<p><strong>Đạt khi:</strong> bạn giải thích được vì sao <code>sl</code> cho <code>127</code> còn <code>ls khong-co</code> cho <code>2</code>, bạn đã thấy danh sách bắt đầu bằng <code>rm -rf /bin …</code> mà không có gì bị xoá, bạn nói được vì sao <code>set -u</code> KHÔNG chặn được bước 4 còn <code>\${STEAMROOT:?}</code> thì chặn được (<code>parameter null or not set</code>), và <code>meo.txt</code> có thêm bốn dòng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Variable expansion (khai triển biến)</span><span class="v">Shell thay <code>$TEN</code> bằng giá trị của nó trước khi chạy lệnh — kể cả khi giá trị rỗng.</span></div>
  <div class="kv"><span class="k">Word splitting (tách từ)</span><span class="v">Shell cắt một dòng thành các tham số riêng tại dấu cách; thừa một dấu cách là thừa một tham số.</span></div>
  <div class="kv"><span class="k">Exit code (mã thoát)</span><span class="v">Con số mọi lệnh trả về: 0 là thành công, khác 0 là thất bại. Nằm trong <code>$?</code>.</span></div>
  <div class="kv"><span class="k">set -u</span><span class="v">Tuỳ chọn của shell biến việc “dùng một biến chưa đặt” thành lỗi làm dừng script. Nó không bắt được biến đã đặt bằng chuỗi rỗng — <code>\${VAR:?}</code> thì bắt được.</span></div>
  <div class="kv"><span class="k">Post-mortem (báo cáo sau sự cố)</span><span class="v">Bản viết sau một sự cố: chuyện gì xảy ra, vì sao, và đổi gì để nó không lặp lại.</span></div>
  <div class="kv"><span class="k">CVE (mã lỗ hổng công khai)</span><span class="v">Mã định danh công khai cho một lỗ hổng bảo mật, ví dụ CVE-2014-6271 là Shellshock.</span></div>
  <div class="kv"><span class="k">CRLF / LF (kiểu xuống dòng)</span><span class="v">Windows kết thúc dòng bằng hai ký tự (<code>\\r\\n</code>), Linux bằng một (<code>\\n</code>). Trộn lẫn là script hỏng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Biến rỗng trong <code>rm -rf "$VAR/"*</code> nghĩa là <code>rm -rf /*</code>; <code>\${VAR:?}</code> chặn được nó, còn <code>set -u</code> chỉ bắt biến chưa từng được đặt.</li>
<li>Thừa một dấu cách là một đường dẫn tách thành hai tham số — Bumblebee đã xoá <code>/usr</code> như thế; hãy đọc dòng phá huỷ theo từng tham số.</li>
<li>GitLab và AWS cho thấy đúng lệnh trên sai máy, hoặc sai một tham số, là đủ gây sự cố; biết mình đang ở đâu và kiểm tham số đầu vào.</li>
<li>Thông báo lỗi có khuôn: ai kêu, về cái gì, vì sao, cộng mã thoát trong <code>$?</code>.</li>
<li>Bí 20 phút thì hỏi, bằng bốn dòng: máy, lệnh, lỗi, đã thử gì.</li>
<li>Hai tuần, mỗi ngày một giờ là đủ phần tối thiểu; tự gõ mọi lệnh và kết thúc mỗi buổi bằng một 🧪.</li>
</ul>

<a class="link-card" href="https://github.com/valvesoftware/steam-for-linux/issues/3671" target="_blank" rel="noopener">
  <span class="lc-ico">🎮</span>
  <span class="lc-body"><span class="lc-title">steam-for-linux #3671 — “Nó xoá mọi thứ thuộc về user”</span><span class="lc-sub">Báo lỗi gốc (14/1/2015) và cuộc thảo luận tìm ra dòng <code>rm -rf "$STEAMROOT/"*</code>.</span></span>
</a>
<a class="link-card" href="https://github.com/MrMEEE/bumblebee-Old-and-abbandoned/issues/123" target="_blank" rel="noopener">
  <span class="lc-ico">🐝</span>
  <span class="lc-body"><span class="lc-title">Bumblebee #123 — “script cài đặt chạy rm -rf /usr trên ubuntu”</span><span class="lc-sub">Lỗi một dấu cách tháng 5/2011.</span></span>
</a>
<a class="link-card" href="https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/" target="_blank" rel="noopener">
  <span class="lc-ico">🦊</span>
  <span class="lc-body"><span class="lc-title">GitLab — Post-mortem sự cố cơ sở dữ liệu ngày 31/1</span><span class="lc-sub">Một bản tường thuật thẳng thắn hiếm có: sai máy, những bản sao lưu đã hỏng âm thầm từ lâu, và những gì đã thay đổi sau đó.</span></span>
</a>
<a class="link-card" href="https://aws.amazon.com/message/41926/" target="_blank" rel="noopener">
  <span class="lc-ico">☁️</span>
  <span class="lc-body"><span class="lc-title">Tóm tắt sự cố gián đoạn Amazon S3 (28/2/2017)</span><span class="lc-sub">Một tham số gõ sai trong lệnh của playbook đã đánh sập S3 vùng us-east-1 nhiều giờ ra sao.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Shellshock_(software_bug)" target="_blank" rel="noopener">
  <span class="lc-ico">🐚</span>
  <span class="lc-body"><span class="lc-title">Shellshock (CVE-2014-6271) — Wikipedia</span><span class="lc-sub">Việc phát hiện, con bọ 25 tuổi trong bash, các đường tấn công và những CVE nối tiếp.</span></span>
</a>
<a class="link-card" href="https://www.shellcheck.net/" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">ShellCheck — tìm lỗi trong script shell</span><span class="lc-sub">Dán script vào, nó cảnh báo những biến không bọc nháy và có thể rỗng — gốc rễ của lỗi Steam.</span></span>
</a>
<a class="link-card" href="https://explainshell.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">ExplainShell — giải thích từng phần của một lệnh</span><span class="lc-sub">Cho lúc một dòng lấy từ Stack Overflow có sáu cái cờ bạn chưa từng thấy.</span></span>
</a>
<p class="note-ct"><strong>Tiếp theo:</strong> bài 0.1 — khoá này dành cho ai, terminal thật sự giỏi hơn ở đâu, và bản đồ đầy đủ của cả 17 phần.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.0 ─────────────────────────── */
    {
      title: '0.0 — Section 0 slides: Linux, the shell and how to learn them, in pictures|||0.0 — Slide Mục 0: Linux, shell và cách học, bằng hình',
      slug: 'lnx-0-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 39 slide của Mục 0: dòng thời gian 1969→2019, cây họ Unix, con số có nguồn, năm sự cố thật, cách đọc thông báo lỗi, bốn lớp terminal/shell/chương trình/kernel, cài đặt trên Windows/macOS/Docker, tra cứu và thoát kẹt — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Slides</span>
<h2>The whole of Section 0 in 39 slides</h2>
<p class="lead">Skim these before the lessons to get the shape of things, then come back as a revision sheet. Every picture reappears inside the lesson that explains it: the restaurant with its waiter, the 1969 → 2019 timeline, the Unix family tree, the Steam bug replayed safely with <code>echo</code>, the four layers behind the black window, and the real errors bash 3.2 throws on a Mac.</p>
<p>Slides 3–8 belong to "Start here (1/2)", 9–14 to "Start here (2/2)", 15–18 to Lesson 0.1, 19–24 to 0.2, 25–30 to 0.3 and 31–35 to 0.4. The last four are the section's common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal on the slides is real output, recorded in September 2026 on Ubuntu 24.04 (the course container), Fedora 44 and macOS 27 on an M1 Mac; every date and number has a source listed in the lessons. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Slide</span>
<h2>Cả Mục 0 trong 39 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để nắm hình dạng mọi thứ, rồi quay lại như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: nhà hàng và người phục vụ, dòng thời gian 1969 → 2019, cây họ Unix, lỗi của Steam được tái hiện an toàn bằng <code>echo</code>, bốn lớp sau cái cửa sổ đen, và những lỗi thật mà bash 3.2 ném ra trên Mac.</p>
<p>Slide 3–8 thuộc “Bắt đầu tại đây (1/2)”, 9–14 thuộc “Bắt đầu tại đây (2/2)”, 15–18 thuộc Bài 0.1, 19–24 thuộc 0.2, 25–30 thuộc 0.3 và 31–35 thuộc 0.4. Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi tháng 9/2026 trên Ubuntu 24.04 (container của khoá), Fedora 44 và macOS 27 trên Mac M1; mọi mốc thời gian và con số đều có nguồn ghi trong bài — con số trên máy bạn có thể khác, quy luật thì không.</p>
</div>
${gallery('lx-00', [
  [1, 'Bìa'], [2, 'Bản đồ Mục 0'],
  [3, 'Shell là người phục vụ'], [4, 'Năm thứ hay bị gọi chung là “Linux”'], [5, 'Dòng thời gian 1969 → 2019'],
  [6, 'Cây họ Unix'], [7, 'Linux chạy phần lớn Internet — con số có nguồn'], [8, 'Học Linux giúp gì cho bạn'],
  [9, 'Steam 2015: một biến rỗng'], [10, 'Bốn sự cố thật'], [11, 'Sự cố của một dự án sinh viên'],
  [12, 'Vì sao người mới bỏ cuộc'], [13, 'Đọc một thông báo lỗi'], [14, 'Lộ trình 2 tuần và 17 phần'],
  [15, 'Terminal thắng khi việc lặp lại'], [16, 'Khoá này cho ai'], [17, 'Lộ trình 17 phần'], [18, 'Học xong đọc được gì'],
  [19, 'Bốn lớp sau cửa sổ đen'], [20, 'cd là builtin, ls là file'], [21, 'Bấm Enter: shell khai triển trước'],
  [22, 'Mọi thứ là một file'], [23, 'Triết lý Unix và ống dẫn'], [24, 'Distro khác nhau ở đâu'],
  [25, 'Bốn đường có shell Linux'], [26, 'Windows: WSL2'], [27, 'macOS: zsh và bash 3.2'],
  [28, 'bash 3.2 làm vỡ script'], [29, 'Docker làm sân tập'], [30, 'Kiểm đã sẵn sàng'],
  [31, 'Sáu cách tra cứu'], [32, '--help | grep, help, tldr'], [33, 'Thoát khỏi mọi thứ'],
  [34, 'Ba câu hỏi trước lệnh phá huỷ'], [35, 'Đọc lệnh lạ từng chặng'],
  [36, 'Sai lầm hay gặp'], [37, 'Bảng tra nhanh (1/2)'], [38, 'Bảng tra nhanh (2/2)'], [39, 'Thực hành Mục 0'],
])}
`,
    },

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — Who this course is for & the full roadmap|||0.1 — Khoá này cho ai & lộ trình toàn khoá',
      slug: 'lnx-0-1-gioi-thieu-lo-trinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao một giao diện chữ từ 1971 vẫn thắng mọi GUI ở những việc nhất định, khoá này lấp khoảng trống nào, và bản đồ toàn khoá — 13 phần gốc cộng 4 chương bổ sung năm 2026, nay 17 phần — từ lệnh cd đầu tiên tới vận hành một máy chủ thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Why a text interface from 1971 still wins</h2>
<p class="lead">Every few years someone declares the command line obsolete, and every year it becomes more central — because deployment, containers, CI, servers and half of modern development happen on machines with no screen attached. If you have ever followed a tutorial by pasting commands you did not understand and hoping, this course closes exactly that gap.</p>

<h3>What the terminal is actually better at</h3>
${slide('lx-00', 15, 'Terminal thắng khi việc lặp lại: 5 hay 4.000 file, một dòng')}
<div class="kv-grid">
  <div class="kv"><span class="k">Repetition</span><span class="v">Renaming 4,000 files by a pattern is one line. In a file manager it is an afternoon, and you will make mistakes.</span></div>
  <div class="kv"><span class="k">Composition</span><span class="v">Small tools joined by pipes solve problems nobody wrote a tool for. No GUI lets you connect two programs you did not plan to connect.</span></div>
  <div class="kv"><span class="k">Remote work</span><span class="v">A server has no desktop. SSH plus a shell is the entire interface — and it works over a bad connection from a phone.</span></div>
  <div class="kv"><span class="k">Reproducibility</span><span class="v">A command can be pasted into a document, reviewed, versioned in Git, and run identically a year later. A sequence of clicks cannot.</span></div>
  <div class="kv"><span class="k">Speed at scale</span><span class="v">Searching ten million lines with <code>grep</code> takes a second. Opening them in an editor takes minutes and may not fit in memory.</span></div>
</div>
<div class="callout ok">The point is not that the terminal beats a GUI at everything — it does not. Reading a photograph, laying out a document, exploring an unfamiliar API: use the tool with pictures. The terminal wins when the task is <em>repeated, composed, remote or reproducible</em>, and that describes most of what happens between writing code and running it in production.</div>

<h3>Run it step by step: rename a whole folder of files in one line</h3>
<p>"Renaming 4,000 files is one line" is easy to say. Here is the line, run for real in the course's Ubuntu 24.04 container, and every piece of it explained. A group folder of screenshots has upper-case <code>.PNG</code> extensions that break a case-sensitive web server, and one file name contains a space:</p>
<pre><code class="language-bash">cd ~/thu-linux/anh
ls | wc -l
for f in *.PNG; do echo mv -- "$f" "\${f%.PNG}.png"; done   # 1) preview
for f in *.PNG; do mv -- "$f" "\${f%.PNG}.png"; done        # 2) do it
ls
ls | wc -l</code></pre>
<div class="out">5
mv -- Screenshot 1.PNG Screenshot 1.png
mv -- Screenshot 2.PNG Screenshot 2.png
mv -- logo.PNG logo.png
'Screenshot 1.png'  'Screenshot 2.png'   bia.png   ghi-chu.txt   logo.png
5</div>
<table>
<tr><th>Piece</th><th>What it means</th></tr>
<tr><td><code>for f in *.PNG; do … done</code></td><td>A loop: the shell first expands <code>*.PNG</code> into the list of matching names, then runs the body once per name with <code>f</code> set to it (Chapter 6).</td></tr>
<tr><td><code>"$f"</code></td><td>The value of <code>f</code>, <em>in double quotes</em> so that <code>Screenshot 1.PNG</code> stays one argument instead of two.</td></tr>
<tr><td><code>\${f%.PNG}</code></td><td>"<code>f</code> with <code>.PNG</code> cut off the end" — parameter expansion, no external program needed (Chapter 6).</td></tr>
<tr><td><code>--</code></td><td>"End of options": a file whose name starts with <code>-</code> will not be mistaken for a flag.</td></tr>
<tr><td><code>echo</code> in the first run</td><td>A dry run: print every command instead of running it. Look, then remove <code>echo</code>.</td></tr>
<tr><td><code>ls | wc -l</code> before and after</td><td>Proof that nothing was lost: 5 names before, 5 after.</td></tr>
</table>
<p>Why the quotes matter — the same loop without them, with <code>printf "[%s] "</code> showing each argument <code>mv</code> would receive:</p>
<div class="out">[mv] [Screenshot] [1.PNG] [Screenshot] [1.png]
[mv] [--] [Screenshot 1.PNG] [Screenshot 1.png]</div>
<p>(The single quotes around <code>'Screenshot 1.png'</code> are added by GNU <code>ls</code> when it prints to a terminal, to show that the space belongs to the name — they are not part of the file name.) The first line is the unquoted version: four file arguments, none of which exists. The second is the quoted one: exactly two.</p>
<div class="callout warn"><strong>On macOS (zsh) this differs.</strong> If no file matches, bash quietly passes the pattern itself (<code>file: *.JPG</code>), while zsh stops with an error. Real output from a Mac, in an empty folder:<br><code>zsh:1: no matches found: *.JPG</code><br>Neither is wrong; they are different rules (Chapter 15). On WSL you are in real bash, so it behaves like Ubuntu.</div>
<table>
<tr><th>Use the terminal when…</th><th>Use a graphical tool when…</th></tr>
<tr><td>the same action repeats on many files or many machines</td><td>you are looking at something once — a photo, a layout, a chart</td></tr>
<tr><td>the machine is remote or has no screen</td><td>you are exploring something you do not understand yet and want to see it</td></tr>
<tr><td>the steps must be written down, reviewed and repeated later</td><td>the task needs a mouse by nature: drawing, cropping, arranging</td></tr>
</table>

<h3>Who this is for</h3>
${slide('lx-00', 16, 'Khoá này cho ai — và nên bắt đầu từ đâu')}
<div class="kv-grid">
  <div class="kv"><span class="k">The paster</span><span class="v">You copy commands from tutorials and they usually work. Start at 0.2 — after Chapter 6 you will read a command instead of trusting it.</span></div>
  <div class="kv"><span class="k">The developer who deploys</span><span class="v">You can code, but SSH-ing into a server makes you nervous. Chapters 4, 5, 9 and 11 are written for you.</span></div>
  <div class="kv"><span class="k">The self-taught engineer</span><span class="v">You know twenty commands and suspect there is a system underneath. Chapters 1, 3 and 6 are that system.</span></div>
  <div class="kv"><span class="k">The person on-call</span><span class="v">A server is misbehaving now. Chapter 12 is a recipe book, readable out of order.</span></div>
</div>

<h3>What you will be able to do at the end</h3>
${slide('lx-00', 18, 'Học xong, bạn đọc được những dòng này trước khi bấm Enter')}
<ul>
  <li>Read an unfamiliar command and predict what it does — including the ones with pipes, redirects and quoting.</li>
  <li>Find any file on a machine by name, size, age or content, and act on all of them in one line.</li>
  <li>Understand permissions well enough to fix "Permission denied" instead of reaching for <code>sudo</code>.</li>
  <li>See what a machine is actually doing: which process is eating the CPU, what is holding a port, why the disk is full.</li>
  <li>Write shell scripts that fail loudly instead of silently, with argument checking and cleanup on exit.</li>
  <li>Run a service under <code>systemd</code>, schedule work, read the logs, and harden SSH.</li>
  <li>Diagnose a server you have never seen before, using nothing but a terminal.</li>
</ul>

<h3>The 13-chapter roadmap</h3>
${slide('lx-00', 17, 'Lộ trình 17 phần: năm chặng từ cd tới vận hành máy chủ')}
<div class="callout ok"><strong>Update (September 2026): the course now has 17 parts.</strong> The thirteen parts below — Section 0 and Chapters 1–12 — are unchanged. Four chapters were added after them, for everyone who wants to go from "can run a server" to "understands it in depth": <strong>Chapter 13, Advanced Bash</strong> (arrays and associative arrays, process substitution, <code>coproc</code>, speed), <strong>Chapter 14, Linux in depth</strong> (the kernel, performance, storage, security), <strong>Chapter 15, your Linux skills on macOS and Windows</strong> (zsh, BSD tools, Homebrew, launchd, WSL and PowerShell), and <strong>Chapter 16, the capstone</strong>: build, automate and run a real server, ending with the final exam of the course. They are listed as Part 5 after the map below.</div>
<div class="lz-map">
  <div class="lz-stage">Part 1 — Moving around (Ch 1–3)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">The shell &amp; the filesystem</div><div class="lz-nsub">What a shell really is, absolute vs relative paths, the directory tree and what each top-level folder is for</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Files &amp; directories</div><div class="lz-nsub">Create, copy, move, delete safely · globs · find · links · archives</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Text, pipes &amp; redirection</div><div class="lz-nsub">The idea that makes Unix work: small tools, one job each, joined by pipes. grep, sed, awk, sort, cut</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 2 — How the machine works (Ch 4–5)</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Permissions, users &amp; sudo</div><div class="lz-nsub">rwx, chmod, chown, umask, groups — and why "Permission denied" is usually not a sudo problem</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Processes, jobs &amp; signals</div><div class="lz-nsub">ps, top, kill, background jobs, nohup — what Ctrl-C actually sends and why some programs ignore it</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 3 — The shell as a language (Ch 6–8)</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Variables, quoting &amp; expansion</div><div class="lz-nsub">The chapter that stops commands from breaking on a space in a filename. Exit codes, conditionals, loops, functions</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Writing production scripts</div><div class="lz-nsub">set -euo pipefail, arguments, validation, trap for cleanup, and how to debug a script</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Environment, PATH &amp; startup files</div><div class="lz-nsub">Why "command not found" happens, which file to edit, and login vs interactive shells</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 4 — Running a machine (Ch 9–12)</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Networking &amp; remote machines</div><div class="lz-nsub">ss, ip, curl, dig, ssh, scp, rsync — and reading a firewall</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Disk, packages &amp; logs</div><div class="lz-nsub">df vs du, finding what filled the disk, apt/dnf, journalctl, log rotation</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">systemd, cron &amp; administration</div><div class="lz-nsub">Running your app as a service that restarts itself, scheduled work, hardening SSH</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Diagnosing a real server</div><div class="lz-nsub">A recipe book: disk full, port in use, service will not start, machine is slow, out of memory</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 5 — Going further (Ch 13–16, added 2026)</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Advanced Bash</div><div class="lz-nsub">Indexed and associative arrays, mapfile, process substitution, coproc, and making scripts fast</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Linux in depth</div><div class="lz-nsub">Kernel, namespaces and cgroups, performance, storage and LVM, security</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Your Linux skills on macOS and Windows</div><div class="lz-nsub">zsh and BSD tools, Homebrew, launchd, WSL 2, Git Bash and PowerShell</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Capstone: build, automate and run a real server</div><div class="lz-nsub">One project that uses every chapter, and the final exam of the course</div></div></div>
</div>

<h3>Bash, and the other shells</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bash</span><span class="v">What this course teaches. The default on nearly every Linux server, and the language of almost every script you will inherit.</span></div>
  <div class="kv"><span class="k">zsh</span><span class="v">macOS's default since 2019. Nearly all of this course applies unchanged; differences are flagged where they matter.</span></div>
  <div class="kv"><span class="k">sh / dash</span><span class="v">The POSIX minimum. Scripts starting <code>#!/bin/sh</code> must avoid Bash-only features — Chapter 7 covers the trap.</span></div>
  <div class="kv"><span class="k">fish</span><span class="v">Friendlier interactively, deliberately not POSIX-compatible. Fine as your daily shell; do not write scripts in it for servers.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your SWP391 group dumped screenshots for the report into one folder, half with <code>.PNG</code> and half with <code>.png</code>, and the Linux web server treats <code>logo.PNG</code> and <code>logo.png</code> as different files. Normalise them — without losing a single file.</p><ol>
<li>Make the folder and five test files: <code>mkdir -p ~/thu-linux/anh &amp;&amp; cd ~/thu-linux/anh</code>, then <code>touch "Screenshot 1.PNG" "Screenshot 2.PNG" logo.PNG bia.png ghi-chu.txt</code>.</li>
<li>Count them: <code>ls | wc -l</code> — write the number down.</li>
<li>Dry run: <code>for f in *.PNG; do echo mv -- "$f" "\${f%.PNG}.png"; done</code>. Check that every line names exactly one old and one new file.</li>
<li>Run it for real (remove <code>echo</code>), then <code>ls</code> and <code>ls | wc -l</code> again.</li>
<li>Prove nothing upper-case is left: <code>ls *.PNG</code> should now fail.</li></ol>
<p><strong>Done when:</strong> the count is 5 before and 5 after, <code>ls</code> shows <code>Screenshot 1.png</code> (one name, with its space), and <code>ls *.PNG</code> answers <code>ls: cannot access '*.PNG': No such file or directory</code> — real output from the course container.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CLI / GUI</span><span class="v">Command-line interface (you type) versus graphical user interface (you click).</span></div>
  <div class="kv"><span class="k">Glob</span><span class="v">A file-name pattern such as <code>*.PNG</code> that the shell expands into matching names.</span></div>
  <div class="kv"><span class="k">Loop</span><span class="v"><code>for … in …; do … done</code>: run the same commands once per item.</span></div>
  <div class="kv"><span class="k">Dry run</span><span class="v">Printing what a command would do (often with <code>echo</code>) before letting it do it.</span></div>
  <div class="kv"><span class="k">Reproducible</span><span class="v">Can be repeated identically later — a command in a file can, a sequence of clicks cannot.</span></div>
  <div class="kv"><span class="k">SSH</span><span class="v">Secure Shell: a shell on a remote machine over an encrypted connection (Chapter 9).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The terminal wins when work is repeated, composed, remote or must be reproducible; a GUI wins for looking at things once.</li>
<li>A loop plus a glob renames five or 4,000 files with the same line; preview with <code>echo</code> first, count before and after.</li>
<li>Quote variables (<code>"$f"</code>) or a space in a file name splits it into two arguments.</li>
<li>bash and zsh treat a glob with no match differently: bash passes the pattern on, zsh stops with "no matches found".</li>
<li>The course has 17 parts: Section 0, Chapters 1–12 (moving around → running a server) and Chapters 13–16 (advanced Bash, Linux in depth, macOS/Windows, capstone).</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/bash.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">The GNU Bash Reference Manual</span><span class="lc-sub">The definitive source. Dense, complete, and the place to settle any argument about expansion.</span></span>
</a>
<a class="link-card" href="https://linuxjourney.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Linux Journey — a free structured tour of Linux</span><span class="lc-sub">Good companion reading: shorter lessons, same order as this course.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: the Linux &amp; Bash track on Code Lab</span><span class="lc-sub">Graded exercises that mirror these chapters. Read here, drill there.</span></span>
</a>

<div class="pitfall"><strong>The trap this course exists to break:</strong> running commands you do not understand because a blog post said to. Most of the time it works, which is exactly the problem — the one time it does not, you have no idea what state the machine is in, and the command that "fixed" it for someone else may have deleted something for you. By Chapter 6 you will be able to read <code>find . -name '*.log' -mtime +30 -delete</code> and know precisely what it will remove before pressing Enter.</div>
<p class="note-ct"><strong>How to use this course:</strong> keep a throwaway Linux machine open beside it and run every command as you read. Lesson 0.3 sets one up — a container or a VM you can destroy and rebuild in thirty seconds. Reading about <code>rm -rf</code> teaches nothing; running it somewhere consequence-free teaches permanently.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Vì sao một giao diện chữ từ năm 1971 tới giờ vẫn thắng</h2>
<p class="lead">Cứ vài năm lại có người tuyên bố dòng lệnh đã lỗi thời, và năm nào nó cũng trở nên trung tâm hơn — vì triển khai, container, CI, máy chủ và một nửa việc phát triển phần mềm hiện đại diễn ra trên những cái máy không gắn màn hình nào. Nếu bạn từng làm theo một hướng dẫn bằng cách dán những lệnh mình không hiểu rồi hy vọng, khoá này lấp đúng khoảng trống đó.</p>

<h3>Terminal thật sự giỏi hơn ở chỗ nào</h3>
${slide('lx-00', 15, 'Terminal thắng khi việc lặp lại: 5 hay 4.000 file, một dòng')}
<div class="kv-grid">
  <div class="kv"><span class="k">Lặp lại</span><span class="v">Đổi tên 4.000 file theo một quy luật là một dòng lệnh. Trong trình quản lý file thì mất cả buổi chiều, và bạn sẽ làm sai.</span></div>
  <div class="kv"><span class="k">Ghép nối</span><span class="v">Những công cụ nhỏ nối bằng ống dẫn giải được những bài toán chưa ai viết công cụ riêng. Không GUI nào cho bạn nối hai chương trình mà người ta không tính trước là sẽ nối.</span></div>
  <div class="kv"><span class="k">Làm việc từ xa</span><span class="v">Một máy chủ không có màn hình. SSH cộng một shell là toàn bộ giao diện — và nó chạy được qua một đường mạng tồi, từ điện thoại.</span></div>
  <div class="kv"><span class="k">Tái lập được</span><span class="v">Một lệnh dán được vào tài liệu, review được, lưu phiên bản trong Git được, và một năm sau chạy lại y hệt. Một chuỗi cú bấm chuột thì không.</span></div>
  <div class="kv"><span class="k">Nhanh ở quy mô lớn</span><span class="v">Tìm trong mười triệu dòng bằng <code>grep</code> mất một giây. Mở chúng trong trình soạn thảo mất vài phút và có thể không vừa bộ nhớ.</span></div>
</div>
<div class="callout ok">Điểm mấu chốt không phải là terminal thắng GUI ở mọi thứ — không hề. Xem một tấm ảnh, dàn trang một tài liệu, khám phá một API lạ: hãy dùng công cụ có hình. Terminal thắng khi công việc là <em>lặp lại, ghép nối, từ xa hoặc cần tái lập</em>, và đó chính là mô tả cho phần lớn những gì diễn ra giữa lúc viết mã và lúc chạy nó trên production.</div>

<h3>Chạy thử từng bước: đổi tên cả một thư mục file trong một dòng</h3>
<p>Nói “đổi tên 4.000 file là một dòng lệnh” thì dễ. Đây là dòng lệnh đó, chạy thật trong container Ubuntu 24.04 của khoá, và từng mảnh của nó được giải thích. Thư mục ảnh chụp màn hình của nhóm có đuôi <code>.PNG</code> viết hoa làm máy chủ web (phân biệt hoa thường) không tìm thấy file, và một tên file có dấu cách:</p>
<pre><code class="language-bash">cd ~/thu-linux/anh
ls | wc -l
for f in *.PNG; do echo mv -- "$f" "\${f%.PNG}.png"; done   # 1) xem trước
for f in *.PNG; do mv -- "$f" "\${f%.PNG}.png"; done        # 2) làm thật
ls
ls | wc -l</code></pre>
<div class="out">5
mv -- Screenshot 1.PNG Screenshot 1.png
mv -- Screenshot 2.PNG Screenshot 2.png
mv -- logo.PNG logo.png
'Screenshot 1.png'  'Screenshot 2.png'   bia.png   ghi-chu.txt   logo.png
5</div>
<table>
<tr><th>Mảnh</th><th>Nghĩa là</th></tr>
<tr><td><code>for f in *.PNG; do … done</code></td><td>Vòng lặp (loop): shell khai triển <code>*.PNG</code> thành danh sách tên khớp trước, rồi chạy phần thân một lần cho mỗi tên với <code>f</code> mang tên đó (Chương 6).</td></tr>
<tr><td><code>"$f"</code></td><td>Giá trị của <code>f</code>, <em>trong nháy kép</em> để <code>Screenshot 1.PNG</code> vẫn là một tham số chứ không thành hai.</td></tr>
<tr><td><code>\${f%.PNG}</code></td><td>“<code>f</code> bị cắt <code>.PNG</code> ở cuối” — khai triển tham số, không cần chương trình ngoài nào (Chương 6).</td></tr>
<tr><td><code>--</code></td><td>“Hết phần tuỳ chọn”: file có tên bắt đầu bằng <code>-</code> sẽ không bị hiểu nhầm là một cờ.</td></tr>
<tr><td><code>echo</code> ở lần chạy đầu</td><td>Chạy thử (dry run): in từng lệnh ra thay vì chạy nó. Nhìn đã, rồi mới bỏ <code>echo</code>.</td></tr>
<tr><td><code>ls | wc -l</code> trước và sau</td><td>Bằng chứng không mất file nào: trước 5 tên, sau vẫn 5.</td></tr>
</table>
<p>Vì sao dấu nháy quan trọng — cùng vòng lặp đó mà bỏ nháy, với <code>printf "[%s] "</code> in ra từng tham số <code>mv</code> sẽ nhận:</p>
<div class="out">[mv] [Screenshot] [1.PNG] [Screenshot] [1.png]
[mv] [--] [Screenshot 1.PNG] [Screenshot 1.png]</div>
<p>(Dấu nháy đơn quanh <code>'Screenshot 1.png'</code> là do <code>ls</code> bản GNU tự thêm khi in ra terminal, để cho thấy dấu cách thuộc về tên — chúng không nằm trong tên file.) Dòng đầu là bản không bọc nháy: bốn tham số tên file, không cái nào tồn tại. Dòng sau là bản có nháy: đúng hai.</p>
<div class="callout warn"><strong>Trên macOS (zsh) thì khác.</strong> Nếu không file nào khớp, bash lặng lẽ truyền nguyên cái mẫu đi (<code>file: *.JPG</code>), còn zsh dừng lại báo lỗi. Output thật trên Mac, trong một thư mục rỗng:<br><code>zsh:1: no matches found: *.JPG</code><br>Không bên nào sai; đó là hai luật khác nhau (Chương 15). Trên WSL bạn đang ở bash thật, nên nó cư xử như Ubuntu.</div>
<table>
<tr><th>Dùng terminal khi…</th><th>Dùng công cụ đồ hoạ khi…</th></tr>
<tr><td>cùng một thao tác lặp trên nhiều file hay nhiều máy</td><td>bạn chỉ nhìn một thứ một lần — một tấm ảnh, một bố cục, một biểu đồ</td></tr>
<tr><td>máy ở xa hoặc không có màn hình</td><td>bạn đang khám phá thứ mình chưa hiểu và muốn nhìn thấy nó</td></tr>
<tr><td>các bước phải được ghi lại, review và lặp lại về sau</td><td>bản chất công việc cần chuột: vẽ, cắt ảnh, sắp xếp</td></tr>
</table>

<h3>Khoá này dành cho ai</h3>
${slide('lx-00', 16, 'Khoá này cho ai — và nên bắt đầu từ đâu')}
<div class="kv-grid">
  <div class="kv"><span class="k">Người quen dán lệnh</span><span class="v">Bạn chép lệnh từ hướng dẫn và chúng thường chạy được. Bắt đầu từ bài 0.2 — sau Chương 6 bạn sẽ ĐỌC một lệnh thay vì tin nó.</span></div>
  <div class="kv"><span class="k">Lập trình viên có deploy</span><span class="v">Bạn code được, nhưng SSH vào máy chủ thì thấy lo lo. Chương 4, 5, 9 và 11 viết cho bạn.</span></div>
  <div class="kv"><span class="k">Kỹ sư tự học</span><span class="v">Bạn biết hai mươi lệnh và ngờ rằng bên dưới có một hệ thống. Chương 1, 3 và 6 chính là cái hệ thống đó.</span></div>
  <div class="kv"><span class="k">Người đang trực</span><span class="v">Có một máy chủ đang trục trặc ngay lúc này. Chương 12 là sách công thức, đọc lẻ được.</span></div>
</div>

<h3>Học xong bạn làm được gì</h3>
${slide('lx-00', 18, 'Học xong, bạn đọc được những dòng này trước khi bấm Enter')}
<ul>
  <li>Đọc một lệnh lạ và đoán trước nó làm gì — kể cả những lệnh có ống dẫn, chuyển hướng và dấu nháy.</li>
  <li>Tìm mọi file trên một máy theo tên, kích thước, tuổi hay nội dung, và tác động lên tất cả chúng trong một dòng.</li>
  <li>Hiểu quyền đủ sâu để sửa lỗi "Permission denied" thay vì vớ lấy <code>sudo</code>.</li>
  <li>Nhìn ra máy đang thật sự làm gì: tiến trình nào ngốn CPU, cái gì đang giữ một cổng, vì sao đĩa đầy.</li>
  <li>Viết script shell hỏng thì kêu to chứ không hỏng trong im lặng, có kiểm tham số và dọn dẹp khi thoát.</li>
  <li>Chạy một dịch vụ dưới <code>systemd</code>, hẹn giờ công việc, đọc log, và gia cố SSH.</li>
  <li>Chẩn đoán một máy chủ bạn chưa từng thấy, chỉ bằng một cái terminal.</li>
</ul>

<h3>Lộ trình 13 chương</h3>
${slide('lx-00', 17, 'Lộ trình 17 phần: năm chặng từ cd tới vận hành máy chủ')}
<div class="callout ok"><strong>Cập nhật (tháng 9/2026): khoá nay có 17 phần.</strong> Mười ba phần dưới đây — Mục 0 và Chương 1–12 — giữ nguyên. Bốn chương được bổ sung sau chúng, cho những ai muốn đi từ “chạy được một máy chủ” tới “hiểu nó thật sâu”: <strong>Chương 13, Bash nâng cao</strong> (mảng và mảng kết hợp, process substitution, <code>coproc</code>, tốc độ), <strong>Chương 14, Linux chuyên sâu</strong> (nhân, hiệu năng, lưu trữ, bảo mật), <strong>Chương 15, dùng kỹ năng Linux trên macOS và Windows</strong> (zsh, bộ lệnh BSD, Homebrew, launchd, WSL và PowerShell), và <strong>Chương 16, dự án cuối khoá</strong>: tự dựng, tự động hoá và vận hành một máy chủ thật, kết thúc bằng bài kiểm tra cuối khoá. Chúng được liệt kê thành Phần 5 ở cuối bản đồ bên dưới.</div>
<div class="lz-map">
  <div class="lz-stage">Phần 1 — Đi lại trong máy (Ch 1–3)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Shell &amp; hệ thống file</div><div class="lz-nsub">Shell thật ra là gì, đường dẫn tuyệt đối vs tương đối, cây thư mục và mỗi thư mục gốc dùng để làm gì</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">File &amp; thư mục</div><div class="lz-nsub">Tạo, chép, chuyển, xoá an toàn · glob · find · liên kết · nén và giải nén</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Văn bản, ống dẫn &amp; chuyển hướng</div><div class="lz-nsub">Ý tưởng làm nên Unix: công cụ nhỏ, mỗi cái một việc, nối bằng ống. grep, sed, awk, sort, cut</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 2 — Máy hoạt động thế nào (Ch 4–5)</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Quyền, người dùng &amp; sudo</div><div class="lz-nsub">rwx, chmod, chown, umask, nhóm — và vì sao "Permission denied" thường không phải chuyện thiếu sudo</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Tiến trình, job &amp; tín hiệu</div><div class="lz-nsub">ps, top, kill, chạy nền, nohup — Ctrl-C thật ra gửi cái gì và vì sao vài chương trình lờ nó đi</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 3 — Shell như một ngôn ngữ (Ch 6–8)</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Biến, dấu nháy &amp; khai triển</div><div class="lz-nsub">Chương làm cho lệnh của bạn thôi vỡ vì một dấu cách trong tên file. Mã thoát, rẽ nhánh, vòng lặp, hàm</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Viết script cho production</div><div class="lz-nsub">set -euo pipefail, tham số, kiểm tính hợp lệ, trap để dọn dẹp, và cách gỡ lỗi một script</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Môi trường, PATH &amp; file khởi động</div><div class="lz-nsub">Vì sao có "command not found", sửa file nào, và shell đăng nhập vs shell tương tác</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 4 — Vận hành một cái máy (Ch 9–12)</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Mạng &amp; máy từ xa</div><div class="lz-nsub">ss, ip, curl, dig, ssh, scp, rsync — và đọc một cái tường lửa</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Đĩa, gói phần mềm &amp; log</div><div class="lz-nsub">df vs du, tìm ra thứ làm đầy đĩa, apt/dnf, journalctl, xoay vòng log</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">systemd, cron &amp; quản trị</div><div class="lz-nsub">Chạy ứng dụng của bạn như một dịch vụ tự khởi động lại, hẹn giờ công việc, gia cố SSH</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Chẩn đoán một máy chủ thật</div><div class="lz-nsub">Sách công thức: đĩa đầy, cổng bị chiếm, dịch vụ không lên, máy chậm, hết bộ nhớ</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 5 — Đi xa hơn (Ch 13–16, bổ sung 2026)</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Bash nâng cao</div><div class="lz-nsub">Mảng chỉ số và mảng kết hợp, mapfile, process substitution, coproc, và làm cho script chạy nhanh</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Linux chuyên sâu</div><div class="lz-nsub">Nhân, namespace và cgroup, hiệu năng, lưu trữ và LVM, bảo mật</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Dùng kỹ năng Linux trên macOS và Windows</div><div class="lz-nsub">zsh và bộ lệnh BSD, Homebrew, launchd, WSL 2, Git Bash và PowerShell</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Dự án cuối khoá: dựng, tự động hoá và vận hành một máy chủ thật</div><div class="lz-nsub">Một dự án dùng tới mọi chương, và bài kiểm tra cuối khoá</div></div></div>
</div>

<h3>Bash, và những shell khác</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bash</span><span class="v">Thứ khoá này dạy. Mặc định trên gần như mọi máy chủ Linux, và là ngôn ngữ của gần như mọi script bạn sẽ tiếp quản.</span></div>
  <div class="kv"><span class="k">zsh</span><span class="v">Mặc định của macOS từ 2019. Gần như toàn bộ khoá này áp dụng nguyên vẹn; những chỗ khác biệt đáng kể đều được ghi chú.</span></div>
  <div class="kv"><span class="k">sh / dash</span><span class="v">Mức tối thiểu theo POSIX. Script bắt đầu bằng <code>#!/bin/sh</code> phải tránh các tính năng chỉ có ở Bash — Chương 7 nói về cái bẫy này.</span></div>
  <div class="kv"><span class="k">fish</span><span class="v">Thân thiện hơn khi gõ tay, cố tình không tương thích POSIX. Dùng làm shell hằng ngày thì ổn; đừng viết script cho máy chủ bằng nó.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm SWP391 của bạn đổ ảnh chụp màn hình cho báo cáo vào một thư mục, nửa đuôi <code>.PNG</code>, nửa <code>.png</code>, và máy chủ web Linux coi <code>logo.PNG</code> với <code>logo.png</code> là hai file khác nhau. Hãy chuẩn hoá chúng — không được mất một file nào.</p><ol>
<li>Tạo thư mục và năm file thử: <code>mkdir -p ~/thu-linux/anh &amp;&amp; cd ~/thu-linux/anh</code>, rồi <code>touch "Screenshot 1.PNG" "Screenshot 2.PNG" logo.PNG bia.png ghi-chu.txt</code>.</li>
<li>Đếm: <code>ls | wc -l</code> — ghi lại con số.</li>
<li>Chạy thử: <code>for f in *.PNG; do echo mv -- "$f" "\${f%.PNG}.png"; done</code>. Kiểm xem mỗi dòng có đúng một tên cũ và một tên mới.</li>
<li>Chạy thật (bỏ <code>echo</code>), rồi <code>ls</code> và <code>ls | wc -l</code> lần nữa.</li>
<li>Chứng minh không còn đuôi viết hoa: <code>ls *.PNG</code> giờ phải báo lỗi.</li></ol>
<p><strong>Đạt khi:</strong> trước 5 sau vẫn 5, <code>ls</code> hiện <code>Screenshot 1.png</code> (một tên, giữ nguyên dấu cách), và <code>ls *.PNG</code> trả lời <code>ls: cannot access '*.PNG': No such file or directory</code> — output thật từ container của khoá.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CLI / GUI (giao diện dòng lệnh / đồ hoạ)</span><span class="v">Command-line interface là gõ lệnh; graphical user interface là bấm chuột vào hình.</span></div>
  <div class="kv"><span class="k">Glob (mẫu tên file)</span><span class="v">Một mẫu như <code>*.PNG</code> mà shell khai triển thành các tên file khớp.</span></div>
  <div class="kv"><span class="k">Loop (vòng lặp)</span><span class="v"><code>for … in …; do … done</code>: chạy cùng các lệnh một lần cho mỗi phần tử.</span></div>
  <div class="kv"><span class="k">Dry run (chạy thử)</span><span class="v">In ra việc lệnh sẽ làm (thường bằng <code>echo</code>) trước khi cho nó làm thật.</span></div>
  <div class="kv"><span class="k">Reproducible (tái lập được)</span><span class="v">Lặp lại y hệt về sau được — lệnh trong file thì được, chuỗi cú bấm chuột thì không.</span></div>
  <div class="kv"><span class="k">SSH (shell an toàn từ xa)</span><span class="v">Secure Shell: một shell trên máy ở xa qua kết nối mã hoá (Chương 9).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Terminal thắng khi công việc lặp lại, cần ghép nối, ở xa hoặc phải tái lập được; GUI thắng khi chỉ cần nhìn một thứ một lần.</li>
<li>Một vòng lặp cộng một glob đổi tên 5 hay 4.000 file bằng cùng một dòng; xem trước bằng <code>echo</code>, đếm trước và sau.</li>
<li>Bọc biến trong nháy (<code>"$f"</code>), không thì dấu cách trong tên file tách nó thành hai tham số.</li>
<li>bash và zsh xử lý glob không khớp khác nhau: bash truyền nguyên mẫu đi, zsh dừng với “no matches found”.</li>
<li>Khoá có 17 phần: Mục 0, Chương 1–12 (đi lại trong máy → vận hành máy chủ) và Chương 13–16 (Bash nâng cao, Linux chuyên sâu, macOS/Windows, dự án cuối khoá).</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/bash.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Sách tra cứu Bash của GNU</span><span class="lc-sub">Nguồn chuẩn mực. Đặc, đầy đủ, và là nơi dàn xếp mọi tranh cãi về khai triển.</span></span>
</a>
<a class="link-card" href="https://linuxjourney.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Linux Journey — chuyến tham quan Linux miễn phí, có cấu trúc</span><span class="lc-sub">Đọc kèm rất hợp: bài ngắn hơn, cùng thứ tự với khoá này.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: track Linux &amp; Bash trên Code Lab</span><span class="lc-sub">Bài tập chấm điểm bám theo các chương này. Đọc ở đây, luyện ở đó.</span></span>
</a>

<div class="pitfall"><strong>Cái bẫy mà khoá này sinh ra để phá:</strong> chạy những lệnh bạn không hiểu chỉ vì một bài blog bảo thế. Phần lớn thời gian nó chạy được, và đó chính là vấn đề — cái lần duy nhất nó không chạy được, bạn chẳng biết cái máy đang ở trạng thái nào, và cái lệnh "chữa được" cho người khác có thể đã xoá mất thứ gì đó của bạn. Tới Chương 6 bạn sẽ đọc được <code>find . -name '*.log' -mtime +30 -delete</code> và biết chính xác nó sẽ xoá gì trước khi bấm Enter.</div>
<p class="note-ct"><strong>Cách dùng khoá này:</strong> hãy mở sẵn một máy Linux vứt đi bên cạnh và chạy mọi lệnh khi bạn đọc tới. Bài 0.3 dựng cho bạn một cái — một container hay một máy ảo mà bạn phá và dựng lại trong ba mươi giây. Đọc về <code>rm -rf</code> không dạy được gì; chạy nó ở một nơi không có hậu quả thì dạy được vĩnh viễn.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — Kernel, shell, terminal: three things people confuse|||0.2 — Kernel, shell, terminal: ba thứ người ta hay lẫn',
      slug: 'lnx-0-2-kernel-shell-terminal',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Phân biệt ba lớp mà ai cũng gọi nhầm là "terminal", triết lý Unix trong một câu, vì sao "mọi thứ là một file", và bức tranh giúp mọi chương sau đọc được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>The three layers behind that black window</h2>
<p class="lead">People say "the terminal", "the shell", "the command line" and "Linux" as if they were one thing. They are four, they sit in layers, and knowing which is which explains half the confusing errors you will meet.</p>
${slide('lx-00', 19, 'Bốn lớp sau cái cửa sổ đen: mỗi lỗi thuộc về MỘT lớp')}

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Terminal emulator</span><span class="lz-v">The <strong>window</strong>. iTerm, Windows Terminal, GNOME Terminal, the panel in VS Code. It draws characters and captures keystrokes. It runs no commands.</span></div>
  <div class="lz-layer"><span class="lz-k">Shell</span><span class="lz-v">The <strong>program</strong> running inside that window — <code>bash</code>, <code>zsh</code>, <code>fish</code>. It reads what you type, interprets it, and starts other programs.</span></div>
  <div class="lz-layer"><span class="lz-k">Utilities</span><span class="lz-v">The <strong>programs</strong> the shell starts: <code>ls</code>, <code>grep</code>, <code>curl</code>. Separate executables on disk, not part of the shell.</span></div>
  <div class="lz-layer"><span class="lz-k">Kernel</span><span class="lz-v">Linux itself. The only thing that actually touches hardware — files, memory, network, processes. Every program asks it for everything.</span></div>
</div>
<pre><code><span class="tok-comment"># Which shell am I in, and where does it live?</span>
<span class="tok-keyword">echo</span> \$SHELL
ps -p \$\$ -o comm=
<span class="tok-comment"># Is 'ls' a program or part of the shell?</span>
<span class="tok-keyword">type</span> ls; <span class="tok-keyword">type</span> cd</code></pre>
<div class="out">/bin/bash
bash
ls is /usr/bin/ls
cd is a shell builtin</div>
<div class="callout ok">That last pair is the distinction made concrete. <code>ls</code> is a file on disk that the shell launches. <code>cd</code> cannot be — changing directory means changing the shell's <em>own</em> state, and a separate program could not do that. Every "why is <code>cd</code> special?" question has this answer.</div>

<h3>Run it step by step: which layer am I talking to?</h3>
${slide('lx-00', 20, 'cd bắt buộc là “builtin” — ls thì là một file')}
<p><code>type</code> is the shell's own answer to "what is this word?". <code>type -t</code> prints just the kind, and <code>type -a</code> lists <em>every</em> match in the order the shell would try them. Real output from the course's Ubuntu 24.04 container (bash 5.2):</p>
<pre><code class="language-bash">type -t cd ls if echo
type -a pwd
dpkg -S /usr/bin/ls</code></pre>
<div class="out">builtin
file
keyword
builtin
pwd is a shell builtin
pwd is /usr/bin/pwd
pwd is /bin/pwd
coreutils: /usr/bin/ls</div>
<table>
<tr><th><code>type -t</code> says</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>builtin</code></td><td>Code inside the shell itself; runs without starting a new process</td><td><code>cd</code>, <code>echo</code>, <code>pwd</code>, <code>export</code></td></tr>
<tr><td><code>file</code></td><td>A separate program on disk, found through <code>PATH</code></td><td><code>ls</code>, <code>grep</code>, <code>curl</code></td></tr>
<tr><td><code>keyword</code></td><td>Part of the shell's grammar, not a command at all</td><td><code>if</code>, <code>for</code>, <code>while</code></td></tr>
<tr><td><code>alias</code> / <code>function</code></td><td>A shortcut or function you (or your startup files) defined</td><td><code>ll</code> on many systems (Chapter 8)</td></tr>
</table>
<p><code>pwd</code> is both a builtin and a file, and the builtin wins because the shell checks builtins before searching <code>PATH</code>. <code>dpkg -S</code> answers "which package installed this file?" — <code>ls</code> belongs to GNU coreutils.</p>
<div class="callout warn"><strong>On macOS this differs — and proves the point.</strong> In zsh the equivalent of <code>type -a</code> is <code>whence -a</code>, and on a Mac it reveals something odd: there is a file <code>/usr/bin/cd</code>. Its last line is <code>builtin &#96;echo \${0##*/} | tr \\[:upper:] \\[:lower:]&#96; \${1+"$@"}</code> — a tiny script that runs the builtin <code>cd</code> <em>in its own child process</em>. Running <code>/usr/bin/cd /tmp</code> on the course Mac returned exit code 0 and <code>pwd</code> had not changed at all. It exists only because POSIX asks for it. On WSL you are in real bash, so the Ubuntu output above applies.</div>

<h3>The Unix philosophy, in one sentence</h3>
${slide('lx-00', 23, 'Triết lý Unix: mỗi chương trình một việc, nối bằng ống')}
<div class="callout ok"><strong>Write programs that do one thing well, and that work together, on text streams.</strong> That is the entire design, from 1978, and it is why Chapter 3's pipes are the most important idea in this course.</div>
<p>Compare the two worlds. A monolithic tool has a "search" feature, a "sort" feature and an "export" feature, and can only combine them in ways its author anticipated. Unix ships <code>grep</code>, <code>sort</code> and <code>tee</code> as separate programs — so you can combine them in ways nobody anticipated:</p>
<pre><code><span class="tok-comment"># Nobody wrote "top 5 IPs by 500-error count". You just did.</span>
grep <span class="tok-string">' 500 '</span> access.log | awk <span class="tok-string">'{print \$1}'</span> | sort | uniq -c | sort -rn | head -5</code></pre>
<div class="out">    412 203.0.113.44
     87 198.51.100.9
     31 203.0.113.7</div>
<p>Five programs, none of which knows the others exist. That composability is what a GUI structurally cannot offer.</p>

<h3>"Everything is a file"</h3>
${slide('lx-00', 22, '“Mọi thứ là một file”: ổ đĩa, tiến trình, cả nhân')}
<p>Unix exposes almost everything through the same interface — open, read, write, close — so the same tools work on all of it:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ordinary files</span><span class="v"><code>/etc/hostname</code>, your source code. What you expect.</span></div>
  <div class="kv"><span class="k">Directories</span><span class="v">A file listing what is inside it. That is why permissions on a directory behave oddly until Chapter 4 explains it.</span></div>
  <div class="kv"><span class="k">Devices</span><span class="v"><code>/dev/sda</code> is your disk, <code>/dev/null</code> discards anything written to it, <code>/dev/urandom</code> produces random bytes forever.</span></div>
  <div class="kv"><span class="k">Kernel state</span><span class="v"><code>/proc/cpuinfo</code>, <code>/proc/meminfo</code>, <code>/sys/class/…</code>. Not real files — the kernel generates them when you read.</span></div>
  <div class="kv"><span class="k">Processes</span><span class="v"><code>/proc/1234/</code> is process 1234: its command line, environment, open files. Chapter 5 uses this.</span></div>
</div>
<pre><code>cat /proc/meminfo | head -3        <span class="tok-comment"># kernel state, read like a text file</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"noise"</span> &gt; /dev/null            <span class="tok-comment"># the universal wastebasket</span>
head -c 8 /dev/urandom | xxd       <span class="tok-comment"># randomness, read like a file</span></code></pre>
<div class="out">MemTotal:       16316904 kB
MemFree:         2184532 kB
MemAvailable:    9847220 kB</div>
<p>Two notes from running this for real. First, <code>xxd</code> is not installed in the minimal <code>ubuntu:24.04</code> image (it comes with <code>vim</code>); <code>od</code> is always there and does the same job:</p>
<pre><code class="language-bash">head -c 8 /dev/urandom | od -An -tx1
ls -l /dev/null
tr '\\0' ' ' &lt; /proc/1/cmdline; echo</code></pre>
<div class="out"> 08 01 fd f7 0d e3 0a d8
crw-rw-rw- 1 root root 1, 3 Sep 28 08:39 /dev/null
sleep infinity</div>
<p>The <code>c</code> at the start of the <code>ls -l</code> line means "character device" — a file that is really a door into the kernel. <code>/proc/1/cmdline</code> is the command line of process 1, with its words separated by zero bytes, which <code>tr</code> turns into spaces; in the course container process 1 is <code>sleep infinity</code>. Second, on a Mac: <code>ls /proc</code> answers <code>ls: /proc: No such file or directory</code>. macOS keeps the "everything is a file" idea for <code>/dev</code>, but has no <code>/proc</code> — commands like <code>ps</code> and <code>top</code> use other interfaces there.</p>


<h3>What happens when you press Enter</h3>
${slide('lx-00', 21, 'Bấm Enter: shell BIẾN ĐỔI lệnh trước khi chạy')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">The terminal sends the line</div><div class="lz-d">Your keystrokes reach the shell as text.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">The shell expands it</div><div class="lz-d">Variables, <code>*</code> globs, quotes, <code>\$(…)</code> — Chapter 6. The command that runs is often not what you typed.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">It finds the program</div><div class="lz-d">Searches each directory in <code>PATH</code> in order — Chapter 8, and the source of "command not found".</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">It asks the kernel to run it</div><div class="lz-d">A new process is created with three streams already open: stdin, stdout, stderr.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">It waits, then reports</div><div class="lz-d">The program exits with a status code; the shell stores it in <code>\$?</code> — Chapter 6.</div></div>
</div>
<div class="callout warn">Step 2 is where beginners lose control. <code>rm *.txt</code> never reaches <code>rm</code> as <code>*.txt</code> — the shell expands the glob first, and <code>rm</code> receives a list of filenames it has no idea was ever a pattern. When a command behaves unexpectedly, the question is usually "what did the shell turn this into?", not "what does this program do?".</div>
<h3>Run it step by step: watch step 2 with set -x</h3>
<p><code>set -x</code> makes bash print every command <em>after</em> expansion, prefixed with <code>+</code>, just before running it. It is the single most useful debugging switch in this course (Chapter 7 uses it for scripts). Real output in the course container, in a folder that already held <code>ghi-chu.txt</code>:</p>
<pre><code class="language-bash">touch a.txt b.txt
set -x
ls *.txt
echo $HOME
set +x</code></pre>
<div class="out">+ ls a.txt b.txt ghi-chu.txt
a.txt
b.txt
ghi-chu.txt
+ echo /root
/root
+ set +x</div>
<p>Read the <code>+</code> lines: <code>ls</code> never saw <code>*.txt</code>, it received three names; <code>echo</code> never saw <code>$HOME</code>, it received <code>/root</code>. <code>set +x</code> switches tracing off again (and is itself traced once).</p>

<h3>Distributions: what actually differs</h3>
${slide('lx-00', 24, 'Distro khác nhau hẹp: gói, init, và bộ lệnh lõi')}
<p>Ubuntu, Debian, Fedora, Alpine and Arch all run the Linux kernel and all give you a shell. For everything in this course, the differences are narrow:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Package manager</span><span class="v"><code>apt</code> (Debian/Ubuntu) · <code>dnf</code> (Fedora/RHEL) · <code>apk</code> (Alpine) · <code>pacman</code> (Arch). Chapter 10.</span></div>
  <div class="kv"><span class="k">Init system</span><span class="v"><code>systemd</code> nearly everywhere; Alpine uses OpenRC. Chapter 11.</span></div>
  <div class="kv"><span class="k">Default shell &amp; utilities</span><span class="v">Alpine ships BusyBox — smaller versions of the same commands, missing some flags. A script that works on Ubuntu can fail in an Alpine container for exactly this reason.</span></div>
</div>

<h3>Seeing the difference for real: BusyBox and /bin/sh</h3>
<p>Two commands show how far "the same Linux" can differ. In an Alpine container, <code>ls</code> is not GNU coreutils at all but a link to BusyBox, a single small program that plays the role of hundreds of commands:</p>
<pre><code class="language-bash">docker run --rm alpine ls --version
docker run --rm alpine readlink -f /bin/sh
readlink -f /bin/sh        # on Ubuntu 24.04</code></pre>
<div class="out">ls: unrecognized option: version
BusyBox v1.37.0 (2026-01-10 15:38:28 UTC) multi-call binary.
…
/bin/busybox
/usr/bin/dash</div>
<p>And <code>/bin/sh</code> — the shell that runs any script starting with <code>#!/bin/sh</code> — is <strong>dash</strong> on Ubuntu, <strong>bash</strong> on Fedora (<code>/usr/bin/bash</code> on the course's Fedora 44 machine) and <strong>BusyBox</strong> on Alpine. A script that uses bash-only features but says <code>#!/bin/sh</code> therefore works on Fedora and breaks on Ubuntu and Alpine — Chapter 7 shows how to avoid that.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate asks "why does <code>cd</code> in my script not change my directory?" Answer with evidence, not opinion.</p><ol>
<li>In <code>~/thu-linux</code>, create a two-line script: <code>printf "cd /tmp\\npwd\\n" &gt; doi-thu-muc.sh</code>.</li>
<li>Run it as a separate process: <code>bash doi-thu-muc.sh</code>, then type <code>pwd</code> yourself. Where are you?</li>
<li>Now run it inside your current shell: <code>source doi-thu-muc.sh</code>, then <code>pwd</code>. Where are you now? (<code>cd ~/thu-linux</code> to go back.)</li>
<li>Ask the shell what four words are: <code>type -t cd ls if source</code>.</li>
<li>Turn on <code>set -x</code>, run <code>ls ~/thu-linux/*.txt</code>, read the <code>+</code> line, then <code>set +x</code>.</li></ol>
<pre><code class="language-bash">bash doi-thu-muc.sh; pwd
source doi-thu-muc.sh; pwd</code></pre>
<div class="out">/tmp
/root/thu-linux
/tmp
/tmp</div>
<p><strong>Done when:</strong> your output matches the pattern above (the script's own <code>pwd</code> says <code>/tmp</code> both times, but your shell only moves with <code>source</code>), <code>type -t</code> printed <code>builtin file keyword builtin</code>, and you can explain the difference in one sentence using the words "child process".</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Terminal emulator</span><span class="v">The window program that draws text and passes keystrokes to the shell.</span></div>
  <div class="kv"><span class="k">Builtin</span><span class="v">A command implemented inside the shell itself, like <code>cd</code> or <code>export</code>.</span></div>
  <div class="kv"><span class="k">Keyword</span><span class="v">A word of the shell's grammar (<code>if</code>, <code>for</code>), not a command.</span></div>
  <div class="kv"><span class="k">Child process</span><span class="v">A new process started by another; it inherits a copy of the parent's state and cannot change the original.</span></div>
  <div class="kv"><span class="k">Expansion</span><span class="v">The shell rewriting what you typed — variables, globs, quotes — before running it.</span></div>
  <div class="kv"><span class="k">/proc</span><span class="v">A virtual filesystem where the Linux kernel shows its own state and every process as files.</span></div>
  <div class="kv"><span class="k">Device file</span><span class="v">A file such as <code>/dev/null</code> that is a doorway to a driver in the kernel.</span></div>
  <div class="kv"><span class="k">BusyBox</span><span class="v">One small program that provides many basic commands, used in Alpine and embedded systems.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Terminal, shell, programs and kernel are four layers; an error usually tells you which one complained.</li>
<li><code>type -t</code> / <code>type -a</code> say whether a word is a builtin, a file, a keyword or an alias; builtins win over files.</li>
<li><code>cd</code> must be a builtin: a child process can only change its own directory — <code>source</code> runs a script in the current shell.</li>
<li>The shell expands globs and variables before a program starts; <code>set -x</code> shows the command after expansion.</li>
<li>Devices and kernel state appear as files (<code>/dev</code>, <code>/proc</code>); macOS has <code>/dev</code> but no <code>/proc</code>.</li>
<li>Distributions differ in package manager, init system and core tools — <code>/bin/sh</code> is dash on Ubuntu, bash on Fedora, BusyBox on Alpine.</li>
</ul>

<a class="link-card" href="https://en.wikipedia.org/wiki/Unix_philosophy" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">The Unix philosophy — McIlroy's original formulation</span><span class="lc-sub">Four sentences from 1978 that explain the design of everything in this course.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/proc.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">proc(7) — the /proc filesystem, documented</span><span class="lc-sub">Every file the kernel exposes about itself and about running processes.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> assuming a command failed because "Linux is broken", when the shell never ran the command you meant. A stray space, an unquoted variable containing a space, or a glob that matched nothing all produce errors that name the <em>program</em> and hide the real cause. Chapter 6 gives you <code>set -x</code>, which prints the command after expansion — and settles the question in one line.</div>
<p class="note-ct"><strong>The picture to carry forward:</strong> you type into a <em>terminal</em>, which feeds a <em>shell</em>, which expands what you wrote and asks the <em>kernel</em> to run separate <em>programs</em>. Every chapter of this course lives at one of those layers, and knowing which one a problem belongs to is most of the diagnosis.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Ba lớp đằng sau cái cửa sổ đen ấy</h2>
<p class="lead">Người ta nói "terminal", "shell", "dòng lệnh" và "Linux" như thể chúng là một thứ. Chúng là bốn thứ, xếp thành lớp, và biết cái nào là cái nào sẽ giải thích được một nửa số lỗi khó hiểu bạn sẽ gặp.</p>
${slide('lx-00', 19, 'Bốn lớp sau cái cửa sổ đen: mỗi lỗi thuộc về MỘT lớp')}

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Trình giả lập terminal</span><span class="lz-v">Cái <strong>CỬA SỔ</strong>. iTerm, Windows Terminal, GNOME Terminal, ô terminal trong VS Code. Nó vẽ ký tự và bắt phím. Nó không chạy lệnh nào cả.</span></div>
  <div class="lz-layer"><span class="lz-k">Shell</span><span class="lz-v">Cái <strong>CHƯƠNG TRÌNH</strong> chạy bên trong cửa sổ đó — <code>bash</code>, <code>zsh</code>, <code>fish</code>. Nó đọc thứ bạn gõ, diễn giải, rồi khởi động các chương trình khác.</span></div>
  <div class="lz-layer"><span class="lz-k">Các tiện ích</span><span class="lz-v">Những <strong>CHƯƠNG TRÌNH</strong> mà shell khởi động: <code>ls</code>, <code>grep</code>, <code>curl</code>. Là các file thực thi riêng trên đĩa, không thuộc về shell.</span></div>
  <div class="lz-layer"><span class="lz-k">Kernel (nhân)</span><span class="lz-v">Chính là Linux. Thứ duy nhất thật sự chạm vào phần cứng — file, bộ nhớ, mạng, tiến trình. Mọi chương trình đều phải xin nó mọi thứ.</span></div>
</div>
<pre><code><span class="tok-comment"># Tôi đang ở shell nào, và nó nằm ở đâu?</span>
<span class="tok-keyword">echo</span> \$SHELL
ps -p \$\$ -o comm=
<span class="tok-comment"># 'ls' là một chương trình hay là một phần của shell?</span>
<span class="tok-keyword">type</span> ls; <span class="tok-keyword">type</span> cd</code></pre>
<div class="out">/bin/bash
bash
ls is /usr/bin/ls
cd is a shell builtin</div>
<div class="callout ok">Cặp cuối cùng đó là sự phân biệt được cụ thể hoá. <code>ls</code> là một file trên đĩa mà shell khởi chạy. <code>cd</code> thì không thể như thế — đổi thư mục nghĩa là đổi trạng thái <em>CỦA CHÍNH</em> shell, và một chương trình riêng biệt không làm được điều đó. Mọi câu hỏi "vì sao <code>cd</code> lại đặc biệt?" đều có câu trả lời này.</div>

<h3>Chạy thử từng bước: tôi đang nói chuyện với lớp nào?</h3>
${slide('lx-00', 20, 'cd bắt buộc là “builtin” — ls thì là một file')}
<p><code>type</code> là câu trả lời của chính shell cho câu hỏi “chữ này là cái gì?”. <code>type -t</code> chỉ in loại, còn <code>type -a</code> liệt kê <em>mọi</em> chỗ khớp theo đúng thứ tự shell sẽ thử. Output thật từ container Ubuntu 24.04 của khoá (bash 5.2):</p>
<pre><code class="language-bash">type -t cd ls if echo
type -a pwd
dpkg -S /usr/bin/ls</code></pre>
<div class="out">builtin
file
keyword
builtin
pwd is a shell builtin
pwd is /usr/bin/pwd
pwd is /bin/pwd
coreutils: /usr/bin/ls</div>
<table>
<tr><th><code>type -t</code> in ra</th><th>Nghĩa là</th><th>Ví dụ</th></tr>
<tr><td><code>builtin</code> (lệnh có sẵn)</td><td>Mã nằm ngay trong shell; chạy mà không cần tạo tiến trình mới</td><td><code>cd</code>, <code>echo</code>, <code>pwd</code>, <code>export</code></td></tr>
<tr><td><code>file</code></td><td>Một chương trình riêng trên đĩa, tìm qua <code>PATH</code></td><td><code>ls</code>, <code>grep</code>, <code>curl</code></td></tr>
<tr><td><code>keyword</code> (từ khoá)</td><td>Một phần ngữ pháp của shell, hoàn toàn không phải lệnh</td><td><code>if</code>, <code>for</code>, <code>while</code></td></tr>
<tr><td><code>alias</code> / <code>function</code></td><td>Lối tắt hoặc hàm do bạn (hay file khởi động) định nghĩa</td><td><code>ll</code> trên nhiều hệ thống (Chương 8)</td></tr>
</table>
<p><code>pwd</code> vừa là builtin vừa là file, và builtin thắng vì shell kiểm builtin trước khi đi tìm trong <code>PATH</code>. <code>dpkg -S</code> trả lời “gói nào đã cài file này?” — <code>ls</code> thuộc GNU coreutils.</p>
<div class="callout warn"><strong>Trên macOS thì khác — và chính nó chứng minh luận điểm.</strong> Trong zsh, thứ tương đương <code>type -a</code> là <code>whence -a</code>, và trên Mac nó lộ ra một điều lạ: có hẳn một file <code>/usr/bin/cd</code>. Dòng cuối của nó là <code>builtin &#96;echo \${0##*/} | tr \\[:upper:] \\[:lower:]&#96; \${1+"$@"}</code> — một script tí hon chạy lệnh builtin <code>cd</code> <em>trong tiến trình con của chính nó</em>. Chạy <code>/usr/bin/cd /tmp</code> trên Mac của khoá trả về mã thoát 0 và <code>pwd</code> không hề đổi. Nó tồn tại chỉ vì POSIX yêu cầu. Trên WSL bạn đang ở bash thật, nên output Ubuntu ở trên là đúng.</div>

<h3>Triết lý Unix, trong một câu</h3>
${slide('lx-00', 23, 'Triết lý Unix: mỗi chương trình một việc, nối bằng ống')}
<div class="callout ok"><strong>Hãy viết những chương trình làm một việc và làm giỏi, và phối hợp được với nhau, trên các dòng văn bản.</strong> Đó là toàn bộ thiết kế, từ năm 1978, và đó là lý do ống dẫn ở Chương 3 là ý tưởng quan trọng nhất của khoá này.</div>
<p>Hãy so hai thế giới. Một công cụ nguyên khối có tính năng "tìm", tính năng "sắp xếp" và tính năng "xuất ra", và chỉ ghép chúng lại được theo những cách mà tác giả nó lường trước. Unix giao <code>grep</code>, <code>sort</code> và <code>tee</code> như những chương trình riêng — nên bạn ghép chúng theo những cách chẳng ai lường trước:</p>
<pre><code><span class="tok-comment"># Không ai viết công cụ "top 5 IP theo số lỗi 500". Bạn vừa tự viết ra.</span>
grep <span class="tok-string">' 500 '</span> access.log | awk <span class="tok-string">'{print \$1}'</span> | sort | uniq -c | sort -rn | head -5</code></pre>
<div class="out">    412 203.0.113.44
     87 198.51.100.9
     31 203.0.113.7</div>
<p>Năm chương trình, không cái nào biết những cái kia tồn tại. Khả năng ghép nối đó là thứ mà một GUI, về mặt cấu trúc, không cung cấp nổi.</p>

<h3>"Mọi thứ đều là một file"</h3>
${slide('lx-00', 22, '“Mọi thứ là một file”: ổ đĩa, tiến trình, cả nhân')}
<p>Unix phơi gần như mọi thứ ra qua cùng một giao diện — mở, đọc, ghi, đóng — nên cùng một bộ công cụ chạy được trên tất cả:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">File thông thường</span><span class="v"><code>/etc/hostname</code>, mã nguồn của bạn. Đúng như bạn nghĩ.</span></div>
  <div class="kv"><span class="k">Thư mục</span><span class="v">Một file liệt kê những gì nằm bên trong nó. Vì thế quyền trên một thư mục hành xử hơi lạ, cho tới khi Chương 4 giải thích.</span></div>
  <div class="kv"><span class="k">Thiết bị</span><span class="v"><code>/dev/sda</code> là cái đĩa của bạn, <code>/dev/null</code> vứt bỏ mọi thứ ghi vào nó, <code>/dev/urandom</code> sinh byte ngẫu nhiên mãi mãi.</span></div>
  <div class="kv"><span class="k">Trạng thái kernel</span><span class="v"><code>/proc/cpuinfo</code>, <code>/proc/meminfo</code>, <code>/sys/class/…</code>. Không phải file thật — kernel sinh ra chúng vào lúc bạn đọc.</span></div>
  <div class="kv"><span class="k">Tiến trình</span><span class="v"><code>/proc/1234/</code> chính là tiến trình 1234: dòng lệnh, môi trường, các file đang mở của nó. Chương 5 dùng tới cái này.</span></div>
</div>
<pre><code>cat /proc/meminfo | head -3        <span class="tok-comment"># trạng thái kernel, đọc như một file chữ</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"noise"</span> &gt; /dev/null            <span class="tok-comment"># cái sọt rác vạn năng</span>
head -c 8 /dev/urandom | xxd       <span class="tok-comment"># sự ngẫu nhiên, đọc như một file</span></code></pre>
<div class="out">MemTotal:       16316904 kB
MemFree:         2184532 kB
MemAvailable:    9847220 kB</div>
<p>Hai ghi chú khi chạy thật. Thứ nhất, <code>xxd</code> không có sẵn trong ảnh tối giản <code>ubuntu:24.04</code> (nó đi kèm <code>vim</code>); <code>od</code> thì lúc nào cũng có và làm được đúng việc đó:</p>
<pre><code class="language-bash">head -c 8 /dev/urandom | od -An -tx1
ls -l /dev/null
tr '\\0' ' ' &lt; /proc/1/cmdline; echo</code></pre>
<div class="out"> 08 01 fd f7 0d e3 0a d8
crw-rw-rw- 1 root root 1, 3 Sep 28 08:39 /dev/null
sleep infinity</div>
<p>Chữ <code>c</code> đầu dòng <code>ls -l</code> nghĩa là “thiết bị ký tự” (character device) — một file thật ra là cánh cửa dẫn vào kernel. <code>/proc/1/cmdline</code> là dòng lệnh của tiến trình số 1, các từ ngăn nhau bằng byte 0, được <code>tr</code> đổi thành dấu cách; trong container của khoá, tiến trình 1 là <code>sleep infinity</code>. Thứ hai, trên Mac: <code>ls /proc</code> trả lời <code>ls: /proc: No such file or directory</code>. macOS giữ ý tưởng “mọi thứ là file” cho <code>/dev</code>, nhưng không có <code>/proc</code> — ở đó các lệnh như <code>ps</code> và <code>top</code> dùng giao diện khác.</p>


<h3>Chuyện gì xảy ra khi bạn bấm Enter</h3>
${slide('lx-00', 21, 'Bấm Enter: shell BIẾN ĐỔI lệnh trước khi chạy')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Terminal gửi dòng chữ đi</div><div class="lz-d">Các phím bạn gõ tới tay shell dưới dạng văn bản.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Shell khai triển nó</div><div class="lz-d">Biến, glob <code>*</code>, dấu nháy, <code>\$(…)</code> — Chương 6. Lệnh được chạy thường KHÔNG phải thứ bạn gõ.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Nó tìm chương trình</div><div class="lz-d">Lần lượt tìm trong từng thư mục của <code>PATH</code> — Chương 8, và là nguồn gốc của "command not found".</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Nó nhờ kernel chạy chương trình</div><div class="lz-d">Một tiến trình mới ra đời với ba dòng đã mở sẵn: stdin, stdout, stderr.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Nó chờ, rồi báo cáo</div><div class="lz-d">Chương trình thoát kèm một mã trạng thái; shell lưu nó vào <code>\$?</code> — Chương 6.</div></div>
</div>
<div class="callout warn">Bước 2 là chỗ người mới mất quyền kiểm soát. <code>rm *.txt</code> không bao giờ tới tay <code>rm</code> dưới dạng <code>*.txt</code> — shell khai triển cái glob trước, và <code>rm</code> nhận một danh sách tên file mà nó chẳng hề biết từng là một mẫu. Khi một lệnh hành xử ngoài dự đoán, câu hỏi thường là "shell đã biến cái này thành gì?", chứ không phải "chương trình này làm gì?".</div>
<h3>Chạy thử từng bước: nhìn tận mắt bước 2 bằng set -x</h3>
<p><code>set -x</code> bắt bash in ra từng lệnh <em>sau khi</em> khai triển, có dấu <code>+</code> đứng trước, ngay trước khi chạy nó. Đây là công tắc gỡ lỗi hữu ích nhất của khoá này (Chương 7 dùng nó cho script). Output thật trong container của khoá, trong một thư mục đã có sẵn <code>ghi-chu.txt</code>:</p>
<pre><code class="language-bash">touch a.txt b.txt
set -x
ls *.txt
echo $HOME
set +x</code></pre>
<div class="out">+ ls a.txt b.txt ghi-chu.txt
a.txt
b.txt
ghi-chu.txt
+ echo /root
/root
+ set +x</div>
<p>Đọc các dòng <code>+</code>: <code>ls</code> chưa bao giờ thấy <code>*.txt</code>, nó nhận ba cái tên; <code>echo</code> chưa bao giờ thấy <code>$HOME</code>, nó nhận <code>/root</code>. <code>set +x</code> tắt chế độ theo dõi (và chính nó cũng được in ra một lần).</p>

<h3>Các bản phân phối: thật ra khác nhau ở đâu</h3>
${slide('lx-00', 24, 'Distro khác nhau hẹp: gói, init, và bộ lệnh lõi')}
<p>Ubuntu, Debian, Fedora, Alpine và Arch đều chạy nhân Linux và đều cho bạn một shell. Với mọi thứ trong khoá này, khác biệt là rất hẹp:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Trình quản lý gói</span><span class="v"><code>apt</code> (Debian/Ubuntu) · <code>dnf</code> (Fedora/RHEL) · <code>apk</code> (Alpine) · <code>pacman</code> (Arch). Chương 10.</span></div>
  <div class="kv"><span class="k">Hệ khởi động</span><span class="v"><code>systemd</code> ở gần như mọi nơi; Alpine dùng OpenRC. Chương 11.</span></div>
  <div class="kv"><span class="k">Shell và tiện ích mặc định</span><span class="v">Alpine đi kèm BusyBox — phiên bản nhỏ hơn của cùng những lệnh đó, thiếu một số cờ. Một script chạy tốt trên Ubuntu có thể hỏng trong container Alpine đúng vì lý do này.</span></div>
</div>

<h3>Nhìn tận mắt chỗ khác nhau: BusyBox và /bin/sh</h3>
<p>Hai lệnh cho thấy “cùng là Linux” có thể khác nhau tới đâu. Trong một container Alpine, <code>ls</code> hoàn toàn không phải GNU coreutils mà là một liên kết tới BusyBox, một chương trình nhỏ duy nhất đóng vai hàng trăm lệnh:</p>
<pre><code class="language-bash">docker run --rm alpine ls --version
docker run --rm alpine readlink -f /bin/sh
readlink -f /bin/sh        # trên Ubuntu 24.04</code></pre>
<div class="out">ls: unrecognized option: version
BusyBox v1.37.0 (2026-01-10 15:38:28 UTC) multi-call binary.
…
/bin/busybox
/usr/bin/dash</div>
<p>Còn <code>/bin/sh</code> — shell chạy mọi script bắt đầu bằng <code>#!/bin/sh</code> — là <strong>dash</strong> trên Ubuntu, <strong>bash</strong> trên Fedora (<code>/usr/bin/bash</code> trên máy Fedora 44 của khoá) và <strong>BusyBox</strong> trên Alpine. Vì thế một script dùng tính năng chỉ bash có mà lại ghi <code>#!/bin/sh</code> sẽ chạy được trên Fedora và hỏng trên Ubuntu lẫn Alpine — Chương 7 chỉ cách tránh.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn cùng nhóm hỏi “sao <code>cd</code> trong script của mình không đổi được thư mục?”. Hãy trả lời bằng bằng chứng, không bằng cảm tưởng.</p><ol>
<li>Trong <code>~/thu-linux</code>, tạo một script hai dòng: <code>printf "cd /tmp\\npwd\\n" &gt; doi-thu-muc.sh</code>.</li>
<li>Chạy nó như một tiến trình riêng: <code>bash doi-thu-muc.sh</code>, rồi tự gõ <code>pwd</code>. Bạn đang ở đâu?</li>
<li>Giờ chạy nó ngay trong shell hiện tại: <code>source doi-thu-muc.sh</code>, rồi <code>pwd</code>. Giờ bạn ở đâu? (<code>cd ~/thu-linux</code> để quay về.)</li>
<li>Hỏi shell bốn chữ này là gì: <code>type -t cd ls if source</code>.</li>
<li>Bật <code>set -x</code>, chạy <code>ls ~/thu-linux/*.txt</code>, đọc dòng <code>+</code>, rồi <code>set +x</code>.</li></ol>
<pre><code class="language-bash">bash doi-thu-muc.sh; pwd
source doi-thu-muc.sh; pwd</code></pre>
<div class="out">/tmp
/root/thu-linux
/tmp
/tmp</div>
<p><strong>Đạt khi:</strong> output của bạn theo đúng khuôn trên (chính <code>pwd</code> trong script cả hai lần đều in <code>/tmp</code>, nhưng shell của bạn chỉ di chuyển khi dùng <code>source</code>), <code>type -t</code> in <code>builtin file keyword builtin</code>, và bạn giải thích được khác biệt trong một câu có dùng cụm “tiến trình con”.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Terminal emulator (trình giả lập terminal)</span><span class="v">Chương trình cửa sổ vẽ chữ và chuyển phím bạn gõ tới shell.</span></div>
  <div class="kv"><span class="k">Builtin (lệnh có sẵn của shell)</span><span class="v">Lệnh được cài ngay bên trong shell, như <code>cd</code> hay <code>export</code>.</span></div>
  <div class="kv"><span class="k">Keyword (từ khoá)</span><span class="v">Một chữ thuộc ngữ pháp của shell (<code>if</code>, <code>for</code>), không phải lệnh.</span></div>
  <div class="kv"><span class="k">Child process (tiến trình con)</span><span class="v">Tiến trình mới do tiến trình khác khởi động; nó nhận bản sao trạng thái của cha và không đổi được bản gốc.</span></div>
  <div class="kv"><span class="k">Expansion (khai triển)</span><span class="v">Shell viết lại thứ bạn gõ — biến, glob, dấu nháy — trước khi chạy.</span></div>
  <div class="kv"><span class="k">/proc</span><span class="v">Hệ thống file ảo nơi kernel Linux trình bày trạng thái của nó và mọi tiến trình dưới dạng file.</span></div>
  <div class="kv"><span class="k">Device file (file thiết bị)</span><span class="v">Một file như <code>/dev/null</code>, thật ra là cửa dẫn tới một trình điều khiển trong kernel.</span></div>
  <div class="kv"><span class="k">BusyBox</span><span class="v">Một chương trình nhỏ cung cấp nhiều lệnh cơ bản, dùng trong Alpine và thiết bị nhúng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Terminal, shell, chương trình và kernel là bốn lớp; thông báo lỗi thường cho biết lớp nào đang kêu.</li>
<li><code>type -t</code> / <code>type -a</code> cho biết một chữ là builtin, file, từ khoá hay alias; builtin thắng file.</li>
<li><code>cd</code> bắt buộc là builtin: tiến trình con chỉ đổi được thư mục của chính nó — <code>source</code> chạy script ngay trong shell hiện tại.</li>
<li>Shell khai triển glob và biến trước khi chương trình khởi động; <code>set -x</code> cho thấy lệnh sau khai triển.</li>
<li>Thiết bị và trạng thái kernel hiện ra như file (<code>/dev</code>, <code>/proc</code>); macOS có <code>/dev</code> nhưng không có <code>/proc</code>.</li>
<li>Các distro khác nhau ở trình quản lý gói, hệ khởi động và bộ lệnh lõi — <code>/bin/sh</code> là dash trên Ubuntu, bash trên Fedora, BusyBox trên Alpine.</li>
</ul>

<a class="link-card" href="https://en.wikipedia.org/wiki/Unix_philosophy" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Triết lý Unix — bản phát biểu gốc của McIlroy</span><span class="lc-sub">Bốn câu từ năm 1978 giải thích thiết kế của mọi thứ trong khoá này.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/proc.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">proc(7) — hệ thống file /proc, có tài liệu đầy đủ</span><span class="lc-sub">Mọi file mà kernel phơi ra về chính nó và về các tiến trình đang chạy.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> cho rằng một lệnh hỏng vì "Linux dở hơi", trong khi shell chưa bao giờ chạy cái lệnh bạn định chạy. Một dấu cách lạc, một biến không bọc nháy có chứa dấu cách, hay một glob không khớp gì — tất cả đều sinh ra lỗi mang tên <em>CHƯƠNG TRÌNH</em> và giấu đi nguyên nhân thật. Chương 6 cho bạn <code>set -x</code>, thứ in ra cái lệnh SAU khi khai triển — và dàn xếp câu hỏi đó trong một dòng.</div>
<p class="note-ct"><strong>Bức tranh cần mang theo:</strong> bạn gõ vào một <em>terminal</em>, nó nạp cho một <em>shell</em>, shell khai triển thứ bạn viết rồi nhờ <em>kernel</em> chạy những <em>chương trình</em> riêng biệt. Mọi chương của khoá này sống ở một trong các lớp đó, và biết một vấn đề thuộc lớp nào đã là phần lớn của việc chẩn đoán.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Getting a real Linux shell on any machine|||0.3 — Có một shell Linux thật trên mọi loại máy',
      slug: 'lnx-0-3-cai-dat',
      type: 'LESSON',
      isFreePreview: true,
      description: 'WSL2 trên Windows, macOS và chỗ nó khác Linux, Docker làm sân tập vứt đi, và cấu hình terminal tối thiểu để phần còn lại của khoá dễ chịu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>A machine you are allowed to destroy</h2>
<p class="lead">Everything in this course should be run, not read. That means a Linux shell you can break without consequence — and on every platform there is a good option that takes under ten minutes.</p>

<h3>Windows — WSL2</h3>
${slide('lx-00', 26, 'Windows: WSL2 là Linux thật — đừng để code ở /mnt/c')}
<pre><code><span class="tok-comment"># In PowerShell as Administrator, once:</span>
wsl --install
<span class="tok-comment"># Reboot, then set a username and password when Ubuntu first starts.</span>

wsl --list --verbose        <span class="tok-comment"># check it is version 2</span>
wsl                          <span class="tok-comment"># enter the Linux shell</span></code></pre>
<p>WSL2 runs a genuine Linux kernel in a lightweight VM. It is not an emulation layer — <code>apt</code>, <code>systemd</code>, Docker and everything in this course behave as they do on a server.</p>
<div class="callout warn"><strong>Keep your project files inside the Linux filesystem</strong>, at <code>~/projects</code>, not on <code>/mnt/c/Users/…</code>. Crossing the Windows/Linux boundary makes file access roughly ten times slower, and permissions do not translate — a script you <code>chmod +x</code> on <code>/mnt/c</code> may not stay executable. Open the folder from VS Code with the WSL extension and it feels native.</div>

<h3>WSL in depth: the commands and settings you will actually use</h3>
<p>What follows is taken from Microsoft's WSL documentation (checked September 2026). The course's machines are a Mac and Linux, so these Windows commands are <em>not</em> shown with recorded output — run them yourself and compare with the documentation linked at the end of the lesson.</p>
<table>
<tr><th>Command (PowerShell)</th><th>What it does</th><th>When you need it</th></tr>
<tr><td><code>wsl --install</code></td><td>Enables WSL and installs Ubuntu, the default distribution</td><td>Once. Needs Windows 10 version 2004 (build 19041) or later, or Windows 11, and a restart</td></tr>
<tr><td><code>wsl --list --online</code> · <code>wsl --install -d Debian</code></td><td>Lists the available distributions · installs another one</td><td>You want a second distribution</td></tr>
<tr><td><code>wsl -l -v</code></td><td>Lists installed distributions with their state and WSL version</td><td>Check that VERSION says 2</td></tr>
<tr><td><code>wsl --set-version Ubuntu 2</code></td><td>Converts a distribution to WSL 2</td><td>An old install is still on version 1</td></tr>
<tr><td><code>wsl --update</code> · <code>wsl --version</code></td><td>Updates WSL itself · shows its version</td><td>systemd needs WSL 0.67.6 or newer</td></tr>
<tr><td><code>wsl --shutdown</code></td><td>Stops every running distribution</td><td>After editing <code>/etc/wsl.conf</code></td></tr>
</table>
<p><strong>systemd.</strong> According to Microsoft, systemd is the default for the current Ubuntu installed by <code>wsl --install</code>. For other distributions you switch it on in <code>/etc/wsl.conf</code> inside Linux, then run <code>wsl.exe --shutdown</code> from PowerShell and start the distribution again:</p>
<pre><code class="language-bash">[boot]
systemd=true</code></pre>
<p><strong>Files across the boundary.</strong> Inside WSL, <code>C:\\Users\\an</code> appears as <code>/mnt/c/Users/an</code>; from Windows, the Linux files appear under <code>\\\\wsl$</code> in File Explorer, and <code>explorer.exe .</code> opens the current Linux folder in Explorer. Microsoft's own advice: "For the fastest performance speed, store your files in the WSL file system if you are working in a Linux command line". Windows is case-insensitive and Linux is case-sensitive, so <code>Logo.png</code> and <code>logo.png</code> can collide on <code>/mnt/c</code>.</p>
<p><strong>Line endings.</strong> A script edited with a Windows editor ends every line with <code>\\r\\n</code>. On Linux that shows up as <code>$'\\r': command not found</code> — lesson "Start here (2/2)" has the real output. Set VS Code to "LF" for shell scripts (bottom-right corner of the window).</p>

<h3>macOS — close, but not Linux</h3>
${slide('lx-00', 27, 'macOS: zsh mặc định từ 2019, còn /bin/bash kẹt ở 3.2 (2007)')}
<p>macOS is Unix, so the shape is the same and most of this course applies unchanged. The differences are worth knowing before they confuse you:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">BSD utilities, not GNU</span><span class="v"><code>sed -i</code> needs an argument on macOS (<code>sed -i '' …</code>), <code>ls</code> colours differ, some <code>find</code> flags are missing. Scripts written on macOS often break on a Linux server.</span></div>
  <div class="kv"><span class="k">No systemd</span><span class="v">macOS uses <code>launchd</code>. Chapter 11 is Linux-only; read it, and run it on a container or a server.</span></div>
  <div class="kv"><span class="k">Different filesystem layout</span><span class="v">No <code>/proc</code>. Package installs land in <code>/opt/homebrew</code> or <code>/usr/local</code>, not <code>/usr</code>.</span></div>
</div>
<pre><code><span class="tok-comment"># Get the GNU tools so commands behave as on a server:</span>
brew install coreutils findutils gnu-sed grep gawk
<span class="tok-comment"># They install with a 'g' prefix: gsed, ggrep, gfind. Either use those,</span>
<span class="tok-comment"># or put the gnubin directories first in PATH (Chapter 8).</span></code></pre>

<h3>macOS in depth: zsh by default, bash 3.2, and a newer bash from Homebrew</h3>
${slide('lx-00', 28, 'Script viết cho bash 5 vỡ trên bash 3.2 của Mac — ngay lập tức')}
<p>Everything in this section was run on the course Mac (macOS 27, Apple M1) in September 2026, using only read-only commands. First, which shells does this Mac have, and which one is yours?</p>
<pre><code class="language-bash">echo $SHELL
cat /etc/shells | grep '^/'
dscl . -read ~ UserShell
zsh --version
/bin/bash --version | head -2</code></pre>
<div class="out">/bin/zsh
/bin/bash
/bin/csh
/bin/dash
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
UserShell: /bin/zsh
zsh 5.9 (arm64-apple-darwin26.0)
GNU bash, version 3.2.57(1)-release (arm64-apple-darwin26)
Copyright (C) 2007 Free Software Foundation, Inc.</div>
<p>Since macOS 10.15 Catalina, Apple states that "your Mac uses zsh as the default login shell and interactive shell". Bash is still installed, but it is version 3.2.57 from 2007 — the last bash released under GPLv2; from 4.0 onward bash is GPLv3. Type <code>bash</code> in a Terminal and the Mac reminds you:</p>
<div class="out">The default interactive shell is now zsh.
To update your account to use zsh, please run &#96;chsh -s /bin/zsh&#96;.
For more details, please visit https://support.apple.com/kb/HT208050.
bash-3.2$</div>
<p>Why this matters: a script written for the Ubuntu server (bash 5.2) or Fedora (bash 5.3) meets a 2007 bash plus BSD tools on the Mac. Real errors:</p>
<pre><code class="language-bash">/bin/bash -c 'declare -A m'
/bin/bash -c 'x=abc; echo \${x^^}'
date -d tomorrow
date -v+1d +%F
command -v timeout || echo "no timeout"</code></pre>
<div class="out">/bin/bash: line 0: declare: -A: invalid option
declare: usage: declare [-afFirtx] [-p] [name[=value] ...]
/bin/bash: \${x^^}: bad substitution
date: illegal option -- d
usage: date [-jnRu] [-I[date|hours|minutes|seconds|ns]] [-f input_fmt] …
2026-09-29
no timeout</div>
<table>
<tr><th>You write (GNU / bash 5)</th><th>On the Mac</th><th>Portable or Mac way</th></tr>
<tr><td><code>declare -A</code> (associative array, bash 4+)</td><td>invalid option</td><td>Run the script with a newer bash (below)</td></tr>
<tr><td><code>\${x^^}</code> (upper-case, bash 4+)</td><td>bad substitution</td><td><code>tr '[:lower:]' '[:upper:]'</code></td></tr>
<tr><td><code>date -d tomorrow</code></td><td>illegal option -- d</td><td><code>date -v+1d</code> (BSD)</td></tr>
<tr><td><code>sed -i 's/a/b/' f</code></td><td>invalid command code f</td><td><code>sed -i '' 's/a/b/' f</code> (BSD)</td></tr>
<tr><td><code>timeout 5 cmd</code></td><td>command not found</td><td><code>gtimeout</code> from Homebrew coreutils</td></tr>
</table>
<p><strong>Getting bash 5 without touching the system bash.</strong> Homebrew installs a current bash next to Apple's, in <code>/opt/homebrew/bin/bash</code> on Apple-silicon Macs; <code>brew info bash</code> on the course Mac reported <code>bash: stable 5.3.20 (bottled), HEAD</code>. Then start your scripts with <code>#!/usr/bin/env bash</code>, which picks the first <code>bash</code> in your <code>PATH</code> — the Homebrew one once <code>/opt/homebrew/bin</code> comes first — while <code>#!/bin/bash</code> always means 3.2 on a Mac:</p>
<pre><code class="language-bash">brew install bash                     # bash 5.x in /opt/homebrew/bin
command -v bash                       # which bash comes first in PATH?
bash --version | head -1
head -1 deploy.sh                     # want: #!/usr/bin/env bash</code></pre>
<p>You do <em>not</em> need to change your login shell to follow this course: keep zsh for everyday typing and type <code>bash</code> when a lesson wants bash. If you ever do want Homebrew's bash as your login shell, Apple's rule is that <code>chsh -s</code> only accepts shells listed in <code>/etc/shells</code>, so it must be added there first (with administrator rights) — Chapter 15 walks through it.</p>
<div class="callout warn"><strong>A zsh trap when you paste commands from this course.</strong> In an interactive zsh with default settings, <code>#</code> does <em>not</em> start a comment. Real output on the Mac, from a fresh zsh with no configuration:<br><code>% ls -d . # xem thu</code><br><code>ls: #: No such file or directory</code><br><code>ls: thu: No such file or directory</code><br><code>ls: xem: No such file or directory</code><br><code>.</code><br>zsh passed <code>#</code>, <code>xem</code> and <code>thu</code> to <code>ls</code> as file names. The option <code>setopt interactivecomments</code> (put it in your own <code>~/.zshrc</code> if you want it permanently; many zsh frameworks already set it) makes <code>#</code> a comment again. In bash and in all scripts, <code>#</code> is always a comment.</div>

<h3>Linux — you are already there</h3>
<pre><code>cat /etc/os-release | head -2
uname -srm</code></pre>
<div class="out">PRETTY_NAME="Ubuntu 24.04.5 LTS"
NAME="Ubuntu"
Linux 7.0.12-linuxkit aarch64</div>

<p>That output is from the course container (Ubuntu 24.04 on Docker Desktop, Mac M1). Note the order: <code>/etc/os-release</code> on Ubuntu starts with <code>PRETTY_NAME</code>, then <code>NAME</code>. On an Ubuntu server or laptop the third line shows that machine's own kernel and architecture, for example a <code>-generic</code> kernel on <code>x86_64</code>; inside a container it is the kernel of the host running Docker — here Docker Desktop's <code>linuxkit</code> VM.</p>

<h3>The disposable playground — Docker</h3>
${slide('lx-00', 29, 'Docker: một Ubuntu để phá, dựng lại trong 1,5 giây')}
<p>Even on Linux, a container is the right place to run the destructive parts of this course. It starts in a second and <code>exit</code> throws it away entirely:</p>
<pre><code><span class="tok-comment"># A clean Ubuntu shell. --rm deletes the container when you leave.</span>
docker run --rm -it ubuntu:24.04 bash

<span class="tok-comment"># Inside, get the tools this course uses:</span>
apt update &amp;&amp; apt install -y \\
  curl less tree file findutils procps iproute2 vim ca-certificates</code></pre>
<div class="callout ok">This is where you run <code>rm -rf</code>, fill the disk, kill init, and break permissions — the experiments that teach the most and that you must never try on a real machine. Type <code>exit</code> and the damage ceases to exist. Rebuilding takes one command.</div>
<table>
<tr><th>Flag of <code>docker run</code></th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>--rm</code></td><td>Delete the container when it exits</td><td>throwaway shells</td></tr>
<tr><td><code>-i</code></td><td>Keep standard input open, so you can type</td><td>always with a shell</td></tr>
<tr><td><code>-t</code></td><td>Give it a terminal (prompt, colours, line editing)</td><td>usually together: <code>-it</code></td></tr>
<tr><td><code>--name lab</code></td><td>A name instead of a random one</td><td><code>docker start -ai lab</code> later</td></tr>
<tr><td><code>-v "$HOME/thu-linux:/root/thu-linux"</code></td><td>Share a folder: host path <code>:</code> container path</td><td>files survive the container</td></tr>
<tr><td><code>ubuntu:24.04</code> · <code>bash</code></td><td>Image and tag · the command to run inside</td><td>match your server's distribution</td></tr>
</table>
<p>Measured on the course Mac: <code>docker run --rm ubuntu:24.04 true</code> — start a container, run nothing, delete it — took about 1.5 seconds. One more thing you will notice in a shared folder: a file created inside the container at 08:57 showed as 15:57 on the Mac. The clock is the same; the container runs in UTC and the Mac in +07 (Chapter 11).</p>
<pre><code><span class="tok-comment"># Keep a lab container between sessions, with a folder shared from your machine:</span>
docker run -it --name lab -v <span class="tok-string">"\$PWD/lab:/root/lab"</span> ubuntu:24.04 bash
<span class="tok-comment"># Later:</span>
docker start -ai lab</code></pre>
<div class="callout warn">A container is not a full machine. There is no <code>systemd</code> by default (Chapter 11 needs a VM or a real server), the network is isolated, and the base image is minimal — many commands are simply not installed until you add them. When something is "missing", check whether it is a container limitation before assuming Linux lacks it.</div>

<h3>A minimal terminal setup</h3>
<pre><code><span class="tok-comment"># Confirm which shell you are running, and switch to bash if you want to</span>
<span class="tok-comment"># follow this course exactly (macOS defaults to zsh).</span>
<span class="tok-keyword">echo</span> \$SHELL
chsh -s /bin/bash            <span class="tok-comment"># optional; log out and back in</span>

<span class="tok-comment"># Make history useful — big, deduplicated, and shared across windows.</span>
cat &gt;&gt; ~/.bashrc &lt;&lt;<span class="tok-string">'EOF'</span>
HISTSIZE=100000
HISTFILESIZE=200000
HISTCONTROL=ignoreboth:erasedups
shopt -s histappend cmdhist checkwinsize
EOF
<span class="tok-keyword">source</span> ~/.bashrc</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl-R</span><span class="v">Search backwards through history. The single most useful key combination in this course.</span></div>
  <div class="kv"><span class="k">Tab</span><span class="v">Complete a command, path or option. Press it twice to list the possibilities.</span></div>
  <div class="kv"><span class="k">Ctrl-A / Ctrl-E</span><span class="v">Jump to the start / end of the line.</span></div>
  <div class="kv"><span class="k">Ctrl-U / Ctrl-W</span><span class="v">Delete to the start of the line / delete the previous word.</span></div>
  <div class="kv"><span class="k">Ctrl-L</span><span class="v">Clear the screen without losing what you have typed.</span></div>
</div>
<pre><code><span class="tok-comment"># Two optional installs that pay for themselves immediately:</span>
sudo apt install -y tldr bat   <span class="tok-comment"># short examples; a nicer cat with syntax highlighting</span>
tldr tar                        <span class="tok-comment"># the five tar commands anyone actually uses</span></code></pre>
<div class="callout warn"><strong>Measured in September 2026 on Ubuntu 24.04:</strong> both tldr clients in the Ubuntu archive (<code>tldr</code> 0.9.2 and <code>tealdeer</code> 1.6.1) fail when they try to download the pages — "Could not find central directory end" — because the old archive address on tldr.sh no longer serves a zip file. The official Python client works: <code>sudo apt install -y pipx</code>, then <code>pipx install tldr</code> (it lands in <code>~/.local/bin</code>, version 3.4.4 at the time of writing). And on Ubuntu the <code>bat</code> package installs the command as <code>batcat</code>, because another package already used the name <code>bat</code>. In the minimal Docker image, <code>man</code> answers "This system has been minimized…" until you run <code>unminimize</code>.</div>

<h3>Verify you are ready</h3>
${slide('lx-00', 30, 'Kiểm “đã sẵn sàng”: ảnh Ubuntu gốc THIẾU curl và cả trang man')}
<pre><code>uname -a &amp;&amp; <span class="tok-keyword">echo</span> <span class="tok-string">"---"</span> &amp;&amp; \\
<span class="tok-keyword">for</span> c <span class="tok-keyword">in</span> bash ls grep sed awk find curl ps; <span class="tok-keyword">do</span>
  <span class="tok-keyword">command</span> -v <span class="tok-string">"\$c"</span> &gt;/dev/null &amp;&amp; <span class="tok-keyword">echo</span> <span class="tok-string">"ok   \$c"</span> || <span class="tok-keyword">echo</span> <span class="tok-string">"MISSING \$c"</span>
<span class="tok-keyword">done</span></code></pre>
<div class="out">Linux lab 6.8.0-45-generic #45-Ubuntu SMP x86_64 GNU/Linux
---
ok   bash
ok   ls
ok   grep
ok   sed
ok   awk
ok   find
ok   curl
ok   ps</div>
<p>You will not understand that loop yet — it is Chapter 6. Run it anyway; by the end of this course you will read it at a glance.</p>

<h3>Four ways to get a shell, and what each one really is</h3>
${slide('lx-00', 25, 'Bốn đường có một shell Linux — chọn theo máy bạn đang có')}
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">WSL2</span><span class="lz-t">A real Linux kernel on Windows</span><span class="lz-d">Full syscall compatibility, and the filesystem boundary is the thing to watch — keep projects under <code>~</code>, not <code>/mnt/c</code>, or every file operation crosses a translation layer.</span></div>
  <div class="lz-node"><span class="lz-k">macOS Terminal</span><span class="lz-t">BSD userland, not Linux</span><span class="lz-d"><code>sed</code>, <code>date</code> and <code>xargs</code> take different flags. Scripts written here break on a server; install the GNU tools if you want them to match.</span></div>
  <div class="lz-node"><span class="lz-k">A Linux desktop</span><span class="lz-t">Already the target</span><span class="lz-d">Nothing to install, and the only setup that guarantees your local commands behave the way the VPS will.</span></div>
  <div class="lz-node"><span class="lz-k">A Docker container</span><span class="lz-t">Disposable and identical</span><span class="lz-d"><code>docker run -it --rm debian bash</code>. Break it freely, and it matches the distribution your server actually runs.</span></div>
</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> before Chapter 1 you want a place where <code>rm -rf</code> costs nothing, but where your notes survive. Build the course lab: a Ubuntu 24.04 container that shares <code>~/thu-linux</code> with your machine. (No Docker on Windows? Do steps 4–5 directly in WSL.)</p><ol>
<li>On your machine: <code>mkdir -p ~/thu-linux &amp;&amp; echo "Xin chào từ máy của tôi" &gt; ~/thu-linux/chao.txt</code>.</li>
<li>Start the lab: <code>docker run -it --name lab -v "$HOME/thu-linux:/root/thu-linux" ubuntu:24.04 bash</code>.</li>
<li>Inside: <code>cat /root/thu-linux/chao.txt</code>, then <code>echo "Xin chào từ Ubuntu" &gt; /root/thu-linux/tu-container.txt</code> and <code>ls -l /root/thu-linux</code>. Note the times.</li>
<li>Run the readiness loop from "Verify you are ready". Expect <code>MISSING curl</code> in a fresh image; fix it with <code>apt-get update &amp;&amp; apt-get install -y curl less tree file procps iproute2 vim man-db</code> and run the loop again.</li>
<li><code>exit</code>, then on your machine <code>ls -l ~/thu-linux</code>; finally <code>docker start -ai lab</code> to get back in, and <code>exit</code> again.</li></ol>
<div class="out">-rw-r--r-- 1 root root 24 Sep 28 08:57 chao.txt
-rw-r--r-- 1 root root 22 Sep 28 08:57 tu-container.txt</div>
<p>Real output inside the container (the Mac showed the same two files at 15:57).</p>
<p><strong>Done when:</strong> the loop prints <code>ok</code> for all eight commands, <code>tu-container.txt</code> is visible from your own machine, you can explain why its time differs by 7 hours, and <code>docker start -ai lab</code> brings you back to the same container with <code>curl</code> still installed.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">WSL 2</span><span class="v">Windows Subsystem for Linux, version 2: a real Linux kernel in a lightweight virtual machine managed by Windows.</span></div>
  <div class="kv"><span class="k">Virtual machine (VM)</span><span class="v">A simulated computer with its own kernel, running inside a real one.</span></div>
  <div class="kv"><span class="k">BSD tools</span><span class="v">The versions of <code>ls</code>, <code>sed</code>, <code>date</code>… that macOS ships; same names as GNU, different flags.</span></div>
  <div class="kv"><span class="k">Homebrew</span><span class="v">The common package manager for macOS; installs into <code>/opt/homebrew</code> on Apple silicon.</span></div>
  <div class="kv"><span class="k">Shebang</span><span class="v">The first line of a script, <code>#!…</code>, naming the interpreter; <code>#!/usr/bin/env bash</code> searches <code>PATH</code>.</span></div>
  <div class="kv"><span class="k">Image / container</span><span class="v">An image is the packaged filesystem (<code>ubuntu:24.04</code>); a container is one running copy of it.</span></div>
  <div class="kv"><span class="k">Bind mount (-v)</span><span class="v">Sharing a folder of your machine into a container.</span></div>
  <div class="kv"><span class="k">Login shell</span><span class="v">The shell your account starts by default (<code>$SHELL</code>), changed with <code>chsh</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>WSL 2 is a real Linux kernel; keep projects in <code>~</code>, not <code>/mnt/c</code>, and save scripts with LF line endings.</li>
<li>macOS uses zsh by default since 2019; <code>/bin/bash</code> is 3.2 from 2007 and rejects <code>declare -A</code> and <code>\${x^^}</code>.</li>
<li>Install a current bash with Homebrew and start scripts with <code>#!/usr/bin/env bash</code>; <code>#!/bin/bash</code> on a Mac always means 3.2.</li>
<li>In interactive zsh, <code>#</code> is not a comment unless <code>interactivecomments</code> is set.</li>
<li>A <code>docker run --rm -it ubuntu:24.04 bash</code> container is the place for destructive experiments; <code>-v</code> keeps your files.</li>
<li>The minimal Ubuntu image lacks <code>curl</code> and man pages; the apt tldr clients are broken on 24.04 — use <code>pipx install tldr</code>.</li>
</ul>

<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/install" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">Microsoft Docs — Install WSL</span><span class="lc-sub">Official setup, plus the VS Code integration and the filesystem performance note.</span></span>
</a>
<a class="link-card" href="https://support.apple.com/en-us/102360" target="_blank" rel="noopener">
  <span class="lc-ico">🍎</span>
  <span class="lc-body"><span class="lc-title">Apple — Use zsh as the default shell on Mac</span><span class="lc-sub">Apple's own note: zsh is the default since macOS 10.15, and how <code>chsh -s</code> works with <code>/etc/shells</code>.</span></span>
</a>
<a class="link-card" href="https://formulae.brew.sh/formula/bash" target="_blank" rel="noopener">
  <span class="lc-ico">🍺</span>
  <span class="lc-body"><span class="lc-title">Homebrew — bash formula</span><span class="lc-sub">The current bash for macOS, installed next to Apple's 3.2.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/filesystems" target="_blank" rel="noopener">
  <span class="lc-ico">📁</span>
  <span class="lc-body"><span class="lc-title">Microsoft Docs — Working across file systems (WSL)</span><span class="lc-sub">Why projects belong in the Linux file system, <code>\\\\wsl$</code>, and running Windows and Linux tools together.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/systemd" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Microsoft Docs — Use systemd with WSL</span><span class="lc-sub">The <code>/etc/wsl.conf</code> setting and the WSL version it needs.</span></span>
</a>
<a class="link-card" href="https://tldr.sh/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">tldr pages — practical examples for every command</span><span class="lc-sub">What you want when <code>man</code> gives you 900 lines and you need the common case.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> learning on macOS and deploying to Linux without knowing the utilities differ. The classic casualty is <code>sed -i</code>: on Linux <code>sed -i 's/a/b/' f</code> edits in place, while macOS requires <code>sed -i '' 's/a/b/' f</code> — and on a Mac the Linux form fails with <code>sed: 1: "f": invalid command code f</code>, because BSD <code>sed</code> takes <code>'s/a/b/'</code> as the backup suffix and <code>f</code> as the script. The variant <code>sed -i -e 's/a/b/' f</code> is worse: it works, and silently leaves a backup file named <code>f-e</code> next to your file (both measured on macOS 27, September 2026). Test anything destined for a server on Linux, in a container if nothing else.</div>
<p class="note-ct"><strong>Set up the lab container now, before Chapter 1.</strong> Every chapter has commands that are only educational when you can afford for them to go wrong — filling a disk, killing the wrong process, removing a permission you need. Having a place where that costs nothing is the difference between learning this material and reading about it.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Một cái máy mà bạn được phép phá</h2>
<p class="lead">Mọi thứ trong khoá này nên được CHẠY, không phải chỉ đọc. Nghĩa là bạn cần một shell Linux có thể phá mà không hậu quả — và trên nền tảng nào cũng có một lựa chọn tốt, mất chưa tới mười phút.</p>

<h3>Windows — WSL2</h3>
${slide('lx-00', 26, 'Windows: WSL2 là Linux thật — đừng để code ở /mnt/c')}
<pre><code><span class="tok-comment"># Trong PowerShell với quyền Administrator, một lần:</span>
wsl --install
<span class="tok-comment"># Khởi động lại, rồi đặt tên người dùng và mật khẩu khi Ubuntu chạy lần đầu.</span>

wsl --list --verbose        <span class="tok-comment"># kiểm xem có đúng phiên bản 2 không</span>
wsl                          <span class="tok-comment"># vào shell Linux</span></code></pre>
<p>WSL2 chạy một nhân Linux thật trong một máy ảo nhẹ. Nó không phải một lớp giả lập — <code>apt</code>, <code>systemd</code>, Docker và mọi thứ trong khoá này hành xử đúng như trên một máy chủ.</p>
<div class="callout warn"><strong>Hãy để file dự án BÊN TRONG hệ thống file Linux</strong>, ở <code>~/projects</code>, đừng để trên <code>/mnt/c/Users/…</code>. Vượt qua ranh giới Windows/Linux làm việc truy cập file chậm khoảng mười lần, và quyền thì không quy đổi được — một script bạn <code>chmod +x</code> trên <code>/mnt/c</code> có thể không giữ được bit thực thi. Hãy mở thư mục từ VS Code bằng tiện ích WSL và nó chạy như bản địa.</div>

<h3>WSL đi sâu: những lệnh và thiết lập bạn sẽ thật sự dùng</h3>
<p>Phần dưới lấy từ tài liệu WSL của Microsoft (kiểm tháng 9/2026). Máy của khoá là Mac và Linux, nên các lệnh Windows này <em>không</em> kèm output ghi lại — hãy tự chạy và đối chiếu với tài liệu có link ở cuối bài.</p>
<table>
<tr><th>Lệnh (PowerShell)</th><th>Làm gì</th><th>Khi nào cần</th></tr>
<tr><td><code>wsl --install</code></td><td>Bật WSL và cài Ubuntu, bản phân phối mặc định</td><td>Một lần. Cần Windows 10 bản 2004 (build 19041) trở lên, hoặc Windows 11, và khởi động lại máy</td></tr>
<tr><td><code>wsl --list --online</code> · <code>wsl --install -d Debian</code></td><td>Liệt kê các bản phân phối có sẵn · cài thêm một bản</td><td>Bạn muốn bản phân phối thứ hai</td></tr>
<tr><td><code>wsl -l -v</code></td><td>Liệt kê bản đã cài, trạng thái và phiên bản WSL</td><td>Kiểm cột VERSION là 2</td></tr>
<tr><td><code>wsl --set-version Ubuntu 2</code></td><td>Chuyển một bản phân phối sang WSL 2</td><td>Bản cài cũ vẫn đang ở phiên bản 1</td></tr>
<tr><td><code>wsl --update</code> · <code>wsl --version</code></td><td>Cập nhật chính WSL · xem phiên bản của nó</td><td>systemd cần WSL 0.67.6 trở lên</td></tr>
<tr><td><code>wsl --shutdown</code></td><td>Dừng mọi bản phân phối đang chạy</td><td>Sau khi sửa <code>/etc/wsl.conf</code></td></tr>
</table>
<p><strong>systemd.</strong> Theo Microsoft, systemd là mặc định với bản Ubuntu hiện tại được cài bằng <code>wsl --install</code>. Với bản phân phối khác, bạn bật nó trong <code>/etc/wsl.conf</code> bên trong Linux, rồi chạy <code>wsl.exe --shutdown</code> từ PowerShell và mở lại bản phân phối:</p>
<pre><code class="language-bash">[boot]
systemd=true</code></pre>
<p><strong>File qua ranh giới.</strong> Bên trong WSL, <code>C:\\Users\\an</code> hiện ra thành <code>/mnt/c/Users/an</code>; từ phía Windows, file Linux nằm dưới <code>\\\\wsl$</code> trong File Explorer, và <code>explorer.exe .</code> mở thư mục Linux hiện tại trong Explorer. Lời khuyên của chính Microsoft: “để có tốc độ nhanh nhất, hãy lưu file trong hệ thống file của WSL nếu bạn làm việc bằng dòng lệnh Linux”. Windows không phân biệt hoa thường còn Linux thì có, nên <code>Logo.png</code> và <code>logo.png</code> có thể đè nhau trên <code>/mnt/c</code>.</p>
<p><strong>Kiểu xuống dòng.</strong> Script sửa bằng trình soạn thảo Windows kết thúc mỗi dòng bằng <code>\\r\\n</code>. Trên Linux nó hiện thành <code>$'\\r': command not found</code> — bài “Bắt đầu tại đây (2/2)” có output thật. Đặt VS Code về “LF” cho script shell (góc dưới bên phải cửa sổ).</p>

<h3>macOS — gần giống, nhưng không phải Linux</h3>
${slide('lx-00', 27, 'macOS: zsh mặc định từ 2019, còn /bin/bash kẹt ở 3.2 (2007)')}
<p>macOS là Unix, nên hình dạng giống nhau và phần lớn khoá này áp dụng nguyên vẹn. Những khác biệt đáng biết trước khi chúng làm bạn rối:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tiện ích BSD, không phải GNU</span><span class="v"><code>sed -i</code> trên macOS cần một tham số (<code>sed -i '' …</code>), màu của <code>ls</code> khác, vài cờ của <code>find</code> không có. Script viết trên macOS thường hỏng trên máy chủ Linux.</span></div>
  <div class="kv"><span class="k">Không có systemd</span><span class="v">macOS dùng <code>launchd</code>. Chương 11 chỉ dành cho Linux; hãy đọc nó, và chạy nó trên một container hay một máy chủ.</span></div>
  <div class="kv"><span class="k">Bố cục hệ thống file khác</span><span class="v">Không có <code>/proc</code>. Gói cài đặt rơi vào <code>/opt/homebrew</code> hoặc <code>/usr/local</code>, không phải <code>/usr</code>.</span></div>
</div>
<pre><code><span class="tok-comment"># Cài bộ công cụ GNU để các lệnh hành xử như trên máy chủ:</span>
brew install coreutils findutils gnu-sed grep gawk
<span class="tok-comment"># Chúng cài kèm tiền tố 'g': gsed, ggrep, gfind. Hoặc dùng những tên đó,</span>
<span class="tok-comment"># hoặc đưa các thư mục gnubin lên đầu PATH (Chương 8).</span></code></pre>

<h3>macOS đi sâu: zsh mặc định, bash 3.2, và một bash mới hơn từ Homebrew</h3>
${slide('lx-00', 28, 'Script viết cho bash 5 vỡ trên bash 3.2 của Mac — ngay lập tức')}
<p>Mọi thứ trong phần này được chạy trên Mac của khoá (macOS 27, Apple M1) tháng 9/2026, chỉ bằng lệnh chỉ-đọc. Trước hết, Mac này có những shell nào, và shell của bạn là cái nào?</p>
<pre><code class="language-bash">echo $SHELL
cat /etc/shells | grep '^/'
dscl . -read ~ UserShell
zsh --version
/bin/bash --version | head -2</code></pre>
<div class="out">/bin/zsh
/bin/bash
/bin/csh
/bin/dash
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
UserShell: /bin/zsh
zsh 5.9 (arm64-apple-darwin26.0)
GNU bash, version 3.2.57(1)-release (arm64-apple-darwin26)
Copyright (C) 2007 Free Software Foundation, Inc.</div>
<p>Từ macOS 10.15 Catalina, Apple nói rõ “Mac của bạn dùng zsh làm shell đăng nhập và shell tương tác mặc định”. Bash vẫn được cài, nhưng là bản 3.2.57 từ năm 2007 — bản bash cuối cùng theo GPLv2; từ 4.0 trở đi bash theo GPLv3. Gõ <code>bash</code> trong Terminal là Mac nhắc bạn ngay:</p>
<div class="out">The default interactive shell is now zsh.
To update your account to use zsh, please run &#96;chsh -s /bin/zsh&#96;.
For more details, please visit https://support.apple.com/kb/HT208050.
bash-3.2$</div>
<p>Vì sao điều này quan trọng: một script viết cho máy chủ Ubuntu (bash 5.2) hay Fedora (bash 5.3) gặp trên Mac một bash của năm 2007 cộng bộ lệnh BSD. Lỗi thật:</p>
<pre><code class="language-bash">/bin/bash -c 'declare -A m'
/bin/bash -c 'x=abc; echo \${x^^}'
date -d tomorrow
date -v+1d +%F
command -v timeout || echo "no timeout"</code></pre>
<div class="out">/bin/bash: line 0: declare: -A: invalid option
declare: usage: declare [-afFirtx] [-p] [name[=value] ...]
/bin/bash: \${x^^}: bad substitution
date: illegal option -- d
usage: date [-jnRu] [-I[date|hours|minutes|seconds|ns]] [-f input_fmt] …
2026-09-29
no timeout</div>
<table>
<tr><th>Bạn viết (GNU / bash 5)</th><th>Trên Mac</th><th>Cách chạy được mọi nơi / cách của Mac</th></tr>
<tr><td><code>declare -A</code> (mảng kết hợp, bash 4+)</td><td>invalid option</td><td>Chạy script bằng bash mới hơn (bên dưới)</td></tr>
<tr><td><code>\${x^^}</code> (viết hoa, bash 4+)</td><td>bad substitution</td><td><code>tr '[:lower:]' '[:upper:]'</code></td></tr>
<tr><td><code>date -d tomorrow</code></td><td>illegal option -- d</td><td><code>date -v+1d</code> (BSD)</td></tr>
<tr><td><code>sed -i 's/a/b/' f</code></td><td>invalid command code f</td><td><code>sed -i '' 's/a/b/' f</code> (BSD)</td></tr>
<tr><td><code>timeout 5 lệnh</code></td><td>command not found</td><td><code>gtimeout</code> từ coreutils của Homebrew</td></tr>
</table>
<p><strong>Có bash 5 mà không đụng tới bash của hệ thống.</strong> Homebrew cài một bash hiện hành cạnh bash của Apple, ở <code>/opt/homebrew/bin/bash</code> trên Mac chip Apple; <code>brew info bash</code> trên Mac của khoá báo <code>bash: stable 5.3.20 (bottled), HEAD</code>. Rồi mở đầu script bằng <code>#!/usr/bin/env bash</code>, dòng này chọn <code>bash</code> đầu tiên trong <code>PATH</code> — là bản Homebrew khi <code>/opt/homebrew/bin</code> đứng trước — còn <code>#!/bin/bash</code> trên Mac thì luôn là 3.2:</p>
<pre><code class="language-bash">brew install bash                     # bash 5.x ở /opt/homebrew/bin
command -v bash                       # bash nào đứng đầu PATH?
bash --version | head -1
head -1 deploy.sh                     # muốn thấy: #!/usr/bin/env bash</code></pre>
<p>Bạn <em>không</em> cần đổi shell đăng nhập để theo khoá này: giữ zsh để gõ hằng ngày và gõ <code>bash</code> khi bài học cần bash. Nếu có lúc muốn dùng bash của Homebrew làm shell đăng nhập, luật của Apple là <code>chsh -s</code> chỉ nhận các shell có trong <code>/etc/shells</code>, nên phải thêm nó vào đó trước (cần quyền quản trị) — Chương 15 đi qua từng bước.</p>
<div class="callout warn"><strong>Một cái bẫy của zsh khi bạn dán lệnh từ khoá này.</strong> Trong zsh tương tác với thiết lập mặc định, <code>#</code> KHÔNG mở đầu chú thích. Output thật trên Mac, từ một zsh sạch không có cấu hình:<br><code>% ls -d . # xem thu</code><br><code>ls: #: No such file or directory</code><br><code>ls: thu: No such file or directory</code><br><code>ls: xem: No such file or directory</code><br><code>.</code><br>zsh đã đưa <code>#</code>, <code>xem</code> và <code>thu</code> cho <code>ls</code> như tên file. Tuỳ chọn <code>setopt interactivecomments</code> (tự đặt vào <code>~/.zshrc</code> của bạn nếu muốn giữ lâu dài; nhiều bộ cấu hình zsh đã bật sẵn) làm <code>#</code> trở lại là chú thích. Trong bash và trong mọi script, <code>#</code> luôn là chú thích.</div>

<h3>Linux — bạn đã ở sẵn đó rồi</h3>
<pre><code>cat /etc/os-release | head -2
uname -srm</code></pre>
<div class="out">PRETTY_NAME="Ubuntu 24.04.5 LTS"
NAME="Ubuntu"
Linux 7.0.12-linuxkit aarch64</div>

<p>Output đó lấy từ container của khoá (Ubuntu 24.04 trên Docker Desktop, Mac M1). Để ý thứ tự: <code>/etc/os-release</code> của Ubuntu mở đầu bằng <code>PRETTY_NAME</code>, rồi mới tới <code>NAME</code>. Trên một máy chủ hay laptop chạy Ubuntu, dòng thứ ba cho thấy kernel và kiến trúc của chính máy đó, ví dụ một kernel <code>-generic</code> trên <code>x86_64</code>; trong container thì đó là kernel của máy đang chạy Docker — ở đây là máy ảo <code>linuxkit</code> của Docker Desktop.</p>

<h3>Sân tập vứt đi — Docker</h3>
${slide('lx-00', 29, 'Docker: một Ubuntu để phá, dựng lại trong 1,5 giây')}
<p>Ngay cả khi đang ở Linux, một container vẫn là chỗ đúng để chạy những phần phá hoại của khoá này. Nó khởi động trong một giây và <code>exit</code> là vứt nó đi hoàn toàn:</p>
<pre><code><span class="tok-comment"># Một shell Ubuntu sạch. --rm xoá container khi bạn rời đi.</span>
docker run --rm -it ubuntu:24.04 bash

<span class="tok-comment"># Bên trong, cài các công cụ khoá này dùng:</span>
apt update &amp;&amp; apt install -y \\
  curl less tree file findutils procps iproute2 vim ca-certificates</code></pre>
<div class="callout ok">Đây là chỗ bạn chạy <code>rm -rf</code>, làm đầy đĩa, giết init, và phá quyền — những thí nghiệm dạy được nhiều nhất và tuyệt đối không được thử trên máy thật. Gõ <code>exit</code> là thiệt hại thôi tồn tại. Dựng lại tốn một lệnh.</div>
<table>
<tr><th>Cờ của <code>docker run</code></th><th>Nghĩa là</th><th>Ví dụ</th></tr>
<tr><td><code>--rm</code></td><td>Xoá container khi nó thoát</td><td>shell dùng một lần</td></tr>
<tr><td><code>-i</code></td><td>Giữ đầu vào chuẩn mở để bạn gõ được</td><td>luôn dùng khi chạy shell</td></tr>
<tr><td><code>-t</code></td><td>Cấp cho nó một terminal (dấu nhắc, màu, sửa dòng)</td><td>thường đi cặp: <code>-it</code></td></tr>
<tr><td><code>--name lab</code></td><td>Đặt tên thay vì tên ngẫu nhiên</td><td>về sau <code>docker start -ai lab</code></td></tr>
<tr><td><code>-v "$HOME/thu-linux:/root/thu-linux"</code></td><td>Chia sẻ thư mục: đường dẫn máy bạn <code>:</code> đường dẫn trong container</td><td>file sống lâu hơn container</td></tr>
<tr><td><code>ubuntu:24.04</code> · <code>bash</code></td><td>Ảnh và nhãn · lệnh chạy bên trong</td><td>chọn khớp distro của máy chủ</td></tr>
</table>
<p>Đo trên Mac của khoá: <code>docker run --rm ubuntu:24.04 true</code> — khởi động một container, không chạy gì, xoá nó — mất khoảng 1,5 giây. Còn một điều bạn sẽ để ý ở thư mục chia sẻ: một file tạo trong container lúc 08:57 hiện trên Mac là 15:57. Đồng hồ là một; container chạy giờ UTC còn Mac chạy giờ +07 (Chương 11).</p>
<pre><code><span class="tok-comment"># Giữ một container thí nghiệm qua nhiều buổi, có chia sẻ một thư mục từ máy bạn:</span>
docker run -it --name lab -v <span class="tok-string">"\$PWD/lab:/root/lab"</span> ubuntu:24.04 bash
<span class="tok-comment"># Về sau:</span>
docker start -ai lab</code></pre>
<div class="callout warn">Một container không phải một cái máy đầy đủ. Mặc định không có <code>systemd</code> (Chương 11 cần một máy ảo hoặc một máy chủ thật), mạng bị cô lập, và ảnh nền là bản tối giản — nhiều lệnh đơn giản là chưa được cài cho tới khi bạn thêm vào. Khi thấy thứ gì "thiếu", hãy kiểm xem đó có phải giới hạn của container không trước khi cho rằng Linux không có nó.</div>

<h3>Cấu hình terminal tối thiểu</h3>
<pre><code><span class="tok-comment"># Xác nhận bạn đang chạy shell nào, và đổi sang bash nếu muốn theo</span>
<span class="tok-comment"># khoá này thật sát (macOS mặc định là zsh).</span>
<span class="tok-keyword">echo</span> \$SHELL
chsh -s /bin/bash            <span class="tok-comment"># tuỳ chọn; đăng xuất rồi vào lại</span>

<span class="tok-comment"># Làm cho lịch sử lệnh có ích — dài, khử trùng lặp, dùng chung giữa các cửa sổ.</span>
cat &gt;&gt; ~/.bashrc &lt;&lt;<span class="tok-string">'EOF'</span>
HISTSIZE=100000
HISTFILESIZE=200000
HISTCONTROL=ignoreboth:erasedups
shopt -s histappend cmdhist checkwinsize
EOF
<span class="tok-keyword">source</span> ~/.bashrc</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl-R</span><span class="v">Tìm ngược trong lịch sử lệnh. Tổ hợp phím hữu ích nhất của cả khoá này.</span></div>
  <div class="kv"><span class="k">Tab</span><span class="v">Hoàn thành một lệnh, đường dẫn hay tuỳ chọn. Bấm hai lần để liệt kê các khả năng.</span></div>
  <div class="kv"><span class="k">Ctrl-A / Ctrl-E</span><span class="v">Nhảy về đầu / cuối dòng.</span></div>
  <div class="kv"><span class="k">Ctrl-U / Ctrl-W</span><span class="v">Xoá tới đầu dòng / xoá từ đứng trước.</span></div>
  <div class="kv"><span class="k">Ctrl-L</span><span class="v">Xoá màn hình mà không mất thứ bạn đang gõ.</span></div>
</div>
<pre><code><span class="tok-comment"># Hai thứ tuỳ chọn nhưng trả công ngay lập tức:</span>
sudo apt install -y tldr bat   <span class="tok-comment"># ví dụ ngắn gọn; một cat đẹp hơn có tô màu cú pháp</span>
tldr tar                        <span class="tok-comment"># năm lệnh tar mà người ta thật sự dùng</span></code></pre>
<div class="callout warn"><strong>Đo lại tháng 9/2026 trên Ubuntu 24.04:</strong> cả hai client tldr trong kho của Ubuntu (<code>tldr</code> 0.9.2 và <code>tealdeer</code> 1.6.1) đều hỏng khi tải trang — “Could not find central directory end” — vì địa chỉ tệp nén cũ trên tldr.sh không còn trả về file zip. Client Python chính thức thì chạy: <code>sudo apt install -y pipx</code>, rồi <code>pipx install tldr</code> (nó nằm ở <code>~/.local/bin</code>, bản 3.4.4 vào lúc viết). Còn trên Ubuntu gói <code>bat</code> cài lệnh dưới tên <code>batcat</code>, vì một gói khác đã dùng mất tên <code>bat</code>. Trong ảnh Docker tối giản, <code>man</code> trả lời “This system has been minimized…” cho tới khi bạn chạy <code>unminimize</code>.</div>

<h3>Kiểm xem đã sẵn sàng chưa</h3>
${slide('lx-00', 30, 'Kiểm “đã sẵn sàng”: ảnh Ubuntu gốc THIẾU curl và cả trang man')}
<pre><code>uname -a &amp;&amp; <span class="tok-keyword">echo</span> <span class="tok-string">"---"</span> &amp;&amp; \\
<span class="tok-keyword">for</span> c <span class="tok-keyword">in</span> bash ls grep sed awk find curl ps; <span class="tok-keyword">do</span>
  <span class="tok-keyword">command</span> -v <span class="tok-string">"\$c"</span> &gt;/dev/null &amp;&amp; <span class="tok-keyword">echo</span> <span class="tok-string">"ok   \$c"</span> || <span class="tok-keyword">echo</span> <span class="tok-string">"MISSING \$c"</span>
<span class="tok-keyword">done</span></code></pre>
<div class="out">Linux lab 6.8.0-45-generic #45-Ubuntu SMP x86_64 GNU/Linux
---
ok   bash
ok   ls
ok   grep
ok   sed
ok   awk
ok   find
ok   curl
ok   ps</div>
<p>Bạn chưa hiểu cái vòng lặp đó đâu — nó là Chương 6. Cứ chạy đi; tới cuối khoá này bạn sẽ đọc nó chỉ bằng một cái liếc mắt.</p>

<h3>Bốn cách để có một shell, và mỗi cách thật ra là gì</h3>
${slide('lx-00', 25, 'Bốn đường có một shell Linux — chọn theo máy bạn đang có')}
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">WSL2</span><span class="lz-t">Một nhân Linux thật trên Windows</span><span class="lz-d">Tương thích lời gọi hệ thống đầy đủ, và cái ranh giới hệ tệp mới là thứ cần để ý — hãy giữ dự án dưới <code>~</code>, đừng để ở <code>/mnt/c</code>, không thì mọi thao tác file đều đi qua một lớp phiên dịch.</span></div>
  <div class="lz-node"><span class="lz-k">Terminal của macOS</span><span class="lz-t">Bộ lệnh BSD, không phải Linux</span><span class="lz-d"><code>sed</code>, <code>date</code> và <code>xargs</code> nhận cờ khác nhau. Script viết ở đây sẽ vỡ trên máy chủ; hãy cài bộ công cụ GNU nếu muốn chúng khớp nhau.</span></div>
  <div class="lz-node"><span class="lz-k">Một máy để bàn Linux</span><span class="lz-t">Vốn đã là đích đến</span><span class="lz-d">Chẳng phải cài gì, và là thiết lập duy nhất bảo đảm các lệnh ở máy bạn cư xử đúng như trên VPS.</span></div>
  <div class="lz-node"><span class="lz-k">Một container Docker</span><span class="lz-t">Vứt đi được và giống hệt</span><span class="lz-d"><code>docker run -it --rm debian bash</code>. Cứ phá thoải mái, và nó khớp với bản phân phối mà máy chủ của bạn thật sự chạy.</span></div>
</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trước Chương 1, bạn muốn có một chỗ mà <code>rm -rf</code> chẳng tốn gì, nhưng ghi chép của bạn vẫn còn. Hãy dựng phòng thí nghiệm của khoá: một container Ubuntu 24.04 chia sẻ <code>~/thu-linux</code> với máy bạn. (Windows chưa có Docker? Làm bước 4–5 thẳng trong WSL.)</p><ol>
<li>Trên máy bạn: <code>mkdir -p ~/thu-linux &amp;&amp; echo "Xin chào từ máy của tôi" &gt; ~/thu-linux/chao.txt</code>.</li>
<li>Khởi động phòng thí nghiệm: <code>docker run -it --name lab -v "$HOME/thu-linux:/root/thu-linux" ubuntu:24.04 bash</code>.</li>
<li>Bên trong: <code>cat /root/thu-linux/chao.txt</code>, rồi <code>echo "Xin chào từ Ubuntu" &gt; /root/thu-linux/tu-container.txt</code> và <code>ls -l /root/thu-linux</code>. Để ý giờ.</li>
<li>Chạy vòng kiểm ở phần “Kiểm xem đã sẵn sàng chưa”. Ảnh mới sẽ báo <code>MISSING curl</code>; sửa bằng <code>apt-get update &amp;&amp; apt-get install -y curl less tree file procps iproute2 vim man-db</code> rồi chạy lại vòng kiểm.</li>
<li><code>exit</code>, rồi trên máy bạn <code>ls -l ~/thu-linux</code>; cuối cùng <code>docker start -ai lab</code> để vào lại, và <code>exit</code> lần nữa.</li></ol>
<div class="out">-rw-r--r-- 1 root root 24 Sep 28 08:57 chao.txt
-rw-r--r-- 1 root root 22 Sep 28 08:57 tu-container.txt</div>
<p>Output thật bên trong container (trên Mac hai file đó hiện lúc 15:57).</p>
<p><strong>Đạt khi:</strong> vòng kiểm in <code>ok</code> cho cả tám lệnh, <code>tu-container.txt</code> nhìn thấy được từ máy bạn, bạn giải thích được vì sao giờ của nó lệch 7 tiếng, và <code>docker start -ai lab</code> đưa bạn về đúng container cũ, <code>curl</code> vẫn còn đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">WSL 2 (Linux trong Windows)</span><span class="v">Windows Subsystem for Linux bản 2: một kernel Linux thật trong máy ảo nhẹ do Windows quản lý.</span></div>
  <div class="kv"><span class="k">Virtual machine (máy ảo)</span><span class="v">Một máy tính giả lập có kernel riêng, chạy bên trong máy thật.</span></div>
  <div class="kv"><span class="k">BSD tools (bộ lệnh BSD)</span><span class="v">Các bản <code>ls</code>, <code>sed</code>, <code>date</code>… đi kèm macOS; cùng tên với bản GNU, khác cờ.</span></div>
  <div class="kv"><span class="k">Homebrew</span><span class="v">Trình quản lý gói phổ biến trên macOS; trên chip Apple nó cài vào <code>/opt/homebrew</code>.</span></div>
  <div class="kv"><span class="k">Shebang (dòng chỉ trình thông dịch)</span><span class="v">Dòng đầu script, <code>#!…</code>, nêu tên trình thông dịch; <code>#!/usr/bin/env bash</code> đi tìm trong <code>PATH</code>.</span></div>
  <div class="kv"><span class="k">Image / container (ảnh / container)</span><span class="v">Ảnh là hệ thống file đóng gói sẵn (<code>ubuntu:24.04</code>); container là một bản đang chạy của nó.</span></div>
  <div class="kv"><span class="k">Bind mount (-v, gắn thư mục)</span><span class="v">Chia sẻ một thư mục của máy bạn vào trong container.</span></div>
  <div class="kv"><span class="k">Login shell (shell đăng nhập)</span><span class="v">Shell tài khoản của bạn khởi động mặc định (<code>$SHELL</code>), đổi bằng <code>chsh</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>WSL 2 là kernel Linux thật; để dự án ở <code>~</code>, không ở <code>/mnt/c</code>, và lưu script với kiểu xuống dòng LF.</li>
<li>macOS dùng zsh mặc định từ 2019; <code>/bin/bash</code> là bản 3.2 từ 2007, từ chối <code>declare -A</code> và <code>\${x^^}</code>.</li>
<li>Cài bash hiện hành bằng Homebrew và mở đầu script bằng <code>#!/usr/bin/env bash</code>; <code>#!/bin/bash</code> trên Mac luôn là 3.2.</li>
<li>Trong zsh tương tác, <code>#</code> không phải chú thích trừ khi bật <code>interactivecomments</code>.</li>
<li>Container <code>docker run --rm -it ubuntu:24.04 bash</code> là chỗ cho thí nghiệm phá huỷ; <code>-v</code> giữ lại file của bạn.</li>
<li>Ảnh Ubuntu tối giản thiếu <code>curl</code> và trang man; client tldr trong apt đã hỏng trên 24.04 — dùng <code>pipx install tldr</code>.</li>
</ul>

<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/install" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">Microsoft Docs — Cài đặt WSL</span><span class="lc-sub">Hướng dẫn chính thức, kèm tích hợp VS Code và ghi chú về hiệu năng hệ thống file.</span></span>
</a>
<a class="link-card" href="https://support.apple.com/en-us/102360" target="_blank" rel="noopener">
  <span class="lc-ico">🍎</span>
  <span class="lc-body"><span class="lc-title">Apple — Dùng zsh làm shell mặc định trên Mac</span><span class="lc-sub">Ghi chú của chính Apple: zsh là mặc định từ macOS 10.15, và <code>chsh -s</code> làm việc với <code>/etc/shells</code> thế nào.</span></span>
</a>
<a class="link-card" href="https://formulae.brew.sh/formula/bash" target="_blank" rel="noopener">
  <span class="lc-ico">🍺</span>
  <span class="lc-body"><span class="lc-title">Homebrew — gói bash</span><span class="lc-sub">Bản bash hiện hành cho macOS, cài cạnh bản 3.2 của Apple.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/filesystems" target="_blank" rel="noopener">
  <span class="lc-ico">📁</span>
  <span class="lc-body"><span class="lc-title">Microsoft Docs — Làm việc qua các hệ thống file (WSL)</span><span class="lc-sub">Vì sao dự án nên nằm trong hệ thống file Linux, <code>\\\\wsl$</code>, và chạy lẫn công cụ Windows với Linux.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/systemd" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Microsoft Docs — Dùng systemd với WSL</span><span class="lc-sub">Thiết lập trong <code>/etc/wsl.conf</code> và phiên bản WSL cần có.</span></span>
</a>
<a class="link-card" href="https://tldr.sh/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">tldr pages — ví dụ thực dụng cho mọi lệnh</span><span class="lc-sub">Thứ bạn muốn khi <code>man</code> đưa ra 900 dòng còn bạn chỉ cần trường hợp thường gặp.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> học trên macOS rồi deploy lên Linux mà không biết các tiện ích khác nhau. Nạn nhân kinh điển là <code>sed -i</code>: trên Linux <code>sed -i 's/a/b/' f</code> sửa tại chỗ, còn macOS đòi <code>sed -i '' 's/a/b/' f</code> — và trên Mac dạng của Linux báo lỗi <code>sed: 1: "f": invalid command code f</code>, vì <code>sed</code> bản BSD coi <code>'s/a/b/'</code> là đuôi file sao lưu còn <code>f</code> là câu lệnh sed. Biến thể <code>sed -i -e 's/a/b/' f</code> còn tệ hơn: nó chạy được, và lặng lẽ để lại một file sao lưu tên <code>f-e</code> cạnh file của bạn (cả hai đo thật trên macOS 27, tháng 9/2026). Hãy kiểm mọi thứ sắp lên máy chủ trên Linux, ít nhất là trong một container.</div>
<p class="note-ct"><strong>Hãy dựng container thí nghiệm NGAY BÂY GIỜ, trước Chương 1.</strong> Mọi chương đều có những lệnh chỉ mang tính giáo dục khi bạn kham nổi việc chúng đi sai — làm đầy đĩa, giết nhầm tiến trình, gỡ mất một quyền bạn đang cần. Có một nơi mà việc đó không tốn gì chính là khác biệt giữa HỌC được tài liệu này và chỉ ĐỌC về nó.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — Survival commands & how to study this course|||0.4 — Bộ lệnh sinh tồn & cách học khoá này',
      slug: 'lnx-0-4-cach-hoc',
      type: 'LESSON',
      description: 'Cách tự tra cứu (man, --help, tldr, ExplainShell), cách thoát khỏi mọi thứ đang kẹt kể cả vim, ba câu hỏi phải trả lời trước mọi lệnh phá huỷ, và nhịp học cả khoá.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>How to never be stuck</h2>
<p class="lead">Nobody remembers the flags. What separates people who are comfortable in a terminal from people who are not is knowing how to look things up in five seconds and how to get out of anything. Both are learnable today.</p>

<h3>The four ways to look something up</h3>
${slide('lx-00', 31, 'Sáu cách tra cứu — chọn theo câu hỏi bạn đang có')}
<pre><code>man tar                    <span class="tok-comment"># the full manual. Complete, dense, offline.</span>
tar --help | head -20      <span class="tok-comment"># a summary. Faster, and usually enough.</span>
tldr tar                   <span class="tok-comment"># the five commands people actually use.</span>
<span class="tok-keyword">type</span> -a python            <span class="tok-comment"># what IS this thing, and where does it live?</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">man</span><span class="v">Inside it: <kbd>/</kbd> searches, <kbd>n</kbd> is the next match, <kbd>q</kbd> quits, <kbd>g</kbd>/<kbd>G</kbd> jump to the start/end. It is <code>less</code>, so those keys work in any pager.</span></div>
  <div class="kv"><span class="k">--help</span><span class="v">Works for nearly everything and prints in a second. Pipe it into <code>grep</code> when you know the flag exists but not its name.</span></div>
  <div class="kv"><span class="k">tldr</span><span class="v">Community examples. The right first stop for <code>tar</code>, <code>find</code>, <code>ffmpeg</code> — the commands with a hundred flags and five real uses.</span></div>
  <div class="kv"><span class="k">apropos</span><span class="v"><code>apropos compress</code> searches man page descriptions when you do not know the command's name at all.</span></div>
</div>
<pre><code><span class="tok-comment"># The move that finds a flag in ten seconds:</span>
ls --help | grep -i <span class="tok-string">"sort"</span></code></pre>
<div class="out">      --sort=WORD            sort by WORD instead of name: none (-U), size (-S),
                               time (-t), version (-v), extension (-X), width
  -t                         sort by time, newest first; see --time
  -S                         sort by file size, largest first</div>
<h3>Run it step by step: find a flag in ten seconds — and when each method fails</h3>
${slide('lx-00', 32, 'Tìm một cờ trong 10 giây: --help | grep')}
<p>The output above is shortened: on Ubuntu 24.04 (GNU coreutils 9.4) <code>ls --help | grep -i sort</code> actually prints 18 lines, because the word "sort" appears in many descriptions. Narrow the search word and you get less noise:</p>
<pre><code class="language-bash">ls --help | grep -i "sort by"
help cd | head -2</code></pre>
<div class="out">  -c                         with -lt: sort by, and show, ctime (time of last
  -S                         sort by file size, largest first
      --sort=WORD            sort by WORD instead of name: none (-U), size (-S),
  -t                         sort by time, newest first; see --time
  …
cd: cd [-L|[-P [-e]] [-@]] [dir]
    Change the shell working directory.</div>
<p><code>help</code> is bash's own manual for its builtins — <code>cd</code>, <code>set</code>, <code>export</code>, <code>read</code> have no separate program, so <code>help cd</code> is where their flags live. Each method has a place where it fails, and knowing it saves the ten minutes you would spend wondering:</p>
<table>
<tr><th>Method</th><th>Works for</th><th>Fails when… (real output)</th></tr>
<tr><td><code>cmd --help</code></td><td>GNU programs on Linux</td><td>BSD tools on a Mac: <code>ls: unrecognized option &#96;--help'</code></td></tr>
<tr><td><code>man cmd</code></td><td>Almost everything, including Mac</td><td>Minimal Docker images: "This system has been minimized…" until <code>unminimize</code></td></tr>
<tr><td><code>help name</code></td><td>bash builtins</td><td>External programs: <code>help: no help topics match &#96;ls'</code>. In zsh <code>help</code> does not exist: <code>zsh:1: command not found: help</code></td></tr>
<tr><td><code>apropos word</code> (= <code>man -k</code>)</td><td>You do not know the command name</td><td>The man database was never built: <code>compress: nothing appropriate.</code> in the course container</td></tr>
<tr><td><code>tldr cmd</code></td><td>Five common examples</td><td>Ubuntu 24.04's apt clients cannot download pages; <code>pipx install tldr</code> works (lesson 0.3)</td></tr>
</table>
<p>Inside <code>man</code> (it runs the pager <code>less</code>), these keys are all you need:</p>
<table>
<tr><th>Key</th><th>Does</th></tr>
<tr><td><code>/</code><em>word</em> then Enter</td><td>Search forward for <em>word</em></td></tr>
<tr><td><code>n</code> / <code>N</code></td><td>Next / previous match</td></tr>
<tr><td><code>Space</code> / <code>b</code></td><td>Page down / page up</td></tr>
<tr><td><code>g</code> / <code>G</code></td><td>Start / end of the page</td></tr>
<tr><td><code>q</code></td><td>Quit</td></tr>
</table>
<p>Tip for flags: search for the flag with the spaces before it, e.g. <code>/  -S</code> in <code>man ls</code>, so you land on its definition rather than on every mention.</p>


<h3>Reading a command you did not write</h3>
${slide('lx-00', 35, 'Đọc lệnh lạ: thêm từng chặng một, nhìn output đổi')}
<p>Manuals explain one command; a real line has five joined by pipes. Two habits handle that:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Split at the pipes</div><div class="lz-d">Each <code>|</code> is a boundary. Read left to right: each stage takes the previous stage's output.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Run the first stage alone</div><div class="lz-d">Then add one stage at a time and watch the output change. This is the whole technique.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Look up only the unknown flag</div><div class="lz-d"><code>man</code> plus <kbd>/</kbd> and the flag name, rather than reading the page.</div></div>
</div>
<a class="link-card" href="https://explainshell.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">ExplainShell — paste a command, get every flag annotated</span><span class="lc-sub">Built for exactly the case above: an unfamiliar line with six flags and three pipes.</span></span>
</a>

<h3>Getting out of anything</h3>
${slide('lx-00', 33, 'Thoát khỏi mọi thứ: bảy phím cứu hộ')}
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl-C</span><span class="v">Interrupt the running program. The first thing to try, always.</span></div>
  <div class="kv"><span class="k">Ctrl-D</span><span class="v">End of input. Exits the shell, or ends a program reading from stdin (<code>cat</code>, <code>python</code>).</span></div>
  <div class="kv"><span class="k">q</span><span class="v">Quits <code>man</code>, <code>less</code>, <code>git log</code>, <code>top</code> — anything showing a page of text.</span></div>
  <div class="kv"><span class="k">:q!</span><span class="v">Quits <code>vim</code> without saving. <kbd>Esc</kbd> first. This is the one everybody needs once.</span></div>
  <div class="kv"><span class="k">Ctrl-X Ctrl-C</span><span class="v">Quits <code>nano</code>? No — nano is <kbd>Ctrl-X</kbd>. The hint bar at the bottom shows <code>^X</code>, meaning Ctrl-X.</span></div>
  <div class="kv"><span class="k">Ctrl-Z then kill %1</span><span class="v">Suspend a program that ignores Ctrl-C, then kill it. Chapter 5.</span></div>
  <div class="kv"><span class="k">reset</span><span class="v">Terminal showing garbage after you <code>cat</code>-ed a binary? <code>reset</code> fixes it. Type it blind if you cannot see.</span></div>
</div>
<div class="callout ok">Git and many other tools open <code>less</code> to show you output. If a command seems to have "frozen" with a <code>:</code> at the bottom of the screen, it has not — it is waiting for you. Press <kbd>q</kbd>.</div>

<h3>Three questions before any destructive command</h3>
${slide('lx-00', 34, 'Ba câu hỏi trước MỌI lệnh phá huỷ: cái gì · ở đâu · là ai')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Which files will this actually hit?</div><div class="lz-d">The shell expands globs before the program sees them. Run <code>ls</code> with the same pattern first.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Where am I?</div><div class="lz-d"><code>pwd</code>. The same <code>rm -rf *</code> is harmless in <code>/tmp/lab</code> and catastrophic in <code>/</code>.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Am I root?</div><div class="lz-d">A <code>#</code> prompt instead of <code>$</code> means no permission will stop you. Chapter 4.</div></div>
</div>
<pre><code><span class="tok-comment"># The habit: preview with ls, then swap in the destructive command.</span>
ls -la *.log                    <span class="tok-comment"># ← LOOK first</span>
rm *.log                        <span class="tok-comment"># ← then act</span>

<span class="tok-comment"># find has a built-in preview: run it without -delete first.</span>
find . -name <span class="tok-string">'*.tmp'</span> -mtime +30              <span class="tok-comment"># list</span>
find . -name <span class="tok-string">'*.tmp'</span> -mtime +30 -delete      <span class="tok-comment"># then delete</span></code></pre>
<div class="callout danger">There is no undo and no recycle bin. <code>rm</code> asks the kernel to unlink the file and the space is reusable immediately. The habits above are not caution for beginners — they are what experienced people do, because they are the ones who have deleted something that mattered.</div>

<h3>Run it step by step: && stops a chain, ; does not</h3>
<p>The second question — "where am I?" — also applies <em>inside</em> scripts and one-liners. Chain the commands with <code>&amp;&amp;</code> and a failed <code>cd</code> stops everything after it; chain them with <code>;</code> and the next command runs anyway, in whatever directory you happen to be. Real output in the course container:</p>
<pre><code class="language-bash">cd /khong-co &amp;&amp; echo "deploy..."
echo $?</code></pre>
<div class="out">bash: cd: /khong-co: No such file or directory
1</div>
<p><code>echo "deploy..."</code> never ran. With <code>cd /khong-co ; rm -rf build/</code> the <code>rm</code> <em>would</em> have run — in the directory you were already in. Use <code>&amp;&amp;</code> (or <code>set -e</code> in scripts, Chapter 7) whenever a later step only makes sense if an earlier one worked.</p>
<table>
<tr><th>Separator</th><th>Next command runs…</th><th>Use it for</th></tr>
<tr><td><code>;</code></td><td>always</td><td>independent commands</td></tr>
<tr><td><code>&amp;&amp;</code></td><td>only if the previous one succeeded (exit 0)</td><td><code>cd dir &amp;&amp; …</code>, build then deploy</td></tr>
<tr><td><code>||</code></td><td>only if the previous one failed</td><td><code>command -v curl || echo "MISSING curl"</code></td></tr>
</table>

<h3>How to pace the course</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chapters 1–3</span><span class="v">In order, with a terminal open. This is the foundation; everything later assumes it. Roughly one chapter per sitting.</span></div>
  <div class="kv"><span class="k">Chapters 4–5</span><span class="v">How the machine works. Best learned in the throwaway container, where breaking permissions costs nothing.</span></div>
  <div class="kv"><span class="k">Chapters 6–8</span><span class="v">The shell as a language. Slower going, and the highest-value part of the course — this is where pasted commands become written ones.</span></div>
  <div class="kv"><span class="k">Chapters 9–12</span><span class="v">Reference-shaped. Read what you need when you need it; Chapter 12 is a cookbook to open mid-incident.</span></div>
</div>

<h3>Building the muscle</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Use the terminal for one real task a day</span><span class="lz-v">Rename a batch of files, search a log, check what is using a port. Ten minutes of real work beats an hour of exercises.</span></div>
  <div class="lz-layer"><span class="lz-k">When you copy a command, read it first</span><span class="lz-v">Name each flag out loud, or paste it into ExplainShell. The habit costs twenty seconds and is the entire difference this course is after.</span></div>
  <div class="lz-layer"><span class="lz-k">Keep a personal cheat file</span><span class="lz-v">One text file of commands that solved something. You will reuse it constantly, and writing it is itself the revision.</span></div>
  <div class="lz-layer"><span class="lz-k">Break the container on purpose</span><span class="lz-v">Fill the disk, kill PID 1, remove read permission from your own home directory. Recovering teaches more than any lesson can.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your lecturer asks for last week's logs as one compressed file. You remember "it's <code>tar</code> something" but not the flags. Find them yourself — no web search.</p><ol>
<li>In <code>~/thu-linux</code>, make three small logs: <code>mkdir -p logs</code>, then <code>for d in 25 26 27; do printf "2026-09-%s INFO start\\n2026-09-%s ERROR db timeout\\n" $d $d &gt; logs/app-$d.log; done</code>.</li>
<li>Find the compression flag: <code>tar --help | grep -i gzip</code>.</li>
<li>Find create, list, file and verbose: <code>tar --help | grep -E -- "^  -[ctxfvz],"</code>. (On a Mac use <code>man tar</code> and <code>/-z</code> instead.)</li>
<li>Build the archive with what you found, then list it without extracting.</li>
<li>Write the two <code>tar</code> lines into <code>meo.txt</code> with a Vietnamese note for each flag.</li></ol>
<pre><code class="language-bash">tar --help | grep -E -- "^  -[ctxfvz],"
tar -czvf logs.tar.gz logs
tar -tzf logs.tar.gz</code></pre>
<div class="out">  -c, --create               create a new archive
  -t, --list                 list the contents of an archive
  -x, --extract, --get       extract files from an archive
  -f, --file=ARCHIVE         use archive file or device ARCHIVE
  -z, --gzip, --gunzip, --ungzip   filter the archive through gzip
  -v, --verbose              verbosely list files processed
logs/
logs/app-25.log
logs/app-26.log
logs/app-27.log
logs/
logs/app-25.log
logs/app-26.log
logs/app-27.log</div>
<p>Real output from the course container (GNU tar on Ubuntu 24.04): the first four file lines come from <code>-v</code> while creating, the last four from <code>-t</code>.</p>
<p><strong>Done when:</strong> <code>logs.tar.gz</code> exists, <code>tar -tzf</code> lists the folder and all three logs, and you can say what each of <code>c z v f t</code> means without looking.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">man page</span><span class="v">The built-in manual of a command, read with <code>man</code>.</span></div>
  <div class="kv"><span class="k">Pager (less)</span><span class="v">The program that shows long text one screen at a time; <code>/</code> searches, <code>q</code> quits.</span></div>
  <div class="kv"><span class="k">help</span><span class="v">bash's manual for its own builtins, such as <code>help cd</code>.</span></div>
  <div class="kv"><span class="k">Flag / option</span><span class="v">A switch that changes what a command does, like <code>-z</code> or <code>--gzip</code>.</span></div>
  <div class="kv"><span class="k">apropos (man -k)</span><span class="v">Searches man page descriptions when you do not know the command's name.</span></div>
  <div class="kv"><span class="k">&amp;&amp; / || / ;</span><span class="v">Run the next command only on success / only on failure / always.</span></div>
  <div class="kv"><span class="k">Root prompt (#)</span><span class="v">A prompt ending in <code>#</code> means you are the administrator — no permission will stop a mistake.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Look things up in this order: <code>--help | grep</code>, <code>man</code> with <code>/</code>, <code>help</code> for builtins, <code>tldr</code> for examples, <code>apropos</code> when you lack the name.</li>
<li>Each method has a blind spot: no <code>--help</code> in BSD tools, no man pages in minimal containers, no <code>help</code> in zsh.</li>
<li><code>Ctrl</code>+<code>C</code> interrupts, <code>q</code> leaves a pager, <code>Esc :q!</code> leaves vim, <code>Ctrl</code>+<code>X</code> leaves nano, <code>reset</code> fixes a garbled terminal.</li>
<li>Before anything destructive: what will it hit, where am I, who am I — preview with <code>ls</code> or <code>echo</code>.</li>
<li><code>&amp;&amp;</code> stops a chain when a step fails; <code>;</code> does not — use <code>&amp;&amp;</code> after every <code>cd</code>.</li>
<li>Read an unfamiliar pipeline one stage at a time, and keep what works in your own <code>meo.txt</code>.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">man7.org — the Linux man pages, online and searchable</span><span class="lc-sub">The same pages as <code>man</code>, but linkable and readable on a phone.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice after each chapter: the Linux &amp; Bash track</span><span class="lc-sub">Graded exercises with solutions, ordered to match these chapters.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> running a command from the internet with <code>sudo</code> in front of it because it failed without. <code>sudo</code> removes the protection that just stopped you, and the most common reason for "Permission denied" is that the command is wrong — the wrong path, the wrong user, a file owned by someone else for a reason. Chapter 4 teaches you to read the error instead. Reaching for <code>sudo</code> reflexively is how a small mistake becomes a system-wide one.</div>
<p class="note-ct"><strong>On memorising:</strong> do not. There are thousands of commands and every one has more flags than anybody remembers. Learn the <em>model</em> — files, processes, streams, permissions — and about forty commands; look everything else up. Someone who understands the model finds the right flag in a minute, while someone who memorised flags is stuck the moment the situation is slightly different.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cách để không bao giờ bị kẹt</h2>
<p class="lead">Không ai thuộc hết các cờ. Thứ phân biệt người thoải mái trong terminal với người thì không là biết cách tra cứu trong năm giây và biết cách thoát ra khỏi mọi thứ. Cả hai đều học được ngay hôm nay.</p>

<h3>Bốn cách tra cứu</h3>
${slide('lx-00', 31, 'Sáu cách tra cứu — chọn theo câu hỏi bạn đang có')}
<pre><code>man tar                    <span class="tok-comment"># sách hướng dẫn đầy đủ. Trọn vẹn, đặc, chạy ngoại tuyến.</span>
tar --help | head -20      <span class="tok-comment"># bản tóm tắt. Nhanh hơn, và thường là đủ.</span>
tldr tar                   <span class="tok-comment"># năm lệnh mà người ta thật sự dùng.</span>
<span class="tok-keyword">type</span> -a python            <span class="tok-comment"># cái này LÀ cái gì, và nó nằm ở đâu?</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">man</span><span class="v">Bên trong nó: <kbd>/</kbd> để tìm, <kbd>n</kbd> tới kết quả kế tiếp, <kbd>q</kbd> để thoát, <kbd>g</kbd>/<kbd>G</kbd> nhảy về đầu/cuối. Nó chính là <code>less</code>, nên các phím đó chạy trong mọi trình phân trang.</span></div>
  <div class="kv"><span class="k">--help</span><span class="v">Chạy được với gần như mọi thứ và in ra trong một giây. Đưa nó vào <code>grep</code> khi bạn biết có cái cờ đó nhưng không nhớ tên.</span></div>
  <div class="kv"><span class="k">tldr</span><span class="v">Ví dụ do cộng đồng viết. Điểm dừng đầu tiên đúng đắn cho <code>tar</code>, <code>find</code>, <code>ffmpeg</code> — những lệnh có một trăm cờ và năm cách dùng thật.</span></div>
  <div class="kv"><span class="k">apropos</span><span class="v"><code>apropos compress</code> tìm trong phần mô tả của các trang man khi bạn hoàn toàn không biết tên lệnh.</span></div>
</div>
<pre><code><span class="tok-comment"># Nước đi tìm ra một cái cờ trong mười giây:</span>
ls --help | grep -i <span class="tok-string">"sort"</span></code></pre>
<div class="out">      --sort=WORD            sort by WORD instead of name: none (-U), size (-S),
                               time (-t), version (-v), extension (-X), width
  -t                         sort by time, newest first; see --time
  -S                         sort by file size, largest first</div>
<h3>Chạy thử từng bước: tìm một cờ trong mười giây — và khi nào mỗi cách thất bại</h3>
${slide('lx-00', 32, 'Tìm một cờ trong 10 giây: --help | grep')}
<p>Output ở trên đã được rút gọn: trên Ubuntu 24.04 (GNU coreutils 9.4), <code>ls --help | grep -i sort</code> thật ra in 18 dòng, vì chữ “sort” xuất hiện trong nhiều phần mô tả. Thu hẹp từ khoá tìm là bớt nhiễu:</p>
<pre><code class="language-bash">ls --help | grep -i "sort by"
help cd | head -2</code></pre>
<div class="out">  -c                         with -lt: sort by, and show, ctime (time of last
  -S                         sort by file size, largest first
      --sort=WORD            sort by WORD instead of name: none (-U), size (-S),
  -t                         sort by time, newest first; see --time
  …
cd: cd [-L|[-P [-e]] [-@]] [dir]
    Change the shell working directory.</div>
<p><code>help</code> là sách hướng dẫn riêng của bash cho các lệnh builtin — <code>cd</code>, <code>set</code>, <code>export</code>, <code>read</code> không có chương trình riêng, nên cờ của chúng nằm ở <code>help cd</code>. Mỗi cách tra đều có chỗ nó thất bại, và biết trước thì đỡ mất mười phút ngồi thắc mắc:</p>
<table>
<tr><th>Cách</th><th>Dùng được cho</th><th>Thất bại khi… (output thật)</th></tr>
<tr><td><code>lệnh --help</code></td><td>Chương trình GNU trên Linux</td><td>Bộ lệnh BSD trên Mac: <code>ls: unrecognized option &#96;--help'</code></td></tr>
<tr><td><code>man lệnh</code></td><td>Gần như mọi thứ, kể cả Mac</td><td>Ảnh Docker tối giản: “This system has been minimized…” cho tới khi <code>unminimize</code></td></tr>
<tr><td><code>help tên</code></td><td>Lệnh builtin của bash</td><td>Chương trình bên ngoài: <code>help: no help topics match &#96;ls'</code>. Trong zsh không có <code>help</code>: <code>zsh:1: command not found: help</code></td></tr>
<tr><td><code>apropos từ</code> (= <code>man -k</code>)</td><td>Bạn không biết tên lệnh</td><td>CSDL của man chưa được dựng: container của khoá trả <code>compress: nothing appropriate.</code></td></tr>
<tr><td><code>tldr lệnh</code></td><td>Năm ví dụ thường dùng</td><td>Client apt của Ubuntu 24.04 không tải được trang; <code>pipx install tldr</code> thì được (bài 0.3)</td></tr>
</table>
<p>Bên trong <code>man</code> (nó chạy trình phân trang <code>less</code>), chỉ cần những phím này:</p>
<table>
<tr><th>Phím</th><th>Làm gì</th></tr>
<tr><td><code>/</code><em>từ</em> rồi Enter</td><td>Tìm xuôi <em>từ</em> đó</td></tr>
<tr><td><code>n</code> / <code>N</code></td><td>Chỗ khớp kế tiếp / trước đó</td></tr>
<tr><td><code>Space</code> / <code>b</code></td><td>Xuống một trang / lên một trang</td></tr>
<tr><td><code>g</code> / <code>G</code></td><td>Đầu / cuối trang man</td></tr>
<tr><td><code>q</code></td><td>Thoát</td></tr>
</table>
<p>Mẹo tìm cờ: gõ cả dấu cách đứng trước cờ, ví dụ <code>/  -S</code> trong <code>man ls</code>, để nhảy thẳng tới chỗ định nghĩa nó thay vì mọi lần nó được nhắc tới.</p>


<h3>Đọc một lệnh không phải bạn viết</h3>
${slide('lx-00', 35, 'Đọc lệnh lạ: thêm từng chặng một, nhìn output đổi')}
<p>Sách hướng dẫn giải thích MỘT lệnh; một dòng thật có năm lệnh nối bằng ống. Hai thói quen xử lý được chuyện đó:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Chẻ ra ở các dấu ống</div><div class="lz-d">Mỗi <code>|</code> là một ranh giới. Đọc từ trái sang phải: mỗi chặng nhận output của chặng trước.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Chạy riêng chặng đầu tiên</div><div class="lz-d">Rồi thêm từng chặng một và nhìn output đổi đi. Toàn bộ kỹ thuật chỉ có vậy.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Chỉ tra cái cờ bạn chưa biết</div><div class="lz-d"><code>man</code> rồi <kbd>/</kbd> và tên cái cờ, thay vì đọc cả trang.</div></div>
</div>
<a class="link-card" href="https://explainshell.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">ExplainShell — dán một lệnh vào, nhận chú giải cho từng cờ</span><span class="lc-sub">Dựng ra đúng cho tình huống trên: một dòng lạ với sáu cái cờ và ba dấu ống.</span></span>
</a>

<h3>Thoát ra khỏi mọi thứ</h3>
${slide('lx-00', 33, 'Thoát khỏi mọi thứ: bảy phím cứu hộ')}
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl-C</span><span class="v">Ngắt chương trình đang chạy. Thứ đầu tiên nên thử, lúc nào cũng vậy.</span></div>
  <div class="kv"><span class="k">Ctrl-D</span><span class="v">Kết thúc đầu vào. Thoát khỏi shell, hoặc kết thúc một chương trình đang đọc stdin (<code>cat</code>, <code>python</code>).</span></div>
  <div class="kv"><span class="k">q</span><span class="v">Thoát <code>man</code>, <code>less</code>, <code>git log</code>, <code>top</code> — mọi thứ đang hiện một trang chữ.</span></div>
  <div class="kv"><span class="k">:q!</span><span class="v">Thoát <code>vim</code> mà không lưu. Bấm <kbd>Esc</kbd> trước. Đây là thứ ai cũng cần đúng một lần.</span></div>
  <div class="kv"><span class="k">Ctrl-X Ctrl-C</span><span class="v">Thoát <code>nano</code> à? Không — nano là <kbd>Ctrl-X</kbd>. Thanh gợi ý ở đáy hiện <code>^X</code>, nghĩa là Ctrl-X.</span></div>
  <div class="kv"><span class="k">Ctrl-Z rồi kill %1</span><span class="v">Tạm dừng một chương trình lờ Ctrl-C đi, rồi giết nó. Chương 5.</span></div>
  <div class="kv"><span class="k">reset</span><span class="v">Terminal hiện toàn ký tự rác sau khi bạn <code>cat</code> một file nhị phân? <code>reset</code> chữa được. Cứ gõ mù nếu không nhìn thấy gì.</span></div>
</div>
<div class="callout ok">Git và nhiều công cụ khác mở <code>less</code> để hiện output cho bạn. Nếu một lệnh có vẻ "đơ" với dấu <code>:</code> ở đáy màn hình thì nó không đơ đâu — nó đang chờ bạn. Bấm <kbd>q</kbd>.</div>

<h3>Ba câu hỏi trước mọi lệnh phá huỷ</h3>
${slide('lx-00', 34, 'Ba câu hỏi trước MỌI lệnh phá huỷ: cái gì · ở đâu · là ai')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Lệnh này thật ra sẽ chạm vào những file nào?</div><div class="lz-d">Shell khai triển glob TRƯỚC khi chương trình nhìn thấy. Hãy chạy <code>ls</code> với cùng cái mẫu đó trước.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Tôi đang ở đâu?</div><div class="lz-d"><code>pwd</code>. Cùng một lệnh <code>rm -rf *</code> là vô hại ở <code>/tmp/lab</code> và là thảm hoạ ở <code>/</code>.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Tôi có đang là root không?</div><div class="lz-d">Dấu nhắc <code>#</code> thay vì <code>$</code> nghĩa là không có quyền nào chặn bạn lại. Chương 4.</div></div>
</div>
<pre><code><span class="tok-comment"># Thói quen: xem trước bằng ls, rồi mới thay bằng lệnh phá huỷ.</span>
ls -la *.log                    <span class="tok-comment"># ← NHÌN trước</span>
rm *.log                        <span class="tok-comment"># ← rồi mới hành động</span>

<span class="tok-comment"># find có sẵn chế độ xem trước: chạy nó mà chưa có -delete.</span>
find . -name <span class="tok-string">'*.tmp'</span> -mtime +30              <span class="tok-comment"># liệt kê</span>
find . -name <span class="tok-string">'*.tmp'</span> -mtime +30 -delete      <span class="tok-comment"># rồi mới xoá</span></code></pre>
<div class="callout danger">Không có hoàn tác và không có thùng rác. <code>rm</code> nhờ kernel gỡ liên kết tới file và chỗ trống đó dùng lại được ngay lập tức. Những thói quen trên không phải sự thận trọng dành cho người mới — đó là thứ người có kinh nghiệm làm, vì họ chính là những người đã từng xoá mất thứ gì đó quan trọng.</div>

<h3>Chạy thử từng bước: && dừng chuỗi lại, ; thì không</h3>
<p>Câu hỏi thứ hai — “tôi đang ở đâu?” — cũng áp dụng <em>bên trong</em> script và các lệnh một dòng. Nối lệnh bằng <code>&amp;&amp;</code> thì một cú <code>cd</code> hỏng sẽ chặn mọi thứ phía sau; nối bằng <code>;</code> thì lệnh kế vẫn chạy, ở bất kỳ thư mục nào bạn đang đứng. Output thật trong container của khoá:</p>
<pre><code class="language-bash">cd /khong-co &amp;&amp; echo "deploy..."
echo $?</code></pre>
<div class="out">bash: cd: /khong-co: No such file or directory
1</div>
<p><code>echo "deploy..."</code> không hề chạy. Với <code>cd /khong-co ; rm -rf build/</code> thì <code>rm</code> <em>sẽ</em> chạy — ở chính thư mục bạn đang đứng. Dùng <code>&amp;&amp;</code> (hoặc <code>set -e</code> trong script, Chương 7) mỗi khi bước sau chỉ có nghĩa nếu bước trước thành công.</p>
<table>
<tr><th>Dấu nối</th><th>Lệnh kế tiếp chạy…</th><th>Dùng cho</th></tr>
<tr><td><code>;</code></td><td>luôn luôn</td><td>các lệnh độc lập nhau</td></tr>
<tr><td><code>&amp;&amp;</code></td><td>chỉ khi lệnh trước thành công (mã 0)</td><td><code>cd thư-mục &amp;&amp; …</code>, build rồi mới deploy</td></tr>
<tr><td><code>||</code></td><td>chỉ khi lệnh trước thất bại</td><td><code>command -v curl || echo "MISSING curl"</code></td></tr>
</table>

<h3>Nhịp học cả khoá</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chương 1–3</span><span class="v">Theo thứ tự, mở sẵn một terminal. Đây là nền móng; mọi thứ về sau đều giả định nó. Khoảng một chương mỗi buổi.</span></div>
  <div class="kv"><span class="k">Chương 4–5</span><span class="v">Máy hoạt động thế nào. Học tốt nhất trong container vứt đi, nơi phá hỏng quyền chẳng tốn gì.</span></div>
  <div class="kv"><span class="k">Chương 6–8</span><span class="v">Shell như một ngôn ngữ. Đi chậm hơn, và là phần giá trị nhất của khoá — đây là chỗ những lệnh đi chép trở thành những lệnh do bạn viết.</span></div>
  <div class="kv"><span class="k">Chương 9–12</span><span class="v">Dạng tra cứu. Đọc cái nào cần lúc cần; Chương 12 là sách công thức để mở ra giữa lúc sự cố.</span></div>
</div>

<h3>Luyện cho thành cơ bắp</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Mỗi ngày dùng terminal cho một việc THẬT</span><span class="lz-v">Đổi tên một mớ file, tìm trong một file log, kiểm xem cái gì đang chiếm một cổng. Mười phút việc thật hơn một giờ bài tập.</span></div>
  <div class="lz-layer"><span class="lz-k">Khi chép một lệnh, hãy đọc nó trước</span><span class="lz-v">Gọi tên từng cái cờ thành tiếng, hoặc dán nó vào ExplainShell. Thói quen đó tốn hai mươi giây và chính là toàn bộ khác biệt mà khoá này nhắm tới.</span></div>
  <div class="lz-layer"><span class="lz-k">Giữ một file mẹo cá nhân</span><span class="lz-v">Một file văn bản chứa những lệnh đã giải quyết được việc gì đó. Bạn sẽ dùng lại nó liên tục, và chính việc viết nó ra đã là ôn tập.</span></div>
  <div class="lz-layer"><span class="lz-k">Phá container một cách có chủ ý</span><span class="lz-v">Làm đầy đĩa, giết PID 1, gỡ quyền đọc khỏi chính thư mục nhà của bạn. Việc cứu hộ dạy được nhiều hơn mọi bài giảng.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> thầy muốn nhận log tuần trước dưới dạng một file nén. Bạn nhớ mang máng “là <code>tar</code> gì đó” mà không nhớ cờ. Hãy tự tìm — không tra Google.</p><ol>
<li>Trong <code>~/thu-linux</code>, tạo ba file log nhỏ: <code>mkdir -p logs</code>, rồi <code>for d in 25 26 27; do printf "2026-09-%s INFO start\\n2026-09-%s ERROR db timeout\\n" $d $d &gt; logs/app-$d.log; done</code>.</li>
<li>Tìm cờ nén: <code>tar --help | grep -i gzip</code>.</li>
<li>Tìm cờ tạo, liệt kê, file và chi tiết: <code>tar --help | grep -E -- "^  -[ctxfvz],"</code>. (Trên Mac thì dùng <code>man tar</code> rồi <code>/-z</code>.)</li>
<li>Dựng file nén bằng những gì vừa tìm được, rồi liệt kê nó mà không giải nén.</li>
<li>Ghi hai dòng <code>tar</code> vào <code>meo.txt</code>, mỗi cờ một ghi chú tiếng Việt.</li></ol>
<pre><code class="language-bash">tar --help | grep -E -- "^  -[ctxfvz],"
tar -czvf logs.tar.gz logs
tar -tzf logs.tar.gz</code></pre>
<div class="out">  -c, --create               create a new archive
  -t, --list                 list the contents of an archive
  -x, --extract, --get       extract files from an archive
  -f, --file=ARCHIVE         use archive file or device ARCHIVE
  -z, --gzip, --gunzip, --ungzip   filter the archive through gzip
  -v, --verbose              verbosely list files processed
logs/
logs/app-25.log
logs/app-26.log
logs/app-27.log
logs/
logs/app-25.log
logs/app-26.log
logs/app-27.log</div>
<p>Output thật từ container của khoá (GNU tar trên Ubuntu 24.04): bốn dòng tên file đầu do <code>-v</code> in ra lúc tạo, bốn dòng cuối do <code>-t</code>.</p>
<p><strong>Đạt khi:</strong> có file <code>logs.tar.gz</code>, <code>tar -tzf</code> liệt kê thư mục và đủ ba file log, và bạn nói được nghĩa của từng chữ <code>c z v f t</code> mà không cần nhìn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">man page (trang hướng dẫn)</span><span class="v">Sách hướng dẫn có sẵn của một lệnh, đọc bằng <code>man</code>.</span></div>
  <div class="kv"><span class="k">Pager (trình phân trang, less)</span><span class="v">Chương trình hiện văn bản dài từng màn hình một; <code>/</code> để tìm, <code>q</code> để thoát.</span></div>
  <div class="kv"><span class="k">help</span><span class="v">Sách hướng dẫn của bash cho chính các lệnh builtin, như <code>help cd</code>.</span></div>
  <div class="kv"><span class="k">Flag / option (cờ / tuỳ chọn)</span><span class="v">Công tắc đổi cách một lệnh làm việc, như <code>-z</code> hay <code>--gzip</code>.</span></div>
  <div class="kv"><span class="k">apropos (man -k, tìm theo mô tả)</span><span class="v">Tìm trong phần mô tả của các trang man khi bạn không biết tên lệnh.</span></div>
  <div class="kv"><span class="k">&amp;&amp; / || / ; (dấu nối lệnh)</span><span class="v">Chạy lệnh kế chỉ khi thành công / chỉ khi thất bại / luôn luôn.</span></div>
  <div class="kv"><span class="k">Root prompt (dấu nhắc #)</span><span class="v">Dấu nhắc kết thúc bằng <code>#</code> nghĩa là bạn là quản trị viên — không quyền nào chặn được một sai lầm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tra theo thứ tự: <code>--help | grep</code>, <code>man</code> với <code>/</code>, <code>help</code> cho builtin, <code>tldr</code> để xem ví dụ, <code>apropos</code> khi không biết tên.</li>
<li>Cách nào cũng có điểm mù: bộ lệnh BSD không có <code>--help</code>, container tối giản không có trang man, zsh không có <code>help</code>.</li>
<li><code>Ctrl</code>+<code>C</code> để ngắt, <code>q</code> thoát trình phân trang, <code>Esc :q!</code> thoát vim, <code>Ctrl</code>+<code>X</code> thoát nano, <code>reset</code> chữa terminal rối.</li>
<li>Trước mọi thứ phá huỷ: nó chạm vào gì, tôi ở đâu, tôi là ai — xem trước bằng <code>ls</code> hoặc <code>echo</code>.</li>
<li><code>&amp;&amp;</code> dừng chuỗi khi một bước hỏng; <code>;</code> thì không — dùng <code>&amp;&amp;</code> sau mọi <code>cd</code>.</li>
<li>Đọc một ống dẫn lạ từng chặng một, và giữ những gì hiệu quả trong <code>meo.txt</code> của riêng bạn.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">man7.org — các trang man của Linux, trực tuyến và tìm được</span><span class="lc-sub">Đúng những trang mà <code>man</code> hiện ra, nhưng gửi link được và đọc được trên điện thoại.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện sau mỗi chương: track Linux &amp; Bash</span><span class="lc-sub">Bài tập chấm điểm kèm lời giải, sắp xếp khớp với các chương này.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chạy một lệnh lấy trên mạng kèm <code>sudo</code> phía trước chỉ vì không có nó thì hỏng. <code>sudo</code> gỡ bỏ đúng cái lớp bảo vệ vừa chặn bạn lại, và lý do phổ biến nhất của "Permission denied" là lệnh đó SAI — sai đường dẫn, sai người dùng, hoặc một file thuộc về người khác vì một lý do nào đó. Chương 4 dạy bạn đọc cái thông báo lỗi thay vì thế. Vớ lấy <code>sudo</code> theo phản xạ là cách một sai lầm nhỏ trở thành một sai lầm ở tầm toàn hệ thống.</div>
<p class="note-ct"><strong>Về việc học thuộc:</strong> đừng. Có hàng nghìn lệnh và cái nào cũng có nhiều cờ hơn số ai nhớ nổi. Hãy học <em>MÔ HÌNH</em> — file, tiến trình, dòng dữ liệu, quyền — cùng khoảng bốn mươi lệnh; còn lại thì tra. Người hiểu mô hình tìm ra cái cờ đúng trong một phút, còn người học thuộc cờ thì tắc ngay khi tình huống khác đi một chút.</p>
</div>
`,
    },
    /* ─────────────────────────── 0.7 · QUIZ ─────────────────────────── */
    {
      title: '0.7 — Section 0 check|||0.7 — Kiểm tra Mục 0',
      slug: 'lnx-0-7-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật: bash 3.2 trên Mac, vì sao cd là builtin, biến rỗng trong rm -rf, set -u so với ${VAR:?}, file CRLF từ Windows, mã thoát 127, WSL2 chậm ở /mnt/c, tra cờ trên Mac, uname trong container, và dấu : ở đáy màn hình.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations you will actually meet in your first weeks with a terminal — every one of them is decided by something in this section. Read the explanation after submitting, especially for the questions you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can name the four layers — terminal, shell, programs, kernel — and say which one printed a given error.</li>
<li>I can tell, from a machine's output, whether I am on GNU/Linux, macOS (BSD, bash 3.2) or inside a container.</li>
<li>I can explain why <code>rm -rf "$DIR/"*</code> with an empty <code>DIR</code> is <code>rm -rf /*</code>, and which guard stops it.</li>
<li>I can read an error message as who · about what · why, and interpret <code>$?</code> values 0, 126 and 127.</li>
<li>I know where to keep code on WSL2, why Windows line endings break scripts, and how to fix them.</li>
<li>I can look up a flag in seconds (<code>--help | grep</code>, <code>man</code> + <code>/</code>, <code>help</code>, <code>tldr</code>) and get out of <code>less</code>, <code>vim</code> and <code>nano</code>.</li>
</ul>
${slide('lx-00', 37, 'Bảng tra nhanh Mục 0 (1/2)')}
${slide('lx-00', 38, 'Bảng tra nhanh Mục 0 (2/2)')}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống bạn sẽ thật sự gặp trong những tuần đầu với terminal — câu nào cũng được quyết định bởi một điều trong mục này. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi gọi tên được bốn lớp — terminal, shell, chương trình, kernel — và nói được lớp nào đã in ra một thông báo lỗi.</li>
<li>Nhìn output của một máy, tôi biết mình đang ở GNU/Linux, macOS (BSD, bash 3.2) hay bên trong một container.</li>
<li>Tôi giải thích được vì sao <code>rm -rf "$DIR/"*</code> với <code>DIR</code> rỗng là <code>rm -rf /*</code>, và chốt chặn nào dừng được nó.</li>
<li>Tôi đọc được một thông báo lỗi theo khuôn ai kêu · về cái gì · vì sao, và hiểu các giá trị <code>$?</code> 0, 126, 127.</li>
<li>Tôi biết để code ở đâu trên WSL2, vì sao kiểu xuống dòng của Windows làm hỏng script, và sửa thế nào.</li>
<li>Tôi tra được một cái cờ trong vài giây (<code>--help | grep</code>, <code>man</code> + <code>/</code>, <code>help</code>, <code>tldr</code>) và thoát được khỏi <code>less</code>, <code>vim</code>, <code>nano</code>.</li>
</ul>
${slide('lx-00', 37, 'Bảng tra nhanh Mục 0 (1/2)')}
${slide('lx-00', 38, 'Bảng tra nhanh Mục 0 (2/2)')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'On your Mac, a script copied from the group VPS stops at its first line with: /bin/bash: line 0: declare: -A: invalid option. The same script works on the Ubuntu server. What is going on?|||Trên Mac, một script chép từ VPS của nhóm dừng ngay dòng đầu với: /bin/bash: line 0: declare: -A: invalid option. Cùng script đó chạy tốt trên máy chủ Ubuntu. Chuyện gì đang xảy ra?',
            options: [
              'macOS ships /bin/bash 3.2 from 2007; associative arrays (declare -A) only arrived in bash 4, so install a newer bash and use #!/usr/bin/env bash|||macOS đi kèm /bin/bash 3.2 từ năm 2007; mảng kết hợp (declare -A) chỉ có từ bash 4, nên cài bash mới hơn và dùng #!/usr/bin/env bash',
              'zsh is the default shell on macOS, and zsh cannot run any file that starts with #!/bin/bash, so it must be rewritten|||zsh là shell mặc định trên macOS, mà zsh không chạy được file nào bắt đầu bằng #!/bin/bash, nên phải viết lại script',
              'declare needs administrator rights on macOS, so the script has to be started with sudo to create the array|||Trên macOS lệnh declare cần quyền quản trị, nên phải chạy script bằng sudo thì mới tạo được mảng',
              'The file still has Windows line endings, which makes every option after declare unreadable to the shell|||File vẫn còn kiểu xuống dòng của Windows, làm shell không đọc được mọi tuỳ chọn đứng sau declare',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: /bin/bash --version on a Mac prints 3.2.57 (2007) — the last version under GPLv2 — and that bash rejects declare -A. The shebang #!/bin/bash picks that old bash regardless of your login shell, so blaming zsh (the most tempting option) is wrong: zsh never ran the script. sudo does not add features, and CRLF produces $\'\\r\' errors, not "invalid option".|||VI: /bin/bash --version trên Mac in 3.2.57 (2007) — bản cuối cùng theo GPLv2 — và bash đó từ chối declare -A. Dòng shebang #!/bin/bash chọn đúng bash cũ đó bất kể shell đăng nhập là gì, nên đổ cho zsh (phương án hấp dẫn nhất) là sai: zsh không hề chạy script. sudo không thêm tính năng, còn CRLF sinh lỗi kiểu $\'\\r\', không phải "invalid option".',
          },
          {
            question: 'type ls prints "ls is /usr/bin/ls" but type cd prints "cd is a shell builtin". Why can cd not simply be a program in /usr/bin like ls?|||type ls in "ls is /usr/bin/ls" còn type cd in "cd is a shell builtin". Vì sao cd không thể đơn giản là một chương trình trong /usr/bin như ls?',
            options: [
              'Because cd is used so often that loading it from disk every time would make the shell noticeably slower|||Vì cd được dùng quá thường xuyên, nạp nó từ đĩa mỗi lần sẽ làm shell chậm đi thấy rõ',
              'A separate program runs as a child process; it could only change its own directory and then exit, leaving the shell where it was|||Một chương trình riêng chạy như tiến trình con; nó chỉ đổi được thư mục của chính nó rồi thoát, shell vẫn đứng nguyên chỗ cũ',
              'Only root may change directories through a program in /usr/bin, and normal users would get Permission denied|||Chỉ root mới được đổi thư mục qua một chương trình trong /usr/bin, người dùng thường sẽ bị Permission denied',
              'POSIX forbids installing any command whose name has fewer than three letters as a file on disk|||POSIX cấm cài dưới dạng file trên đĩa bất kỳ lệnh nào có tên ngắn hơn ba chữ cái',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: The current directory is the shell process\'s own state. A child process gets a copy, changes the copy, and dies — the parent never sees it. Speed is the tempting answer, and it is why echo and pwd are ALSO builtins (type -a pwd shows both a builtin and /usr/bin/pwd), but for cd it is a necessity, not an optimisation.|||VI: Thư mục hiện hành là trạng thái riêng của tiến trình shell. Tiến trình con nhận một bản sao, đổi bản sao đó rồi chết — cha không bao giờ thấy. Tốc độ là đáp án hấp dẫn, và đúng là vì thế echo, pwd CŨNG là builtin (type -a pwd cho thấy cả builtin lẫn /usr/bin/pwd), nhưng với cd đó là bắt buộc, không phải để tối ưu.',
          },
          {
            question: 'A cleanup script contains rm -rf "$BUILD_DIR/"* and a bug leaves BUILD_DIR empty (BUILD_DIR=""). Replace rm with echo to check safely. What does echo rm -rf "$BUILD_DIR/"* print?|||Một script dọn dẹp có dòng rm -rf "$BUILD_DIR/"* và một lỗi làm BUILD_DIR rỗng (BUILD_DIR=""). Thay rm bằng echo để kiểm cho an toàn. echo rm -rf "$BUILD_DIR/"* in ra gì?',
            options: [
              'rm -rf — the empty variable swallows the path, so rm would get no file names and just print a usage error|||rm -rf — biến rỗng nuốt mất đường dẫn, nên rm không nhận tên file nào và chỉ in lỗi cách dùng',
              'rm -rf followed by the files of the current directory, because an empty path means "here"|||rm -rf rồi tới các file của thư mục hiện tại, vì đường dẫn rỗng nghĩa là “ở đây”',
              'rm -rf /bin /boot /dev /etc /home … — "$BUILD_DIR/"* became /* and matched every top-level directory|||rm -rf /bin /boot /dev /etc /home … — "$BUILD_DIR/"* thành /* và khớp mọi thư mục cấp cao nhất',
              'rm -rf $BUILD_DIR/* literally, because variables inside double quotes are not expanded|||Nguyên văn rm -rf $BUILD_DIR/* , vì biến nằm trong nháy kép thì không được khai triển',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The shell expands first: empty + "/" gives "/", then the unquoted * matches everything in /. Run for real in the course container it printed rm -rf /bin /bin.usr-is-merged /boot /dev /etc … — exactly the Steam 2015 bug (issue #3671). "Current directory" is tempting but wrong: the path starts with /, so it is absolute. Double quotes DO expand $VAR; only single quotes do not.|||VI: Shell khai triển trước: rỗng + "/" thành "/", rồi dấu * không bọc nháy khớp mọi thứ trong /. Chạy thật trong container của khoá nó in rm -rf /bin /bin.usr-is-merged /boot /dev /etc … — đúng lỗi của Steam năm 2015 (issue #3671). “Thư mục hiện tại” nghe hợp lý nhưng sai: đường dẫn bắt đầu bằng / nên là đường dẫn tuyệt đối. Nháy kép CÓ khai triển $VAR; chỉ nháy đơn mới không.',
          },
          {
            question: 'You want that cleanup script to refuse to run whenever BUILD_DIR is missing OR empty. Which change actually does it?|||Bạn muốn script dọn dẹp đó từ chối chạy mỗi khi BUILD_DIR thiếu HOẶC rỗng. Thay đổi nào thật sự làm được điều đó?',
            options: [
              'Add set -u at the top of the script, so any empty variable becomes an error|||Thêm set -u ở đầu script, để mọi biến rỗng đều thành lỗi',
              'Write rm -rf "$BUILD_DIR"/* instead, moving the slash outside the quotes|||Viết rm -rf "$BUILD_DIR"/* , đưa dấu gạch chéo ra ngoài dấu nháy',
              'Add set -e at the top, so the script stops as soon as rm returns an error|||Thêm set -e ở đầu script, để script dừng ngay khi rm trả về lỗi',
              'Write rm -rf "${BUILD_DIR:?BUILD_DIR is empty}/"* so the expansion itself fails|||Viết rm -rf "${BUILD_DIR:?BUILD_DIR is empty}/"* để chính bước khai triển báo lỗi',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: ${VAR:?msg} stops when VAR is unset OR empty (real output: "BUILD_DIR: BUILD_DIR is empty", or "parameter null or not set" without a message). set -u is the tempting answer but only catches variables that were never set: with BUILD_DIR="" it still printed rm -rf /bin /boot … in the course container. Moving the slash changes nothing, and set -e reacts only AFTER rm has already run.|||VI: ${VAR:?thông báo} dừng khi VAR chưa đặt HOẶC rỗng (output thật: "BUILD_DIR: BUILD_DIR is empty", hoặc "parameter null or not set" nếu không có thông báo). set -u là đáp án hấp dẫn nhưng chỉ bắt biến chưa từng đặt: với BUILD_DIR="" nó vẫn in rm -rf /bin /boot … trong container của khoá. Dời dấu gạch chéo không đổi gì, còn set -e chỉ phản ứng SAU KHI rm đã chạy xong.',
          },
          {
            question: 'A teammate on Windows pushes deploy.sh. On the Ubuntu VPS, ./deploy.sh prints "cannot execute: required file not found" and bash deploy.sh prints "$\'\\r\': command not found". The command file deploy.sh says "with CRLF line terminators". What fixes it?|||Một bạn dùng Windows đẩy lên deploy.sh. Trên VPS Ubuntu, ./deploy.sh in "cannot execute: required file not found" còn bash deploy.sh in "$\'\\r\': command not found". Lệnh file deploy.sh báo "with CRLF line terminators". Sửa bằng gì?',
            options: [
              'Convert the line endings to LF, e.g. sed -i \'s/\\r$//\' deploy.sh, and set VS Code to save the file with LF|||Đổi kiểu xuống dòng sang LF, ví dụ sed -i \'s/\\r$//\' deploy.sh, và đặt VS Code lưu file bằng LF',
              'chmod +x deploy.sh, because "required file not found" means the execute permission is missing|||chmod +x deploy.sh, vì "required file not found" nghĩa là thiếu quyền thực thi',
              'Run it with sudo ./deploy.sh, since only root can execute scripts that came from another machine|||Chạy bằng sudo ./deploy.sh, vì chỉ root mới được chạy script đến từ máy khác',
              'Install bash on the VPS with apt, because the error says the interpreter file is not found|||Cài bash lên VPS bằng apt, vì lỗi nói không tìm thấy file trình thông dịch',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Every line ends in \\r\\n, so the kernel looks for an interpreter literally named "/bin/bash\\r" (hence "required file not found") and bash sees \\r as part of each word. Installing bash is the tempting answer because the message mentions a missing file, but bash is already there — the name it is asked for has an invisible \\r. A missing execute bit would say "Permission denied" (exit 126).|||VI: Mọi dòng kết thúc bằng \\r\\n, nên kernel đi tìm trình thông dịch tên đúng là "/bin/bash\\r" (vì thế "required file not found") còn bash coi \\r là một phần của mỗi từ. Cài bash là đáp án hấp dẫn vì thông báo nói thiếu file, nhưng bash vẫn ở đó — cái tên được hỏi có một \\r vô hình. Thiếu quyền thực thi thì sẽ báo "Permission denied" (mã 126).',
          },
          {
            question: 'You type sl instead of ls and get "bash: sl: command not found". What does echo $? print right after that?|||Bạn gõ nhầm sl thay vì ls và nhận "bash: sl: command not found". Ngay sau đó echo $? in ra gì?',
            options: [
              '0',
              '127',
              '126',
              '2',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: 127 means the shell could not find the command at all (the message starts with bash:, not with a program name). 126 is "found but not executable" — e.g. ./ghi-chu.txt without x permission, Permission denied. 2 came from ls khong-co: ls ran and then failed. 0 would mean success.|||VI: 127 nghĩa là shell hoàn toàn không tìm thấy lệnh (thông báo bắt đầu bằng bash:, không phải tên chương trình). 126 là “tìm thấy nhưng không chạy được” — ví dụ ./ghi-chu.txt không có quyền x, Permission denied. 2 là từ ls khong-co: ls đã chạy rồi mới thất bại. 0 là thành công.',
          },
          {
            question: 'On WSL2, npm install inside /mnt/c/Users/an/du-an takes minutes, and chmod +x on a script there does not seem to stick. What does Microsoft\'s documentation recommend?|||Trên WSL2, npm install trong /mnt/c/Users/an/du-an mất cả mấy phút, và chmod +x một script ở đó có vẻ không ăn. Tài liệu của Microsoft khuyên gì?',
            options: [
              'Switch the distribution back to WSL 1 with wsl --set-version, since WSL 1 has no virtual machine to slow it down|||Chuyển bản phân phối về WSL 1 bằng wsl --set-version, vì WSL 1 không có máy ảo làm chậm',
              'Give the Linux distribution more memory in .wslconfig; the slowness is caused by swapping|||Cấp thêm bộ nhớ cho bản phân phối trong .wslconfig; chậm là do phải dùng swap',
              'Keep the project in the Linux filesystem, e.g. ~/du-an, and open it from VS Code with the WSL extension|||Để dự án trong hệ thống file của Linux, ví dụ ~/du-an, và mở nó từ VS Code bằng tiện ích WSL',
              'Run PowerShell as administrator before starting WSL so that it gets full access to the C: drive|||Mở PowerShell bằng quyền quản trị trước khi vào WSL để nó có toàn quyền trên ổ C:',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: "For the fastest performance speed, store your files in the WSL file system if you are working in a Linux command line" — /mnt/c is the Windows drive seen through a translation layer, and Linux permissions do not map onto it. Going back to WSL 1 is tempting (its /mnt/c access is faster) but gives up the real Linux kernel the course relies on; memory and administrator rights are unrelated.|||VI: “Để có tốc độ nhanh nhất, hãy lưu file trong hệ thống file của WSL nếu bạn làm việc bằng dòng lệnh Linux” — /mnt/c là ổ Windows nhìn qua một lớp phiên dịch, và quyền của Linux không ánh xạ lên đó. Quay về WSL 1 nghe hấp dẫn (truy cập /mnt/c nhanh hơn) nhưng bỏ mất nhân Linux thật mà khoá này dựa vào; bộ nhớ và quyền quản trị không liên quan.',
          },
          {
            question: 'On a Mac, ls --help | grep -i sort prints "ls: unrecognized option `--help\'"-style errors and help ls says "no help topics match". What is the quickest reliable way to find the sort flags of ls there?|||Trên Mac, ls --help | grep -i sort chỉ in lỗi kiểu "unrecognized option" còn help ls báo "no help topics match". Cách nhanh và chắc nhất để tìm các cờ sắp xếp của ls ở đó là gì?',
            options: [
              'Run ls --help again with sudo, because the help text is protected on macOS|||Chạy lại ls --help bằng sudo, vì phần trợ giúp bị bảo vệ trên macOS',
              'Use help ls -m, because help needs a format flag for external commands|||Dùng help ls -m, vì help cần cờ định dạng khi hỏi lệnh bên ngoài',
              'Switch the login shell to bash with chsh -s /bin/bash, and then --help will work|||Đổi shell đăng nhập sang bash bằng chsh -s /bin/bash, rồi --help sẽ chạy',
              'Open man ls, type /sort and press n for each next match; q to quit|||Mở man ls, gõ /sort rồi bấm n để tới từng chỗ khớp tiếp theo; q để thoát',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: BSD ls on macOS has no --help, and help only knows shell builtins (bash itself answered: no help topics match `ls\'). The man page is always there: /sort searches, n jumps to the next hit — on the course Mac it found "-S  Sort by size…". Changing the shell is tempting but useless: --help is a feature of GNU ls, not of bash.|||VI: ls bản BSD trên macOS không có --help, còn help chỉ biết các lệnh builtin của shell (chính bash trả lời: no help topics match `ls\'). Trang man thì lúc nào cũng có: /sort để tìm, n nhảy tới chỗ khớp kế — trên Mac của khoá nó tìm ra "-S  Sort by size…". Đổi shell nghe hợp lý nhưng vô ích: --help là tính năng của ls bản GNU, không phải của bash.',
          },
          {
            question: 'On a Mac with Docker Desktop, docker run --rm ubuntu:24.04 uname -r prints 7.0.12-linuxkit, while uname -r on the Mac itself prints 27.0.0. What explains the two numbers?|||Trên Mac có Docker Desktop, docker run --rm ubuntu:24.04 uname -r in 7.0.12-linuxkit, còn uname -r trên chính máy Mac in 27.0.0. Điều gì giải thích hai con số đó?',
            options: [
              'The container uses the kernel of Docker Desktop\'s Linux virtual machine; the image only brings Ubuntu\'s files, and the Mac itself runs Apple\'s Darwin kernel|||Container dùng kernel của máy ảo Linux trong Docker Desktop; ảnh chỉ mang theo các file của Ubuntu, còn bản thân Mac chạy nhân Darwin của Apple',
              'Ubuntu 24.04 ships kernel 7.0.12 inside every image, and each container boots that kernel for itself|||Ubuntu 24.04 đóng sẵn kernel 7.0.12 trong mọi ảnh, và mỗi container tự khởi động kernel đó',
              'macOS translates uname -r for containers to a fake Linux version so that Linux programs will start|||macOS dịch uname -r cho container thành một số phiên bản Linux giả để các chương trình Linux chịu chạy',
              'The numbers are the same kernel counted in two ways: 27 is the macOS marketing number of Linux 7.0|||Hai con số là cùng một kernel đếm theo hai cách: 27 là số tiếp thị của macOS cho Linux 7.0',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: A distribution is not a kernel. The ubuntu image supplies Ubuntu\'s files and tools; the kernel is whoever runs the container — on a Mac, the Linux VM of Docker Desktop (linuxkit). "Each container boots its own kernel" is the tempting answer and the classic misconception; containers never boot a kernel. Darwin 27.0.0 is Apple\'s own kernel, unrelated to Linux version numbers.|||VI: Bản phân phối không phải là kernel. Ảnh ubuntu mang các file và công cụ của Ubuntu; kernel là của nơi chạy container — trên Mac là máy ảo Linux của Docker Desktop (linuxkit). “Mỗi container tự khởi động kernel riêng” là đáp án hấp dẫn và là hiểu lầm kinh điển; container không bao giờ khởi động kernel. Darwin 27.0.0 là nhân riêng của Apple, không liên quan tới số phiên bản của Linux.',
          },
          {
            question: 'You run git log (or man tar). The screen fills with text, a colon : sits in the bottom-left corner, and typing a new command does nothing. What should you do?|||Bạn chạy git log (hoặc man tar). Màn hình đầy chữ, một dấu hai chấm : nằm ở góc dưới bên trái, và gõ lệnh mới thì chẳng có gì xảy ra. Nên làm gì?',
            options: [
              'Press Ctrl+Z to suspend the frozen program, then close the terminal window to be safe|||Bấm Ctrl+Z để tạm dừng chương trình đang đơ, rồi đóng luôn cửa sổ terminal cho an toàn',
              'Type reset and press Enter, because the terminal has been corrupted by binary output|||Gõ reset rồi Enter, vì terminal đã bị output nhị phân làm hỏng',
              'Press q: you are inside the less pager, which is waiting for you — / searches, n jumps to the next match|||Bấm q: bạn đang ở trong trình phân trang less, nó đang chờ bạn — / để tìm, n tới chỗ khớp kế',
              'Press Ctrl+D, which ends the input of the command and returns to the prompt|||Bấm Ctrl+D, để kết thúc đầu vào của lệnh và quay về dấu nhắc',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Nothing is frozen: git log and man page their output through less, and the : is its prompt. q quits cleanly. Ctrl+Z is tempting but leaves a stopped job behind (and closing the window is overkill); reset fixes garbage characters, not a pager; Ctrl+D is "end of input" for programs reading from you, which less is not.|||VI: Không có gì bị đơ cả: git log và man đưa output qua less, và dấu : chính là dấu nhắc của nó. q thoát gọn gàng. Ctrl+Z nghe hấp dẫn nhưng để lại một job bị dừng (còn đóng cửa sổ thì quá tay); reset chữa ký tự rác chứ không phải trình phân trang; Ctrl+D là “hết đầu vào” cho chương trình đang đọc từ bạn, mà less thì không phải.',
          },
        ],
      },
    },
  ],
};
