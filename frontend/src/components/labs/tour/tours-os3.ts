/**
 * Kịch bản hướng dẫn từng bước cho đợt mô phỏng #4 của phòng lab OS (29/10/2026): luyện đề Gantt, tay đĩa, tách bit địa
 * chỉ (Ch16), Amdahl + false sharing (Ch4), flame graph + coordinated omission (Ch15). Viết cho người mới; mọi con số
 * trong lời thoại lấy từ engine/output thật của lab (đã kiểm bằng engine/*.test.ts) — không bịa.
 */
import type { Tour } from './types';

const step = (n: number, delay = 650) => ({ a: 'player.step', delay, upTo: n });

export const OS3_TOURS: Tour[] = [
  // ───────────────────────── gantt-exam ─────────────────────────
  {
    id: 'gantt-exam-grade', ns: 'os-lab', sim: 'gantt-exam', presets: ['sjf', 'srtf', 'prio', 's1', 'random'],
    title: ['Solve a scheduling question and get it graded', 'Tự giải một câu lập lịch và được chấm'],
    summary: ['Paint the Gantt chart for SJF yourself, fill the table, get every cell graded, then replay the worked solution.', 'Tự tô biểu đồ Gantt cho SJF, điền bảng, được chấm từng ô, rồi xem lại lời giải từng bước.'],
    steps: [
      {
        target: 'gx-jobs', do: [{ a: 'gx.drill', v: 's2' }, { a: 'gx.policy', v: 'sjf' }, { a: 'gx.mode', v: 'exam' }],
        title: ['The question', 'Đề bài'],
        body: ['Bài S2 of Chapter 16: five processes arrive at different times. Policy: SJF, NOT preemptive — once a job starts, it runs to the end.', 'Bài S2 của Chương 16: năm tiến trình đến vào các lúc khác nhau. Chính sách: SJF, KHÔNG cắt ngang — việc đã chạy là chạy tới hết.'],
      },
      {
        target: 'gx-rules',
        title: ['Write the tie rules first', 'Ghi luật hoà ra trước'],
        body: ['Exams lose most marks on ties. Here: equal burst ⇒ the earlier arrival wins, then the one higher in the table. Copy these lines onto your paper before drawing anything.', 'Đề thi mất điểm nhiều nhất ở chỗ hoà. Ở đây: bằng thời gian CPU ⇒ ai đến sớm hơn thắng, rồi tới ai đứng trên trong bảng. Chép mấy dòng này ra giấy trước khi vẽ gì.'],
      },
      {
        target: 'step',
        title: ['Your turn: walk the clock', 'Đến lượt bạn: đi theo đồng hồ'],
        body: ['Press Step twice. The box tells you who ARRIVES at each moment — it never tells you who runs. That part is yours.', 'Bấm Bước hai lần. Ô giải thích cho biết ai ĐẾN ở mỗi thời điểm — nó không bao giờ nói ai chạy. Phần đó là của bạn.'],
        task: { text: ['Step to t = 2.', 'Bấm Bước tới t = 2.'], until: (s) => ((s.gx?.i as number) ?? 0) >= 2, solve: [step(2)] },
      },
      {
        target: 'gx-grid',
        title: ['Your turn: paint the first job', 'Đến lượt bạn: tô việc đầu tiên'],
        body: ['At t = 0 only P1 is there, so P1 starts — and SJF will not stop it. Pick the P1 brush and drag across the first 7 cells (its burst is 7).', 'Lúc t = 0 chỉ có P1, nên P1 chạy — và SJF sẽ không dừng nó. Chọn bút P1 và kéo qua 7 ô đầu (thời gian CPU của nó là 7).'],
        task: { text: ['Paint cells 0–6 with P1.', 'Tô ô 0–6 bằng P1.'], until: (s) => ((s.gx?.filled as number) ?? 0) >= 7, solve: [{ a: 'gx.paint', v: 'P1:0:7' }] },
      },
      {
        target: 'gx-grid',
        title: ['Your turn: the rest of the chart', 'Đến lượt bạn: phần còn lại'],
        body: ['At t = 7 everyone has arrived. Shortest first: P3 (1), then P5 (3), then P2 and P4 both need 4 — P2 arrived earlier. Paint until all 19 cells are filled.', 'Lúc t = 7 mọi người đã đến. Ngắn nhất trước: P3 (1), rồi P5 (3), rồi P2 và P4 đều cần 4 — P2 đến sớm hơn. Tô tới khi đủ 19 ô.'],
        task: { text: ['Fill all 19 cells.', 'Tô đủ 19 ô.'], until: (s) => s.gx?.filled === s.gx?.end, solve: [{ a: 'gx.paint', v: 'P3:7:8', delay: 300 }, { a: 'gx.paint', v: 'P5:8:11', delay: 300 }, { a: 'gx.paint', v: 'P2:11:15', delay: 300 }, { a: 'gx.paint', v: 'P4:15:19', delay: 300 }] },
      },
      {
        target: 'gx-check',
        title: ['Your turn: fill the table and check', 'Đến lượt bạn: điền bảng rồi chấm'],
        body: ['Read the finish times off your chart, then turnaround = finish − arrival and waiting = turnaround − burst. Press "Check my answer".', 'Đọc lúc xong từ biểu đồ của bạn, rồi turnaround = xong − đến và waiting = turnaround − CPU. Bấm "Chấm bài".'],
        task: { text: ['Fill the table and press Check.', 'Điền bảng và bấm Chấm bài.'], until: (s) => s.gx?.graded === true, solve: [{ a: 'gx.fill', delay: 300 }, { a: 'gx.check', delay: 500 }] },
      },
      {
        target: 'gx-score',
        title: ['Graded cell by cell', 'Chấm từng ô'],
        body: ['Every chart cell and every table entry is a point. A wrong cell turns red with the right job in its corner, and if your mistakes match a known wrong convention, the box above names it.', 'Mỗi ô biểu đồ và mỗi ô trong bảng là một điểm. Ô sai chuyển đỏ, góc ghi việc đúng; và nếu lỗi của bạn khớp một quy ước sai quen thuộc, ô phía trên gọi đúng tên nó.'],
      },
      {
        target: 'gx-mode',
        title: ['Your turn: the worked solution', 'Đến lượt bạn: xem lời giải'],
        body: ['Switch to "Worked solution" and play it to the end. At every time step it says who arrived, who is in the ready queue and why one was picked.', 'Chuyển sang "Lời giải" và chạy tới cuối. Ở mỗi thời điểm nó nói ai vừa đến, ai đang trong hàng sẵn sàng và vì sao chọn người đó.'],
        task: { text: ['Open the worked solution and run it to the end.', 'Mở lời giải và chạy tới cuối.'], until: (s) => s.gx?.mode === 'solution' && s.gx?.atEnd === true, solve: [{ a: 'gx.mode', v: 'solution', delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
      {
        target: 'gx-table',
        title: ['47/5 and 28/5', '47/5 và 28/5'],
        body: ['Average turnaround = 47/5 = 9.40, average waiting = 28/5 = 5.60 — exactly what osgcalc.py printed in the lab. Write the fraction too: examiners like to see the sum.', 'Turnaround trung bình = 47/5 = 9,40, waiting trung bình = 28/5 = 5,60 — đúng như osgcalc.py in ra trong lab. Ghi cả phân số: người chấm thích thấy tổng.'],
      },
    ],
    quiz: {
      q: ['Two jobs with the same burst arrive at the same time. Which one does SJF pick?', 'Hai việc cùng thời gian CPU đến cùng lúc. SJF chọn việc nào?'],
      options: [['The one listed first in the table', 'Việc đứng trước trong bảng'], ['The one listed last', 'Việc đứng sau cùng'], ['Either — it does not matter for the averages', 'Việc nào cũng được — không ảnh hưởng trung bình']],
      answer: 0, why: ['That is the tie rule of Chapter 16 (and osgcalc.py). The choice CAN change individual waiting times, so it matters for the table.', 'Đó là luật hoà của Chương 16 (và osgcalc.py). Lựa chọn này CÓ THỂ đổi thời gian chờ từng việc, nên nó quan trọng với bảng.'],
    },
  },
  {
    id: 'gantt-exam-rr', ns: 'os-lab', sim: 'gantt-exam', presets: ['rr'],
    title: ['Round robin: the queue-order trap', 'Round robin: cái bẫy thứ tự hàng đợi'],
    summary: ['See a classic wrong RR chart get graded, find the exact moment where the convention matters, then fix it.', 'Xem một biểu đồ RR sai kinh điển bị chấm, tìm đúng thời điểm quy ước quyết định, rồi sửa lại.'],
    steps: [
      {
        target: 'gx-rules', do: [{ a: 'gx.drill', v: 's2' }, { a: 'gx.policy', v: 'rr' }, { a: 'gx.quantum', v: 3 }, { a: 'gx.mode', v: 'exam' }],
        title: ['One rule decides everything', 'Một luật quyết định tất cả'],
        body: ['Round robin, quantum 3. The rule to remember: a job that ARRIVES at time t joins the queue BEFORE the job whose quantum ends at t.', 'Round robin, quantum 3. Luật cần nhớ: việc ĐẾN đúng lúc t vào hàng TRƯỚC việc hết quantum lúc t.'],
      },
      {
        target: 'gx-grid', do: [{ a: 'gx.wrong', v: 'rr-order', delay: 300 }, { a: 'gx.check', delay: 500 }],
        title: ['A classmate\'s answer', 'Bài làm của một bạn'],
        body: ['Here is a chart drawn with the opposite habit — the preempted job goes back in line first. It looks reasonable. It has just been graded.', 'Đây là một biểu đồ vẽ theo thói quen ngược lại — việc bị cắt quay lại hàng trước. Trông có vẻ hợp lý. Nó vừa được chấm.'],
      },
      {
        target: 'explain',
        title: ['The slip has a name', 'Lỗi này có tên'],
        body: ['The red cells start at t = 13, and the box says why: "rr-order". It comes from ONE decision at t = 6: P2 and P5 swap places in the queue, so their finish times move — their rows and both averages are wrong too (26/36).', 'Các ô đỏ bắt đầu từ t = 13, và ô giải thích nói vì sao: "thứ tự RR". Gốc là MỘT quyết định lúc t = 6: P2 và P5 đổi chỗ trong hàng, nên lúc xong của chúng dời đi — hai dòng đó và cả hai số trung bình cũng sai (26/36).'],
      },
      {
        target: 'gx-mode',
        title: ['Your turn: go to t = 6', 'Đến lượt bạn: tới t = 6'],
        body: ['Open the worked solution and step to t = 6.', 'Mở lời giải và bấm Bước tới t = 6.'],
        task: { text: ['Worked solution, t = 6.', 'Lời giải, t = 6.'], until: (s) => s.gx?.mode === 'solution' && ((s.player?.i as number) ?? 0) >= 6, solve: [{ a: 'gx.mode', v: 'solution', delay: 300 }, { a: 'player.seek', v: 6, delay: 400 }] },
      },
      {
        target: 'gx-queue',
        title: ['P5 jumps ahead of P2', 'P5 chen trước P2'],
        body: ['At t = 6 two things happen together: P5 arrives, and P2 uses up its quantum. The newcomer goes first: before the pick the queue is P3, P1, P4, P5, P2 — P3 runs, and P5 will get the CPU before P2.', 'Lúc t = 6 hai việc xảy ra cùng lúc: P5 đến, và P2 dùng hết quantum. Việc mới đến đứng trước: trước khi chọn, hàng là P3, P1, P4, P5, P2 — P3 chạy, và P5 sẽ được CPU trước P2.'],
      },
      {
        target: 'gx-check', do: [{ a: 'gx.mode', v: 'exam' }],
        title: ['Your turn: full marks', 'Đến lượt bạn: điểm tối đa'],
        body: ['Back in "Do it myself" (the wrong answer is still there): fix the chart and the table, and check again until you get every point.', 'Đã quay về "Tự làm" (bài sai vẫn còn đó): sửa biểu đồ và bảng, rồi chấm lại tới khi được trọn điểm.'],
        task: { text: ['Get full marks.', 'Được điểm tối đa.'], until: (s) => s.gx?.full === true, solve: [{ a: 'gx.mode', v: 'exam', delay: 300 }, { a: 'gx.fill', delay: 300 }, { a: 'gx.check', delay: 500 }] },
      },
    ],
    quiz: {
      q: ['RR, quantum 2. At t = 4, A\'s quantum ends and B arrives. Who is in front of the queue?', 'RR, quantum 2. Lúc t = 4, A hết quantum và B vừa đến. Ai đứng trước trong hàng?'],
      options: [['B, the newcomer', 'B, việc mới đến'], ['A, the job just preempted', 'A, việc vừa bị cắt'], ['Whichever has less work left', 'Việc nào còn ít việc hơn']],
      answer: 0, why: ['Textbook (and Chapter 16) convention: arrivals at t are queued before the job preempted at t. Some exams state otherwise — then say which rule you use.', 'Quy ước giáo trình (và Chương 16): việc đến lúc t vào hàng trước việc bị cắt lúc t. Đề nào nói khác thì ghi rõ bạn dùng luật nào.'],
    },
  },

  // ───────────────────────── disk-arm ─────────────────────────
  {
    id: 'disk-arm-cscan', ns: 'os-lab', sim: 'disk-arm', presets: ['cscan', 'scan', 'look', 'clook', 'fcfs', 'sstf'],
    title: ['C-SCAN: 385 or 186?', 'C-SCAN: 385 hay 186?'],
    summary: ['Follow the arm through the Chapter 16 question and see why two correct answers differ by exactly 199.', 'Theo tay đĩa qua bài của Chương 16 và xem vì sao hai đáp án đúng chênh nhau đúng 199.'],
    steps: [
      {
        target: 'disk-platter', do: [{ a: 'disk.exam', v: false }, { a: 'disk.algo', v: 'cscan' }, { a: 'disk.up', v: true }, { a: 'disk.ret', v: true }],
        title: ['A disk from above', 'Một mặt đĩa nhìn từ trên'],
        body: ['Blue rings are the pending requests (cylinders 45, 132, 12, 98, 181, 67, 140, 30). The orange head sits at 80 and is moving up — towards the inside, cylinder 199.', 'Các vòng xanh là yêu cầu đang chờ (trụ 45, 132, 12, 98, 181, 67, 140, 30). Đầu đọc màu cam ở trụ 80 và đang đi lên — vào phía trong, trụ 199.'],
      },
      {
        target: 'step',
        title: ['Your turn: sweep up', 'Đến lượt bạn: quét lên'],
        body: ['Press Step until the head reaches 181, the highest request. Watch the counter add 18, 34, 8, 41.', 'Bấm Bước tới khi đầu đọc tới 181, yêu cầu cao nhất. Xem bộ đếm cộng 18, 34, 8, 41.'],
        task: { text: ['Step to cylinder 181.', 'Bấm Bước tới trụ 181.'], until: (s) => s.disk?.cyl === 181, solve: [step(4)] },
      },
      {
        target: 'disk-path',
        title: ['Your turn: to the edge', 'Đến lượt bạn: tới mép'],
        body: ['Nothing above 181 — yet C-SCAN keeps going to the very edge. One more Step.', 'Phía trên 181 không còn gì — vậy mà C-SCAN vẫn chạy tới tận mép. Bấm Bước thêm một lần.'],
        task: { text: ['Step to the edge, 199.', 'Bấm Bước tới mép, 199.'], until: (s) => s.disk?.cyl === 199, solve: [step(1)] },
      },
      {
        target: 'disk-path',
        title: ['Your turn: the jump', 'Đến lượt bạn: cú nhảy'],
        body: ['Step once more: the head flies back to cylinder 0 without serving anything (dashed line), then sweeps up again: 12, 30, 45, 67.', 'Bấm Bước thêm: đầu đọc bay về trụ 0 mà không phục vụ gì (nét đứt), rồi lại quét lên: 12, 30, 45, 67.'],
        task: { text: ['Step past the jump to 0.', 'Bấm Bước qua cú nhảy về 0.'], until: (s) => s.disk?.cyl === 0, solve: [step(1)] },
      },
      {
        target: 'disk-sum',
        title: ['Your turn: finish', 'Đến lượt bạn: đi hết'],
        body: ['Play to the end and read the sum.', 'Chạy tới cuối và đọc tổng.'],
        task: { text: ['Run to the end.', 'Chạy tới cuối.'], until: (s) => s.disk?.atEnd === true && s.disk?.total === 385, solve: [{ a: 'player.end', delay: 300 }] },
      },
      {
        target: 'disk-opts',
        title: ['Your turn: the other convention', 'Đến lượt bạn: quy ước kia'],
        body: ['385 counts the 199-cylinder return jump, like osgcalc.py and Chapter 16. Some books leave it out. Switch "return jump" to "not counted".', '385 là có tính 199 trụ của cú nhảy quay về, như osgcalc.py và Chương 16. Vài sách bỏ phần đó. Chuyển "cú nhảy về" sang "không tính".'],
        task: { text: ['Do not count the return jump.', 'Không tính cú nhảy về.'], until: (s) => s.disk?.countReturn === false && s.disk?.total === 186, solve: [{ a: 'disk.ret', v: false }] },
      },
      {
        target: 'disk-compare',
        title: ['186 — and say which rule you used', '186 — và ghi rõ dùng luật nào'],
        body: ['Same path, 385 − 199 = 186. Both are right under their rule, so write the rule in your answer. The six totals on this question: FCFS 708, SSTF 237, SCAN 306, LOOK 270, C-SCAN 385, C-LOOK 325.', 'Cùng đường đi, 385 − 199 = 186. Cả hai đều đúng theo luật của nó, nên hãy ghi luật vào bài. Sáu tổng của đề này: FCFS 708, SSTF 237, SCAN 306, LOOK 270, C-SCAN 385, C-LOOK 325.'],
      },
    ],
    quiz: {
      q: ['Why would anyone pick C-SCAN over SCAN, if it moves more?', 'Sao lại chọn C-SCAN thay vì SCAN, khi nó đi xa hơn?'],
      options: [['More uniform waiting: requests near the edges are not served twice as rarely', 'Thời gian chờ đều hơn: yêu cầu gần mép không bị phục vụ thưa gấp đôi'], ['It is always faster', 'Nó luôn nhanh hơn'], ['SSDs need it', 'SSD cần nó']],
      answer: 0, why: ['SCAN passes the middle twice per round trip but each edge once. C-SCAN treats the disk as a circle, so every cylinder waits about the same.', 'SCAN đi qua vùng giữa hai lần mỗi vòng nhưng mỗi mép chỉ một lần. C-SCAN coi đĩa như một vòng tròn, nên trụ nào cũng chờ gần như nhau.'],
    },
  },
  {
    id: 'disk-arm-exam', ns: 'os-lab', sim: 'disk-arm', presets: ['exam'],
    title: ['Exam mode: compute it, then name it', 'Chế độ thi: tự tính, rồi gọi tên'],
    summary: ['Work out a SCAN total on your own with the path hidden, then recognise an algorithm from the order it visited.', 'Tự tính tổng SCAN khi đường đi bị ẩn, rồi nhận ra thuật toán từ thứ tự nó đi.'],
    steps: [
      {
        target: 'disk-path', do: [{ a: 'disk.exam', v: true }, { a: 'disk.algo', v: 'scan' }, { a: 'disk.up', v: true }],
        title: ['The path is hidden', 'Đường đi bị ẩn'],
        body: ['Only the head (80) and the requests are shown. SCAN, moving up, on a 0–199 disk.', 'Chỉ hiện đầu đọc (80) và các yêu cầu. SCAN, đang đi lên, đĩa 0–199.'],
      },
      {
        target: 'disk-exam',
        title: ['Your turn: answer', 'Đến lượt bạn: trả lời'],
        body: ['Up first: 98, 132, 140, 181, then to the edge 199, then down: 67, 45, 30, 12. Type the order and the total, then press Check.', 'Đi lên trước: 98, 132, 140, 181, rồi tới mép 199, rồi đi xuống: 67, 45, 30, 12. Gõ thứ tự và tổng rồi bấm Chấm.'],
        task: { text: ['Get the SCAN answer right.', 'Trả lời đúng bài SCAN.'], until: (s) => s.disk?.correct === true, solve: [{ a: 'disk.answer', delay: 300 }, { a: 'disk.check', delay: 400 }], hint: ['18 + 34 + 8 + 41 + 18 + 132 + 22 + 15 + 18 = ?', '18 + 34 + 8 + 41 + 18 + 132 + 22 + 15 + 18 = ?'] },
      },
      {
        target: 'disk-guess',
        title: ['Your turn: which algorithm?', 'Đến lượt bạn: thuật toán nào?'],
        body: ['80, 98, 132, 140, 181, 12, 30, 45, 67: it turned at 181 (not 199) and then jumped to the LOWEST request and went up again. Pick the algorithm.', '80, 98, 132, 140, 181, 12, 30, 45, 67: nó quay ở 181 (không phải 199) rồi nhảy về yêu cầu THẤP NHẤT và đi lên tiếp. Chọn thuật toán.'],
        task: { text: ['Name the algorithm.', 'Gọi tên thuật toán.'], until: (s) => s.disk?.guessOk === true, solve: [{ a: 'disk.guess', v: 'clook' }] },
      },
    ],
    quiz: {
      q: ['Head at 80, moving DOWN. LOOK gives 237. Which other algorithm gives the same 237 here?', 'Đầu đọc ở 80, đi XUỐNG. LOOK cho 237. Thuật toán nào khác cũng cho 237 ở đề này?'],
      options: [['SSTF', 'SSTF'], ['SCAN', 'SCAN'], ['C-LOOK', 'C-LOOK']],
      answer: 0, why: ['SSTF happened to pick 67, 45, 30, 12, then 98…181 — the same order (Ch16 K1.4). Direction is part of the question: always state it.', 'SSTF tình cờ chọn 67, 45, 30, 12, rồi 98…181 — cùng thứ tự (Ch16 K1.4). Hướng đi là một phần của đề: luôn ghi rõ.'],
    },
  },

  // ───────────────────────── addr-split ─────────────────────────
  {
    id: 'addr-split-walk', ns: 'os-lab', sim: 'addr-split', presets: ['split', 'x64'],
    title: ['Split an address like the exam wants', 'Tách địa chỉ đúng kiểu đề thi'],
    summary: ['Hex to binary, offset first, then one index per table level, then the walk — and why 8/12/12 is the easy case.', 'Hex sang nhị phân, offset trước, rồi mỗi cấp bảng một chỉ số, rồi đi bảng — và vì sao 8/12/12 là trường hợp dễ.'],
    steps: [
      {
        target: 'addr-bits', do: [{ a: 'addr.view', v: 'split' }, { a: 'addr.va', v: '0x12345678' }, { a: 'addr.bits', v: '10,10,12' }],
        title: ['32 bits, three jobs', '32 bit, ba nhiệm vụ'],
        body: ['0x12345678 with a 10/10/12 split: the top 10 bits pick an entry in the top-level table, the next 10 an entry in a second-level table, the low 12 are the offset inside a 4 KiB page.', '0x12345678 tách 10/10/12: 10 bit cao chọn một mục trong bảng cấp trên, 10 bit kế chọn một mục trong bảng cấp hai, 12 bit thấp là offset bên trong một trang 4 KiB.'],
      },
      {
        target: 'step',
        title: ['Your turn: offset first', 'Đến lượt bạn: offset trước'],
        body: ['Press Step twice: first the hex becomes binary (one hex digit = 4 bits), then the offset is read from the right.', 'Bấm Bước hai lần: trước tiên hex thành nhị phân (một chữ số hex = 4 bit), rồi đọc offset từ bên phải.'],
        task: { text: ['Step to the offset.', 'Bấm Bước tới offset.'], until: (s) => ((s.addr?.i as number) ?? 0) >= 1, solve: [step(1)] },
      },
      {
        target: 'addr-bits',
        title: ['1656 = 0x678', '1656 = 0x678'],
        body: ['The low 12 bits are exactly the last 3 hex digits: 0x678 = 1656. When the offset is a multiple of 4 bits, you can read it straight from the hex.', '12 bit thấp chính là 3 chữ số hex cuối: 0x678 = 1656. Khi offset là bội của 4 bit, đọc thẳng từ hex được luôn.'],
      },
      {
        target: 'play',
        title: ['Your turn: the indexes and the walk', 'Đến lượt bạn: các chỉ số và đi bảng'],
        body: ['Play to the end: PT1 = 72, PT2 = 837 — the same numbers osgcalc.py printed — then the walk to the frame.', 'Chạy tới cuối: PT1 = 72, PT2 = 837 — đúng như osgcalc.py in ra — rồi đi bảng tới khung.'],
        task: { text: ['Run to the end.', 'Chạy tới cuối.'], until: (s) => s.addr?.atEnd === true && s.addr?.idx === '72/837/1656', solve: [{ a: 'player.end', delay: 300 }] },
      },
      {
        target: 'addr-walk',
        title: ['Two extra memory reads', 'Thêm hai lần đọc bộ nhớ'],
        body: ['Without the TLB every access would read the level-1 table, then the level-2 table, then the data. The frame number shown is an example — in a real system it comes from the table.', 'Không có TLB thì mỗi lần truy cập phải đọc bảng cấp 1, rồi bảng cấp 2, rồi mới tới dữ liệu. Số khung hiện ra là ví dụ — ở máy thật nó đến từ bảng.'],
      },
      {
        target: 'addr-input',
        title: ['Your turn: the final-exam address', 'Đến lượt bạn: địa chỉ của bài thi cuối khoá'],
        body: ['Type 0xABCDE123 and choose 8/12/12. When every field is a multiple of 4 bits, each one is just a group of hex digits.', 'Gõ 0xABCDE123 và chọn 8/12/12. Khi mọi trường đều là bội của 4 bit, mỗi trường chỉ là một nhóm chữ số hex.'],
        task: { text: ['0xABCDE123, 8/12/12.', '0xABCDE123, 8/12/12.'], until: (s) => s.addr?.bits === '8/12/12' && s.addr?.idx === '171/3294/291', solve: [{ a: 'addr.va', v: '0xABCDE123', delay: 300 }, { a: 'addr.bits', v: '8,12,12', delay: 300 }] },
      },
      {
        target: 'addr-bits',
        title: ['0xAB · 0xCDE · 0x123', '0xAB · 0xCDE · 0x123'],
        body: ['171, 3294, 291. With 10/10/12 the same address gives 687, 222, 291 — the bit widths decide everything, so copy them from the question carefully.', '171, 3294, 291. Tách 10/10/12 thì cùng địa chỉ cho 687, 222, 291 — độ rộng bit quyết định tất cả, nên chép từ đề thật cẩn thận.'],
      },
    ],
    quiz: {
      q: ['A 32-bit address, 4 KiB pages. How many bits is the offset?', 'Địa chỉ 32 bit, trang 4 KiB. Offset có mấy bit?'],
      options: [['12', '12'], ['4', '4'], ['20', '20']],
      answer: 0, why: ['4 KiB = 4096 = 2^12 bytes, so 12 bits address a byte inside the page; the other 20 bits are the page number.', '4 KiB = 4096 = 2^12 byte, nên 12 bit đủ chỉ một byte trong trang; 20 bit còn lại là số trang.'],
    },
  },
  {
    id: 'addr-split-size', ns: 'os-lab', sim: 'addr-split', presets: ['table', 'tlb', 'seg'],
    title: ['Table size, TLB and segmentation', 'Cỡ bảng trang, TLB và phân đoạn'],
    summary: ['Why one-level tables do not scale, what a TLB miss costs with 4 levels, and when segmentation traps.', 'Vì sao bảng một mức không mở rộng được, một lần trượt TLB với 4 mức tốn bao nhiêu, và khi nào phân đoạn gây trap.'],
    steps: [
      {
        target: 'addr-table', do: [{ a: 'addr.view', v: 'table' }, { a: 'addr.vabits', v: 32 }, { a: 'addr.page', v: 12 }, { a: 'addr.pte', v: 4 }],
        title: ['One entry per page', 'Mỗi trang một mục'],
        body: ['32-bit addresses, 4 KiB pages, 4-byte entries: 2^20 pages ⇒ a flat table of 4 MiB per process.', 'Địa chỉ 32 bit, trang 4 KiB, mục 4 byte: 2^20 trang ⇒ bảng phẳng 4 MiB cho mỗi tiến trình.'],
      },
      {
        target: 'play',
        title: ['Your turn: the multi-level way', 'Đến lượt bạn: cách nhiều mức'],
        body: ['Play to the end and compare the two KPIs.', 'Chạy tới cuối và so hai ô số.'],
        task: { text: ['Run to the end.', 'Chạy tới cuối.'], until: (s) => s.addr?.view === 'table' && s.addr?.atEnd === true, solve: [{ a: 'player.end', delay: 300 }] },
      },
      {
        target: 'addr-table',
        title: ['4 MiB vs 12 KiB', '4 MiB vs 12 KiB'],
        body: ['A small process needs only the top table plus two second-level tables (code at the bottom, stack at the top): 3 × 4 KiB. Unused parts of the address space cost nothing.', 'Một tiến trình nhỏ chỉ cần bảng cấp trên cộng hai bảng cấp hai (mã ở đáy, stack ở đỉnh): 3 × 4 KiB. Phần không dùng của không gian địa chỉ không tốn gì.'],
      },
      {
        target: 'addr-input',
        title: ['Your turn: four levels', 'Đến lượt bạn: bốn mức'],
        body: ['Open "TLB · EAT" and set the table levels to 4 (x86-64 and arm64 use 4). Keep 95 % hits.', 'Mở "TLB · EAT" và đặt số mức bảng là 4 (x86-64 và arm64 dùng 4). Giữ tỉ lệ trúng 95 %.'],
        task: { text: ['TLB view, 4 levels.', 'Trang TLB, 4 mức.'], until: (s) => s.addr?.view === 'tlb' && s.addr?.levels === 4 && s.addr?.eat === 106, solve: [{ a: 'addr.view', v: 'tlb', delay: 300 }, { a: 'addr.hit', v: 95 }, { a: 'addr.levels', v: 4, delay: 300 }] },
      },
      {
        target: 'addr-table',
        title: ['106 ns instead of 80', '106 ns thay vì 80'],
        body: ['A miss now costs 10 + 4 × 80 + 80 = 410 ns, but only 5 % of accesses miss: 0.95 × 90 + 0.05 × 410 = 106 ns.', 'Một lần trượt giờ tốn 10 + 4 × 80 + 80 = 410 ns, nhưng chỉ 5 % truy cập trượt: 0,95 × 90 + 0,05 × 410 = 106 ns.'],
      },
      {
        target: 'addr-input',
        title: ['Your turn: a worse TLB', 'Đến lượt bạn: TLB kém hơn'],
        body: ['Drag the hit rate down to 80 %.', 'Kéo tỉ lệ trúng xuống 80 %.'],
        task: { text: ['Hit rate 80 %.', 'Tỉ lệ trúng 80 %.'], until: (s) => s.addr?.hit === 80 && s.addr?.eat === 154, solve: [{ a: 'addr.hit', v: 80 }] },
      },
      {
        target: 'addr-input',
        title: ['Your turn: a segment overflow', 'Đến lượt bạn: tràn đoạn'],
        body: ['154 ns: almost twice plain memory. Now open "segmentation" and try segment 1, offset 130.', '154 ns: gần gấp đôi bộ nhớ thường. Giờ mở "phân đoạn" và thử đoạn 1, offset 130.'],
        task: { text: ['Segment 1, offset 130.', 'Đoạn 1, offset 130.'], until: (s) => s.addr?.view === 'seg' && s.addr?.seg === 1 && s.addr?.off === 130, solve: [{ a: 'addr.view', v: 'seg', delay: 300 }, { a: 'addr.seg', v: '1:130', delay: 300 }] },
      },
      {
        target: 'addr-table', do: [{ a: 'player.end', delay: 300 }],
        title: ['TRAP', 'TRAP'],
        body: ['Segment 1 is only 120 bytes long; 130 ≥ 120, so the hardware raises an addressing error before forming any physical address. Check the limit FIRST, then add the base.', 'Đoạn 1 chỉ dài 120 byte; 130 ≥ 120, nên phần cứng báo lỗi địa chỉ trước khi tạo ra địa chỉ vật lý nào. Kiểm limit TRƯỚC, rồi mới cộng base.'],
      },
    ],
    quiz: {
      q: ['Why do multi-level page tables save memory?', 'Vì sao bảng trang nhiều mức tiết kiệm bộ nhớ?'],
      options: [['Sub-tables for unused address ranges are simply not allocated', 'Bảng con cho vùng địa chỉ không dùng đơn giản là không được cấp'], ['They compress the entries', 'Chúng nén các mục lại'], ['They use bigger pages', 'Chúng dùng trang lớn hơn']],
      answer: 0, why: ['A top-level entry marked "not present" stands for a whole missing sub-table. Most of a process\'s address space is unused.', 'Một mục cấp trên ghi "không có mặt" thay cho cả một bảng con không tồn tại. Phần lớn không gian địa chỉ của tiến trình bỏ trống.'],
    },
  },

  // ───────────────────────── amdahl ─────────────────────────
  {
    id: 'amdahl-ceiling', ns: 'os-lab', sim: 'amdahl', presets: ['amdahl', 'gustafson', 'hetero'],
    title: ['The serial part sets the ceiling', 'Phần tuần tự đặt ra cái trần'],
    summary: ['Compare Amdahl\'s law with the speedups measured in the lab, see the 1/s ceiling, then two ways around it.', 'So định luật Amdahl với speedup đo thật trong lab, thấy cái trần 1/s, rồi hai cách đi vòng qua nó.'],
    steps: [
      {
        target: 'amd-chart', do: [{ a: 'amd.view', v: 'amdahl' }, { a: 'amd.s', v: 0.1 }],
        title: ['10 % that cannot be split', '10 % không chia được'],
        body: ['The program does 10 % of its work on one thread and 90 % in parallel. Blue line: Amdahl\'s prediction. Circles: what ./amdahl really did on the 10-core lab machine.', 'Chương trình làm 10 % việc trên một luồng và 90 % song song. Đường xanh: dự đoán của Amdahl. Vòng tròn: ./amdahl chạy thật trên máy lab 10 lõi.'],
      },
      {
        target: 'step',
        title: ['Your turn: up to 10 cores', 'Đến lượt bạn: lên 10 lõi'],
        body: ['Press Step until n = 10.', 'Bấm Bước tới n = 10.'],
        task: { text: ['Step to n = 10.', 'Bấm Bước tới n = 10.'], until: (s) => s.amd?.n === 10, solve: [step(4)] },
      },
      {
        target: 'amd-kpi',
        title: ['5.26× predicted, 4.97× measured', 'Dự đoán 5,26×, đo được 4,97×'],
        body: ['Ten cores, barely five times faster. The real machine is a little worse than the formula: threads still have to be created, joined and fed from memory.', 'Mười lõi mà nhanh chưa tới năm lần. Máy thật kém hơn công thức một chút: luồng vẫn phải được tạo, chờ gộp và được nạp dữ liệu từ bộ nhớ.'],
      },
      {
        target: 'amd-sliders',
        title: ['Your turn: 25 % serial', 'Đến lượt bạn: 25 % tuần tự'],
        body: ['Set the serial part to 25 % (or tap the "25 %" measured points).', 'Đặt phần tuần tự là 25 % (hoặc chạm vào "25 %" của chấm số đo).'],
        task: { text: ['s = 25 %.', 's = 25 %.'], until: (s) => s.amd?.s === 0.25, solve: [{ a: 'amd.s', v: 0.25 }] },
      },
      {
        target: 'play',
        title: ['Your turn: to 64 cores', 'Đến lượt bạn: tới 64 lõi'],
        body: ['Play to the end and watch the curve flatten under the red ceiling.', 'Chạy tới cuối và xem đường cong dẹt lại dưới cái trần đỏ.'],
        task: { text: ['Run to 64 cores.', 'Chạy tới 64 lõi.'], until: (s) => s.amd?.n === 64 && s.amd?.s === 0.25, solve: [{ a: 'player.end', delay: 300 }] },
      },
      {
        target: 'amd-chart',
        title: ['3.8× on 64 cores', '3,8× trên 64 lõi'],
        body: ['With 25 % serial, even infinite cores stop at 1/0.25 = 4×. Buying cores does not help — shrinking the serial part does.', 'Với 25 % tuần tự, kể cả vô hạn lõi cũng dừng ở 1/0,25 = 4×. Mua thêm lõi không giúp — thu nhỏ phần tuần tự mới giúp.'],
      },
      {
        target: 'amd-view',
        title: ['Your turn: Gustafson', 'Đến lượt bạn: Gustafson'],
        body: ['Open the Gustafson view. Instead of the same job faster, give each extra core MORE work in the same time.', 'Mở trang Gustafson. Thay vì làm cùng một việc nhanh hơn, giao cho mỗi lõi thêm NHIỀU việc hơn trong cùng thời gian.'],
        task: { text: ['Open Gustafson.', 'Mở Gustafson.'], until: (s) => s.amd?.view === 'gustafson', solve: [{ a: 'amd.view', v: 'gustafson' }] },
      },
      {
        target: 'amd-chart', do: [{ a: 'amd.s', v: 0.1 }, { a: 'player.seek', v: 4, delay: 300 }],
        title: ['9.1× more work', 'Làm được gấp 9,1 lần'],
        body: ['Scaled speedup = s + (1 − s)·n = 0.1 + 0.9 × 10 = 9.1. The lab\'s "grow" run did 36 400 units in 3 612 ms on 10 cores vs 4 000 in 3 048 ms on one — servers handling more users live here.', 'Speedup co giãn = s + (1 − s)·n = 0,1 + 0,9 × 10 = 9,1. Lần chạy "grow" trong lab làm 36 400 đơn vị trong 3 612 ms trên 10 lõi, so với 4 000 trong 3 048 ms trên một lõi — máy chủ phục vụ thêm người dùng sống ở đây.'],
      },
    ],
    quiz: {
      q: ['5 % of a job is serial. What is the best possible speedup with unlimited cores?', '5 % việc là tuần tự. Speedup tốt nhất có thể với vô hạn lõi là bao nhiêu?'],
      options: [['20×', '20×'], ['95×', '95×'], ['Unlimited', 'Vô hạn']],
      answer: 0, why: ['The ceiling is 1/s = 1/0.05 = 20×: the serial 5 % alone takes 1/20 of the original time.', 'Trần là 1/s = 1/0,05 = 20×: riêng 5 % tuần tự đã chiếm 1/20 thời gian ban đầu.'],
    },
  },
  {
    id: 'amdahl-karp', ns: 'os-lab', sim: 'amdahl', presets: ['karp', 'balance'],
    title: ['Measure your serial fraction (Karp–Flatt)', 'Đo phần tuần tự của bạn (Karp–Flatt)'],
    summary: ['Turn a sweep table into the serial fraction e, predict 64 cores, and see why fixed blocks lose to a shared queue.', 'Biến một bảng sweep thành phần tuần tự e, dự đoán 64 lõi, và xem vì sao chia khối cố định thua hàng đợi chung.'],
    steps: [
      {
        target: 'amd-karp', do: [{ a: 'amd.view', v: 'karp' }, { a: 'amd.load', v: 'a10' }],
        title: ['A real sweep table', 'Một bảng sweep thật'],
        body: ['./sweep.sh ran ./amdahl at 1, 2, 4, 8, 10 cores. Karp–Flatt turns each row into e = (1/S − 1/n) / (1 − 1/n): the serial fraction that row behaves like.', './sweep.sh chạy ./amdahl ở 1, 2, 4, 8, 10 lõi. Karp–Flatt biến mỗi dòng thành e = (1/S − 1/n) / (1 − 1/n): phần tuần tự mà dòng đó cư xử giống.'],
      },
      {
        target: 'amd-kpi',
        title: ['e ≈ 11 %, a 64-core prediction', 'e ≈ 11 %, dự đoán 64 lõi'],
        body: ['e climbs from 10.1 % to 11.3 % — slightly more than the 10 % written in the code: overhead grows with n. With that e, 64 cores would give under 8×.', 'e tăng từ 10,1 % lên 11,3 % — nhỉnh hơn 10 % ghi trong mã: chi phí phụ tăng theo n. Với e đó, 64 lõi cho chưa tới 8×.'],
      },
      {
        target: 'amd-karp',
        title: ['Your turn: a well-balanced program', 'Đến lượt bạn: một chương trình chia việc khéo'],
        body: ['Load "primes, shared queue" — threads pull small chunks from a queue.', 'Nạp "số nguyên tố, hàng đợi" — các luồng lấy từng khúc nhỏ từ một hàng đợi.'],
        task: { text: ['Load the shared-queue sweep.', 'Nạp bảng hàng đợi chung.'], until: (s) => s.amd?.set === 'queue', solve: [{ a: 'amd.load', v: 'queue' }] },
      },
      {
        target: 'amd-karp',
        title: ['Your turn: fixed blocks', 'Đến lượt bạn: khối cố định'],
        body: ['e stays near 0–3 %. Now load "primes, fixed blocks": same work, each thread gets one quarter up front.', 'e ở quanh 0–3 %. Giờ nạp "số nguyên tố, khối cố định": cùng việc, mỗi luồng nhận trước một phần tư.'],
        task: { text: ['Load the fixed-blocks sweep.', 'Nạp bảng khối cố định.'], until: (s) => s.amd?.set === 'block', solve: [{ a: 'amd.load', v: 'block' }] },
      },
      {
        target: 'amd-view',
        title: ['Your turn: why blocks lose', 'Đến lượt bạn: vì sao khối thua'],
        body: ['e is 7 % at 10 cores (25 % at 2!), yet there is no serial code at all. Open "splitting work" and play it to the end.', 'e là 7 % ở 10 lõi (25 % ở 2 lõi!), mà không hề có mã tuần tự nào. Mở "chia việc" và chạy tới cuối.'],
        task: { text: ['Splitting work, to the end.', 'Chia việc, chạy tới cuối.'], until: (s) => s.amd?.view === 'balance' && s.amd?.atEnd === true, solve: [{ a: 'amd.view', v: 'balance', delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
      {
        target: 'amd-chart',
        title: ['Waiting for the slowest thread', 'Chờ luồng chậm nhất'],
        body: ['Bigger numbers cost more to test, so thread 3 is still busy at 706 ms while thread 0 idled since 308 ms. A shared queue finishes everyone at 535 ms. Karp–Flatt cannot tell imbalance from serial code — the timeline can.', 'Số càng lớn kiểm càng tốn, nên luồng 3 vẫn bận tới 706 ms trong khi luồng 0 ngồi chơi từ 308 ms. Hàng đợi chung cho cả bốn cùng xong lúc 535 ms. Karp–Flatt không phân biệt được chia lệch với mã tuần tự — dòng thời gian thì được.'],
      },
    ],
    quiz: {
      q: ['Your Karp–Flatt e GROWS as you add cores. What does that suggest?', 'e của Karp–Flatt TĂNG khi bạn thêm lõi. Điều đó gợi ý gì?'],
      options: [['Overhead or imbalance that grows with n, not a fixed serial part', 'Chi phí phụ hoặc chia lệch tăng theo n, không phải phần tuần tự cố định'], ['The measurement is wrong', 'Phép đo sai'], ['The program has no serial part', 'Chương trình không có phần tuần tự']],
      answer: 0, why: ['A truly fixed serial fraction gives a constant e. Rising e means synchronisation, memory bandwidth, uneven chunks or slow cores are eating the gain.', 'Phần tuần tự cố định thật thì e không đổi. e tăng nghĩa là đồng bộ, băng thông bộ nhớ, khúc việc không đều hoặc lõi chậm đang ăn mất phần lợi.'],
    },
  },

  // ───────────────────────── cacheline ─────────────────────────
  {
    id: 'cacheline-bounce', ns: 'os-lab', sim: 'cacheline', presets: ['false', 'm1', 'padded', 'java'],
    title: ['Watch a cache line bounce', 'Xem một dòng cache nhảy qua lại'],
    summary: ['Eight threads, eight separate counters, one cache line: MESI makes every write a transfer — 777 ms vs 192 ms.', 'Tám luồng, tám bộ đếm riêng, một dòng cache: MESI biến mỗi lần ghi thành một lần chuyển — 777 ms vs 192 ms.'],
    steps: [
      {
        target: 'cl-mem', do: [{ a: 'cl.cores', v: 8 }, { a: 'cl.local', v: false }, { a: 'cl.gap', v: 8 }, { a: 'cl.line', v: 64 }],
        title: ['Eight counters, 8 bytes apart', 'Tám bộ đếm, cách nhau 8 byte'],
        body: ['long counter[8]: each thread only ever touches its OWN element. But 8 × 8 bytes = 64 bytes = one cache line.', 'long counter[8]: mỗi luồng chỉ đụng tới phần tử CỦA RIÊNG NÓ. Nhưng 8 × 8 byte = 64 byte = đúng một dòng cache.'],
      },
      {
        target: 'step',
        title: ['Your turn: four writes', 'Đến lượt bạn: bốn lần ghi'],
        body: ['Press Step four times and watch the red M move from core to core.', 'Bấm Bước bốn lần và xem chữ M đỏ chạy từ lõi này sang lõi khác.'],
        task: { text: ['Step until the line has bounced 3 times.', 'Bấm Bước tới khi dòng đã nhảy 3 lần.'], until: (s) => ((s.cl?.bounces as number) ?? 0) >= 3, solve: [step(4, 600)] },
      },
      {
        target: 'cl-cores',
        title: ['Read-for-ownership', 'Đọc để giành quyền sở hữu'],
        body: ['To write, a core needs the line in state M (Modified, its only copy). So each write steals the whole line from the previous core, which drops to I (Invalid). No variable is shared — only the line.', 'Muốn ghi, một lõi cần dòng ở trạng thái M (Modified, bản duy nhất). Nên mỗi lần ghi lại giật cả dòng từ lõi trước, lõi đó tụt xuống I (Invalid). Không biến nào dùng chung — chỉ chung dòng.'],
      },
      {
        target: 'cl-clock',
        title: ['777 ms', '777 ms'],
        body: ['Measured: 8 threads × 100 million increments take 777 ms like this. One thread alone takes 172 ms — adding threads made it 4.5× SLOWER.', 'Đo thật: 8 luồng × 100 triệu lần cộng mất 777 ms khi sắp như vầy. Một luồng một mình chỉ 172 ms — thêm luồng làm nó CHẬM gấp 4,5 lần.'],
      },
      {
        target: 'cl-opts',
        title: ['Your turn: pad the counters', 'Đến lượt bạn: chèn đệm giữa các bộ đếm'],
        body: ['Put the counters 128 bytes apart and play to the end.', 'Đặt các bộ đếm cách nhau 128 byte và chạy tới cuối.'],
        task: { text: ['128 B apart, run to the end.', 'Cách 128 B, chạy tới cuối.'], until: (s) => s.cl?.gap === 128 && s.cl?.atEnd === true && s.cl?.bounces === 0, solve: [{ a: 'cl.gap', v: 128, delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
      {
        target: 'cl-kpi',
        title: ['Zero bounces, 192 ms', 'Không lần nhảy nào, 192 ms'],
        body: ['Each core keeps its own line in M and every write is an L1 hit. Measured: 192 ms for 8 threads.', 'Mỗi lõi giữ dòng riêng ở trạng thái M và lần ghi nào cũng trúng L1. Đo thật: 192 ms cho 8 luồng.'],
      },
      {
        target: 'cl-opts',
        title: ['Your turn: the getconf trap', 'Đến lượt bạn: cái bẫy getconf'],
        body: ['getconf says the line is 64 bytes, so 64 apart should be enough — yet the lab measured 269 ms. Set 64 B apart, switch the line to 128 B (the real M1 size) and play to the end.', 'getconf nói dòng là 64 byte, vậy cách 64 là đủ — thế mà lab đo được 269 ms. Đặt cách 64 B, đổi dòng sang 128 B (cỡ thật của M1) rồi chạy tới cuối.'],
        task: { text: ['64 B apart, 128-B line, to the end.', 'Cách 64 B, dòng 128 B, chạy tới cuối.'], until: (s) => s.cl?.gap === 64 && s.cl?.line === 128 && s.cl?.atEnd === true, solve: [{ a: 'cl.gap', v: 64, delay: 300 }, { a: 'cl.line', v: 128, delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
      {
        target: 'cl-mem',
        title: ['Pairs still share', 'Từng cặp vẫn chung dòng'],
        body: ['With 128-byte lines, counters 0+1, 2+3… share a line, so half the false sharing remains. Pad to the real line size (or use @Contended / LongAdder in Java) — and measure, do not trust getconf.', 'Với dòng 128 byte, bộ đếm 0+1, 2+3… chung một dòng, nên còn một nửa false sharing. Đệm theo cỡ dòng thật (hoặc @Contended / LongAdder trong Java) — và đo, đừng tin getconf.'],
      },
    ],
    quiz: {
      q: ['Two threads write two DIFFERENT variables and the program gets slower with more threads. Most likely cause?', 'Hai luồng ghi hai biến KHÁC nhau mà chương trình càng thêm luồng càng chậm. Nguyên nhân nhiều khả năng nhất?'],
      options: [['The variables share a cache line (false sharing)', 'Hai biến chung một dòng cache (false sharing)'], ['A data race', 'Một data race'], ['Too few cores', 'Quá ít lõi']],
      answer: 0, why: ['Coherence works per line, not per variable. Local variables, padding or per-thread accumulators fix it.', 'Cơ chế nhất quán làm việc theo dòng, không theo biến. Biến cục bộ, chèn đệm hoặc bộ cộng riêng từng luồng sẽ sửa được.'],
    },
  },

  // ───────────────────────── flamegraph ─────────────────────────
  {
    id: 'flamegraph-read', ns: 'os-lab', sim: 'flamegraph', presets: ['hot', 'offcpu', 'java', 'python'],
    title: ['Read a real flame graph', 'Đọc một flame graph thật'],
    summary: ['Find the hot function by SELF time, see why TOTAL misleads, search, then learn what off-CPU flame graphs show.', 'Tìm hàm nóng theo thời gian SELF, thấy vì sao TOTAL dễ gây hiểu lầm, tìm tên, rồi học flame graph off-CPU cho thấy gì.'],
    steps: [
      {
        target: 'fg-graph', do: [{ a: 'fg.script', v: 'hot' }],
        title: ['915 samples of hot.c', '915 mẫu của hot.c'],
        body: ['perf stopped the program 999 times a second and recorded its stack. Each box = a function; width = share of samples; the bottom is where the program started.', 'perf dừng chương trình 999 lần mỗi giây và ghi lại ngăn xếp. Mỗi hộp = một hàm; bề rộng = phần mẫu; dưới đáy là chỗ chương trình bắt đầu.'],
      },
      {
        target: 'step',
        title: ['Your turn: find the hot spot', 'Đến lượt bạn: tìm điểm nóng'],
        body: ['Press Step twice.', 'Bấm Bước hai lần.'],
        task: { text: ['Step until crc_bitwise is selected.', 'Bấm Bước tới khi crc_bitwise được chọn.'], until: (s) => s.fg?.sel === 'crc_bitwise', solve: [step(2, 800)] },
      },
      {
        target: 'fg-info',
        title: ['SELF 86.9 %', 'SELF 86,9 %'],
        body: ['SELF = the CPU was running this function\'s own instructions. TOTAL = it was anywhere on the stack. A wide box with nothing on top has high SELF: fix it.', 'SELF = CPU đang chạy lệnh của chính hàm này. TOTAL = nó có mặt ở bất kỳ đâu trên ngăn xếp. Hộp rộng mà trên đỉnh không còn gì thì SELF cao: sửa nó.'],
      },
      {
        target: 'fg-rank',
        title: ['Your turn: a misleading TOTAL', 'Đến lượt bạn: một TOTAL dễ gây hiểu lầm'],
        body: ['Select render_json — tap its box or its name in the TOTAL list.', 'Chọn render_json — chạm vào hộp của nó hoặc tên của nó trong danh sách TOTAL.'],
        task: { text: ['Select render_json.', 'Chọn render_json.'], until: (s) => s.fg?.sel === 'render_json', solve: [{ a: 'fg.select', v: 'render_json' }] },
      },
      {
        target: 'fg-info',
        title: ['10 % total, 0 % self', '10 % total, 0 % self'],
        body: ['render_json is on 10 % of stacks but never on top: all its time is sprintf. Optimising its own code would gain nothing.', 'render_json có mặt trong 10 % ngăn xếp nhưng không bao giờ ở đỉnh: toàn bộ thời gian là của sprintf. Tối ưu mã của chính nó chẳng được gì.'],
      },
      {
        target: 'fg-tools',
        title: ['Your turn: search', 'Đến lượt bạn: tìm'],
        body: ['Type "printf" in the search box: every matching box turns pink and the total share appears.', 'Gõ "printf" vào ô tìm: mọi hộp khớp chuyển hồng và tổng phần trăm hiện ra.'],
        task: { text: ['Search "printf".', 'Tìm "printf".'], until: (s) => ((s.fg?.matched as number) ?? 0) > 0 && String(s.fg?.q).includes('printf'), solve: [{ a: 'fg.search', v: 'printf' }] },
      },
      {
        target: 'fg-script',
        title: ['Your turn: off-CPU', 'Đến lượt bạn: off-CPU'],
        body: ['Open "on/off-CPU" and play it to the end. A program can be slow while its CPU flame graph looks fine.', 'Mở "on/off-CPU" và chạy tới cuối. Một chương trình có thể chậm trong khi flame graph CPU trông ổn.'],
        task: { text: ['on/off-CPU, to the end.', 'on/off-CPU, chạy tới cuối.'], until: (s) => s.fg?.script === 'offcpu' && s.fg?.atEnd === true && s.fg?.sel === 'futex_do_wait', solve: [{ a: 'fg.script', v: 'offcpu', delay: 300 }, { a: 'player.end', delay: 500 }] },
      },
      {
        target: 'fg-graph',
        title: ['87.8 % waiting for a lock', '87,8 % ngồi chờ khoá'],
        body: ['Off-CPU time is the time threads spent asleep: here mostly in futex_do_wait, queued on a mutex held by someone sleeping in usleep. On-CPU profiles cannot see this.', 'Thời gian off-CPU là lúc luồng ngủ: ở đây chủ yếu trong futex_do_wait, xếp hàng chờ một mutex mà người giữ nó lại đang ngủ trong usleep. Hồ sơ on-CPU không thể thấy điều này.'],
      },
    ],
    quiz: {
      q: ['In a flame graph, what does the x axis mean?', 'Trong flame graph, trục x có nghĩa gì?'],
      options: [['Nothing about time — boxes are sorted by name; width is the share of samples', 'Không phải thời gian — hộp xếp theo tên; bề rộng là phần mẫu'], ['Time, left to right', 'Thời gian, từ trái sang phải'], ['Memory addresses', 'Địa chỉ bộ nhớ']],
      answer: 0, why: ['Flame graphs merge identical stacks and sort them alphabetically. For time order you need a flame chart (e.g. Chrome DevTools).', 'Flame graph gộp các ngăn xếp giống nhau và xếp theo ABC. Muốn theo thứ tự thời gian thì cần flame chart (vd Chrome DevTools).'],
    },
  },
  {
    id: 'flamegraph-traps', ns: 'os-lab', sim: 'flamegraph', presets: ['diff', 'inline'],
    title: ['Two traps: renamed functions and inlining', 'Hai cái bẫy: hàm đổi tên và inline'],
    summary: ['A differential graph that "shows" a regression, and a JIT that hides the function you must fix.', 'Một đồ thị khác biệt "cho thấy" chậm đi, và một JIT giấu mất hàm bạn cần sửa.'],
    steps: [
      {
        target: 'fg-graph', do: [{ a: 'fg.script', v: 'diff' }],
        title: ['Before → after', 'Trước → sau'],
        body: ['hot.c was fixed (bitwise CRC → lookup table) and got 3× faster. This differential graph compares the two profiles.', 'hot.c đã được sửa (CRC theo bit → bảng tra) và nhanh gấp 3. Đồ thị khác biệt này so hai hồ sơ.'],
      },
      {
        target: 'step',
        title: ['Your turn: the red box', 'Đến lượt bạn: hộp đỏ'],
        body: ['Press Step until crc_table is selected.', 'Bấm Bước tới khi crc_table được chọn.'],
        task: { text: ['Select crc_table by stepping.', 'Bấm Bước tới crc_table.'], until: (s) => s.fg?.sel === 'crc_table', solve: [step(1, 800)] },
      },
      {
        target: 'fg-info',
        title: ['Red does not mean slower', 'Đỏ không có nghĩa là chậm hơn'],
        body: ['crc_table is new, so ALL its samples count as "more". The function it replaced is simply gone. Read the absolute numbers: 916 ms → 310 ms.', 'crc_table là hàm mới, nên MỌI mẫu của nó đều tính là "nhiều hơn". Hàm cũ nó thay thế thì biến mất. Đọc số tuyệt đối: 916 ms → 310 ms.'],
      },
      {
        target: 'fg-script',
        title: ['Your turn: the inlining trap', 'Đến lượt bạn: bẫy inline'],
        body: ['Open "inlining trap" and play to the end.', 'Mở "bẫy inline" và chạy tới cuối.'],
        task: { text: ['Inlining trap, to the end.', 'Bẫy inline, chạy tới cuối.'], until: (s) => s.fg?.script === 'inline' && s.fg?.atEnd === true, solve: [{ a: 'fg.script', v: 'inline', delay: 300 }, { a: 'player.end', delay: 500 }] },
      },
      {
        target: 'fg-quiz',
        title: ['Your turn: which function?', 'Đến lượt bạn: hàm nào?'],
        body: ['93 % is inside Array.prototype.includes, called "from report". But report does not call includes — something it calls does. Pick the function to fix.', '93 % nằm trong Array.prototype.includes, được gọi "từ report". Nhưng report không gọi includes — một hàm mà nó gọi mới gọi. Chọn hàm cần sửa.'],
        task: { text: ['Answer the quiz correctly.', 'Trả lời đúng câu đố.'], until: (s) => s.fg?.quizOk === true, solve: [{ a: 'fg.answer', v: 'unique' }] },
      },
      {
        target: 'fg-quiz',
        title: ['Line 24: 91.3 %', 'Dòng 24: 91,3 %'],
        body: ['V8 inlined uniqueCustomers into report, so its frame vanished from the stack. Node\'s own profiler pins line 24 at 91.3 %. A Set instead of includes: 93 → 1 052 requests per second.', 'V8 đã inline uniqueCustomers vào report, nên khung của nó biến khỏi ngăn xếp. Profiler của chính Node chỉ ra dòng 24 chiếm 91,3 %. Dùng Set thay includes: 93 → 1 052 request mỗi giây.'],
      },
    ],
    quiz: {
      q: ['A hot function is missing from your flame graph. What is a likely reason?', 'Một hàm nóng vắng mặt trong flame graph. Lý do có khả năng là gì?'],
      options: [['It was inlined into its caller by the compiler/JIT', 'Trình biên dịch/JIT đã inline nó vào hàm gọi'], ['It never ran', 'Nó chưa từng chạy'], ['perf only samples kernel code', 'perf chỉ lấy mẫu mã nhân']],
      answer: 0, why: ['Inlined code runs inside the caller\'s frame. Use line-level profiles (--cpu-prof, perf annotate) or disable inlining to confirm.', 'Mã đã inline chạy bên trong khung của hàm gọi. Dùng hồ sơ theo dòng (--cpu-prof, perf annotate) hoặc tắt inline để kiểm.'],
    },
  },

  // ───────────────────────── coordinated-omission ─────────────────────────
  {
    id: 'coordinated-omission-loops', ns: 'os-lab', sim: 'coordinated-omission', presets: ['stall', 'conns', 'wrk', 'nostall'],
    title: ['Why p99 = 0.2 ms can be a lie', 'Vì sao p99 = 0,2 ms có thể là nói dối'],
    summary: ['Watch a closed-loop tester stop sending during a stall, an open-loop one keep the schedule, and fix the numbers like wrk does.', 'Xem công cụ vòng kín ngừng gửi lúc máy chủ đứng hình, công cụ vòng mở giữ đúng lịch, và sửa số liệu như wrk.'],
    steps: [
      {
        target: 'co-lanes', do: [{ a: 'co.conns', v: 1 }, { a: 'co.stall', v: 200 }, { a: 'co.rate', v: 100 }, { a: 'co.fix', v: false }],
        title: ['One server, two testers', 'Một máy chủ, hai công cụ đo'],
        body: ['The server answers in about 0.1 ms but freezes for 200 ms every second (red stripes). Top lane: a closed loop like hey or wrk. Bottom lane: an open loop sending 100 requests per second on schedule.', 'Máy chủ trả lời trong khoảng 0,1 ms nhưng đứng hình 200 ms mỗi giây (vệt đỏ). Làn trên: vòng kín như hey hay wrk. Làn dưới: vòng mở gửi 100 yêu cầu mỗi giây đúng lịch.'],
      },
      {
        target: 'step',
        title: ['Your turn: through the first stall', 'Đến lượt bạn: qua lần đứng hình đầu'],
        body: ['Press Step until 1.25 s.', 'Bấm Bước tới 1,25 s.'],
        task: { text: ['Step to 1.25 s.', 'Bấm Bước tới 1,25 s.'], until: (s) => ((s.co?.t as number) ?? 0) >= 1250, solve: [step(5, 500)] },
      },
      {
        target: 'co-lanes',
        title: ['The closed loop went quiet', 'Vòng kín im bặt'],
        body: ['Top lane: no grey bars during the stall — the tester was waiting for its one answer, so it sent nothing. ONE slow sample, thousands of fast ones. Bottom lane: requests kept their schedule and the red dots rise to 200 ms.', 'Làn trên: không có cột xám nào trong lúc đứng hình — công cụ đang chờ câu trả lời duy nhất nên không gửi gì. MỘT mẫu chậm, hàng nghìn mẫu nhanh. Làn dưới: yêu cầu vẫn giữ lịch và chấm đỏ vọt lên 200 ms.'],
      },
      {
        target: 'play',
        title: ['Your turn: the full 8 seconds', 'Đến lượt bạn: trọn 8 giây'],
        body: ['Play to the end.', 'Chạy tới cuối.'],
        task: { text: ['Run to 8 s.', 'Chạy tới 8 s.'], until: (s) => s.co?.atEnd === true, solve: [{ a: 'player.end', delay: 300 }] },
      },
      {
        target: 'co-table',
        title: ['0.1 ms vs 190 ms', '0,1 ms vs 190 ms'],
        body: ['Closed loop p99 ≈ 0.1 ms; open loop p99 ≈ 190 ms from the intended start — the lab measured 0.2 vs 189.3 ms. Every user who arrives during a stall waits; only the open loop sees them.', 'p99 vòng kín ≈ 0,1 ms; p99 vòng mở ≈ 190 ms tính từ lúc dự định — lab đo được 0,2 vs 189,3 ms. Người dùng nào tới lúc đứng hình cũng phải chờ; chỉ vòng mở thấy họ.'],
      },
      {
        target: 'co-opts',
        title: ['Your turn: the wrk fix', 'Đến lượt bạn: cách sửa của wrk'],
        body: ['Turn on "wrk-style fix": for every slow sample, insert the samples that should have been sent meanwhile.', 'Bật "sửa kiểu wrk": với mỗi mẫu chậm, chèn thêm các mẫu lẽ ra đã được gửi trong lúc đó.'],
        task: { text: ['Turn the fix on.', 'Bật cách sửa.'], until: (s) => s.co?.fix === true && ((s.co?.fixP99 as number) ?? 0) > 150, solve: [{ a: 'co.fix', v: true }] },
      },
      {
        target: 'co-table',
        title: ['≈ 187 ms, like wrk', '≈ 187 ms, như wrk'],
        body: ['The corrected closed loop agrees with reality again (wrk printed 187.31 ms). Still, prefer a real open-loop tool — k6 constant-arrival-rate measured 189.15 ms.', 'Vòng kín đã sửa lại khớp thực tế (wrk in 187,31 ms). Dù vậy, nên dùng công cụ vòng mở thật — k6 constant-arrival-rate đo được 189,15 ms.'],
      },
      {
        target: 'co-opts',
        title: ['Your turn: enough connections', 'Đến lượt bạn: đủ kết nối'],
        body: ['With one connection, the open loop\'s "from actual send" clock hides the stall too. Give it 50 connections and play to the end.', 'Với một kết nối, đồng hồ "từ lúc gửi thật" của vòng mở cũng giấu cú đứng hình. Cho nó 50 kết nối rồi chạy tới cuối.'],
        task: { text: ['50 connections, to the end.', '50 kết nối, chạy tới cuối.'], until: (s) => s.co?.conns === 50 && s.co?.atEnd === true, solve: [{ a: 'co.conns', v: 50, delay: 300 }, { a: 'player.end', delay: 500 }] },
      },
      {
        target: 'co-table',
        title: ['Now both clocks agree', 'Giờ hai đồng hồ khớp nhau'],
        body: ['Requests leave on time over idle connections and queue INSIDE the server, so even "from actual send" shows ≈ 190 ms (lab: 190.0). Rule: always measure from the intended start.', 'Yêu cầu rời đúng giờ qua các kết nối rảnh và xếp hàng BÊN TRONG máy chủ, nên kể cả "từ lúc gửi thật" cũng thấy ≈ 190 ms (lab: 190,0). Luật: luôn đo từ lúc dự định.'],
      },
    ],
    quiz: {
      q: ['hey -c 1 reports p99 = 0.1 ms on a server that freezes 200 ms every second. Why?', 'hey -c 1 báo p99 = 0,1 ms trên một máy chủ đứng hình 200 ms mỗi giây. Vì sao?'],
      options: [['It is a closed loop: it stops sending during the stall, so only one request per stall is slow', 'Nó là vòng kín: nó ngừng gửi lúc đứng hình, nên mỗi lần chỉ một yêu cầu bị chậm'], ['hey rounds the numbers', 'hey làm tròn số'], ['The stall does not affect HTTP', 'Đứng hình không ảnh hưởng HTTP']],
      answer: 0, why: ['That is coordinated omission: the tester coordinates with the server and omits exactly the samples that would have been slow.', 'Đó là coordinated omission: công cụ đo "phối hợp" với máy chủ và bỏ sót đúng những mẫu lẽ ra phải chậm.'],
    },
  },
  // ───────────────────────── osmap ─────────────────────────
  {
    id: 'osmap-compare', ns: 'os-lab', sim: 'osmap', presets: ['linux', 'mac', 'win', 'compare'],
    title: ['One idea, three systems', 'Một ý, ba hệ điều hành'],
    summary: ['Flip between Linux, macOS and Windows on the same concepts and spot the differences that break real code.', 'Lật giữa Linux, macOS và Windows trên cùng các khái niệm và tìm những khác biệt làm gãy mã thật.'],
    steps: [
      {
        target: 'om-switch', do: [{ a: 'om.os', v: 'linux' }, { a: 'om.card', v: 'kernel' }],
        title: ['The switch', 'Công tắc'],
        body: ['Every card is one operating-system idea. The switch decides which system the cards describe. Green badge = a line measured in the lab; dashed orange = from documentation only.', 'Mỗi thẻ là một ý của hệ điều hành. Công tắc quyết định thẻ đang nói về hệ nào. Nhãn xanh = dòng đo thật trong lab; nhãn cam nét đứt = chỉ theo tài liệu.'],
      },
      {
        target: 'step',
        title: ['Your turn: system-call numbers', 'Đến lượt bạn: số hiệu syscall'],
        body: ['Press Step once to move to the second card.', 'Bấm Bước một lần để sang thẻ thứ hai.'],
        task: { text: ['Go to the system-call card.', 'Sang thẻ số hiệu syscall.'], until: (s) => s.om?.card === 'syscall', solve: [step(1)] },
      },
      {
        target: 'om-switch',
        title: ['Your turn: flip to macOS', 'Đến lượt bạn: lật sang macOS'],
        body: ['On Linux arm64, write is system call 64. Switch to macOS and read the number there.', 'Trên Linux arm64, write là lời gọi số 64. Chuyển sang macOS và đọc con số ở đó.'],
        task: { text: ['Switch to macOS.', 'Chuyển sang macOS.'], until: (s) => s.om?.view === 'mac', solve: [{ a: 'om.os', v: 'mac' }] },
      },
      {
        target: 'om-cards',
        title: ['4 instead of 64', '4 thay vì 64'],
        body: ['Same call, different number — which is why compiled programs are not portable between kernels, and why you call libc, never the numbers.', 'Cùng lời gọi, khác số — vì vậy chương trình đã biên dịch không mang qua nhân khác được, và vì vậy ta gọi libc chứ không gọi thẳng số hiệu.'],
      },
      {
        target: 'om-switch',
        title: ['Your turn: side by side', 'Đến lượt bạn: so cạnh nhau'],
        body: ['Choose "side by side" and go to the "Signals and exit codes" card (press Step, or tap the card).', 'Chọn "so cạnh nhau" và tới thẻ "Tín hiệu và mã thoát" (bấm Bước, hoặc chạm vào thẻ).'],
        task: { text: ['Side by side, signals card.', 'So cạnh nhau, thẻ tín hiệu.'], until: (s) => s.om?.view === 'compare' && s.om?.card === 'signal', solve: [{ a: 'om.os', v: 'compare', delay: 300 }, { a: 'om.card', v: 'signal', delay: 300 }] },
      },
      {
        target: 'om-cards',
        title: ['exit 138 means two things', 'exit 138 mang hai nghĩa'],
        body: ['kill -USR1 gives exit 138 on Linux but 158 on macOS — and 138 on a Mac is SIGBUS. Decode exit codes with the signal table of the system that produced them.', 'kill -USR1 cho thoát 138 trên Linux nhưng 158 trên macOS — và 138 trên Mac lại là SIGBUS. Giải mã mã thoát bằng bảng tín hiệu của đúng hệ đã sinh ra nó.'],
      },
      {
        target: 'om-cards',
        title: ['Your turn: the case trap', 'Đến lượt bạn: bẫy hoa/thường'],
        body: ['Open the "Upper/lower case in file names" card.', 'Mở thẻ "Chữ hoa/thường trong tên tệp".'],
        task: { text: ['Open the case card.', 'Mở thẻ hoa/thường.'], until: (s) => s.om?.card === 'case', solve: [{ a: 'om.card', v: 'case' }] },
      },
      {
        target: 'om-cards',
        title: ['Works on my Mac', 'Chạy được trên máy Mac của tôi'],
        body: ['import "./Config" finds config.js on macOS and fails on the Linux server. Keep file names in one exact case, and let CI run on Linux.', 'import "./Config" tìm thấy config.js trên macOS nhưng hỏng trên máy chủ Linux. Giữ tên tệp đúng một kiểu hoa/thường, và cho CI chạy trên Linux.'],
      },
    ],
    quiz: {
      q: ['A container on your Mac prints "Linux … aarch64" for uname. Why?', 'Container trên máy Mac in "Linux … aarch64" khi gõ uname. Vì sao?'],
      options: [['Docker Desktop runs containers in a Linux VM on the Mac', 'Docker Desktop chạy container trong một máy ảo Linux trên Mac'], ['macOS can run Linux system calls natively', 'macOS chạy được lời gọi hệ thống của Linux'], ['uname lies inside containers', 'uname nói dối trong container']],
      answer: 0, why: ['Containers need the Linux kernel (namespaces, cgroups). On macOS and Windows that kernel lives in a small VM — file access crosses the VM boundary.', 'Container cần nhân Linux (namespace, cgroup). Trên macOS và Windows nhân đó nằm trong một máy ảo nhỏ — truy cập tệp phải vượt ranh giới máy ảo.'],
    },
  },
];
