/**
 * Curated YouTube track for the "Linux & Bash" course.
 * ─────────────────────────────────────────────────────────────────────────────
 * One entry per non-quiz lesson slug → the third-party lecture shown on the YT
 * pill of the learn page, until the Vietnamese/English recordings are made.
 *
 * ⚠️ CREDIT ĐỂ TRỐNG LÀ CỐ Ý — CHƯA XÁC MINH ĐƯỢC TỪ MÁY DỰNG.
 * Mọi id lấy từ kết quả tìm kiếm SỐNG (25/08/2026), kèm tiêu đề mong đợi ghi ở
 * chú thích cuối dòng. Máy dựng khoá bị chặn ra youtube.com nên KHÔNG gọi được
 * oEmbed ⇒ không đọc được tên kênh, không biết video có cho nhúng hay không.
 * verify coi credit rỗng là HỢP LỆ; --fix-credits điền đúng "Kênh — Tiêu đề".
 *
 * CHẠY HAI LỆNH NÀY THEO ĐÚNG THỨ TỰ:
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/linux-bash.mjs --fix-credits
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/linux-bash.mjs --apply
 *
 * Lệnh đầu in ra link nào đã chết (✗) — thay link đó rồi chạy lại. Lệnh sau sẽ
 * TỪ CHỐI --apply khi còn credit rỗng. Credit thật lệch hẳn tiêu đề mong đợi ở
 * chú thích cùng dòng ⇒ id trỏ nhầm video, báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'linux-bash',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Giới thiệu, shell là gì & cài đặt ── */
    'lnx-0-1-gioi-thieu-lo-trinh': { yt: 'ZtqBQ68cfJc', credit: 'freeCodeCamp.org — The 50 Most Popular Linux & Terminal Commands - Full Course for Beginners' },  // The 50 Most Popular Linux & Terminal Commands - Full Course for Beginners
    'lnx-0-2-kernel-shell-terminal': { yt: 'ToudGcFJhOA', credit: 'NetSoft College of Technology — Linux Terminal Explained Beginner Guide to Command Line Access and Settings - Episode 8' },// Linux Terminal Explained Beginner Guide to Command Line Access and Settings - Episode 8
    'lnx-0-3-cai-dat': { yt: 'iwolPf6kN-k', credit: 'Kunal Kushwaha — Introduction to Linux & Terminal Commands - Full Course for Beginners' },              // Introduction to Linux & Terminal Commands - Full Course for Beginners
    'lnx-0-4-cach-hoc': { yt: 'hREnP0HslK8', credit: 'NeuralNine — Linux Terminal Crash Course - For Absolute Beginners' },             // Linux Terminal Crash Course - For Absolute Beginners

    /* ── Chương 1 — Shell & hệ thống tệp ── */
    'lnx-1-1-dau-nhac-ba-lenh': { yt: '16d2lHc0Pe8', credit: 'Keep On Coding — Linux Command Line for Beginners' },  // Linux Command Line for Beginners
    'lnx-1-2-duong-dan': { yt: 'kQaOtys9Pp8', credit: 'Robotics Back-End — Linux Command Line Tutorial - Learn Linux Terminal in 40 minutes' },         // Linux Command Line Tutorial - Learn Linux Terminal in 40 minutes
    'lnx-1-3-cay-thu-muc': { yt: 'PEaixsvzRUk', credit: 'Gary Explains — Linux Directories Explained - including /etc /home /var /proc /usr' },       // Linux Directories Explained - including /etc /home /var /proc /usr
    'lnx-1-4-nhin-ky-mot-file': { yt: 'cfa0zy7qpuo', credit: 'Stodachon — Linux: Understanding the output of the ls -l Linux command' },  // Linux: Understanding the output of the ls -l Linux command

    /* ── Chương 2 — Tệp & thư mục ── */
    'lnx-2-1-tao-chep-chuyen-xoa': { yt: 'mABpAI-pCw0', credit: 'freeCodeCamp.org — Command Line Basics for Beginners - Full Course' },// Command Line Basics for Beginners - Full Course
    'lnx-2-2-glob-ky-tu-dai-dien': { yt: 'MIGcHAlYpxU', credit: 'DavidWesselsVIU — Bash wildcards and globbing' },// Bash wildcards and globbing
    'lnx-2-3-find': { yt: 'FvEoGHFKsKA', credit: 'Veronica Explains — Demystifying "find" and "find -exec" ...Lil\' Linux Lesson!' },               // Demystifying "find" and "find -exec" ...Lil' Linux Lesson!
    'lnx-2-4-lien-ket-va-nen': { yt: 'mvTBQmiCSXA', credit: 'Engineering Educator Academy — Inodes and Shortcuts in Linux (Symlink vs. Hard Link), ln, stat, readlink' },    // Inodes and Shortcuts in Linux (Symlink vs. Hard Link), ln, stat, readlink

    /* ── Chương 3 — Văn bản, ống dẫn & chuyển hướng ── */
    'lnx-3-1-dong-chuan-chuyen-huong': { yt: '9FuWfNdOnsY', credit: 'CodeLucky — Linux Standard Streams Explained: stdin, stdout, & stderr for Beginners' },// Linux Standard Streams Explained: stdin, stdout, & stderr for Beginners
    'lnx-3-2-ong-dan': { yt: '_1jGoFEt-n8', credit: 'Leela Web Dev — 128. Bash Piping & Output Redirection Explained Simply | stdin, stdout, stderr Made Easy' },                // Bash Piping & Output Redirection Explained Simply | stdin, stdout, stderr Made Easy
    'lnx-3-3-grep-regex': { yt: 'VNVjPuLdb64', credit: 'CodeLucky — Linux Regular Expressions (Regex) Tutorial: grep, sed, & awk for Beginners' },             // Linux Regular Expressions (Regex) Tutorial: grep, sed, & awk for Beginners
    'lnx-3-4-bo-cong-cu-nho': { yt: 'yCTnihfbPCo', credit: 'Zach Gollwitzer — Intermediate Bash Commands (grep, sed, awk, tar, less, gzip)' },         // Intermediate Bash Commands (grep, sed, awk, tar, less, gzip)
    'lnx-3-5-sed': { yt: 'sGO9wAsAW4c', credit: 'Robert Cowher - AI & Robotics Tinkerer — Text Manipulation in Linux - Parsing logs with sed, awk, and grep' },                    // Text Manipulation in Linux - Parsing logs with sed, awk, and grep

    /* ── Chương 4 — Quyền, người dùng & sudo ── */
    'lnx-4-1-mo-hinh-quyen': { yt: 'Z3_4RmYTO7s', credit: 'NextGenstar26 — Linux File Permissions Explained | chmod, chown, umask, SUID, SGID, Sticky Bit' },              // Linux File Permissions Explained | chmod, chown, umask, SUID, SGID, Sticky Bit
    'lnx-4-2-chmod-chown-umask': { yt: 'o_2aXxEqtao', credit: 'WhiteboardDoodles — Linux File Permissions: chmod, umask & ACLs Explained | Linux Basics' },          // Linux File Permissions: chmod, umask & ACLs Explained | Linux Basics
    'lnx-4-3-bit-dac-biet': { yt: 'mYfXqUWXmEA', credit: 'NixEducation — Special Linux File permissions and their Use (setuid, setgid, sticky bit)' },               // Special Linux File permissions and their Use (setuid, setgid, sticky bit)
    'lnx-4-4-nguoi-dung-nhom-sudo': { yt: 'PjkqVZgdO9s', credit: 'DevOps Made Easy — Linux Essentials: User Management Mastery | useradd | usermod | userdel | groupadd | visudo | passwd' },       // Linux Essentials: User Management Mastery | useradd | usermod | userdel | groupadd | visudo | passwd
    'lnx-4-5-chan-doan-permission-denied': { yt: '4U7PxdAwvM8', credit: 'OneByteAtATime — Linux Permissions - POSIX, chmod, chown, chgrp' },// Linux Permissions - POSIX, chmod, chown, chgrp

    /* ── Chương 5 — Tiến trình, job & tín hiệu ── */
    'lnx-5-1-tien-trinh-la-gi': { yt: 'aIkWNXnXJfM', credit: 'Caleb Curry — Processes (ps and top Commands) Linux Tutorial 26' },  // Processes (ps and top Commands) Linux Tutorial 26
    'lnx-5-2-top-tai-bo-nho': { yt: '0LWgrHYsVhs', credit: 'BeginLinux Guru — Demystifying Linux CPU Load Averages' },    // Demystifying Linux CPU Load Averages
    'lnx-5-3-tin-hieu': { yt: 'JWQfR_3ddYA', credit: 'Pedagogy — Process Signals in Linux | SIGINT , SIGKILL , SIGTERM , SIGCONT , SIGTSTP... | kill command in linux' },          // Process Signals in Linux | SIGINT, SIGKILL, SIGTERM, SIGCONT, SIGTSTP | kill command in linux
    'lnx-5-4-job-chay-nen': { yt: 'PQp_YPGg7GQ', credit: 'Jadi — Managing Processes in Linux (jobs, fg, bg, &, nohup, kill, ...)' },      // Managing Processes in Linux (jobs, fg, bg, &, nohup, kill, ...)

    /* ── Chương 6 — Biến, dấu nháy & khai triển ── */
    'lnx-6-1-bien-thay-the-lenh': { yt: 'yTijxqjZhRo', credit: 'nixcasts — Bash variable expansion' },   // Bash variable expansion
    'lnx-6-2-dau-nhay': { yt: 'MYWvVgIL_Ys', credit: 'tutoriaLinux — Bash Scripting 3 -- Variables and Quoting' },             // Bash Scripting 3 -- Variables and Quoting
    'lnx-6-3-khai-trien-tham-so': { yt: 'S4D9KaW3ERw', credit: 'Protesilaos — BASH Parameter Expansion' },   // BASH Parameter Expansion
    'lnx-6-4-ma-thoat-dieu-kien': { yt: 'teh6glwKslo', credit: 'PythonPythonME — 🖥️ Mastering Conditional Statements in Bash: if-else & case Explained 🚀' },   // Mastering Conditional Statements in Bash: if-else & case Explained
    'lnx-6-5-vong-lap-ham': { yt: 'sCmqBkz1yYY', credit: 'quidsup — Bash Tutorial 4: Loops - For While Until' },         // Bash Tutorial 4: Loops - For While Until

    /* ── Chương 7 — Viết script cho production ── */
    'lnx-7-1-khung-script': { yt: 'i70QxFJRLeg', credit: 'Learn In Public — Bash Scripting Tutorial for Beginners | set -x, set -e, pipefail Explained | Linux Pipe (|)' },      // Bash Scripting Tutorial for Beginners | set -x, set -e, pipefail Explained
    'lnx-7-2-tham-so-kiem-tra': { yt: 'wTvqFQydZQs', credit: 'You Suck at Programming — Crash-Course in using \`getopts\` to parse Command Line Arguments in Bash!' },  // Crash-Course in using getopts to parse Command Line Arguments in Bash!
    'lnx-7-3-trap-don-dep': { yt: 'Tjbfe9dsGFU', credit: 'Putorius Linux Tutorials — Using Trap to Exit Bash Shell Scripts Cleanly - Linux Tutorial' },      // Using Trap to Exit Bash Shell Scripts Cleanly - Linux Tutorial
    'lnx-7-4-go-loi-script': { yt: '9pbpevjuwmI', credit: 'Skybert Hacks — Programming BASH #3 - Debugging' },     // Programming BASH #3 - Debugging
    'lnx-7-5-script-hoan-chinh': { yt: 'xT2d0htjb6I', credit: 'You Suck at Programming — Exit Codes in Bash explained! Some gotchas and pitfalls with them. You Suck at Programming #062' }, // Exit Codes in Bash explained! Some gotchas and pitfalls with them

    /* ── Chương 8 — Môi trường, PATH & file khởi động ── */
    'lnx-8-1-path': { yt: 'rJMFxIbDe-g', credit: 'tutoriaLinux — Everything You Need to Know About $PATH in Bash' },                   // Everything You Need to Know About $PATH in Bash
    'lnx-8-2-file-khoi-dong': { yt: 'FeMwbigYa9M', credit: 'Brodie Robertson — What Do All These Bash Files Do (bashrc, bash_profile, bash_logout)' },         // What Do All These Bash Files Do (bashrc, bash_profile, bash_logout)
    'lnx-8-3-bien-moi-truong-bi-mat': { yt: 'AgPd5kM7Sn4', credit: 'CodeLucky — Linux Environment Variables: env & export Commands Explained!' }, // Linux Environment Variables: env & export Commands Explained!
    'lnx-8-4-tuy-bien-shell': { yt: '74SmxwCYykg', credit: 'Learn Linux TV — How to Customize Your Bash Prompt (PS1) - Complete Linux Tutorial' },         // How to Customize Your Bash Prompt (PS1) - Complete Linux Tutorial

    /* ── Chương 9 — Mạng & máy từ xa ── */
    'lnx-9-1-giao-dien-cong-dns': { yt: 'rCdQnnaWZlA', credit: 'Verbose DevOps — Linux Network Troubleshooting Commands (ip, ifconfig, netstat, ufw, traceroute, dig)' },// Linux Network Troubleshooting Commands (ip, ifconfig, netstat, ufw, traceroute, dig)
    'lnx-9-2-curl': { yt: 'Q3_3saEQiSA', credit: 'Navek — curl: A Practical Guide' },              // curl: A Practical Guide
    'lnx-9-3-ssh': { yt: '5KKP8qPHrP0', credit: 'Automation Avenue — SSH Tunneling explained ( with local port forwarding examples ! )' },               // SSH Tunneling explained (with local port forwarding examples!)
    'lnx-9-4-scp-rsync': { yt: 'Pygr_TpZRpM', credit: 'Tony Teaches Tech — How to Use rsync to Reliably Copy Files Fast (many examples)' },         // How to Use rsync to Reliably Copy Files Fast (many examples)
    'lnx-9-5-tuong-lua': { yt: 'GQcrRhcZMF8', credit: '3CodeCamp — Lock down your Linux VPS using UFW and Fail2Ban' },         // Lock down your Linux VPS using UFW and Fail2Ban

    /* ── Chương 10 — Đĩa, gói phần mềm & log ── */
    'lnx-10-1-dia-day': { yt: 'Tky5uCQUZPQ', credit: 'Red Hat Enterprise Linux — Troubleshooting Linux Disk Space Issues at 2 AM?' },      // Troubleshooting Linux Disk Space Issues at 2 AM?
    'lnx-10-2-goi-phan-mem': { yt: 'oNfy6QYmq7g', credit: 'Tech Taught by Her — Linux Package Management Tutorial | apt vs yum vs dnf Explained' },  // Linux Package Management Tutorial | apt vs yum vs dnf Explained
    'lnx-10-3-log-journalctl': { yt: 'J1XhNXWhCKU', credit: 'Devops_world — Linux Log Analysis Explained | /var/log, tail, grep & journalctl' },// Linux Log Analysis Explained | /var/log, tail, grep & journalctl

    /* ── Chương 11 — systemd, cron & quản trị ── */
    'lnx-11-1-systemd-unit': { yt: 'C4a7jxlMTfo', credit: 'tutoriaLinux — How to Create a systemd Linux Service' },   // How to Create a systemd Linux Service
    'lnx-11-2-cron-timer': { yt: 'DixhIrgMy3M', credit: 'tutoriaLinux — Introduction to systemd timers' },     // Introduction to systemd timers
    'lnx-11-3-gia-co-may-chu': { yt: '1PljaLoTZ28', credit: 'TechSky - Ethical Hacking — How to Harden Linux Server using Auditd, UFW & Fail2Ban?' }, // How to Harden Linux Server using Auditd, UFW & Fail2Ban?

    /* ── Chương 12 — Chẩn đoán một máy chủ thật ── */
    'lnx-12-1-phuong-phap': { yt: 'ZNkFDHLQnrA', credit: 'EuroBSDCon — Keynote 3: System Performance Analysis Methodologies - Brendan Gregg' },  // Keynote 3: System Performance Analysis Methodologies - Brendan Gregg
    'lnx-12-2-no-chet': { yt: 'fhBHvsi0Ql0', credit: 'USENIX — LISA19 - Linux Systems Performance' },      // LISA19 - Linux Systems Performance
    'lnx-12-3-no-cham': { yt: 'FJW8nGV4jxY', credit: 'Brendan Gregg — Linux Performance Tools, Brendan Gregg, part 1 of 2' },      // Linux Performance Tools, Brendan Gregg, part 1 of 2
    'lnx-12-4-no-la': { yt: 'zrr2nUln9Kk', credit: 'Brendan Gregg — Linux Performance Tools, Brendan Gregg, part 2 of 2' },        // Linux Performance Tools, Brendan Gregg, part 2 of 2
  },
};
