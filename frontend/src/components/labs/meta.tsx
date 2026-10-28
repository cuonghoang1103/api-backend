/**
 * Mỗi mô phỏng: một biểu tượng (thẻ phòng lab + đầu khung) và MỘT câu "bạn đang xem gì" cho người mới mở ra lần đầu.
 * Câu gợi ý viết cho người chưa biết gì: nói thẳng nhìn vào đâu và bấm gì trước.
 */
import type { ComponentType } from 'react';
import {
  Binary, Boxes, Cable, CalendarClock, Cpu, Database, FileCode2, GitFork, Gauge, HardDrive, Layers, Lock, MemoryStick,
  Network, Route, ScanSearch, ShieldAlert, Shuffle, Timer, Type, Workflow, Zap,
  ArrowDownUp, KeyRound, Container, Layers3, RadioTower, Table2, AlarmClock, Hourglass,
  ChartGantt, Disc3, Split, TrendingUp, Grid3x3, Flame, Waypoints, MonitorSmartphone,
} from 'lucide-react';
import type { L } from './tour/types';
import type { LabNs } from './selector';

export const SIM_ICON: Record<LabNs, Record<string, ComponentType<{ className?: string }>>> = {
  'cpu-lab': { bits: Binary, data: Type, logic: Cable, cpu: Cpu, pipeline: FileCode2, cache: Zap },
  'os-lab': {
    process: GitFork, scheduler: CalendarClock, race: Shuffle, memory: Layers, vm: MemoryStick, sysmon: Gauge, eventloop: Workflow,
    threadpool: Boxes, sync: Lock, deadlock: ShieldAlert, cgroup: Database, cow: Route, pagecache: HardDrive, latency: Timer,
    syscall: ArrowDownUp, perm: KeyRound, fdtable: Table2, nslayers: Container, overlay: Layers3, epoll: RadioTower, eintr: AlarmClock, nagle: Hourglass,
    'gantt-exam': ChartGantt, 'disk-arm': Disc3, 'addr-split': Split, amdahl: TrendingUp, cacheline: Grid3x3, flamegraph: Flame, 'coordinated-omission': Waypoints, osmap: MonitorSmartphone,
  },
};
export const FALLBACK_ICON = ScanSearch;
export const NET_ICON = Network;

