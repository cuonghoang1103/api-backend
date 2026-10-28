/**
 * Dữ liệu chữ (VI/EN) của cảnh 3D — dùng chung cho trang /cpu-lab/3d, mini-map <WhereInComputer/> và video Remotion.
 *
 *  • FOCUS        — các "điểm đến" trong máy tính (id ổn định, ghi trong README.md). Mỗi id: tên + một dòng "ở đây xảy ra gì".
 *  • CONCEPTS     — khái niệm của bài học (thanh ghi, page table, gói tin…) ⇒ nằm ở focus nào (+ chỗ phụ cũng sáng).
 *  • LAYERS       — 8 tầng của hành trình (ngoài → trong).
 *  • LABELS       — nhãn chỉ vào vật thể 3D (id nhãn = id điểm neo trong macro.ts / micro.ts).
 */
export type Lang = 'vi' | 'en';
export type T2 = { vi: string; en: string };

export const FOCUS_IDS = [
  'pc', 'board', 'cpu', 'cpu.die', 'cpu.core',
  'cpu.fetch', 'cpu.decode', 'cpu.registers', 'cpu.alu', 'cpu.mmu', 'cpu.l1', 'cpu.l2', 'cpu.l3', 'cpu.imc',
  'bus.memory', 'ram', 'ram.cells',
  'bus.pcie', 'ssd', 'ssd.controller', 'ssd.nand',
  'gpu', 'chipset', 'nic',
] as const;
export type FocusId = (typeof FOCUS_IDS)[number];

