/**
 * Kịch bản hướng dẫn từng bước cho phòng lab hệ điều hành (/os-lab) — những mô phỏng dùng nhiều nhất trong khoá
 * "Operating Systems for Developers": tiến trình, lập lịch, race, bộ nhớ ảo, phòng máy, event loop, deadlock.
 */
import type { Tour } from './types';

const step = (n: number, delay = 650) => ({ a: 'player.step', delay, upTo: n });

export const OS_TOURS: Tour[] = [
  {
    id: 'process-shell', ns: 'os-lab', sim: 'process', presets: ['shell'],
    title: ['How a shell runs a command', 'Shell chạy một lệnh ra sao'],
    summary: ['fork → exec → wait → exit, on the process tree and the state machine at the same time.', 'fork → exec → wait → exit, trên cây tiến trình và máy trạng thái cùng lúc.'],
    steps: [
      {
        target: 'proc-code', do: [{ a: 'process.mode', v: 'shell' }, { a: 'player.seek', v: 0 }],
        title: ['A shell is a loop', 'Shell là một vòng lặp'],
        body: ['Every time you type "ls" and press Enter, bash runs this loop: read a line, fork a copy of itself, the copy becomes ls (exec), and the parent waits. The yellow line is the code running now.', 'Mỗi lần bạn gõ "ls" rồi Enter, bash chạy vòng lặp này: đọc một dòng, fork ra một bản sao, bản sao biến thành ls (exec), còn cha thì chờ. Dòng vàng là đoạn mã đang chạy.'],
      },
      {
        target: 'proc-tree',
        title: ['The family tree', 'Cây gia phả'],
        body: ['Every process has a parent. systemd (PID 1) is the ancestor of everything; bash (PID 100) is waiting for you to type. A dashed border means a zombie, a thick border means it just appeared.', 'Tiến trình nào cũng có cha. systemd (PID 1) là tổ tiên của tất cả; bash (PID 100) đang chờ bạn gõ phím. Viền đứt nét là zombie, viền đậm là vừa xuất hiện.'],
      },
      {
        target: 'proc-states', do: [{ a: 'player.seek', v: 1 }],
        title: ['You press Enter', 'Bạn bấm Enter'],
        body: ['bash was Sleeping inside read(). The kernel wakes it (→ Ready) and the scheduler gives it the CPU (→ Running). Red arrows show the moves that just happened.', 'bash đang Ngủ trong read(). Nhân đánh thức nó (→ Sẵn sàng) và bộ lập lịch cho nó CPU (→ Đang chạy). Mũi tên đỏ là các bước chuyển vừa xảy ra.'],
      },
      {
        target: 'proc-tree', do: [{ a: 'player.seek', v: 2 }],
        title: ['fork(): one becomes two', 'fork(): một thành hai'],
        body: ['PID 101 appears: a copy of bash with the same code and a copy-on-write copy of its memory. fork returns 101 to the parent and 0 to the child — that is how each knows who it is.', 'PID 101 xuất hiện: bản sao của bash, cùng mã và một bản sao copy-on-write của bộ nhớ. fork trả 101 cho cha và 0 cho con — nhờ đó mỗi bên biết mình là ai.'],
      },
      {
        target: 'proc-tree', do: [{ a: 'player.seek', v: 4 }],
        title: ['exec(): become another program', 'exec(): hoá thành chương trình khác'],
        body: ['The parent went to sleep in waitpid(). The child calls execvp("ls"): it throws away the bash code and loads ls into ITSELF. Same PID 101, new program.', 'Cha đã đi ngủ trong waitpid(). Con gọi execvp("ls"): vứt mã bash và nạp ls vào CHÍNH NÓ. Vẫn PID 101, chương trình mới.'],
      },
      {
        target: 'step',
        title: ['Your turn: let ls finish', 'Đến lượt bạn: cho ls chạy xong'],
        body: ['Press Step until ls exits. Watch it become a ZOMBIE (Z): its memory is gone, but its exit code is kept until the parent asks for it.', 'Bấm Bước tới khi ls thoát. Xem nó thành ZOMBIE (Z): bộ nhớ đã giải phóng, nhưng mã thoát còn giữ lại tới khi cha hỏi.'],
        task: { text: ['Step until there is a zombie.', 'Bấm Bước tới khi có một zombie.'], until: (s) => (s.process?.zombies as number) >= 1, solve: [step(3, 700)] },
      },
      {
        target: 'proc-ps', do: [{ a: 'player.step', delay: 400 }],
        title: ['wait() reaps the zombie', 'wait() dọn zombie'],
        body: ['The kernel wakes bash, waitpid() returns status 0 and PID 101 disappears for good. The ps listing here is what you would see in a real terminal at each step.', 'Nhân đánh thức bash, waitpid() trả về status 0 và PID 101 biến mất hẳn. Bảng ps ở đây là thứ bạn sẽ thấy trong terminal thật ở từng bước.'],
      },
    ],
    quiz: {
      q: ['After a successful exec(), the PID of the process…', 'Sau khi exec() thành công, PID của tiến trình…'],
      options: [['changes to a new number', 'đổi thành số mới'], ['stays the same', 'giữ nguyên'], ['becomes 0', 'thành 0']],
      answer: 1, why: ['exec replaces the program inside the same process; fork is what creates a new PID.', 'exec thay chương trình bên trong cùng một tiến trình; fork mới là thứ tạo PID mới.'],
    },
  },
  {
    id: 'sched-policies', ns: 'os-lab', sim: 'scheduler', presets: ['textbook'],
    title: ['Who gets the CPU?', 'Ai được dùng CPU?'],
    summary: ['Read a Gantt chart, measure waiting time, and compare FCFS with SRTF on the textbook example.', 'Đọc sơ đồ Gantt, đo thời gian chờ, và so FCFS với SRTF trên ví dụ giáo trình.'],
    steps: [
      {
        target: 'sched-procs', do: [{ a: 'sched.load', v: 'textbook' }, { a: 'player.seek', v: 0 }],
        title: ['Four processes', 'Bốn tiến trình'],
        body: ['Each row is one process: when it arrives and how many ticks of CPU it needs (burst). One core can run only one of them at a time — so someone has to wait.', 'Mỗi hàng là một tiến trình: đến lúc nào và cần bao nhiêu tick CPU (burst). Một lõi chỉ chạy được một tiến trình mỗi lúc — nên phải có người chờ.'],
      },
      {
        target: 'sched-policy',
        title: ['The policy decides', 'Chính sách quyết định'],
        body: ['A scheduling policy is the rule for picking the next process. We start with FCFS: first come, first served — like a queue at the bank.', 'Chính sách lập lịch là luật chọn tiến trình chạy tiếp. Ta bắt đầu với FCFS: đến trước phục vụ trước — như xếp hàng ở ngân hàng.'],
      },
      {
        target: 'play',
        title: ['Your turn: run it', 'Đến lượt bạn: chạy thử'],
        body: ['Press Play. The red line is "now"; the chart fills in tick by tick.', 'Bấm Chạy. Vạch đỏ là "bây giờ"; sơ đồ được tô dần từng tick.'],
        task: { text: ['Play until every process is done.', 'Chạy tới khi mọi tiến trình xong.'], until: (s) => s.player?.atEnd === true && s.sched?.policy === 'fcfs', solve: [{ a: 'player.speed', v: 4 }, { a: 'player.play', delay: 200 }] },
      },
      {
        target: 'sched-gantt',
        title: ['Reading the Gantt chart', 'Đọc sơ đồ Gantt'],
        body: ['A solid block means running, a thin bar means ready but waiting for the CPU. P3 arrived at t = 2 but waited until t = 12 — ten ticks of pure waiting.', 'Khối đặc là đang chạy, vạch mảnh là sẵn sàng nhưng đang chờ CPU. P3 đến lúc t = 2 mà phải đợi tới t = 12 — mười tick chỉ để chờ.'],
      },
      {
        target: 'sched-kpis',
        title: ['Average waiting time', 'Thời gian chờ trung bình'],
        body: ['FCFS: average waiting = 8.75 ticks. Short jobs stuck behind long ones push this number up.', 'FCFS: chờ trung bình = 8,75 tick. Việc ngắn kẹt sau việc dài làm con số này phình to.'],
      },
      {
        target: 'sched-policy',
        title: ['Your turn: try SRTF', 'Đến lượt bạn: thử SRTF'],
        body: ['Click SRTF (shortest remaining time first) and run it again to the end.', 'Bấm SRTF (còn ít việc nhất chạy trước) rồi chạy lại tới cuối.'],
        task: { text: ['Switch to SRTF and run to the end.', 'Đổi sang SRTF và chạy tới cuối.'], until: (s) => s.sched?.policy === 'srtf' && s.player?.atEnd === true, solve: [{ a: 'sched.policy', v: 'srtf', delay: 300 }, { a: 'player.end', delay: 500 }] },
      },
      {
        target: 'sched-kpis',
        title: ['6.5 instead of 8.75', '6,5 thay vì 8,75'],
        body: ['SRTF lets short jobs jump ahead, so average waiting drops to 6.5. The price: long jobs can starve, and the OS must guess how long jobs are — which is why Linux uses fairness (CFS/EEVDF) instead.', 'SRTF cho việc ngắn chen lên, nên chờ trung bình tụt còn 6,5. Cái giá: việc dài có thể bị đói, và HĐH phải đoán độ dài công việc — vì thế Linux dùng tính công bằng (CFS/EEVDF).'],
      },
    ],
    quiz: {
      q: ['The "convoy effect" (short jobs stuck behind one long job) belongs to…', '"Hiệu ứng đoàn xe" (việc ngắn kẹt sau một việc dài) là đặc trưng của…'],
      options: [['FCFS', 'FCFS'], ['Round robin', 'Round robin'], ['SRTF', 'SRTF']],
      answer: 0, why: ['FCFS never interrupts the running job, so everyone behind a long job waits for all of it.', 'FCFS không bao giờ ngắt việc đang chạy, nên ai đứng sau một việc dài phải chờ nó chạy hết.'],
    },
  },
  {
    id: 'race-lost-update', ns: 'os-lab', sim: 'race', presets: ['none', 'mutex', 'atomic'],
    title: ['The lost update', 'Lần tăng bị mất'],
    summary: ['counter++ split into load/add/store, the interleaving that loses an increment, and the mutex fix.', 'counter++ tách thành nạp/cộng/ghi, cách xen kẽ làm mất một lần tăng, và cách sửa bằng mutex.'],
    steps: [
      {
        target: 'race-threads', do: [{ a: 'race.mode', v: 'none' }, { a: 'race.sched', v: 'alt' }, { a: 'race.n', v: 3 }, { a: 'player.seek', v: 0 }],
        title: ['Two threads, one counter', 'Hai luồng, một biến đếm'],
        body: ['Threads T1 and T2 each run counter++ three times. In C or Java that is one line — but the CPU runs three instructions: load into a register, add 1, store back.', 'Luồng T1 và T2 mỗi luồng chạy counter++ ba lần. Trong C hay Java đó là một dòng — nhưng CPU chạy ba lệnh: nạp vào thanh ghi, cộng 1, ghi trở lại.'],
      },
      {
        target: 'race-memory',
        title: ['Shared memory', 'Bộ nhớ chung'],
        body: ['Both threads read and write this one variable. 3 + 3 increments should give 6.', 'Cả hai luồng đọc và ghi đúng một biến này. 3 + 3 lần tăng thì đáng lẽ ra 6.'],
      },
      {
        target: 'step',
        title: ['Your turn: catch the bug', 'Đến lượt bạn: bắt tận tay lỗi'],
        body: ['Press Step one instruction at a time. The threads take turns after every instruction (the worst case). Stop when an update is lost — you will hear an "oops".', 'Bấm Bước từng lệnh một. Hai luồng thay phiên sau mỗi lệnh (trường hợp xấu nhất). Dừng lại khi một lần tăng bị mất — bạn sẽ nghe tiếng "ôi".'],
        task: { text: ['Step until "lost updates" becomes 1.', 'Bấm Bước tới khi "lần tăng mất" thành 1.'], until: (s) => (s.race?.lost as number) >= 1, solve: [step(8, 650)] },
      },
      {
        target: 'race-step',
        title: ['What just happened', 'Chuyện gì vừa xảy ra'],
        body: ['Both threads loaded the SAME old value into their registers before either stored. Both added 1 and stored the same number — one increment vanished, with no error message.', 'Cả hai luồng đã nạp CÙNG một giá trị cũ vào thanh ghi trước khi ai kịp ghi. Cả hai cộng 1 rồi ghi cùng một số — một lần tăng biến mất, không có thông báo lỗi nào.'],
      },
      {
        target: 'race-memory', do: [{ a: 'player.end', delay: 200 }],
        title: ['The final result', 'Kết quả cuối'],
        body: ['The counter ends below 6. In real programs this shows up as "sometimes the total is wrong" — the worst kind of bug, because it depends on timing.', 'Biến đếm kết thúc dưới 6. Trong chương trình thật nó hiện ra dưới dạng "thỉnh thoảng tổng bị sai" — loại bug tệ nhất, vì nó phụ thuộc thời điểm.'],
      },
      {
        target: 'race-mode',
        title: ['Your turn: add a lock', 'Đến lượt bạn: thêm khoá'],
        body: ['Choose Mutex. Now lock(m) … unlock(m) wraps the three instructions into a critical section.', 'Chọn Mutex. Giờ lock(m) … unlock(m) bọc ba lệnh lại thành một vùng găng.'],
        task: { text: ['Switch the mode to Mutex.', 'Chuyển chế độ sang Mutex.'], until: (s) => s.race?.mode === 'mutex', solve: [{ a: 'race.mode', v: 'mutex', delay: 300 }] },
      },
      {
        target: 'race-memory', do: [{ a: 'player.end', delay: 300 }],
        title: ['Always 6', 'Luôn bằng 6'],
        body: ['With the mutex, whoever holds m finishes load-add-store before the other may start. Correct every time — at the cost of threads waiting for each other.', 'Có mutex, ai đang giữ m phải làm xong nạp-cộng-ghi thì luồng kia mới được bắt đầu. Đúng mọi lần — đổi lại các luồng phải chờ nhau.'],
      },
      {
        target: 'race-hist', do: [{ a: 'race.mode', v: 'none' }, { a: 'race.hist', delay: 300 }],
        title: ['1,000 random runs', '1.000 lần chạy ngẫu nhiên'],
        body: ['Without a lock, 1,000 runs with random timing give many different answers. "It works on my machine" just means you got lucky.', 'Không có khoá, 1.000 lần chạy với thời điểm ngẫu nhiên cho ra rất nhiều đáp án khác nhau. "Máy tôi chạy được mà" chỉ có nghĩa là bạn gặp may.'],
      },
    ],
    quiz: {
      q: ['Why is counter++ unsafe between two threads?', 'Vì sao counter++ không an toàn giữa hai luồng?'],
      options: [['It is three steps (load, add, store) and another thread can run in between', 'Nó gồm ba bước (nạp, cộng, ghi) và luồng khác có thể chen vào giữa'], ['The CPU sometimes adds wrongly', 'CPU thỉnh thoảng cộng sai'], ['int is too small', 'Kiểu int quá nhỏ']],
      answer: 0, why: ['A read-modify-write is not atomic unless you use a lock or an atomic instruction.', 'Đọc-sửa-ghi không nguyên tử trừ khi dùng khoá hoặc lệnh nguyên tử.'],
    },
  },
  {
    id: 'race-deadlock', ns: 'os-lab', sim: 'race', presets: ['deadlock', 'ordered'],
    title: ['Two locks, one deadlock', 'Hai khoá, một deadlock'],
    summary: ['Two transfers lock accounts in opposite order and wait forever; fixed by a global lock order.', 'Hai lệnh chuyển tiền khoá tài khoản theo thứ tự ngược nhau và chờ nhau mãi; sửa bằng thứ tự khoá chung.'],
    steps: [
      {
        target: 'race-threads', do: [{ a: 'race.mode', v: 'deadlock' }, { a: 'race.sched', v: 'alt' }, { a: 'player.seek', v: 0 }],
        title: ['Two bank transfers', 'Hai lệnh chuyển tiền'],
        body: ['T1 moves money from A to B: it locks A, then B. T2 moves money from B to A: it locks B, then A. Each looks perfectly correct on its own.', 'T1 chuyển tiền từ A sang B: khoá A rồi khoá B. T2 chuyển từ B sang A: khoá B rồi khoá A. Nhìn riêng từng luồng thì hoàn toàn đúng.'],
      },
      {
        target: 'play',
        title: ['Your turn: run them together', 'Đến lượt bạn: chạy cùng lúc'],
        body: ['Press Play and wait for the heavy "thud".', 'Bấm Chạy và chờ tiếng "bịch".'],
        task: { text: ['Play until the threads get stuck.', 'Chạy tới khi hai luồng kẹt.'], until: (s) => s.race?.deadlock === true, solve: [{ a: 'player.play', delay: 200 }] },
      },
      {
        target: 'race-graph',
        title: ['A cycle of waiting', 'Một vòng chờ đợi'],
        body: ['T1 holds A and waits for B; T2 holds B and waits for A. The arrows form a circle, so nobody can ever move: deadlock. The program does not crash — it just hangs.', 'T1 giữ A và chờ B; T2 giữ B và chờ A. Các mũi tên khép thành vòng nên không ai nhúc nhích được: deadlock. Chương trình không sập — nó chỉ treo.'],
      },
      {
        target: 'race-mode',
        title: ['Your turn: fix the order', 'Đến lượt bạn: sửa thứ tự'],
        body: ['Choose "Fixed lock order": every thread now locks A before B, no matter which way the money goes.', 'Chọn "Cố định thứ tự khoá": mọi luồng đều khoá A trước B, bất kể tiền đi chiều nào.'],
        task: { text: ['Switch to "Fixed lock order".', 'Chuyển sang "Cố định thứ tự khoá".'], until: (s) => s.race?.mode === 'ordered', solve: [{ a: 'race.mode', v: 'ordered', delay: 300 }] },
      },
      {
        target: 'race-graph', do: [{ a: 'player.end', delay: 300 }],
        title: ['No cycle possible', 'Không thể có vòng'],
        body: ['If everyone takes locks in the same global order, the arrows can never close into a circle. This rule prevents most real deadlocks — in Java, Go, databases and the Linux kernel.', 'Nếu ai cũng lấy khoá theo cùng một thứ tự chung, mũi tên không bao giờ khép thành vòng. Luật này chặn phần lớn deadlock ngoài đời — trong Java, Go, CSDL và nhân Linux.'],
      },
    ],
    quiz: {
      q: ['Which change prevents this deadlock?', 'Thay đổi nào ngăn được deadlock này?'],
      options: [['Use faster CPUs', 'Dùng CPU nhanh hơn'], ['Always take the locks in the same order', 'Luôn lấy khoá theo cùng một thứ tự'], ['Add more threads', 'Thêm nhiều luồng hơn']],
      answer: 1, why: ['A deadlock needs a cycle of waiting; a single global order makes a cycle impossible.', 'Deadlock cần một vòng chờ; một thứ tự toàn cục khiến vòng không thể hình thành.'],
    },
  },
  {
    id: 'vm-translate', ns: 'os-lab', sim: 'vm', presets: ['program', 'walk'],
    title: ['From a pointer to a byte in RAM', 'Từ con trỏ tới một byte trong RAM'],
    summary: ['Virtual address → TLB → page table → physical frame, and what a page fault really is.', 'Địa chỉ ảo → TLB → bảng trang → khung vật lý, và lỗi trang thật ra là gì.'],
    steps: [
      {
        target: 'vm-address', do: [{ a: 'vmtab.tab', v: 'tr' }, { a: 'vm.load', v: 'program' }, { a: 'player.seek', v: 0 }],
        title: ['A virtual address', 'Một địa chỉ ảo'],
        body: ['Every pointer in your program is a VIRTUAL address. Its top bits (blue) are the page number, the rest (grey) is the position inside a 4 KiB page. Only the page number gets translated.', 'Mọi con trỏ trong chương trình là một địa chỉ ẢO. Các bit cao (xanh) là số trang, phần còn lại (xám) là vị trí trong một trang 4 KiB. Chỉ số trang được dịch.'],
      },
      {
        target: 'vm-pagetable', do: [{ a: 'player.seek', v: 1 }],
        title: ['The page table', 'Bảng trang'],
        body: ['Each process has its own page table: page number → physical frame. P = 1 means the page is in RAM right now. The highlighted row is the page being accessed.', 'Mỗi tiến trình có bảng trang riêng: số trang → khung vật lý. P = 1 nghĩa là trang đang nằm trong RAM. Hàng tô sáng là trang đang được truy cập.'],
      },
      {
        target: 'vm-tlb',
        title: ['The TLB: a shortcut', 'TLB: lối tắt'],
        body: ['Walking the page table costs extra memory reads, so the CPU caches recent translations in the TLB. A TLB hit translates in about 1 ns.', 'Đi bảng trang tốn thêm vài lần đọc bộ nhớ, nên CPU lưu các bản dịch gần đây trong TLB. Trúng TLB thì dịch xong trong khoảng 1 ns.'],
      },
      {
        target: 'step',
        title: ['Your turn: find a page fault', 'Đến lượt bạn: tìm một lỗi trang'],
        body: ['The very first access already faulted: the code page was not in RAM. Press Step until another access touches a page that is not in RAM yet — the explanation box turns orange or red.', 'Ngay lần truy cập đầu đã có lỗi trang: trang mã chưa nằm trong RAM. Bấm Bước tới khi một lần truy cập khác đụng trang chưa có trong RAM — ô giải thích chuyển màu cam hoặc đỏ.'],
        task: { text: ['Step until the next page fault.', 'Bấm Bước tới lỗi trang tiếp theo.'], until: (s) => ((s.vm?.minor as number) + (s.vm?.major as number)) >= 2 && (s.vm?.fault === 'minor' || s.vm?.fault === 'major'), solve: [step(10, 700)] },
      },
      {
        target: 'vm-frames',
        title: ['The kernel fixes it', 'Nhân hệ điều hành xử lý'],
        body: ['A page fault is not an error: the CPU pauses the program, the kernel finds a free frame (and reads the data from disk if needed), updates the page table and retries. A minor fault takes microseconds; a major one waits for the disk.', 'Lỗi trang không phải là lỗi: CPU tạm dừng chương trình, nhân tìm một khung trống (đọc dữ liệu từ đĩa nếu cần), cập nhật bảng trang rồi chạy lại. Lỗi minor mất vài micro giây; lỗi major phải chờ đĩa.'],
      },
      {
        target: 'play',
        title: ['Your turn: run the program', 'Đến lượt bạn: chạy hết chương trình'],
        body: ['Press Play and watch the frames fill up — and how many faults it took.', 'Bấm Chạy và xem các khung được lấp đầy — cùng số lỗi trang phải trả.'],
        task: { text: ['Play to the end.', 'Chạy tới cuối.'], until: (s) => s.player?.atEnd === true && s.vm?.preset === 'program', solve: [{ a: 'player.speed', v: 4 }, { a: 'player.play', delay: 200 }] },
      },
    ],
    quiz: {
      q: ['What does a TLB store?', 'TLB lưu thứ gì?'],
      options: [['Recently used page → frame translations', 'Các bản dịch trang → khung vừa dùng'], ['Copies of whole pages', 'Bản sao của cả trang'], ['The process\'s stack', 'Stack của tiến trình']],
      answer: 0, why: ['It is a small cache of the page table, so most accesses skip the page-table walk.', 'Nó là một cache nhỏ của bảng trang, nên phần lớn lần truy cập khỏi phải đi bảng trang.'],
    },
  },
  {
    id: 'vm-thrash', ns: 'os-lab', sim: 'vm', presets: ['loop'],
    title: ['Not enough RAM: thrashing', 'Thiếu RAM: thrashing'],
    summary: ['A loop over 5 pages with 4 frames faults on every access; one more frame fixes it.', 'Vòng lặp qua 5 trang với 4 khung thì lần nào cũng lỗi trang; thêm một khung là hết.'],
    steps: [
      {
        target: 'thrash-table', do: [{ a: 'vmtab.tab', v: 'rep' }, { a: 'thrash.load', v: 'loop' }, { a: 'thrash.algo', v: 'lru' }, { a: 'player.end', delay: 200 }],
        title: ['A loop over 5 pages', 'Vòng lặp qua 5 trang'],
        body: ['The program keeps using pages 1 2 3 4 5 1 2 3 4 5 … but RAM has only 4 frames. Every column marked F is a page fault.', 'Chương trình liên tục dùng các trang 1 2 3 4 5 1 2 3 4 5 … nhưng RAM chỉ có 4 khung. Mỗi cột đánh F là một lỗi trang.'],
      },
      {
        target: 'thrash-kpis',
        title: ['Every access faults', 'Lần nào cũng lỗi'],
        body: ['LRU throws out exactly the page that is needed next, so all 20 accesses fault. Each fault costs ~100 µs instead of ~100 ns — the program becomes about a thousand times slower. That is thrashing.', 'LRU đẩy ra đúng trang sắp cần tới, nên cả 20 lần truy cập đều lỗi. Mỗi lỗi tốn ~100 µs thay vì ~100 ns — chương trình chậm đi cỡ nghìn lần. Đó là thrashing.'],
      },
      {
        target: 'thrash-frames',
        title: ['Your turn: add one frame', 'Đến lượt bạn: thêm một khung'],
        body: ['Drag the RAM frames slider to 5 — enough to hold the whole working set.', 'Kéo thanh số khung RAM lên 5 — đủ chứa trọn tập làm việc.'],
        task: { text: ['Give it 5 frames.', 'Cho nó 5 khung.'], until: (s) => (s.thrash?.frames as number) >= 5 && s.thrash?.thrashing === false, solve: [{ a: 'thrash.frames', v: 5, delay: 300 }, { a: 'player.end', delay: 300 }] },
      },
      {
        target: 'thrash-curve',
        title: ['A cliff, not a slope', 'Một vách đá, không phải con dốc'],
        body: ['Only the first 5 accesses fault now. The bar chart shows faults for every possible number of frames: red bars are fewer frames than pages in use. Performance does not degrade gently — it falls off a cliff.', 'Giờ chỉ 5 lần đầu lỗi trang. Biểu đồ cột cho thấy số lỗi với mọi số khung có thể: cột đỏ là ít khung hơn số trang đang dùng. Hiệu năng không giảm từ từ — nó rơi khỏi vách đá.'],
      },
    ],
    quiz: {
      q: ['A server is thrashing. What helps?', 'Máy chủ đang thrashing. Điều gì giúp được?'],
      options: [['A faster CPU', 'CPU nhanh hơn'], ['More RAM, or running fewer things at once', 'Thêm RAM, hoặc chạy ít việc cùng lúc hơn'], ['A bigger swap file', 'Tệp swap lớn hơn']],
      answer: 1, why: ['The CPU is idle waiting for the disk; only fitting the working set in RAM fixes it.', 'CPU đang ngồi chờ đĩa; chỉ có cho tập làm việc vừa RAM mới sửa được.'],
    },
  },
  {
    id: 'sysmon-read', ns: 'os-lab', sim: 'sysmon', presets: ['calm', 'cpuhog'],
    title: ['Read a server like an SRE', 'Đọc máy chủ như người trực hệ thống'],
    summary: ['htop meters, load average, an injected CPU hog, the commands to confirm it, and a diagnosis.', 'Thanh đo htop, load average, một sự cố ăn CPU được bơm vào, lệnh để xác nhận, và chẩn đoán.'],
    steps: [
      {
        target: 'sys-meters', do: [{ a: 'sysmon.fresh' }, { a: 'player.seek', v: 0 }],
        title: ['The meters', 'Các thanh đo'],
        body: ['A virtual 4-core Linux server, like htop shows it. CPU: green = your programs, red = the kernel, grey = waiting for disk. Mem: green = used, orange = cache (the kernel gives it back when needed).', 'Một máy chủ Linux ảo 4 lõi, giống như htop hiển thị. CPU: xanh = chương trình của bạn, đỏ = nhân, xám = chờ đĩa. Mem: xanh = đang dùng, cam = cache (nhân trả lại khi cần).'],
      },
      {
        target: 'sys-kpis',
        title: ['Four numbers to watch', 'Bốn con số cần nhìn'],
        body: ['Load average divided by the number of cores: below 1 means there is room. "available" is the real free memory. API p99 is what your users actually feel.', 'Load average chia cho số lõi: dưới 1 là còn dư sức. "available" mới là bộ nhớ trống thật. API p99 là thứ người dùng thật sự cảm thấy.'],
      },
      {
        target: 'play',
        title: ['Your turn: let it run', 'Đến lượt bạn: cho máy chạy'],
        body: ['Press Play and let the machine run for about ten seconds. A healthy server is boring — that is good.', 'Bấm Chạy và để máy chạy khoảng mười giây. Máy khoẻ thì nhàm chán — vậy là tốt.'],
        task: { text: ['Run for 10 seconds.', 'Cho chạy 10 giây.'], until: (s) => (s.sysmon?.t as number) >= 10, solve: [{ a: 'player.speed', v: 4 }, { a: 'player.play', delay: 200 }] },
      },
      {
        target: 'sys-inject', do: [{ a: 'player.pause' }, { a: 'sysmon.inject', v: 'cpuhog', delay: 300 }, { a: 'player.play', delay: 300 }],
        title: ['Something goes wrong', 'Có chuyện xảy ra'],
        body: ['We just injected an incident: a program with six busy threads on a four-core machine. Keep watching the meters and the load.', 'Ta vừa bơm một sự cố: một chương trình sáu luồng chạy hết sức trên máy bốn lõi. Tiếp tục nhìn các thanh đo và load.'],
      },
      {
        target: 'sys-kpis',
        title: ['Your turn: watch the load climb', 'Đến lượt bạn: xem load leo thang'],
        body: ['Let it run until the load passes the number of cores (4). CPU is now nearly 100% green and the API gets slower.', 'Cho chạy tới khi load vượt số lõi (4). CPU giờ gần như xanh kín 100% và API chậm dần.'],
        task: { text: ['Wait until load > 4.', 'Chờ tới khi load > 4.'], until: (s) => (s.sysmon?.load1 as number) > 4, solve: [{ a: 'player.play', delay: 200 }] },
      },
      {
        target: 'sys-top', do: [{ a: 'player.pause' }, { a: 'sysmon.sort', v: 'cpu' }, { a: 'sysmon.selTop', delay: 300 }],
        title: ['top finds the culprit', 'top tìm ra thủ phạm'],
        body: ['Sorted by %CPU, the first row uses ~380% CPU — six threads sharing four cores. Clicking a row offers kill and renice, exactly like in real top.', 'Sắp theo %CPU, dòng đầu dùng ~380% CPU — sáu luồng chia nhau bốn lõi. Bấm một dòng sẽ hiện kill và renice, y như top thật.'],
      },
      {
        target: 'sys-diagnose',
        title: ['Your turn: diagnose it', 'Đến lượt bạn: chẩn đoán'],
        body: ['Pick the answer that matches what you saw.', 'Chọn đáp án khớp với những gì bạn đã thấy.'],
        task: { text: ['Choose the right diagnosis.', 'Chọn đúng chẩn đoán.'], until: (s) => s.sysmon?.correct === true, solve: [{ a: 'sysmon.answer', v: 'cpuhog', delay: 400 }] },
      },
    ],
    quiz: {
      q: ['On a 4-core machine, load average 8 means…', 'Trên máy 4 lõi, load average 8 nghĩa là…'],
      options: [['It is 8% busy', 'Máy bận 8%'], ['About twice as much work as the cores can run — things are waiting', 'Việc nhiều gấp khoảng đôi số lõi chạy nổi — đang có việc phải chờ'], ['8 processes are running in total', 'Tổng cộng có 8 tiến trình']],
      answer: 1, why: ['Load counts tasks running or waiting to run (plus uninterruptible ones); compare it with the core count.', 'Load đếm số tác vụ đang chạy hoặc chờ chạy (cộng các tác vụ không ngắt được); so nó với số lõi.'],
    },
  },
  {
    id: 'eventloop-order', ns: 'os-lab', sim: 'eventloop', presets: ['order'],
    title: ['Who prints first?', 'Ai in trước?'],
    summary: ['Synchronous code, nextTick, Promise microtasks, timers, I/O and setImmediate — in the real Node.js order.', 'Mã đồng bộ, nextTick, microtask Promise, timer, I/O và setImmediate — theo đúng thứ tự của Node.js.'],
    steps: [
      {
        target: 'el-code', do: [{ a: 'el.mode', v: 'order' }, { a: 'player.seek', v: 0 }],
        title: ['Guess first', 'Đoán trước đã'],
        body: ['This script schedules eight console.log calls in different ways. The number in each message is the order Node.js really prints them. Try to explain why before stepping.', 'Đoạn mã này hẹn tám lệnh console.log theo nhiều cách. Con số trong mỗi dòng in chính là thứ tự Node.js thật sự in ra. Thử tự giải thích vì sao trước khi bấm.'],
      },
      {
        target: 'el-stack',
        title: ['One thread', 'Một luồng'],
        body: ['JavaScript runs on ONE thread: this call stack. Only one function runs at a time; everything else waits in a queue until the stack is empty.', 'JavaScript chạy trên MỘT luồng: chính call stack này. Mỗi lúc chỉ một hàm chạy; mọi thứ khác xếp hàng chờ tới khi stack trống.'],
      },
      {
        target: 'step',
        title: ['Your turn: the synchronous part', 'Đến lượt bạn: phần đồng bộ'],
        body: ['Press Step until "2 sync" is printed. Notice that setTimeout, the Promise and readFile only QUEUE work — they do not run it yet.', 'Bấm Bước tới khi "2 sync" được in. Để ý: setTimeout, Promise và readFile chỉ XẾP HÀNG công việc — chưa chạy nó.'],
        task: { text: ['Step until "2 sync" appears.', 'Bấm Bước tới khi "2 sync" xuất hiện.'], until: (s) => s.el?.last === '2 sync' || (s.el?.printed as number) >= 2, solve: [step(14, 550)] },
      },
      {
        target: 'el-micro',
        title: ['Microtasks jump the queue', 'Microtask chen hàng'],
        body: ['As soon as the stack is empty, Node drains process.nextTick first, then Promise callbacks — BEFORE any timer, even a 0 ms one.', 'Ngay khi stack trống, Node chạy hết process.nextTick trước, rồi tới callback của Promise — TRƯỚC mọi timer, kể cả timer 0 ms.'],
      },
      {
        target: 'play',
        title: ['Your turn: run the loop', 'Đến lượt bạn: chạy vòng lặp'],
        body: ['Press Play and watch the event loop phases light up in turn: timers → poll (I/O) → check (setImmediate).', 'Bấm Chạy và xem các pha của event loop lần lượt sáng: timers → poll (I/O) → check (setImmediate).'],
        task: { text: ['Play to the end.', 'Chạy tới cuối.'], until: (s) => s.el?.phase === 'done', solve: [{ a: 'player.speed', v: 2 }, { a: 'player.play', delay: 200 }] },
      },
      {
        target: 'el-console',
        title: ['1 to 8', 'Từ 1 tới 8'],
        body: ['Inside the readFile callback, setImmediate (7) beats the 0 ms setTimeout (8): after the poll phase comes check, and timers only on the next turn of the loop.', 'Trong callback của readFile, setImmediate (7) thắng setTimeout 0 ms (8): sau pha poll là pha check, còn timers phải đợi vòng lặp sau.'],
      },
    ],
    quiz: {
      q: ['Which runs first: setTimeout(fn, 0) or Promise.resolve().then(fn)?', 'Cái nào chạy trước: setTimeout(fn, 0) hay Promise.resolve().then(fn)?'],
      options: [['setTimeout', 'setTimeout'], ['The Promise callback', 'Callback của Promise'], ['It is random', 'Ngẫu nhiên']],
      answer: 1, why: ['Promise callbacks are microtasks, drained before the event loop moves on to the timers phase.', 'Callback của Promise là microtask, được chạy hết trước khi event loop sang pha timers.'],
    },
  },
  {
    id: 'eventloop-block', ns: 'os-lab', sim: 'eventloop', presets: ['block', 'offload'],
    title: ['Never block the event loop', 'Đừng bao giờ chặn event loop'],
    summary: ['One slow synchronous handler delays every other request; offloading it fixes the latency.', 'Một handler đồng bộ chậm làm trễ mọi request khác; đẩy nó ra ngoài là sửa được độ trễ.'],
    steps: [
      {
        target: 'el-code', do: [{ a: 'el.mode', v: 'block' }, { a: 'el.offload', v: false }, { a: 'player.seek', v: 0 }],
        title: ['A tiny web server', 'Một máy chủ web tí hon'],
        body: ['Four requests arrive 5 ms apart. Request 2 (/report) does 200 ms of synchronous work — say, building a PDF in a loop.', 'Bốn request đến cách nhau 5 ms. Request 2 (/report) làm 200 ms việc đồng bộ — ví dụ dựng PDF bằng một vòng lặp.'],
      },
      {
        target: 'play',
        title: ['Your turn: serve them', 'Đến lượt bạn: phục vụ chúng'],
        body: ['Press Play.', 'Bấm Chạy.'],
        task: { text: ['Play to the end.', 'Chạy tới cuối.'], until: (s) => s.el?.phase === 'done' && s.el?.mode === 'block', solve: [{ a: 'player.speed', v: 2 }, { a: 'player.play', delay: 200 }] },
      },
      {
        target: 'el-requests',
        title: ['Everyone waited', 'Ai cũng phải chờ'],
        body: ['Requests 3 and 4 needed only a millisecond of work, yet they waited ~200 ms: while /report runs, the single JavaScript thread can do nothing else.', 'Request 3 và 4 chỉ cần một mili giây xử lý, vậy mà phải chờ ~200 ms: khi /report chạy, luồng JavaScript duy nhất không làm được gì khác.'],
      },
      {
        target: 'el-options',
        title: ['Your turn: offload it', 'Đến lượt bạn: đẩy nó ra ngoài'],
        body: ['Switch the report handler to "offload (async)" — the heavy work moves to a worker and the main thread stays free.', 'Chuyển handler /report sang "đẩy ra ngoài (async)" — việc nặng chuyển sang worker và luồng chính được rảnh tay.'],
        task: { text: ['Choose offload.', 'Chọn đẩy ra ngoài.'], until: (s) => s.el?.offload === true, solve: [{ a: 'el.offload', v: true, delay: 300 }] },
      },
      {
        target: 'el-requests', do: [{ a: 'player.end', delay: 300 }],
        title: ['Fast again', 'Lại nhanh rồi'],
        body: ['The other requests are answered within a few milliseconds. Rule of thumb: CPU-heavy work goes to worker_threads, a queue or another service.', 'Các request khác được trả lời trong vài mili giây. Quy tắc: việc nặng CPU đưa sang worker_threads, một hàng đợi hoặc một dịch vụ khác.'],
      },
    ],
    quiz: {
      q: ['A Node.js handler runs a 200 ms synchronous loop. What happens to other requests?', 'Một handler Node.js chạy vòng lặp đồng bộ 200 ms. Các request khác ra sao?'],
      options: [['Nothing, Node is asynchronous', 'Không sao, Node bất đồng bộ mà'], ['They all wait up to 200 ms', 'Tất cả phải chờ tới 200 ms'], ['They run on another core automatically', 'Chúng tự chạy trên lõi khác']],
      answer: 1, why: ['There is one JavaScript thread; synchronous code holds it until it finishes.', 'Chỉ có một luồng JavaScript; mã đồng bộ giữ nó tới khi chạy xong.'],
    },
  },
  {
    id: 'deadlock-detect', ns: 'os-lab', sim: 'deadlock', presets: ['detect', 'cycle', 'pool'],
    title: ['Detecting a deadlock', 'Phát hiện deadlock'],
    summary: ['The resource-allocation graph and the detection scan: who can finish, who is stuck.', 'Đồ thị cấp phát tài nguyên và phép quét phát hiện: ai chạy xong được, ai bị kẹt.'],
    steps: [
      {
        target: 'det-graph', do: [{ a: 'deadlock.tab', v: 'detect' }, { a: 'detect.example', v: 'textbook' }, { a: 'player.seek', v: 0 }],
        title: ['The resource-allocation graph', 'Đồ thị cấp phát tài nguyên'],
        body: ['Circles are processes, boxes are resources (each dot is one instance). Solid lines: "holds this instance". Red dashed arrows: "is waiting for this many".', 'Hình tròn là tiến trình, hộp là tài nguyên (mỗi chấm là một bản). Nét liền: "đang giữ bản này". Mũi tên đỏ đứt nét: "đang chờ chừng này bản".'],
      },
      {
        target: 'play',
        title: ['Your turn: run the scan', 'Đến lượt bạn: chạy phép quét'],
        body: ['Press Play. At each step the scan looks for a process whose request can be satisfied by what is free; that process finishes and gives everything back.', 'Bấm Chạy. Mỗi bước, phép quét tìm một tiến trình mà phần đang xin được đáp ứng bằng tài nguyên còn rảnh; tiến trình đó chạy xong và trả lại hết.'],
        task: { text: ['Play the scan to the end.', 'Chạy phép quét tới cuối.'], until: (s) => s.detect?.atEnd === true && s.detect?.key === 'textbook', solve: [{ a: 'player.play', delay: 200 }] },
      },
      {
        target: 'det-table',
        title: ['Everyone waits, nobody is stuck', 'Ai cũng chờ, mà không ai kẹt'],
        body: ['All five processes finish in some order, so there is NO deadlock — even though several were waiting. Waiting is normal; a deadlock is waiting that can never end.', 'Cả năm tiến trình đều xong theo một thứ tự nào đó, nên KHÔNG có deadlock — dù nhiều tiến trình đang chờ. Chờ là bình thường; deadlock là chờ mà không bao giờ kết thúc.'],
      },
      {
        target: 'det-table', do: [{ a: 'detect.example', v: 'p2more' }, { a: 'player.end', delay: 300 }],
        title: ['One more request', 'Thêm một yêu cầu'],
        body: ['P2 asks for just one more C. Now the scan gets stuck: P1, P2, P3 and P4 can never be satisfied. They are deadlocked — the OS must kill one or take resources away.', 'P2 xin thêm đúng một C. Giờ phép quét kẹt lại: P1, P2, P3 và P4 không bao giờ được đáp ứng. Chúng bị deadlock — HĐH phải giết một tiến trình hoặc thu hồi tài nguyên.'],
      },
      {
        target: 'det-graph', do: [{ a: 'detect.example', v: 'pool' }, { a: 'player.end', delay: 300 }],
        title: ['The same bug in your web app', 'Cùng lỗi đó trong ứng dụng web'],
        body: ['A pool of 2 database connections; each request holds one and asks for another inside the handler. Two requests at once = deadlock, and the site hangs.', 'Pool 2 kết nối CSDL; mỗi request giữ một kết nối rồi xin thêm một cái trong handler. Hai request cùng lúc = deadlock, và trang web treo.'],
      },
    ],
    quiz: {
      q: ['Several processes are waiting for resources. Are they deadlocked?', 'Nhiều tiến trình đang chờ tài nguyên. Chúng có bị deadlock không?'],
      options: [['Yes, always', 'Có, luôn luôn'], ['Only if no order lets every one of them eventually finish', 'Chỉ khi không có thứ tự nào để tất cả rốt cuộc chạy xong'], ['Never, the OS prevents it', 'Không bao giờ, HĐH ngăn được']],
      answer: 1, why: ['Detection checks whether some sequence of finishes frees enough for everyone; those left over are deadlocked.', 'Phép phát hiện kiểm xem có thứ tự kết thúc nào giải phóng đủ cho mọi người không; ai còn lại là bị deadlock.'],
    },
  },
  {
    id: 'deadlock-banker', ns: 'os-lab', sim: 'deadlock', presets: ['banker', 'request'],
    title: ['The Banker\'s algorithm', 'Thuật toán Banker'],
    summary: ['Safe states, the safety check by hand, and why a request can be refused even when the resources are free.', 'Trạng thái an toàn, kiểm an toàn bằng tay, và vì sao một yêu cầu có thể bị từ chối dù tài nguyên đang rảnh.'],
    steps: [
      {
        target: 'bank-table', do: [{ a: 'deadlock.tab', v: 'banker' }, { a: 'banker.reset' }, { a: 'player.seek', v: 0 }],
        title: ['The bank\'s ledger', 'Sổ sách của ngân hàng'],
        body: ['Each process declared its MAXIMUM need. Alloc = what it holds now, Need = Max − Alloc = what it may still ask for, Available = what the OS has left.', 'Mỗi tiến trình đã khai nhu cầu TỐI ĐA. Alloc = đang giữ, Need = Max − Alloc = còn có thể xin thêm, Available = phần HĐH còn lại.'],
      },
      {
        target: 'play',
        title: ['Your turn: is it safe?', 'Đến lượt bạn: có an toàn không?'],
        body: ['Press Play. The check looks for a process whose Need fits in Available, lets it finish and adds its Alloc back to Available — exactly the method you use in the exam.', 'Bấm Chạy. Phép kiểm tìm một tiến trình có Need vừa với Available, cho nó chạy xong rồi cộng Alloc của nó trả lại Available — đúng cách bạn làm trong bài thi.'],
        task: { text: ['Play the safety check to the end.', 'Chạy phép kiểm an toàn tới cuối.'], until: (s) => s.banker?.atEnd === true && s.banker?.verdict === '', solve: [{ a: 'player.play', delay: 200 }] },
      },
      {
        target: 'bank-sequence',
        title: ['A safe sequence', 'Một dãy an toàn'],
        body: ['Everyone can finish in this order, so the state is SAFE. The order shown is one valid answer; there can be others.', 'Ai cũng chạy xong được theo thứ tự này, nên trạng thái AN TOÀN. Thứ tự hiện ra là một đáp án đúng; có thể còn đáp án khác.'],
      },
      {
        target: 'bank-request',
        title: ['Your turn: P1 asks for (1,0,2)', 'Đến lượt bạn: P1 xin (1,0,2)'],
        body: ['Choose P1, type 1 0 2 and press Request. The OS pretends to grant it and runs the safety check again.', 'Chọn P1, gõ 1 0 2 rồi bấm Xin. HĐH giả vờ cấp rồi chạy lại phép kiểm an toàn.'],
        task: { text: ['Request (1,0,2) for P1.', 'Xin (1,0,2) cho P1.'], until: (s) => s.banker?.verdict === 'grant' && s.banker?.who === 1, solve: [{ a: 'banker.request', v: [1, [1, 0, 2]], delay: 400 }] },
      },
      {
        target: 'bank-request', do: [{ a: 'banker.request', v: [0, [0, 2, 0]], delay: 300 }],
        title: ['Refused although available', 'Bị từ chối dù còn tài nguyên'],
        body: ['Now P0 asks for (0,2,0). The resources ARE there — but after pretending to grant them, no safe sequence remains. The Banker says no, and P0 waits.', 'Giờ P0 xin (0,2,0). Tài nguyên CÓ sẵn — nhưng giả vờ cấp xong thì không còn dãy an toàn nào. Banker từ chối, và P0 phải chờ.'],
      },
    ],
    quiz: {
      q: ['Why would the Banker refuse a request when the resources are free?', 'Vì sao Banker từ chối một yêu cầu khi tài nguyên đang rảnh?'],
      options: [['Because granting it would leave no safe sequence', 'Vì cấp xong sẽ không còn dãy an toàn'], ['Because the process asked too early', 'Vì tiến trình xin quá sớm'], ['It never does that', 'Nó không bao giờ làm thế']],
      answer: 0, why: ['Unsafe is not yet deadlocked, but the OS could no longer guarantee that everyone finishes.', 'Không an toàn chưa phải deadlock, nhưng HĐH không còn bảo đảm được ai cũng chạy xong.'],
    },
  },
];
