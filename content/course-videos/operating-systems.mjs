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
    'osg202-bat-dau-tai-day': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/00-gioi-thieu-huong-dan-hoc/00-01-bat-dau-tai-day-77ac60a2.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-hoc-the-nao': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/00-gioi-thieu-huong-dan-hoc/00-02-hoc-the-nao-ae743a2c.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-cai-moi-truong': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/00-gioi-thieu-huong-dan-hoc/00-03-cai-moi-truong-320af3b1.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-buoi-dau-tien': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/00-gioi-thieu-huong-dan-hoc/00-04-buoi-dau-tien-b13822a0.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-slide-osg1-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/01-gioi-thieu-he-dieu-hanh/01-01-slide-gioi-thieu-tron-e31d1390.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-slide-osg1-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/01-gioi-thieu-he-dieu-hanh/01-02-slide-loi-goi-he-thong-tron-f70b735d.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-slide-osg2-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/02-tien-trinh-va-luong/02-01-slide-tien-trinh-va-luong-tron-8a715c7d.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-slide-osg2-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/02-tien-trinh-va-luong/02-02-slide-giao-tiep-lien-tien-trinh-tron-033624e5.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-slide-osg2-3': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/02-tien-trinh-va-luong/02-03-slide-lap-lich-tron-8d071444.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-on-ch2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/02-tien-trinh-va-luong/02-10-thuc-hanh-chuong-2-tron-6e11394f.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-slide-osg3-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/03-quan-ly-bo-nho/03-01-slide-quan-ly-bo-nho-tron-d7ddfc42.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-slide-osg3-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/03-quan-ly-bo-nho/03-02-slide-thiet-ke-phan-trang-tron-3af91bab.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-on-ch3': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/03-quan-ly-bo-nho/03-07-thuc-hanh-chuong-3-tron-d7c08f4f.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-slide-osg4-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/04-he-thong-tep/04-01-slide-he-thong-tep-tron-11112ace.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-slide-osg4-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/04-he-thong-tep/04-02-slide-quan-ly-he-thong-tep-tron-65817cfb.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-on-ch4': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/04-he-thong-tep/04-05-thuc-hanh-chuong-4-tron-bb4f8fa5.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-slide-osg5-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/05-vao-ra/05-01-slide-vao-ra-tron-eaf3fcdd.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-slide-osg5-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/05-vao-ra/05-02-slide-dia-dong-ho-man-hinh-tron-c8adf400.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-on-ch5': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/05-vao-ra/05-05-thuc-hanh-chuong-5-tron-33547759.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-slide-osg6-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/06-be-tac/06-01-slide-be-tac-tron-bd682a4f.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-on-ch6': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/06-be-tac/06-04-thuc-hanh-chuong-6-tron-47d1465a.mp4' }, defaultVideoTrack: 'VI' },
    'osg202-slide-cs1-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/operating-systems/14-chuyen-sau-hdh-trong-backend/14-01-slide-cs1-tien-trinh-linux-a-c8f33310.mp4' }, defaultVideoTrack: 'VI' },
  },
};