export const FOCUS: Record<FocusId, { name: T2; what: T2 }> = {
  pc: { name: { vi: 'Máy tính', en: 'The computer' }, what: { vi: 'Cả hệ thống — mọi lớp bên trong cùng chạy chương trình của bạn.', en: 'The whole system — every layer inside works together to run your program.' } },
  board: { name: { vi: 'Bo mạch chủ', en: 'Motherboard' }, what: { vi: 'Tấm mạch nối mọi linh kiện; dữ liệu chạy giữa chúng trên các đường bus bằng đồng.', en: 'The board that connects every part; data travels between them on copper bus traces.' } },
  cpu: { name: { vi: 'CPU (gói chip)', en: 'CPU package' }, what: { vi: 'Bộ xử lý trung tâm — nơi mọi lệnh của chương trình được thực thi.', en: 'The central processor — where every instruction of a program is executed.' } },
  'cpu.die': { name: { vi: 'Die silicon', en: 'Silicon die' }, what: { vi: 'Mảnh silicon chứa các lõi, cache và bộ điều khiển — hàng tỉ transistor.', en: 'The silicon chip holding the cores, caches and controllers — billions of transistors.' } },
  'cpu.core': { name: { vi: 'Lõi CPU', en: 'CPU core' }, what: { vi: 'Một bộ xử lý hoàn chỉnh: chạy một luồng lệnh, lặp nạp → giải mã → thực thi.', en: 'A complete processor: runs one stream of instructions, looping fetch → decode → execute.' } },
  'cpu.fetch': { name: { vi: 'Khối nạp lệnh (fetch)', en: 'Fetch unit' }, what: { vi: 'Lấy lệnh kế tiếp từ cache L1-I theo địa chỉ trong thanh ghi PC.', en: 'Fetches the next instruction from the L1-I cache at the address in the PC register.' } },
  'cpu.decode': { name: { vi: 'Giải mã & điều khiển', en: 'Decode & control unit' }, what: { vi: 'Đọc mã lệnh rồi phát tín hiệu điều khiển cho ALU, thanh ghi, bộ nhớ.', en: 'Reads the opcode and sends control signals to the ALU, registers and memory.' } },
  'cpu.registers': { name: { vi: 'Thanh ghi', en: 'Registers' }, what: { vi: 'Các ô nhớ siêu nhanh ngay trong lõi (PC, IR, AC…); ALU đọc/ghi ở đây mỗi nhịp.', en: 'Tiny ultra-fast storage inside the core (PC, IR, AC…); the ALU reads and writes them every cycle.' } },
  'cpu.alu': { name: { vi: 'ALU', en: 'ALU' }, what: { vi: 'Mạch tính toán: cộng, trừ, so sánh, AND/OR — dựng từ cổng logic.', en: 'The arithmetic-logic unit: add, subtract, compare, AND/OR — built from logic gates.' } },
  'cpu.mmu': { name: { vi: 'MMU & TLB', en: 'MMU & TLB' }, what: { vi: 'Dịch địa chỉ ảo → địa chỉ thật; TLB nhớ sẵn các mục bảng trang vừa dùng.', en: 'Translates virtual → physical addresses; the TLB caches recently used page-table entries.' } },
  'cpu.l1': { name: { vi: 'Cache L1', en: 'L1 cache' }, what: { vi: 'Bản sao gần nhất của lệnh (L1-I) và dữ liệu (L1-D): ~1 ns, vài chục KB mỗi lõi.', en: 'The closest copy of instructions (L1-I) and data (L1-D): ~1 ns, tens of KB per core.' } },
  'cpu.l2': { name: { vi: 'Cache L2', en: 'L2 cache' }, what: { vi: 'Cache riêng của từng lõi: lớn hơn L1, chậm hơn một chút.', en: 'Each core’s private cache: bigger than L1, a little slower.' } },
  'cpu.l3': { name: { vi: 'Cache L3', en: 'L3 cache' }, what: { vi: 'Cache dùng chung cho mọi lõi; dữ liệu đi theo từng cache line 64 byte.', en: 'Shared by all cores; data moves in 64-byte cache lines.' } },
  'cpu.imc': { name: { vi: 'Bộ điều khiển bộ nhớ', en: 'Memory controller' }, what: { vi: 'Cổng của CPU ra RAM: gửi địa chỉ, nhận và gửi dữ liệu qua bus bộ nhớ.', en: 'The CPU’s gateway to RAM: sends addresses, moves data over the memory bus.' } },
  'bus.memory': { name: { vi: 'Bus bộ nhớ', en: 'Memory bus' }, what: { vi: 'Đường đồng nối CPU với RAM: 64 bit dữ liệu mỗi kênh, hàng tỉ lần mỗi giây.', en: 'Copper traces between CPU and RAM: 64 data bits per channel, billions of times a second.' } },
  ram: { name: { vi: 'RAM', en: 'RAM' }, what: { vi: 'Bộ nhớ chính: chương trình đang chạy, dữ liệu, bảng trang, hàng đợi của HĐH. Tắt máy là mất.', en: 'Main memory: running programs, data, page tables, OS queues. Lost when power goes off.' } },
  'ram.cells': { name: { vi: 'Ô nhớ DRAM', en: 'DRAM cells' }, what: { vi: 'Mỗi bit là một tụ điện tí hon + một transistor, được làm tươi liên tục.', en: 'Each bit is a tiny capacitor plus one transistor, refreshed constantly.' } },
  'bus.pcie': { name: { vi: 'Làn PCIe', en: 'PCIe lanes' }, what: { vi: 'Đường tốc độ cao từ CPU tới card đồ hoạ và ổ SSD.', en: 'High-speed lanes from the CPU to the graphics card and the SSD.' } },
  ssd: { name: { vi: 'Ổ SSD (M.2)', en: 'SSD (M.2)' }, what: { vi: 'Lưu lâu dài: tệp, chương trình đã cài. Không mất khi tắt máy.', en: 'Long-term storage: files and installed programs. Survives power-off.' } },
  'ssd.controller': { name: { vi: 'Bộ điều khiển SSD', en: 'SSD controller' }, what: { vi: 'Chip quản lý NAND, nói chuyện với CPU qua PCIe (NVMe).', en: 'Manages the NAND chips and talks to the CPU over PCIe (NVMe).' } },
  'ssd.nand': { name: { vi: 'Chip NAND flash', en: 'NAND flash' }, what: { vi: 'Nơi các byte của tệp thật sự nằm — giữ điện tích mà không cần nguồn.', en: 'Where a file’s bytes actually live — charge that stays without power.' } },
  gpu: { name: { vi: 'Card đồ hoạ (GPU)', en: 'Graphics card (GPU)' }, what: { vi: 'Hàng nghìn lõi nhỏ tính song song: vẽ hình, chạy AI.', en: 'Thousands of small cores working in parallel: graphics, AI.' } },
  chipset: { name: { vi: 'Chipset', en: 'Chipset' }, what: { vi: 'Trạm trung chuyển cho USB, SATA, mạng… nối với CPU bằng đường DMI.', en: 'The hub for USB, SATA, networking… linked to the CPU by DMI.' } },
  nic: { name: { vi: 'Chip mạng (Ethernet)', en: 'Network chip (Ethernet)' }, what: { vi: 'Biến gói tin thành tín hiệu điện trên dây mạng, và ngược lại.', en: 'Turns packets into electrical signals on the cable, and back.' } },
};

