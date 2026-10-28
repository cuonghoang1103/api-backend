/**
 * Danh mục mô phỏng của OS Visual Lab. Bài học nhúng bằng một <div class="os-lab os-lab-sim-<tên> os-lab-p-<preset>">
 * (xem content/courses/operating-systems-for-developers/_lab.mjs — hai danh sách PHẢI khớp nhau; bộ dựng nội dung
 * ném lỗi khi gặp tên lạ). Chỉ tên trong danh mục này mới được gắn: nội dung bài KHÔNG chạy được mã tuỳ ý.
 */
import type { ComponentType } from 'react';
import type { Lang } from './ui';

export interface OsLabDef {
  en: string; vi: string; descEn: string; descVi: string; chapterEn: string; chapterVi: string;
  presets: string[];
  load: () => Promise<{ default: ComponentType<{ lang?: Lang; preset?: string }> }>;
}

export const OS_LABS: Record<string, OsLabDef> = {
  process: {
    en: 'Processes: tree & states', vi: 'Tiến trình: cây & trạng thái', chapterEn: 'Chapter 1', chapterVi: 'Chương 1',
    descEn: 'fork, exec, wait, exit; zombies, orphans, exit 137, threads — with live ps output.',
    descVi: 'fork, exec, wait, exit; zombie, mồ côi, exit 137, luồng — kèm output ps tại từng bước.',
    presets: ['shell', 'zombie', 'orphan', 'fork3', 'oom137', 'threads', 'sandbox'],
    load: () => import('./ProcessSim'),
  },
  scheduler: {
    en: 'CPU scheduling', vi: 'Lập lịch CPU', chapterEn: 'Chapter 3', chapterVi: 'Chương 3',
    descEn: 'FCFS, SJF, SRTF, RR, priority, MLFQ, CFS on 1–4 cores, Gantt chart and waiting/turnaround/response.',
    descVi: 'FCFS, SJF, SRTF, RR, ưu tiên, MLFQ, CFS trên 1–4 lõi, sơ đồ Gantt và thời gian chờ/hoàn thành/đáp ứng.',
    presets: ['textbook', 'convoy', 'rr', 'interactive', 'multicore', 'nice'],
    load: () => import('./SchedulerSim'),
  },
  race: {
    en: 'Race conditions & deadlock', vi: 'Race condition & deadlock', chapterEn: 'Chapters 5–6', chapterVi: 'Chương 5–6',
    descEn: 'counter++ as load/add/store, interleaved instruction by instruction; mutex, atomics; deadlock with two locks.',
    descVi: 'counter++ là nạp/cộng/ghi, xen kẽ từng lệnh máy; mutex, nguyên tử; deadlock với hai khoá.',
    presets: ['none', 'mutex', 'atomic', 'deadlock', 'ordered'],
    load: () => import('./RaceSim'),
  },
  memory: {
    en: 'Process memory layout', vi: 'Bố cục bộ nhớ tiến trình', chapterEn: 'Chapters 7 & 13', chapterVi: 'Chương 7 & 13',
    descEn: 'text/data/bss/heap/mmap/stack with ASLR; stack frames, canaries and what a buffer overflow overwrites.',
    descVi: 'text/data/bss/heap/mmap/stack với ASLR; khung stack, canary và tràn bộ đệm ghi đè lên cái gì.',
    presets: ['layout', 'stack', 'overflow'],
    load: () => import('./MemoryLayoutSim'),
  },
  vm: {
    en: 'Virtual memory & thrashing', vi: 'Bộ nhớ ảo & thrashing', chapterEn: 'Chapters 7–8', chapterVi: 'Chương 7–8',
    descEn: 'Address → TLB → page table → frame, page faults, FIFO/LRU/OPT/Clock, and a RAM-pressure slider.',
    descVi: 'Địa chỉ → TLB → bảng trang → khung, lỗi trang, FIFO/LRU/OPT/Clock, và thanh trượt thiếu RAM.',
    presets: ['program', 'walk', 'pressure', 'exam', 'belady', 'loop'],
    load: () => import('./VirtualMemorySim'),
  },
  latency: {
    en: 'Latency ladder', vi: 'Thang độ trễ', chapterEn: 'Section 0', chapterVi: 'Mục 0',
    descEn: 'Registers → caches → RAM → SSD → disk → network, on a human time scale.',
    descVi: 'Thanh ghi → cache → RAM → SSD → đĩa → mạng, theo thang thời gian con người.',
    presets: ['default'],
    load: () => import('./LatencyLadder'),
  },
};

export const isLab = (name: string) => Object.prototype.hasOwnProperty.call(OS_LABS, name);