export const SIM_HINT: Record<LabNs, Record<string, L>> = {
  'cpu-lab': {
    bits: ['Each square is one bit — a tiny switch that is either off (0) or on (1). Click one and watch every number below change.', 'Mỗi ô vuông là một bit — một công tắc tí hon chỉ tắt (0) hoặc bật (1). Bấm thử một ô và xem mọi con số bên dưới đổi theo.'],
    data: ['Text, real numbers and colours are all stored as bytes. Type something and see the exact bytes behind it.', 'Chữ, số thực và màu sắc đều được lưu bằng byte. Gõ thử một thứ và xem đúng các byte nằm sau nó.'],
    logic: ['Green glowing wires carry a 1, grey ones a 0. Click the input buttons and follow the signal through the gates.', 'Dây sáng xanh đang mang 1, dây xám mang 0. Bấm các nút đầu vào và lần theo tín hiệu đi qua từng cổng.'],
    cpu: ['A whole (tiny) computer: the chip on the left, RAM on the right, the bus between. Press Step and watch one register light up at a time.', 'Cả một chiếc máy tính (tí hon): con chip bên trái, RAM bên phải, bus ở giữa. Bấm Bước và xem từng thanh ghi sáng lên một.'],
    pipeline: ['Six stages from C text to a running program, with real gcc output. Click the stages from 1 to 6.', 'Sáu chặng từ chữ C tới chương trình đang chạy, với output thật của gcc. Bấm lần lượt các chặng 1 → 6.'],
    cache: ['Each step is one memory access. Green = hit (fast), red = miss (slow trip to RAM). Press Step or Play.', 'Mỗi bước là một lần truy cập bộ nhớ. Xanh = trúng (nhanh), đỏ = trượt (phải chạy ra RAM). Bấm Bước hoặc Chạy.'],
  },
  'os-lab': {
    process: ['The process family tree on the left, their states on the right. Press Step to follow one command from fork to exit.', 'Bên trái là cây gia phả tiến trình, bên phải là trạng thái của từng con. Bấm Bước để theo một lệnh từ fork tới exit.'],
    scheduler: ['Who gets the CPU, tick by tick. Press Play to fill the Gantt chart, then switch policy and compare the averages.', 'Ai được CPU, từng tick một. Bấm Chạy cho sơ đồ Gantt đầy, rồi đổi chính sách và so các số trung bình.'],
    race: ['Two threads share one counter. Step one machine instruction at a time and watch an update get lost.', 'Hai luồng dùng chung một biến đếm. Đi từng lệnh máy và xem một lần tăng bị mất.'],
    memory: ['The memory map of one running program: code, data, heap, stack. Step through and watch the stack grow and shrink.', 'Bản đồ bộ nhớ của một chương trình đang chạy: code, data, heap, stack. Đi từng bước và xem stack lớn lên, co lại.'],
    vm: ['Each step is one memory access: virtual address → TLB → page table → RAM frame. Red = page fault.', 'Mỗi bước là một lần truy cập bộ nhớ: địa chỉ ảo → TLB → bảng trang → khung RAM. Đỏ = lỗi trang.'],
    sysmon: ['A virtual Linux server, one second per step. Press Play, read the meters, then break it and fix it.', 'Một máy chủ Linux ảo, mỗi bước một giây. Bấm Chạy, đọc các thanh đo, rồi làm hỏng nó và sửa nó.'],
    eventloop: ['One JavaScript thread and its queues. Guess the print order, then press Step to see who really runs first.', 'Một luồng JavaScript và các hàng đợi của nó. Đoán thứ tự in, rồi bấm Bước xem ai thật sự chạy trước.'],
    threadpool: ['Requests arrive, threads serve them, the rest wait in the queue. Push the load up and watch latency explode.', 'Request đến, luồng phục vụ, phần còn lại xếp hàng. Tăng tải lên và xem độ trễ bùng nổ.'],
    sync: ['Threads waiting on semaphores and condition variables. Step through and watch who sleeps and who wakes whom.', 'Các luồng chờ trên semaphore và biến điều kiện. Đi từng bước và xem ai ngủ, ai đánh thức ai.'],
    deadlock: ['Processes holding some resources and waiting for others. Run the check and see who can finish — and who is stuck.', 'Tiến trình giữ một số tài nguyên và chờ thêm tài nguyên khác. Chạy phép kiểm và xem ai chạy xong được — ai bị kẹt.'],
    cgroup: ['A container with a memory or CPU limit. Press Play and watch what the kernel does when the limit is hit.', 'Một container có giới hạn bộ nhớ hoặc CPU. Bấm Chạy và xem nhân làm gì khi chạm giới hạn.'],
    cow: ['fork() shares memory pages instead of copying them. Write to a page and watch only that one get copied.', 'fork() dùng chung trang nhớ thay vì sao chép. Ghi vào một trang và xem chỉ đúng trang đó bị chép.'],
    pagecache: ['Files are read through RAM (the page cache). Step through the reads and compare cold and warm.', 'Tệp được đọc qua RAM (page cache). Đi từng lần đọc và so lúc nguội với lúc nóng.'],
    latency: ['How long things take, scaled to human time: if one CPU cycle were one second…', 'Mọi thứ mất bao lâu, đổi ra thời gian con người: nếu một chu kỳ CPU là một giây…'],
    syscall: ['One call travels down the tower and back up. Press Step: watch the dashed red line (user → kernel), the registers and the time counter.', 'Một lời gọi đi xuống tháp rồi đi lên. Bấm Bước: nhìn vạch đỏ đứt nét (người dùng → nhân), các thanh ghi và đồng hồ đếm giá.'],
    perm: ['Pick a person, a file and an action, then press Step: the kernel checks one rule at a time — the highlighted one decides.', 'Chọn một người, một tệp và một việc, rồi bấm Bước: nhân kiểm từng luật một — luật được tô sáng là luật quyết định.'],
    fdtable: ['Three columns: the numbers a process holds (fd), the kernel\'s open files (with the offset), the files themselves (inodes). Press Step and follow the arrows.', 'Ba cột: con số tiến trình cầm (fd), các tệp đang mở của nhân (kèm offset), chính các tệp (inode). Bấm Bước và lần theo mũi tên.'],
    nslayers: ['The same process seen from the host (left) and from inside the container (right). Turn namespaces on one by one and watch the right side change.', 'Cùng một tiến trình nhìn từ máy chủ (trái) và từ trong container (phải). Bật từng namespace một và xem bên phải thay đổi.'],
    overlay: ['Read-only layers at the bottom, one writable layer on top, the merged view the container sees. Press Step to read, write and delete files.', 'Các lớp chỉ-đọc ở dưới, một lớp ghi được ở trên, góc nhìn ghép mà container thấy. Bấm Bước để đọc, ghi, xoá tệp.'],
    epoll: ['Many sockets, one thread. Green = has data. Press Step and see how epoll hands over only the ready ones.', 'Nhiều socket, một luồng. Xanh = có dữ liệu. Bấm Bước và xem epoll chỉ trao đúng những socket đã sẵn sàng.'],
    eintr: ['A program asleep in read(), and an alarm signal at 1 second. Press Step and watch what the call returns.', 'Một chương trình đang ngủ trong read(), và một tín hiệu báo thức lúc 1 giây. Bấm Bước và xem lời gọi trả về gì.'],
    nagle: ['Packets between a server and curl, millisecond by millisecond. Press Step and look for the one that waits.', 'Các gói tin giữa máy chủ và curl, từng mili giây. Bấm Bước và tìm gói phải chờ.'],
    'gantt-exam': ['An exam question you solve yourself. Pick a job, paint the cells of the Gantt chart, fill the table, then press "Check my answer".', 'Một câu đề thi bạn tự giải. Chọn một việc, tô các ô của biểu đồ Gantt, điền bảng, rồi bấm "Chấm bài".'],
    'disk-arm': ['A disk seen from above and the path of its read head. Press Step: the arm swings to the next cylinder and the counter adds the distance.', 'Một mặt đĩa nhìn từ trên và đường đi của đầu đọc. Bấm Bước: tay đĩa xoay tới trụ kế tiếp và bộ đếm cộng thêm quãng đường.'],
    'addr-split': ['One virtual address, its bits coloured by job: which bits pick the table entry, which bits are the offset. Press Step for the exam method.', 'Một địa chỉ ảo, các bit tô màu theo nhiệm vụ: bit nào chọn mục trong bảng, bit nào là offset. Bấm Bước để xem cách giải đề.'],
    amdahl: ['How much faster with more cores? Move the "serial part" slider and watch the curve flatten; the circles are real measurements.', 'Thêm lõi thì nhanh hơn bao nhiêu? Kéo thanh "phần tuần tự" và xem đường cong dẹt xuống; các vòng tròn là số đo thật.'],
    cacheline: ['Each core adds to its own counter. Press Step and watch the red M jump from core to core when the counters share a cache line.', 'Mỗi lõi cộng vào bộ đếm của riêng nó. Bấm Bước và xem chữ M đỏ nhảy từ lõi này sang lõi khác khi các bộ đếm chung một dòng cache.'],
    flamegraph: ['A real profile: each box is a function, wider = more CPU time. Tap a box to see its SELF and TOTAL, tap again to zoom in.', 'Một hồ sơ thật: mỗi hộp là một hàm, càng rộng càng tốn CPU. Chạm một hộp để xem SELF và TOTAL, chạm tiếp để phóng to.'],
    'coordinated-omission': ['The same frozen server measured two ways. Press Play and compare the p99 the two load testers report.', 'Cùng một máy chủ bị đứng hình, đo theo hai cách. Bấm Chạy và so p99 mà hai công cụ tải báo ra.'],
    osmap: ['Flip the switch at the top between Linux, macOS and Windows: every card changes to that system\'s name, command and output.', 'Bật công tắc phía trên giữa Linux, macOS và Windows: mỗi thẻ đổi sang tên, lệnh và output của hệ đó.'],
  },
};