/** Khái niệm bài học ⇒ chỗ chính (camera bay tới) + chỗ phụ (cũng sáng). */
export const CONCEPTS: Record<string, { focus: FocusId; also?: FocusId[]; note: T2 }> = {
  register: { focus: 'cpu.registers', note: { vi: 'Thanh ghi nằm NGAY TRONG lõi CPU.', en: 'Registers live INSIDE the CPU core.' } },
  alu: { focus: 'cpu.alu', note: { vi: 'ALU là một khối mạch trong mỗi lõi.', en: 'The ALU is a circuit block inside every core.' } },
  'control-unit': { focus: 'cpu.decode', note: { vi: 'Khối điều khiển nằm cạnh bộ giải mã trong lõi.', en: 'The control unit sits next to the decoder in the core.' } },
  'cache-line': { focus: 'cpu.l3', also: ['cpu.l1', 'cpu.l2'], note: { vi: 'Cache line (64 byte) được chép giữa RAM ⇄ L3 ⇄ L2 ⇄ L1.', en: 'A 64-byte cache line is copied RAM ⇄ L3 ⇄ L2 ⇄ L1.' } },
  'page-table': { focus: 'ram.cells', also: ['cpu.mmu'], note: { vi: 'Bảng trang nằm trong RAM; TLB (trong lõi) giữ bản sao các mục vừa dùng.', en: 'The page table lives in RAM; the TLB (in the core) caches recent entries.' } },
  tlb: { focus: 'cpu.mmu', also: ['ram'], note: { vi: 'TLB ở trong MMU của lõi CPU.', en: 'The TLB is inside the core’s MMU.' } },
  'ram-cell': { focus: 'ram.cells', note: { vi: 'Một bit = một tụ điện trong chip DRAM.', en: 'One bit = one capacitor in a DRAM chip.' } },
  bus: { focus: 'bus.memory', also: ['bus.pcie'], note: { vi: 'Bus là các đường đồng trên bo mạch chủ.', en: 'Buses are copper traces on the motherboard.' } },
  ssd: { focus: 'ssd.nand', also: ['ssd'], note: { vi: 'Dữ liệu lưu lâu dài nằm trong chip NAND của SSD.', en: 'Persistent data sits in the SSD’s NAND chips.' } },
  file: { focus: 'ssd.nand', also: ['ram'], note: { vi: 'Byte của tệp nằm trên NAND; bản sao page cache nằm trong RAM.', en: 'A file’s bytes sit on NAND; the page-cache copy sits in RAM.' } },
  'page-cache': { focus: 'ram', also: ['ssd.nand'], note: { vi: 'Page cache là bản sao trong RAM của tệp trên SSD.', en: 'The page cache is a RAM copy of file data from the SSD.' } },
  process: { focus: 'ram', also: ['cpu.core'], note: { vi: 'Bộ nhớ của tiến trình ở RAM; lúc chạy, lệnh của nó chảy qua một lõi.', en: 'A process’s memory is in RAM; when it runs, its instructions flow through a core.' } },
  thread: { focus: 'cpu.core', also: ['cpu.registers'], note: { vi: 'Luồng đang chạy = một lõi đang nạp lệnh của nó; trạng thái nằm trong thanh ghi.', en: 'A running thread = a core fetching its instructions; its state is in registers.' } },
  scheduler: { focus: 'cpu.core', also: ['ram'], note: { vi: 'Bộ lập lịch là mã HĐH chạy trên một lõi; hàng đợi của nó nằm trong RAM.', en: 'The scheduler is OS code running on a core; its run queue lives in RAM.' } },
  'run-queue': { focus: 'ram', also: ['cpu.core'], note: { vi: 'Hàng đợi tiến trình là cấu trúc dữ liệu trong RAM.', en: 'The run queue is a data structure in RAM.' } },
  stack: { focus: 'ram', also: ['cpu.l1', 'cpu.registers'], note: { vi: 'Stack nằm trong RAM (bản sao nóng ở L1); con trỏ stack là một thanh ghi.', en: 'The stack is in RAM (hot copy in L1); the stack pointer is a register.' } },
  heap: { focus: 'ram', note: { vi: 'Heap là vùng RAM do chương trình xin thêm.', en: 'The heap is RAM a program asks for at run time.' } },
  interrupt: { focus: 'cpu.core', also: ['chipset'], note: { vi: 'Ngắt từ thiết bị (qua chipset) làm lõi tạm dừng để chạy mã xử lý.', en: 'A device interrupt (via the chipset) makes a core pause and run a handler.' } },
  packet: { focus: 'nic', also: ['chipset', 'ram'], note: { vi: 'Gói tin đi qua chip mạng, chipset, rồi được chép vào RAM.', en: 'A packet passes the network chip and chipset, then lands in RAM.' } },
  gpu: { focus: 'gpu', note: { vi: 'GPU là card cắm khe PCIe.', en: 'The GPU is a card in a PCIe slot.' } },
};

