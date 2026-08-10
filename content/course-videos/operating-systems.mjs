/**
 * Curated YouTube track for OSG202 — Operating Systems.
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/operating-systems.mjs
 */
export default {
  courseSlug: 'operating-systems',
  defaultVideoTrack: 'YT',
  lessons: {
    // 0.x intro — only the "About" lesson gets a general OS intro; grading/CLOs/materials skipped (pure admin)
    "osg202-gioi-thieu": { yt: "vBURTt97EkA", credit: "Neso Academy — Introduction to Operating Systems" },

    // Chapter 1 — OS overview
    "osg202-1-1-kernel-syscall": { yt: "WJ-UaAaumNA", credit: "Gate Smashers — L-1.1: Introduction to Operating System and its Functions with English Subtitles" },
    "osg202-1-2-lich-su-zoo": { yt: "PY6zEUELn8s", credit: "Jenny's Lectures CS IT — Types of Operating Systems(Batch, Multiprogramming, Time Sharing, Multiprocessing, Real Time)" },
    "osg202-1-3-phan-cung": { yt: "VjPgYcQqqN0", credit: "Neso Academy — Basics of OS (Computer System Operation)" },
    "osg202-1-4-syscall-kien-truc": { yt: "lhToWeuWWfw", credit: "Neso Academy — System Calls" },

    // Chapter 2 — processes, threads, scheduling, synchronization
    "osg202-2-1-tien-trinh-lap-lich": { yt: "OrM7nZcxXZU", credit: "Neso Academy — Process Management (Processes and Threads)" },
    "osg202-2-2-luong-dong-bo": { yt: "LOfGJcVnvAk", credit: "Neso Academy — Introduction to Threads" },
    "osg202-2-3-fork-exec": { yt: "IFEFVXvjiHY", credit: "Neso Academy — fork() and exec() System Calls" },
    "osg202-2-4-lap-lich-tinh-toan": { yt: "7DoP1L9nAAs", credit: "Neso Academy — Scheduling Algorithms - First Come First Served (FCFS)" },
    "osg202-2-5-ipc-dong-bo": { yt: "ph2awKa8r5Y", credit: "Neso Academy — Process Synchronization" },
    "osg202-2-6-bai-toan-ipc": { yt: "FYUi-u7UWgw", credit: "Neso Academy — The Dining Philosophers Problem" },

    // Chapter 3 — memory & virtual memory
    "osg202-3-1-phan-trang": { yt: "6c-mOFZwP_8", credit: "Gate Smashers — L-5.9: What is Paging | Memory management |  Operating System" },
    "osg202-3-2-thay-trang": { yt: "FWoMSiMep80", credit: "Jenny's Lectures CS IT — Lec28 Page replacement Introduction| FIFO page replacement algorithm with example| Operating System" },
    "osg202-3-3-tlb-dia-chi": { yt: "UWZIRmfUIVw", credit: "Udacity — Translation Look Aside Buffer (TLB) - Georgia Tech - HPCA: Part 4" },
    "osg202-3-4-thrashing": { yt: "IyWaK8pbN6A", credit: "Gate Smashers — L-5.16: What is Thrashing | Operating System" },

    // Chapter 4 — file systems
    "osg202-4-1-he-thong-tep": { yt: "pQ2coSLQvX4", credit: "Neso Academy — File Systems | Chapter-10 | Operating System | nesoacademy.org" },
    "osg202-4-2-inode": { yt: "gK6L3v1b8AM", credit: "Sudhakar Atchala — Allocation Methods | File Allocation Methods | Contiguous | linked | indexed | chain | os | files" },

    // Chapter 5 — I/O & disk
    "osg202-5-1-io": { yt: "F18RiREDkwE", credit: "Neso Academy — Basics of OS (I/O Structure)" },
    "osg202-5-2-lap-lich-dia": { yt: "9uoa_p8q47Y", credit: "Gate Smashers — L-6.3: Disk Scheduling Algorithm | Operating System" },

    // Chapter 6 — deadlocks
    "osg202-6-1-deadlock": { yt: "x9FF723STvo", credit: "Jenny's Lectures CS IT — Lec19 Deadlock | Necessary conditions for Deadlock | Operating Systems" },
    "osg202-6-2-banker": { yt: "bYFVbzLLxfY", credit: "Jenny's Lectures CS IT — Lec23 Deadlock Avoidance: Banker's Algorithm with example | Operating System" },

    // Chapter 7 — Linux & shell
    "osg202-7-1-lenh-linux": { yt: "ZtqBQ68cfJc", credit: "freeCodeCamp.org — The 50 Most Popular Linux & Terminal Commands - Full Course for Beginners" },
    "osg202-7-2-shell-script": { yt: "tK9Oc6AEnR4", credit: "freeCodeCamp.org — Bash Scripting Tutorial for Beginners" },

    // N1 — from OS to the cloud
    "osg202-n1-1-cloud-container": { yt: "Jz8Gs4UHTO8", credit: "ByteByteGo — Big Misconceptions about Bare Metal, Virtual Machines, and Containers" },
  },
};
