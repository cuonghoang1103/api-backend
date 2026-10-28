/**
 * Danh mục mô phỏng của CPU Lab — "Máy tính từ số 0" (CSI104, CEA201). Bài học nhúng bằng
 *   <div class="cpu-lab cpu-lab-sim-<tên> cpu-lab-p-<preset>">
 * (dựng bằng content/_labs.mjs — hai danh sách PHẢI khớp nhau; labs/registry.test.ts kiểm điều đó). Chỉ tên trong
 * danh mục này mới được gắn: nội dung bài KHÔNG chạy được mã tuỳ ý.
 */
import type { LabDef } from '../labs/registry';

export const CPU_LABS: Record<string, LabDef> = {
  bits: {
    en: 'Bits & number systems', vi: 'Bit & hệ đếm', chapterEn: 'CSI104 Ch2–3 · CEA201 Ch10', chapterVi: 'CSI104 Ch2–3 · CEA201 Ch10',
    descEn: 'Why only 0 and 1 (voltage → bit), click bits on/off, decimal/binary/hex/octal live, conversion step by step, two\'s complement & overflow, shifts and masks.',
    descVi: 'Vì sao chỉ có 0 và 1 (điện áp → bit), bấm bật/tắt từng bit, thập phân/nhị phân/hex/bát phân trực tiếp, đổi cơ số từng bước, bù hai & tràn số, dịch bit và mặt nạ.',
    presets: ['play', 'intro', 'convert', 'signed', 'ops'],
    load: () => import('./BitsSim'),
  },
  data: {
    en: 'Data representation', vi: 'Biểu diễn dữ liệu', chapterEn: 'CSI104 Ch3 · CEA201 Ch10', chapterVi: 'CSI104 Ch3 · CEA201 Ch10',
    descEn: 'Text as bytes (ASCII, Unicode, UTF-8 — why "ệ" is 3 bytes, how mojibake happens), IEEE-754 floats (why 0.1 + 0.2 ≠ 0.3), colours & pixels, endianness.',
    descVi: 'Chữ thành byte (ASCII, Unicode, UTF-8 — vì sao "ệ" tốn 3 byte, lỗi font "Viá»‡t" sinh ra thế nào), số thực IEEE-754 (vì sao 0.1 + 0.2 ≠ 0.3), màu & điểm ảnh, endianness.',
    presets: ['text', 'mojibake', 'float', 'color', 'endian'],
    load: () => import('./DataSim'),
  },
  logic: {
    en: 'Logic gates → circuits', vi: 'Cổng logic → mạch', chapterEn: 'CEA201 Ch9 · CSI104 N1', chapterVi: 'CEA201 Ch9 · CSI104 N1',
    descEn: 'Gates and truth tables, half adder → full adder → 8-bit ripple-carry adder with carries propagating, mux/decoder, a clocked register, everything from NAND.',
    descVi: 'Cổng và bảng chân trị, half adder → full adder → bộ cộng 8 bit nối tiếp nhớ với bit nhớ chạy qua từng tầng, mux/bộ giải mã, thanh ghi theo nhịp đồng hồ, mọi thứ từ NAND.',
    presets: ['gates', 'adder', 'ripple', 'mux', 'register', 'nand'],
    load: () => import('./LogicSim'),
  },
  cpu: {
    en: 'Toy CPU (MARIE)', vi: 'CPU đồ chơi (MARIE)', chapterEn: 'CSI104 Ch1 · CEA201 Ch3, 10–12, ASM', chapterVi: 'CSI104 Ch1 · CEA201 Ch3, 10–12, ASM',
    descEn: 'A von Neumann machine you program: assembler with machine-code bits, fetch → decode → execute on the bus step by step, registers, memory in hex & binary, self-modifying code.',
    descVi: 'Một cỗ máy von Neumann bạn tự lập trình: trình hợp dịch hiện bit mã máy, nạp → giải mã → thực thi trên bus từng bước, thanh ghi, bộ nhớ dạng hex & nhị phân, mã tự sửa chính nó.',
    presets: ['add', 'sum', 'mul', 'max', 'io', 'selfmod', 'blank'],
    load: () => import('./CpuSim'),
  },
  pipeline: {
    en: 'From C source to a running program', vi: 'Từ mã C tới chương trình đang chạy', chapterEn: 'CSI104 Ch7 · CEA201 Ch10, ASM', chapterVi: 'CSI104 Ch7 · CEA201 Ch10, ASM',
    descEn: 'Real gcc output: C → x86-64 / ARM64 assembly → machine-code bytes → ELF sections → loaded into memory → the CPU runs it; mapped back to the toy CPU.',
    descVi: 'Output thật của gcc: C → hợp ngữ x86-64 / ARM64 → byte mã máy → các section ELF → nạp vào bộ nhớ → CPU chạy; đối chiếu lại với CPU đồ chơi.',
    presets: ['add', 'sum', 'max'],
    load: () => import('./PipelineSim'),
  },
  cache: {
    en: 'Cache & memory hierarchy', vi: 'Cache & phân cấp bộ nhớ', chapterEn: 'CEA201 Ch4 · CSI104 Ch1', chapterVi: 'CEA201 Ch4 · CSI104 Ch1',
    descEn: 'Address split into tag | index | offset, direct-mapped vs set-associative vs fully associative, hit/miss per access, LRU/FIFO, and why loop order matters.',
    descVi: 'Địa chỉ tách thành tag | index | offset, ánh xạ trực tiếp vs kết hợp tập hợp vs kết hợp toàn phần, trúng/trượt từng lần truy cập, LRU/FIFO, và vì sao thứ tự vòng lặp quan trọng.',
    presets: ['textbook', 'sequential', 'loop', 'conflict', 'matrix'],
    load: () => import('./CacheSim'),
  },
};