export const LAYERS: Array<{ id: string; focus?: FocusId; title: T2; body: T2; scale: string }> = [
  { id: 'pc', focus: 'pc', scale: '≈ 50 cm', title: { vi: 'Cây máy tính', en: 'The PC' },
    body: { vi: 'Mọi thứ bạn làm — gõ phím, mở web, chạy code — cuối cùng đều thành những phép tính nhỏ xíu bên trong chiếc hộp này. Chui vào xem nhé.', en: 'Everything you do — typing, browsing, running code — ends up as tiny calculations inside this box. Let’s go in.' } },
  { id: 'board', focus: 'board', scale: '≈ 30 cm', title: { vi: 'Bo mạch chủ', en: 'Motherboard' },
    body: { vi: 'Tấm mạch nối mọi linh kiện: CPU cắm vào socket, RAM giữ dữ liệu đang dùng, SSD lưu lâu dài, khe PCIe cho card đồ hoạ, chipset lo USB/SATA. Các đường đồng li ti là bus — dữ liệu chạy trên đó dưới dạng xung điện.', en: 'The board connects everything: the CPU sits in its socket, RAM holds data in use, the SSD stores it long-term, the PCIe slot takes the graphics card, the chipset handles USB/SATA. The fine copper lines are buses — data runs on them as electrical pulses.' } },
  { id: 'cpu', focus: 'cpu', scale: '≈ 4,5 cm', title: { vi: 'Gói CPU', en: 'CPU package' },
    body: { vi: 'Con chip bạn mua thật ra là một “gói”: đế mạch với hàng nghìn tiếp điểm vàng ở mặt dưới, và nắp kim loại IHS ở trên để dẫn nhiệt ra quạt.', en: 'The chip you buy is a package: a substrate with thousands of gold contacts underneath and a metal lid (IHS) on top to spread heat to the cooler.' } },
  { id: 'die', focus: 'cpu.die', scale: '≈ 2 cm', title: { vi: 'Die silicon', en: 'Silicon die' },
    body: { vi: 'Dưới nắp là die — mảnh silicon cỡ con tem chứa hàng tỉ transistor: 8 lõi, cache L3 dùng chung ở giữa, bộ điều khiển bộ nhớ (nói chuyện với RAM) và khối I/O (PCIe).', en: 'Under the lid is the die — a stamp-sized piece of silicon with billions of transistors: 8 cores, shared L3 cache in the middle, the memory controller (talks to RAM) and the I/O block (PCIe).' } },
  { id: 'core', focus: 'cpu.core', scale: '≈ 4 mm', title: { vi: 'Một lõi CPU', en: 'One CPU core' },
    body: { vi: 'Mỗi lõi lặp mãi một vòng: nạp lệnh (fetch) từ L1 → giải mã (decode) → thực thi (execute) ở ALU, đọc/ghi thanh ghi. Lệnh Add Y: AC = 5, Y = 7 → AC = 12. Đây chính là CPU MARIE trong /cpu-lab, chỉ to và nhanh hơn.', en: 'Every core repeats one loop: fetch from L1 → decode → execute in the ALU, reading and writing registers. Add Y: AC = 5, Y = 7 → AC = 12. This is the MARIE CPU from /cpu-lab, only bigger and faster.' } },
  { id: 'alu', scale: '≈ 20 µm', title: { vi: 'ALU — mạch cộng', en: 'ALU — an adder' },
    body: { vi: 'ALU cộng bằng cổng logic. Mạch cộng 4 bit gồm 4 bộ cộng đầy đủ (full adder), mỗi bộ 2 XOR, 2 AND, 1 OR. Dây sáng = bit 1. Bit nhớ (carry) lan từ phải sang trái. Bấm các bit A, B để thử.', en: 'The ALU adds with logic gates. This 4-bit adder is four full adders, each with 2 XOR, 2 AND and 1 OR. A lit wire = bit 1. The carry ripples right to left. Click bits of A and B to try.' } },
  { id: 'gate', scale: '≈ 1 µm', title: { vi: 'Cổng logic → transistor', en: 'Gate → transistors' },
    body: { vi: 'Mỗi cổng logic lại ghép từ transistor. Cổng AND kiểu CMOS dùng 6 transistor: 3 loại P (nối nguồn VDD) và 3 loại N (nối đất GND).', en: 'Each logic gate is built from transistors. A CMOS AND gate uses 6: three P-type (to VDD) and three N-type (to ground).' } },
  { id: 'transistor', scale: '≈ 50 nm', title: { vi: 'Transistor — công tắc', en: 'Transistor — a switch' },
    body: { vi: 'Transistor là công tắc điều khiển bằng điện. Điện áp cao ở cực cổng (gate) ⇒ điện trường hút electron thành kênh dẫn giữa nguồn (source) và máng (drain) ⇒ có dòng = 1. Bỏ điện áp ⇒ kênh biến mất = 0. Chip thật dùng transistor 3D (FinFET), nguyên lý y vậy.', en: 'A transistor is a switch controlled by electricity. High voltage on the gate ⇒ the field pulls electrons into a channel between source and drain ⇒ current flows = 1. Remove it ⇒ the channel vanishes = 0. Real chips use 3D FinFETs; the principle is the same.' } },
];

/** Nhãn neo vào vật thể (hiện khi ở tầng tương ứng). */
export const LABELS: Record<string, T2> = {
  'pc.case': { vi: 'Thùng máy (case)', en: 'Case' },
  'pc.monitor': { vi: 'Màn hình', en: 'Monitor' },
  'b.socket': { vi: 'CPU (trong socket)', en: 'CPU in its socket' },
  'b.ram': { vi: 'RAM', en: 'RAM' },
  'b.ssd': { vi: 'SSD M.2', en: 'M.2 SSD' },
  'b.gpu': { vi: 'Card đồ hoạ (khe PCIe)', en: 'Graphics card (PCIe)' },
  'b.chipset': { vi: 'Chipset', en: 'Chipset' },
  'b.bus': { vi: 'Bus bộ nhớ', en: 'Memory bus' },
  'c.ihs': { vi: 'Nắp tản nhiệt (IHS)', en: 'Heat spreader (IHS)' },
  'c.substrate': { vi: 'Đế mạch (substrate)', en: 'Substrate' },
  'd.cores': { vi: '8 lõi (core)', en: '8 cores' },
  'd.l3': { vi: 'Cache L3 dùng chung', en: 'Shared L3 cache' },
  'd.imc': { vi: 'Bộ điều khiển bộ nhớ', en: 'Memory controller' },
  'd.io': { vi: 'Khối I/O (PCIe)', en: 'I/O (PCIe)' },
  'd.l2': { vi: 'L2 riêng mỗi lõi', en: 'Per-core L2' },
  'k.fetch': { vi: 'Nạp lệnh (fetch)', en: 'Fetch' },
  'k.decode': { vi: 'Giải mã (decode)', en: 'Decode' },
  'k.regs': { vi: 'Thanh ghi', en: 'Registers' },
  'k.alu': { vi: 'ALU (thực thi)', en: 'ALU (execute)' },
  'k.l1i': { vi: 'L1-I (lệnh)', en: 'L1-I' },
  'k.l1d': { vi: 'L1-D (dữ liệu)', en: 'L1-D' },
  'k.l2': { vi: 'L2', en: 'L2' },
  'k.mmu': { vi: 'MMU · TLB', en: 'MMU · TLB' },
  'a.A': { vi: 'A = 0101 (5)', en: 'A = 0101 (5)' },
  'a.B': { vi: 'B = 0111 (7)', en: 'B = 0111 (7)' },
  'a.S': { vi: 'Tổng S', en: 'Sum S' },
  'a.fa': { vi: 'Bộ cộng đầy đủ', en: 'Full adder' },
  'a.carry': { vi: 'Bit nhớ (carry)', en: 'Carry' },
  'g.p': { vi: 'Transistor P (nối VDD)', en: 'P-type (to VDD)' },
  'g.n': { vi: 'Transistor N (nối GND)', en: 'N-type (to GND)' },
  't.gate': { vi: 'Cực cổng (gate)', en: 'Gate' },
  't.source': { vi: 'Nguồn (source)', en: 'Source' },
  't.drain': { vi: 'Máng (drain)', en: 'Drain' },
  't.oxide': { vi: 'Lớp cách điện (oxide)', en: 'Gate oxide' },
  't.channel': { vi: 'Kênh dẫn', en: 'Channel' },
  't.sub': { vi: 'Đế silicon loại p', en: 'p-type silicon' },
};

/** Hướng đặt chữ của nhãn so với điểm neo (px trên khung 1920 × 1080) — web nhân 0,6, video dùng nguyên. */
export const LABEL_DIR: Record<string, [number, number]> = {
  'pc.case': [-60, -60], 'pc.monitor': [60, -60],
  'b.socket': [-60, -70], 'b.ram': [40, -60], 'b.ssd': [-40, 70], 'b.gpu': [80, -40], 'b.chipset': [70, -50], 'b.bus': [40, -70],
  'c.ihs': [60, -70], 'c.substrate': [-60, 70],
  'd.cores': [40, -70], 'd.l3': [40, 70], 'd.imc': [-30, 80], 'd.io': [-40, -80], 'd.l2': [40, 70],
  'k.l1i': [-40, -70], 'k.fetch': [40, -70], 'k.decode': [60, -40], 'k.alu': [60, 50], 'k.regs': [-60, 40], 'k.l1d': [-50, 60], 'k.l2': [60, -60], 'k.mmu': [60, 60],
  'a.A': [-40, -60], 'a.B': [40, -60], 'a.S': [40, 60], 'a.fa': [-40, 70], 'a.carry': [40, 70],
  'g.p': [-50, -60], 'g.n': [50, 60],
  't.gate': [0, -80], 't.source': [-50, -70], 't.drain': [50, -70], 't.channel': [-60, 90], 't.oxide': [70, 40], 't.sub': [-60, 70],
};

/** Nhãn nào thuộc tầng nào (chỉ số trong LAYERS). */
export const LABEL_LAYER: Record<string, number> = {
  'pc.case': 0, 'pc.monitor': 0,
  'b.socket': 1, 'b.ram': 1, 'b.ssd': 1, 'b.gpu': 1, 'b.chipset': 1, 'b.bus': 1,
  'c.ihs': 2, 'c.substrate': 2,
  'd.cores': 3, 'd.l3': 3, 'd.imc': 3, 'd.io': 3, 'd.l2': 3,
  'k.fetch': 4, 'k.decode': 4, 'k.regs': 4, 'k.alu': 4, 'k.l1i': 4, 'k.l1d': 4, 'k.l2': 4, 'k.mmu': 4,
  'a.A': 5, 'a.B': 5, 'a.S': 5, 'a.fa': 5, 'a.carry': 5,
  'g.p': 6, 'g.n': 6,
  't.gate': 7, 't.source': 7, 't.drain': 7, 't.oxide': 7, 't.channel': 7, 't.sub': 7,
};

export const t2 = (x: T2, lang: Lang) => (lang === 'en' ? x.en : x.vi);
