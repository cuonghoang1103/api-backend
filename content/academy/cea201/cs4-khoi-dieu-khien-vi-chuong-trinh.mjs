/**
 * CEA201 · ⭐ CS.4 — Khối điều khiển & vi chương trình (deck 'cea19' = Chapter 19 "Control Unit
 * Operation and Microprogrammed Control", Stallings COA 11e — trọn 32 slide).
 *
 * Phần ⭐ Chuyên sâu do web BỔ SUNG — deck có trong bộ slide chính hãng nhưng không nằm trong
 * lịch 60 buổi (xem _slides.mjs). Nối Chương 3 (chu trình lệnh) + Chương 12 (thanh ghi) với
 * TÍN HIỆU ĐIỀU KHIỂN thật sự đóng/mở đường dữ liệu.
 *
 * Chạy thật: bộ mô phỏng khối điều khiển vi chương trình (Python 3.11.2 trong node:22), đi đủ
 * fetch / indirect / execute / interrupt với đúng vi thao tác + tín hiệu của Table 19.1, và kiểm
 * phương trình mạch cứng của C5 khớp 28/28 bước.
 *
 * Chỗ slide gốc SAI/THIẾU (nêu thẳng trong bài):
 *   · slide 5 (Fig 19.2a): nhãn "tMAR" — lỗi gõ, là MAR.
 *   · slide 9 (Fig 19.3): "Fetch intstruction" — lỗi gõ.
 *   · slide 13 (Table 19.1): bước t2 của chu kỳ ngắt KHÔNG ghi tín hiệu nào (ô trống) — sách để ngỏ
 *     vì Save_Address/Routine_Address tuỳ máy; bước PC ← PC + 1 cũng không có tín hiệu C riêng.
 *   · slide 20: gạch "Microprogrammed implementation" không có lời giải thích nào; deck cũng
 *     không có Hình 19.11 (số hình nhảy từ 19.10 sang 19.12).
 *   · slide 24 (Table 19.4): lệnh R n ghi "C(Acc) × 2^(n+1)" — thiếu dấu trừ, đúng là 2^−(n+1)
 *     (dịch PHẢI); để nguyên thì R và L trông như nhau.
 *   · slide 18 (Fig 19.8): nhãn chân lệch datasheet 8085AH — hình ghi 30 WR, 31 RD, 32 "Vpp", KHÔNG có ALE;
 *     datasheet: 30 ALE, 31 WR, 32 RD.
 *   · Tín hiệu C6/C7/C9/C10/C11 cho pha thực thi KHÔNG có trong Table 19.1 — bài đọc từ Hình 19.5
 *     và ghi rõ là "đọc từ hình".
 */
import { walk, walkHead, bi } from './_slides.mjs';
import { code, out, xem, bai } from './_cs.mjs';
import { thuNgay } from '../../_labs.mjs';

const D = 'cea19';
const COA = 'computer-organization-and-architecture';

const PY_VI = String.raw`
# Khoi dieu khien VI CHUONG TRINH thu nho (Stallings Ch19: Fig 19.5, Table 19.1, Fig 19.13)
# Lenh 16 bit: [I | opcode 3 bit | dia chi 12 bit]; opcode 1=LOAD 2=ADD 3=STORE 7=HALT
FETCH, IND, INT = 0, 3, 6
TEN = {1: "LOAD", 2: "ADD", 3: "STORE", 7: "HALT"}
# Bo nho dieu khien: dia chi -> (vi thao tac, tin hieu dieu khien, cach chon dia chi ke)
CM = {
    0: ("MAR <- PC",              "C2",        "tiep"),
    1: ("MBR <- M[MAR]; PC <- PC+1", "C5 CR",  "tiep"),
    2: ("IR <- MBR",              "C4",        "I=1 ? IND : opcode"),
    3: ("MAR <- IR(dc)",          "C8",        "tiep"),
    4: ("MBR <- M[MAR]",          "C5 CR",     "tiep"),
    5: ("IR(dc) <- MBR(dc)",      "C4",        "opcode"),
    6: ("MBR <- PC",              "C1",        "tiep"),
    7: ("MAR <- 0xF00; PC <- 0x200", "-",      "tiep"),
    8: ("M[MAR] <- MBR",          "C12 CW",    "FETCH"),
    10: ("MAR <- IR(dc)",         "C8",        "tiep"),      # LOAD
    11: ("MBR <- M[MAR]",         "C5 CR",     "tiep"),
    12: ("AC <- MBR",             "C10",       "ngat ? INT : FETCH"),
    13: ("MAR <- IR(dc)",         "C8",        "tiep"),      # ADD
    14: ("MBR <- M[MAR]",         "C5 CR",     "tiep"),
    15: ("AC <- AC + MBR",        "C6 C7 C9",  "ngat ? INT : FETCH"),
    16: ("MAR <- IR(dc)",         "C8",        "tiep"),      # STORE
    17: ("MBR <- AC",             "C11",       "tiep"),
    18: ("M[MAR] <- MBR",         "C12 CW",    "ngat ? INT : FETCH"),
    19: ("(dung may)",            "-",         "HALT"),
}
MAP = {1: 10, 2: 13, 3: 16, 7: 19}   # "jump to opcode routine" (Fig 19.13)

def lenh(op, dc, i=0): return (i << 15) | (op << 12) | dc
M = {0x100: lenh(1, 0x120),          # LOAD  X
     0x101: lenh(2, 0x130, i=1),     # ADD   @P   (gian tiep: P chua dia chi cua Y)
     0x102: lenh(3, 0x122),          # STORE Z
     0x103: lenh(7, 0),              # HALT
     0x120: 5, 0x121: 7, 0x122: 0, 0x130: 0x121,
     0x200: lenh(7, 0)}              # trinh phuc vu ngat (o day chi la HALT cho gon)
R = dict(PC=0x100, MAR=0, MBR=0, IR=0, AC=0)
ngat_den_sau_lenh = 3                # thiet bi xin ngat sau lenh thu 3
CAR, buoc, so_lenh, t = FETCH, 0, 0, 1
def C5_mach_cung(P, Q, T, op):
    # Cach DIEU KHIEN CUNG: C5 la mot bieu thuc Boole cua (P, Q), nhip T va opcode
    LOAD, ADD = op == 1, op == 2
    return (not P and not Q and T == 2) or (not P and Q and T == 2) or (P and not Q and T == 2 and (LOAD or ADD))
khop = 0
print(f"{'#':>2} {'CAR':>3} {'t':>2}  {'vi thao tac':<27} {'tin hieu':<9} PC   MAR  MBR   AC")
while True:
    uop, sig, ke = CM[CAR]
    dc = R["IR"] & 0xFFF
    if   CAR == 0:  R["MAR"] = R["PC"]
    elif CAR == 1:  R["MBR"] = M.get(R["MAR"], 0); R["PC"] += 1
    elif CAR in (2,): R["IR"] = R["MBR"]
    elif CAR in (3, 10, 13, 16): R["MAR"] = dc
    elif CAR in (4, 11, 14): R["MBR"] = M.get(R["MAR"], 0)
    elif CAR == 5:  R["IR"] = (R["IR"] & 0xF000 & ~0x8000) | (R["MBR"] & 0xFFF)
    elif CAR == 6:  R["MBR"] = R["PC"]
    elif CAR == 7:  R["MAR"], R["PC"] = 0xF00, 0x200
    elif CAR in (8, 18): M[R["MAR"]] = R["MBR"]
    elif CAR == 12: R["AC"] = R["MBR"]
    elif CAR == 15: R["AC"] = R["AC"] + R["MBR"]
    elif CAR == 17: R["MBR"] = R["AC"]
    buoc += 1
    P, Q = (0, 0) if CAR <= 2 else (0, 1) if CAR <= 5 else (1, 1) if CAR <= 8 else (1, 0)
    khop += C5_mach_cung(P, Q, t, (R["IR"] >> 12) & 7) == ("C5" in sig.split())
    print(f"{buoc:>2} {CAR:>3} t{t}  {uop:<27} {sig:<9} {R['PC']:03X}  {R['MAR']:03X}  {R['MBR']:04X}  {R['AC']}")
    t = t + 1 if t < 3 else 1
    # bo tuan tu (sequencing logic) chon dia chi vi lenh ke tiep
    op = (R["IR"] >> 12) & 7
    if ke == "HALT":
        print(f"   -> HALT. Z = M[0x122] = {M[0x122]}, PC cu cat o M[0xF00] = {M[0xF00]:03X}")
        print(f"   {buoc} buoc vi lenh; C5 theo mach cung khop vi chuong trinh {khop}/{buoc} buoc")
        break
    if ke == "tiep": CAR += 1; continue
    if ke == "FETCH": CAR = FETCH; continue
    if ke.startswith("I=1"):
        CAR = IND if R["IR"] >> 15 else MAP[op]
        print(f"   -> giai ma: {TEN[op]}{' (gian tiep)' if R['IR'] >> 15 else ''}")
        continue
    if ke == "opcode": CAR = MAP[op]; continue
    so_lenh += 1                                   # het chu ky thuc thi
    if so_lenh == ngat_den_sau_lenh:
        print("   -> co yeu cau ngat: vao chu ky NGAT"); CAR = INT
    else:
        CAR = FETCH
`;
const O_VI = String.raw`
 # CAR  t  vi thao tac                 tin hieu  PC   MAR  MBR   AC
 1   0 t1  MAR <- PC                   C2        100  100  0000  0
 2   1 t2  MBR <- M[MAR]; PC <- PC+1   C5 CR     101  100  1120  0
 3   2 t3  IR <- MBR                   C4        101  100  1120  0
   -> giai ma: LOAD
 4  10 t1  MAR <- IR(dc)               C8        101  120  1120  0
 5  11 t2  MBR <- M[MAR]               C5 CR     101  120  0005  0
 6  12 t3  AC <- MBR                   C10       101  120  0005  5
 7   0 t1  MAR <- PC                   C2        101  101  0005  5
 8   1 t2  MBR <- M[MAR]; PC <- PC+1   C5 CR     102  101  A130  5
 9   2 t3  IR <- MBR                   C4        102  101  A130  5
   -> giai ma: ADD (gian tiep)
10   3 t1  MAR <- IR(dc)               C8        102  130  A130  5
11   4 t2  MBR <- M[MAR]               C5 CR     102  130  0121  5
12   5 t3  IR(dc) <- MBR(dc)           C4        102  130  0121  5
13  13 t1  MAR <- IR(dc)               C8        102  121  0121  5
14  14 t2  MBR <- M[MAR]               C5 CR     102  121  0007  5
15  15 t3  AC <- AC + MBR              C6 C7 C9  102  121  0007  12
16   0 t1  MAR <- PC                   C2        102  102  0007  12
17   1 t2  MBR <- M[MAR]; PC <- PC+1   C5 CR     103  102  3122  12
18   2 t3  IR <- MBR                   C4        103  102  3122  12
   -> giai ma: STORE
19  16 t1  MAR <- IR(dc)               C8        103  122  3122  12
20  17 t2  MBR <- AC                   C11       103  122  000C  12
21  18 t3  M[MAR] <- MBR               C12 CW    103  122  000C  12
   -> co yeu cau ngat: vao chu ky NGAT
22   6 t1  MBR <- PC                   C1        103  122  0103  12
23   7 t2  MAR <- 0xF00; PC <- 0x200   -         200  F00  0103  12
24   8 t3  M[MAR] <- MBR               C12 CW    200  F00  0103  12
25   0 t1  MAR <- PC                   C2        200  200  0103  12
26   1 t2  MBR <- M[MAR]; PC <- PC+1   C5 CR     201  200  7000  12
27   2 t3  IR <- MBR                   C4        201  200  7000  12
   -> giai ma: HALT
28  19 t1  (dung may)                  -         201  200  7000  12
   -> HALT. Z = M[0x122] = 12, PC cu cat o M[0xF00] = 103
   28 buoc vi lenh; C5 theo mach cung khop vi chuong trinh 28/28 buoc
`;

/* ───────────── Mở đầu ───────────── */
const MO_DAU = bi(`<span class="eyebrow">⭐ Advanced · Lesson CS.4 · official deck CEA19 (Stallings Ch.19, 32 slides) · added by this site</span>
<h2>The control unit: how "fetch, decode, execute" becomes a sequence of control signals — hardwired or microprogrammed</h2>
<p class="lead">Chapter 3 described the instruction cycle and Chapter 12 the registers, but one question was left open: <em>who opens the path from PC to MAR at exactly the right clock tick?</em> That is the control unit. This lesson breaks every instruction into <strong>micro-operations</strong>, maps each one to the <strong>control signals</strong> that make it happen, and compares the two ways of building the unit — a fixed logic circuit (hardwired) or a tiny program in a control memory (microprogrammed).</p>
<p class="nhan">Source: official Stallings slide set (COA 11e, Global Edition), Chapter 19 "Control Unit Operation and Microprogrammed Control" — deck CEA19 · in the course's slide set but NOT in the 60-session schedule</p>
<div class="note-ct">Added by CuongThai (not a school requirement). The simulator in the hands-on part is written for this page; its micro-operations and control signals follow Table 19.1 and Figure 19.5 of the deck.</div>
<h3>Why it still matters</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">x86 today</div><div class="lz-t">instructions → µops</div><div class="lz-d">the decoder of every Intel/AMD core splits complex instructions into micro-operations (Chapter 14's front end)</div></div>
  <div class="lz-step"><div class="lz-k">Microcode</div><div class="lz-t">a program inside the CPU</div><div class="lz-d">rare, complex instructions still run from an on-chip control store</div></div>
  <div class="lz-step"><div class="lz-k">2018</div><div class="lz-t">microcode updates</div><div class="lz-d">part of the Spectre mitigations shipped as microcode loaded by the OS at boot (lesson N3.1)</div></div>
  <div class="lz-step"><div class="lz-k">RISC</div><div class="lz-t">hardwired</div><div class="lz-d">simple fixed-length instructions let ARM and RISC-V cores decode with plain logic (Chapter 13)</div></div>
</div>
<h3>Map of the slides</h3>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–9</td><td>Micro-operations of fetch, indirect, interrupt, execute; the instruction-cycle flowchart</td><td>write the t1/t2/t3 micro-operations of any simple instruction</td></tr>
<tr><td>10–14</td><td>What the control unit must do; data paths and control signals; internal bus</td><td>name the control signal that opens each path in Figure 19.5</td></tr>
<tr><td>15–19</td><td>Case study: Intel 8085 — block diagram, pins, timing</td><td>read a timing diagram: machine cycles, T-states, ALE/RD/WR</td></tr>
<tr><td>20–22</td><td>Hardwired implementation</td><td>write a control signal as a Boolean equation of cycle, timing and opcode</td></tr>
<tr><td>23–31</td><td>Microprogrammed control and Wilkes's original design</td><td>trace a microprogram through control memory, CAR and CBR</td></tr>
</tbody>
</table>`,
`<span class="eyebrow">⭐ Chuyên sâu · Bài CS.4 · deck chính hãng CEA19 (Stallings Ch.19, 32 slide) · web bổ sung</span>
<h2>Khối điều khiển: "nạp, giải mã, thực thi" biến thành một chuỗi tín hiệu điều khiển ra sao — điều khiển cứng hay vi chương trình</h2>
<p class="lead">Chương 3 mô tả chu trình lệnh, Chương 12 mô tả các thanh ghi, nhưng còn bỏ ngỏ một câu: <em>ai mở đường từ PC sang MAR đúng vào nhịp đồng hồ cần thiết?</em> Đó là khối điều khiển (control unit). Bài này bẻ mọi lệnh thành các <strong>vi thao tác</strong> (micro-operation), gắn mỗi vi thao tác với <strong>tín hiệu điều khiển</strong> làm nó xảy ra, và so hai cách dựng khối này — một mạch logic cố định (điều khiển cứng, hardwired) hoặc một chương trình tí hon trong bộ nhớ điều khiển (vi chương trình, microprogrammed).</p>
<p class="nhan">Nguồn: bộ slide chính hãng Stallings (COA 11e, Global Edition), Chapter 19 "Control Unit Operation and Microprogrammed Control" — deck CEA19 · có trong bộ slide của môn nhưng KHÔNG nằm trong lịch 60 buổi</p>
<div class="note-ct">CuongThai bổ sung (không phải quy định của trường). Bộ mô phỏng ở phần thực hành được viết cho trang này; vi thao tác và tín hiệu điều khiển của nó theo Table 19.1 và Hình 19.5 của deck.</div>
<h3>Vì sao vẫn còn quan trọng</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">x86 hôm nay</div><div class="lz-t">lệnh → µop</div><div class="lz-d">bộ giải mã của mọi nhân Intel/AMD tách lệnh phức tạp thành vi thao tác (phần front end ở Chương 14)</div></div>
  <div class="lz-step"><div class="lz-k">Vi mã</div><div class="lz-t">một chương trình bên trong CPU</div><div class="lz-d">các lệnh hiếm, phức tạp vẫn chạy từ bộ nhớ điều khiển trên chip</div></div>
  <div class="lz-step"><div class="lz-k">2018</div><div class="lz-t">cập nhật vi mã</div><div class="lz-d">một phần bản vá Spectre được phát hành dưới dạng vi mã mà hệ điều hành nạp lúc khởi động (bài N3.1)</div></div>
  <div class="lz-step"><div class="lz-k">RISC</div><div class="lz-t">điều khiển cứng</div><div class="lz-d">lệnh đơn giản, độ dài cố định cho phép nhân ARM và RISC-V giải mã bằng logic thuần (Chương 13)</div></div>
</div>
<h3>Bản đồ slide</h3>
<table>
<thead><tr><th>Slide</th><th>Ý chính</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–9</td><td>Vi thao tác của nạp, gián tiếp, ngắt, thực thi; lưu đồ chu trình lệnh</td><td>viết vi thao tác t1/t2/t3 cho mọi lệnh đơn giản</td></tr>
<tr><td>10–14</td><td>Khối điều khiển phải làm gì; đường dữ liệu và tín hiệu điều khiển; bus nội</td><td>gọi tên tín hiệu mở từng đường trong Hình 19.5</td></tr>
<tr><td>15–19</td><td>Ví dụ thật: Intel 8085 — sơ đồ khối, chân, giản đồ thời gian</td><td>đọc giản đồ thời gian: chu kỳ máy, trạng thái T, ALE/RD/WR</td></tr>
<tr><td>20–22</td><td>Hiện thực điều khiển cứng</td><td>viết một tín hiệu điều khiển thành biểu thức Boole của chu kỳ, nhịp và opcode</td></tr>
<tr><td>23–31</td><td>Điều khiển vi chương trình và thiết kế gốc của Wilkes</td><td>lần theo một vi chương trình qua bộ nhớ điều khiển, CAR và CBR</td></tr>
</tbody>
</table>`);

/* ───────────── Giảng theo từng slide ───────────── */
const SLIDES = walk(D, [
  [1, 'Chapter 19 — Control Unit Operation and Microprogrammed Control (title slide)',
    `<p class="y-chinh">🎯 The last piece of the processor puzzle: the ALU computes, registers store, buses carry — and the control unit decides <strong>what happens in each clock cycle</strong>.</p>
<p>The chapter has two halves. Slides 2–22: what the control unit must make happen (micro-operations and control signals) and how to do it with fixed logic. Slides 23–31: the alternative invented by Maurice Wilkes in 1951 — store the control signals as words in a memory and "run" them like a program.</p>
<p class="meo">💡 Analogy for the whole chapter: a machine instruction is a recipe step ("make the sauce"); micro-operations are the hand movements ("open the fridge, take the tomatoes, …"); control signals are the nerve impulses that move each muscle. The control unit is the part of the brain that turns the recipe into impulses.</p>`,
    `<p class="y-chinh">🎯 Mảnh cuối của bức tranh bộ xử lý: ALU tính, thanh ghi giữ, bus chở — và khối điều khiển quyết định <strong>điều gì xảy ra trong mỗi chu kỳ đồng hồ</strong>.</p>
<p>Chương có hai nửa. Slide 2–22: khối điều khiển phải làm cho điều gì xảy ra (vi thao tác và tín hiệu điều khiển) và làm việc đó bằng logic cố định ra sao. Slide 23–31: lựa chọn thay thế do Maurice Wilkes nghĩ ra năm 1951 — lưu tín hiệu điều khiển thành các từ trong một bộ nhớ rồi "chạy" chúng như một chương trình.</p>
<p class="meo">💡 Hình ảnh cho cả chương: một lệnh máy là một bước trong công thức nấu ăn ("làm nước sốt"); vi thao tác là các động tác tay ("mở tủ lạnh, lấy cà chua, …"); tín hiệu điều khiển là xung thần kinh làm từng cơ bắp cử động. Khối điều khiển là phần não biến công thức thành xung thần kinh.</p>`],

  [2, 'Micro-Operations',
    `<p class="y-chinh">🎯 A <strong>micro-operation</strong> is the atomic step of a processor: a simple transfer or operation between registers, which accomplishes very little. A program is a sequence of instructions; each instruction runs as an instruction cycle made of subcycles (fetch, indirect, execute, interrupt); each subcycle is one or more micro-operations.</p>
<p>"Micro" means small, not microscopic in size: MAR ← (PC) is one micro-operation — copy one register into another. Loading a value from memory needs several of them, because memory sits on the other side of the bus and the CPU can only talk to it through MAR (address) and MBR (data).</p>
<p>Notation used everywhere in the chapter: <code>X ← (Y)</code> means "the contents of Y are copied into X"; <code>(PC) + I</code> means the contents of PC plus the length of one instruction.</p>`,
    `<p class="y-chinh">🎯 <strong>Vi thao tác</strong> (micro-operation) là bước nguyên tử của bộ xử lý: một phép chuyển hoặc phép tính đơn giản giữa các thanh ghi, làm được rất ít việc. Một chương trình là dãy lệnh; mỗi lệnh chạy thành một chu trình lệnh gồm các chu kỳ con (nạp, gián tiếp, thực thi, ngắt); mỗi chu kỳ con là một hoặc nhiều vi thao tác.</p>
<p>"Vi" nghĩa là nhỏ về khối lượng việc, không phải kích thước: MAR ← (PC) là một vi thao tác — chép một thanh ghi sang thanh ghi khác. Nạp một giá trị từ bộ nhớ cần vài vi thao tác, vì bộ nhớ nằm ở phía bên kia bus và CPU chỉ nói chuyện với nó qua MAR (địa chỉ) và MBR (dữ liệu).</p>
<p>Ký hiệu dùng suốt chương: <code>X ← (Y)</code> nghĩa là "nội dung của Y được chép vào X"; <code>(PC) + I</code> là nội dung PC cộng độ dài một lệnh.</p>`],

  [3, 'Figure 19.1 Constituent Elements of a Program Execution',
    `<p class="y-chinh">🎯 A tree with four levels: <strong>program execution</strong> → many <strong>instruction cycles</strong> → each made of <strong>fetch, indirect, execute, interrupt</strong> subcycles → each made of <strong>µOPs</strong>.</p>
<p>Notice in the figure that the fetch subcycle has three µOPs and indirect has two drawn; execute and interrupt have a variable fan of lines. Fetch and indirect are the same for every instruction; execute depends on the opcode; interrupt happens only when an enabled interrupt is pending. The control unit's job is to emit the right µOPs at the bottom of this tree, in the right order.</p>
<p class="meo">💡 Keep the tree in mind when reading the simulator output below: each printed line is one leaf (one µOP), and the "-&gt; giai ma" lines are where one subcycle hands over to the next.</p>`,
    `<p class="y-chinh">🎯 Một cây bốn tầng: <strong>thực thi chương trình</strong> → nhiều <strong>chu trình lệnh</strong> → mỗi chu trình gồm các chu kỳ con <strong>nạp, gián tiếp, thực thi, ngắt</strong> → mỗi chu kỳ con gồm các <strong>µOP</strong>.</p>
<p>Để ý trên hình chu kỳ nạp vẽ ba µOP còn gián tiếp vẽ hai; thực thi và ngắt có một chùm đường số lượng thay đổi. Nạp và gián tiếp giống nhau với mọi lệnh; thực thi tuỳ opcode; ngắt chỉ xảy ra khi có ngắt được phép đang chờ. Việc của khối điều khiển là phát ra đúng các µOP ở đáy cây, đúng thứ tự.</p>
<p class="meo">💡 Giữ cây này trong đầu khi đọc output của bộ mô phỏng bên dưới: mỗi dòng in ra là một lá (một µOP), còn các dòng "-&gt; giai ma" là chỗ một chu kỳ con trao tay cho chu kỳ con kế tiếp.</p>`],

  [4, 'The Fetch Cycle',
    `<p class="y-chinh">🎯 Fetch happens at the start of every instruction cycle and brings the next instruction from memory. Four registers: <strong>MAR</strong> (on the address bus — the address to read or write), <strong>MBR</strong> (on the data bus — data to write or last data read), <strong>PC</strong> (address of the next instruction), <strong>IR</strong> (the instruction just fetched).</p>
<table>
<thead><tr><th>register</th><th>connected to</th><th>holds</th></tr></thead>
<tbody>
<tr><td>MAR</td><td>address bus</td><td>the address for the next memory read/write</td></tr>
<tr><td>MBR</td><td>data bus</td><td>the word to write, or the word just read</td></tr>
<tr><td>PC</td><td>internal</td><td>the address of the next instruction</td></tr>
<tr><td>IR</td><td>control unit</td><td>the instruction being executed</td></tr>
</tbody>
</table>
<p>MAR and MBR are the CPU's two "windows" onto memory — nothing else in the CPU touches the buses directly. That is why every memory access costs at least two micro-operations: put the address in MAR, then read into or write from MBR.</p>`,
    `<p class="y-chinh">🎯 Nạp xảy ra ở đầu mọi chu trình lệnh và mang lệnh kế tiếp từ bộ nhớ về. Bốn thanh ghi: <strong>MAR</strong> (nối bus địa chỉ — địa chỉ cần đọc/ghi), <strong>MBR</strong> (nối bus dữ liệu — dữ liệu cần ghi hoặc dữ liệu vừa đọc), <strong>PC</strong> (địa chỉ lệnh kế tiếp), <strong>IR</strong> (lệnh vừa nạp).</p>
<table>
<thead><tr><th>thanh ghi</th><th>nối với</th><th>chứa</th></tr></thead>
<tbody>
<tr><td>MAR</td><td>bus địa chỉ</td><td>địa chỉ cho lần đọc/ghi bộ nhớ kế tiếp</td></tr>
<tr><td>MBR</td><td>bus dữ liệu</td><td>từ cần ghi, hoặc từ vừa đọc</td></tr>
<tr><td>PC</td><td>bên trong</td><td>địa chỉ lệnh kế tiếp</td></tr>
<tr><td>IR</td><td>khối điều khiển</td><td>lệnh đang thực thi</td></tr>
</tbody>
</table>
<p>MAR và MBR là hai "cửa sổ" của CPU nhìn ra bộ nhớ — không thứ gì khác trong CPU chạm trực tiếp vào bus. Vì thế mọi lần truy cập bộ nhớ tốn ít nhất hai vi thao tác: đặt địa chỉ vào MAR, rồi đọc vào hoặc ghi ra từ MBR.</p>`],

  [5, 'Figure 19.2 Sequence of Events, Fetch Cycle',
    `<p class="y-chinh">🎯 Four snapshots of the registers. (a) PC = 0000000001100100 (= 100). (b) After t1: MAR = 100. (c) After t2: MBR = 0001000000100000 (the instruction read from address 100) and PC = 101. (d) After t3: IR = 0001000000100000.</p>
<div class="formula">t1: MAR ← (PC) &nbsp;·&nbsp; t2: MBR ← Memory, PC ← (PC) + I &nbsp;·&nbsp; t3: IR ← (MBR)</div>
<p>Two rules decide how micro-operations are grouped into time units: the <strong>order must be respected</strong> (MAR must hold the address before the memory read), and <strong>no conflicts</strong> (a register cannot be read and written in the same time unit, and memory cannot be read and written at once). PC ← PC + I goes into t2 because it has nothing to do with the memory read and does not conflict with it — putting it there saves a whole time unit.</p>
<div class="pitfall co-tieu-de"><strong>Typo in part (a).</strong> The first register label reads "tMAR"; it is MAR, as in parts (b)–(d).</div>
<p class="meo">💡 Decode the instruction yourself: 0001 0000 0010 0000 = 0x1020 — in a format with a 4-bit opcode and a 12-bit address, opcode 1 and address 0x020. In MARIE (lesson N1.1) opcode 1 is <code>Load</code>.</p>`,
    `<p class="y-chinh">🎯 Bốn ảnh chụp các thanh ghi. (a) PC = 0000000001100100 (= 100). (b) Sau t1: MAR = 100. (c) Sau t2: MBR = 0001000000100000 (lệnh đọc từ địa chỉ 100) và PC = 101. (d) Sau t3: IR = 0001000000100000.</p>
<div class="formula">t1: MAR ← (PC) &nbsp;·&nbsp; t2: MBR ← Bộ nhớ, PC ← (PC) + I &nbsp;·&nbsp; t3: IR ← (MBR)</div>
<p>Hai luật quyết định cách gom vi thao tác vào các đơn vị thời gian: <strong>phải đúng thứ tự</strong> (MAR phải có địa chỉ trước khi đọc bộ nhớ), và <strong>không xung đột</strong> (một thanh ghi không thể vừa bị đọc vừa bị ghi trong cùng một đơn vị thời gian, bộ nhớ không thể vừa đọc vừa ghi). PC ← PC + I được đặt vào t2 vì nó không liên quan tới việc đọc bộ nhớ và không xung đột với nó — đặt ở đó tiết kiệm trọn một đơn vị thời gian.</p>
<div class="pitfall co-tieu-de"><strong>Lỗi gõ ở phần (a).</strong> Nhãn thanh ghi đầu tiên ghi "tMAR"; đó là MAR, như ở phần (b)–(d).</div>
<p class="meo">💡 Tự giải mã lệnh: 0001 0000 0010 0000 = 0x1020 — với khuôn dạng opcode 4 bit và địa chỉ 12 bit, đó là opcode 1 và địa chỉ 0x020. Trong MARIE (bài N1.1) opcode 1 là <code>Load</code>.</p>`],

  [6, 'Indirect Cycle',
    `<p class="y-chinh">🎯 If the instruction uses an <strong>indirect address</strong>, an indirect cycle comes before execute: MAR ← IR(address), MBR ← Memory, then IR(address) ← MBR(address). Afterwards the IR looks exactly as if the instruction had used a direct address.</p>
<div class="formula">t1: MAR ← (IR(Address)) &nbsp;·&nbsp; t2: MBR ← Memory &nbsp;·&nbsp; t3: IR(Address) ← (MBR(Address))</div>
<p>Indirect addressing (Chapter 11: EA = (A)) means the address field holds the address <em>of</em> the operand's address. The trick of this cycle is elegant: instead of building a special execute sequence for every indirect instruction, it rewrites the address field in IR, so the normal execute micro-operations work unchanged.</p>
<p class="meo">💡 Cost visible in the simulator: the indirect ADD takes 9 micro-steps, the direct LOAD only 6 — one extra memory access, three extra time units.</p>`,
    `<p class="y-chinh">🎯 Nếu lệnh dùng <strong>địa chỉ gián tiếp</strong>, một chu kỳ gián tiếp diễn ra trước thực thi: MAR ← IR(địa chỉ), MBR ← Bộ nhớ, rồi IR(địa chỉ) ← MBR(địa chỉ). Sau đó IR trông y như lệnh đã dùng địa chỉ trực tiếp.</p>
<div class="formula">t1: MAR ← (IR(Address)) &nbsp;·&nbsp; t2: MBR ← Bộ nhớ &nbsp;·&nbsp; t3: IR(Address) ← (MBR(Address))</div>
<p>Địa chỉ gián tiếp (Chương 11: EA = (A)) nghĩa là trường địa chỉ chứa địa chỉ <em>của</em> địa chỉ toán hạng. Mẹo của chu kỳ này rất gọn: thay vì dựng một dãy thực thi riêng cho mọi lệnh gián tiếp, nó viết lại trường địa chỉ trong IR, nên các vi thao tác thực thi bình thường dùng được nguyên vẹn.</p>
<p class="meo">💡 Cái giá thấy được trong bộ mô phỏng: ADD gián tiếp tốn 9 bước vi lệnh, LOAD trực tiếp chỉ 6 — thêm một lần truy cập bộ nhớ, thêm ba đơn vị thời gian.</p>`],

  [7, 'Interrupt Cycle',
    `<p class="y-chinh">🎯 After execute, the processor checks for enabled interrupts. If one is pending: t1 MBR ← (PC); t2 MAR ← Save_Address and PC ← Routine_Address; t3 Memory ← (MBR). The old PC is saved, and the next fetch starts the interrupt handler.</p>
<div class="formula">t1: MBR ← (PC) &nbsp;·&nbsp; t2: MAR ← Save_Address, PC ← Routine_Address &nbsp;·&nbsp; t3: Memory ← (MBR)</div>
<p>The slide stresses that this cycle "varies greatly from one machine to another": where the old PC is saved (a fixed address, a stack), and how Save_Address and Routine_Address are obtained (with several interrupt types or priority levels, extra micro-operations may be needed to find them — the interrupt vector of Chapter 7). Real CPUs also save the flags/status register.</p>
<p>In the simulator below, the interrupt arrives after STORE: the old PC 0x103 is saved at 0xF00 and the CPU jumps to the handler at 0x200 — exactly the three steps of this slide.</p>`,
    `<p class="y-chinh">🎯 Sau thực thi, bộ xử lý kiểm xem có ngắt được phép nào không. Nếu có ngắt đang chờ: t1 MBR ← (PC); t2 MAR ← Save_Address và PC ← Routine_Address; t3 Bộ nhớ ← (MBR). PC cũ được cất, và lần nạp kế tiếp sẽ bắt đầu trình phục vụ ngắt.</p>
<div class="formula">t1: MBR ← (PC) &nbsp;·&nbsp; t2: MAR ← Save_Address, PC ← Routine_Address &nbsp;·&nbsp; t3: Bộ nhớ ← (MBR)</div>
<p>Slide nhấn mạnh chu kỳ này "khác nhau rất nhiều giữa các máy": PC cũ được cất ở đâu (một địa chỉ cố định, một ngăn xếp), và Save_Address với Routine_Address lấy từ đâu (khi có nhiều loại hoặc nhiều mức ưu tiên ngắt, có thể cần thêm vi thao tác để tìm chúng — bảng vector ngắt của Chương 7). CPU thật còn cất cả thanh ghi cờ/trạng thái.</p>
<p>Trong bộ mô phỏng bên dưới, ngắt tới sau STORE: PC cũ 0x103 được cất ở 0xF00 và CPU nhảy tới trình phục vụ ở 0x200 — đúng ba bước của slide này.</p>`],

  [8, 'Execute Cycle',
    `<p class="y-chinh">🎯 Fetch, indirect and interrupt are the same for every instruction; execute is different for every opcode. The control unit <strong>decodes</strong> the opcode and generates the matching sequence. Example: ADD R1, X → t1 MAR ← IR(address); t2 MBR ← Memory; t3 R1 ← (R1) + (MBR).</p>
<p>Two more examples from the textbook, to see how varied execute can be:</p>
<table>
<thead><tr><th>instruction</th><th>micro-operations</th></tr></thead>
<tbody>
<tr><td>ISZ X (increment and skip if zero)</td><td>t1 MAR ← IR(address); t2 MBR ← Memory; t3 MBR ← MBR + 1; t4 Memory ← MBR, and if MBR = 0 then PC ← PC + I</td></tr>
<tr><td>BSA X (branch and save address — a subroutine call)</td><td>t1 MAR ← IR(address), MBR ← PC; t2 PC ← IR(address), Memory ← MBR; t3 PC ← PC + I</td></tr>
</tbody>
</table>
<p>The slide also warns that extra micro-operations may be needed to pick the register named in the IR or to stage ALU inputs and outputs in temporary registers — slide 14 shows a case (Y and Z).</p>`,
    `<p class="y-chinh">🎯 Nạp, gián tiếp và ngắt giống nhau với mọi lệnh; thực thi thì khác với từng opcode. Khối điều khiển <strong>giải mã</strong> opcode và sinh ra dãy tương ứng. Ví dụ: ADD R1, X → t1 MAR ← IR(địa chỉ); t2 MBR ← Bộ nhớ; t3 R1 ← (R1) + (MBR).</p>
<p>Thêm hai ví dụ của giáo trình, để thấy pha thực thi đa dạng cỡ nào:</p>
<table>
<thead><tr><th>lệnh</th><th>vi thao tác</th></tr></thead>
<tbody>
<tr><td>ISZ X (tăng rồi bỏ qua nếu bằng 0)</td><td>t1 MAR ← IR(địa chỉ); t2 MBR ← Bộ nhớ; t3 MBR ← MBR + 1; t4 Bộ nhớ ← MBR, và nếu MBR = 0 thì PC ← PC + I</td></tr>
<tr><td>BSA X (nhảy và cất địa chỉ — một lời gọi chương trình con)</td><td>t1 MAR ← IR(địa chỉ), MBR ← PC; t2 PC ← IR(địa chỉ), Bộ nhớ ← MBR; t3 PC ← PC + I</td></tr>
</tbody>
</table>
<p>Slide còn nhắc có thể cần thêm vi thao tác để chọn thanh ghi mà IR chỉ định hoặc để đặt tạm đầu vào/đầu ra của ALU vào thanh ghi trung gian — slide 14 cho một ca như vậy (Y và Z).</p>`],

  [9, 'Figure 19.3 Flowchart for Instruction Cycle',
    `<p class="y-chinh">🎯 A 2-bit register <strong>ICC</strong> (instruction cycle code) remembers which subcycle comes next: <strong>00 fetch</strong>, <strong>01 indirect</strong>, <strong>10 execute</strong>, <strong>11 interrupt</strong>. Each subcycle ends by setting ICC.</p>
<pre><code class="language-mermaid">stateDiagram-v2
  [*] --> Fetch
  Fetch --> Indirect: indirect address (ICC = 01)
  Fetch --> Execute: direct address (ICC = 10)
  Indirect --> Execute: ICC = 10
  Execute --> Interrupt: enabled interrupt pending (ICC = 11)
  Execute --> Fetch: no interrupt (ICC = 00)
  Interrupt --> Fetch: ICC = 00
</code></pre>
<p>This is a <strong>state machine</strong> with four states — the first hint that a control unit can be built as plain sequential logic (slide 20). In the simulator, the next-address column of the control memory ("I=1 ? IND : opcode", "ngat ? INT : FETCH") implements exactly these arrows.</p>
<div class="pitfall co-tieu-de"><strong>Typo on the figure.</strong> The box under "00 (fetch)" reads "Fetch intstruction" — "instruction".</div>`,
    `<p class="y-chinh">🎯 Một thanh ghi 2 bit <strong>ICC</strong> (instruction cycle code — mã chu kỳ lệnh) nhớ chu kỳ con nào tới lượt: <strong>00 nạp</strong>, <strong>01 gián tiếp</strong>, <strong>10 thực thi</strong>, <strong>11 ngắt</strong>. Mỗi chu kỳ con kết thúc bằng việc đặt ICC.</p>
<pre><code class="language-mermaid">stateDiagram-v2
  [*] --> Nap
  Nap --> GianTiep: địa chỉ gián tiếp (ICC = 01)
  Nap --> ThucThi: địa chỉ trực tiếp (ICC = 10)
  GianTiep --> ThucThi: ICC = 10
  ThucThi --> Ngat: có ngắt được phép đang chờ (ICC = 11)
  ThucThi --> Nap: không có ngắt (ICC = 00)
  Ngat --> Nap: ICC = 00
</code></pre>
<p>Đây là một <strong>máy trạng thái</strong> bốn trạng thái — gợi ý đầu tiên rằng khối điều khiển có thể dựng bằng logic tuần tự thuần (slide 20). Trong bộ mô phỏng, cột "địa chỉ kế" của bộ nhớ điều khiển ("I=1 ? IND : opcode", "ngat ? INT : FETCH") hiện thực đúng các mũi tên này.</p>
<div class="pitfall co-tieu-de"><strong>Lỗi gõ trên hình.</strong> Ô dưới "00 (fetch)" ghi "Fetch intstruction" — đúng là "instruction".</div>`],

  [10, 'Control Unit Functional Requirements',
    `<p class="y-chinh">🎯 Reduce the processor to its most basic level and you can say exactly what the control unit must do. Three steps: define the basic elements of the processor; describe the micro-operations it performs; determine the functions the control unit must perform to make them happen. Result: two tasks — <strong>sequencing</strong> and <strong>execution</strong>.</p>
<ul>
<li><strong>Sequencing</strong>: step through the micro-operations in the proper order, based on the program being executed (which subcycle, which time step, which opcode).</li>
<li><strong>Execution</strong>: cause each micro-operation to be performed — that is, raise the right control signals.</li>
</ul>
<p>The basic elements are few: ALU, registers, internal data paths, external data paths (buses), and the control unit itself. Every micro-operation is one of four kinds: register → register, register → external bus, external bus → register, or an ALU operation between registers.</p>`,
    `<p class="y-chinh">🎯 Rút bộ xử lý về tầng cơ bản nhất thì nói được chính xác khối điều khiển phải làm gì. Ba bước: xác định các thành phần cơ bản của bộ xử lý; mô tả các vi thao tác nó thực hiện; xác định các chức năng khối điều khiển phải làm để chúng xảy ra. Kết quả: hai nhiệm vụ — <strong>tuần tự hoá</strong> (sequencing) và <strong>thực thi</strong> (execution).</p>
<ul>
<li><strong>Tuần tự hoá</strong>: đi qua các vi thao tác đúng thứ tự, dựa trên chương trình đang chạy (chu kỳ con nào, bước thời gian nào, opcode nào).</li>
<li><strong>Thực thi</strong>: làm cho từng vi thao tác xảy ra — tức là bật đúng các tín hiệu điều khiển.</li>
</ul>
<p>Thành phần cơ bản rất ít: ALU, thanh ghi, đường dữ liệu nội, đường dữ liệu ngoài (bus), và chính khối điều khiển. Mọi vi thao tác thuộc một trong bốn loại: thanh ghi → thanh ghi, thanh ghi → bus ngoài, bus ngoài → thanh ghi, hoặc một phép ALU giữa các thanh ghi.</p>`],

  [11, 'Figure 19.4 Block Diagram of the Control Unit',
    `<p class="y-chinh">🎯 Inputs: the <strong>instruction register</strong> (opcode), the <strong>flags</strong>, the <strong>clock</strong>, and <strong>control signals from the control bus</strong> (interrupt requests, acknowledgements). Outputs: <strong>control signals within the CPU</strong> (open/close register paths, select the ALU function) and <strong>control signals to the control bus</strong> (memory read/write, I/O).</p>
<ul>
<li><strong>Clock</strong>: one pulse per time unit — the t1, t2, t3 of the previous slides.</li>
<li><strong>IR</strong>: the opcode decides which execute sequence to run.</li>
<li><strong>Flags</strong>: needed for conditional decisions, e.g. ISZ and conditional branches.</li>
<li><strong>Control bus in</strong>: interrupt and acknowledge signals from outside the CPU.</li>
</ul>
<p class="meo">💡 Everything the control unit "knows" comes through these four inputs. If you can list them, you can write the control logic as a function: signals = f(timing, opcode, flags, external requests). That function is what slides 20–31 implement in two different ways.</p>`,
    `<p class="y-chinh">🎯 Đầu vào: <strong>thanh ghi lệnh</strong> (opcode), các <strong>cờ</strong>, <strong>đồng hồ</strong>, và <strong>tín hiệu điều khiển từ bus điều khiển</strong> (yêu cầu ngắt, tín hiệu xác nhận). Đầu ra: <strong>tín hiệu điều khiển bên trong CPU</strong> (mở/đóng đường giữa các thanh ghi, chọn phép của ALU) và <strong>tín hiệu điều khiển ra bus điều khiển</strong> (đọc/ghi bộ nhớ, I/O).</p>
<ul>
<li><strong>Đồng hồ</strong>: mỗi đơn vị thời gian một xung — chính là t1, t2, t3 của các slide trước.</li>
<li><strong>IR</strong>: opcode quyết định chạy dãy thực thi nào.</li>
<li><strong>Cờ</strong>: cần cho quyết định có điều kiện, vd ISZ và lệnh rẽ nhánh có điều kiện.</li>
<li><strong>Bus điều khiển vào</strong>: tín hiệu ngắt và xác nhận từ bên ngoài CPU.</li>
</ul>
<p class="meo">💡 Mọi thứ khối điều khiển "biết" đều đi qua bốn đầu vào này. Liệt kê được chúng là viết được logic điều khiển thành một hàm: tín hiệu = f(nhịp, opcode, cờ, yêu cầu ngoài). Hàm đó là thứ slide 20–31 hiện thực theo hai cách khác nhau.</p>`],

  [12, 'Figure 19.5 Data Paths and Control Signals',
    `<p class="y-chinh">🎯 A simple accumulator CPU drawn with every data path and the gate that controls it. Each small circle on a path is a gate; the label C<sub>i</sub> next to it is the control signal that opens it. Raise C2 and PC's contents flow into MAR; raise C4 and MBR flows into IR.</p>
<table>
<thead><tr><th>signal</th><th>opens the path</th><th>used in (Table 19.1)</th></tr></thead>
<tbody>
<tr><td>C2</td><td>PC → MAR</td><td>fetch t1</td></tr>
<tr><td>C5</td><td>data bus → MBR</td><td>fetch t2, indirect t2</td></tr>
<tr><td>C4</td><td>MBR → IR</td><td>fetch t3, indirect t3</td></tr>
<tr><td>C8</td><td>address field → MAR</td><td>indirect t1</td></tr>
<tr><td>C1</td><td>PC → MBR</td><td>interrupt t1</td></tr>
<tr><td>C12</td><td>MBR → data bus</td><td>interrupt t3</td></tr>
</tbody>
</table>
<p>Read from the figure (not in Table 19.1): C10 carries MBR into AC, C11 carries AC into MBR, C6 and C7 feed MBR and AC into the ALU, C9 writes the ALU result into AC, C3 loads PC from the MBR path, C0 puts MAR on the address bus, and C13 passes IR to the control unit. The simulator uses C10, C11 and C6 + C7 + C9 for LOAD, STORE and ADD, labelled as read from this figure.</p>
<p class="meo">💡 The whole idea of "control" fits in one sentence: a micro-operation happens exactly when the control signals of the gates on its path are 1 during that clock period.</p>`,
    `<p class="y-chinh">🎯 Một CPU kiểu thanh ghi tích luỹ đơn giản, vẽ đủ mọi đường dữ liệu và cổng điều khiển nó. Mỗi vòng tròn nhỏ trên đường là một cổng; nhãn C<sub>i</sub> cạnh nó là tín hiệu điều khiển mở cổng đó. Bật C2 thì nội dung PC chảy vào MAR; bật C4 thì MBR chảy vào IR.</p>
<table>
<thead><tr><th>tín hiệu</th><th>mở đường</th><th>dùng ở (Table 19.1)</th></tr></thead>
<tbody>
<tr><td>C2</td><td>PC → MAR</td><td>nạp t1</td></tr>
<tr><td>C5</td><td>bus dữ liệu → MBR</td><td>nạp t2, gián tiếp t2</td></tr>
<tr><td>C4</td><td>MBR → IR</td><td>nạp t3, gián tiếp t3</td></tr>
<tr><td>C8</td><td>trường địa chỉ → MAR</td><td>gián tiếp t1</td></tr>
<tr><td>C1</td><td>PC → MBR</td><td>ngắt t1</td></tr>
<tr><td>C12</td><td>MBR → bus dữ liệu</td><td>ngắt t3</td></tr>
</tbody>
</table>
<p>Đọc từ hình (không có trong Table 19.1): C10 đưa MBR vào AC, C11 đưa AC vào MBR, C6 và C7 đưa MBR và AC vào ALU, C9 ghi kết quả ALU vào AC, C3 nạp PC từ đường MBR, C0 đặt MAR lên bus địa chỉ, và C13 chuyển IR cho khối điều khiển. Bộ mô phỏng dùng C10, C11 và C6 + C7 + C9 cho LOAD, STORE và ADD, có ghi rõ là đọc từ hình này.</p>
<p class="meo">💡 Toàn bộ ý "điều khiển" gói trong một câu: một vi thao tác xảy ra đúng khi tín hiệu điều khiển của các cổng trên đường của nó bằng 1 trong chu kỳ đồng hồ đó.</p>`],

  [13, 'Table 19.1 Micro-operations and Control Signals',
    `<p class="y-chinh">🎯 The bridge between the two worlds: each micro-operation of fetch, indirect and interrupt, with the active control signals. C<sub>R</sub> = read signal to the system bus, C<sub>W</sub> = write signal.</p>
<table>
<thead><tr><th>cycle</th><th>t</th><th>micro-operations</th><th>signals</th></tr></thead>
<tbody>
<tr><td rowspan="3">Fetch</td><td>t1</td><td>MAR ← (PC)</td><td>C2</td></tr>
<tr><td>t2</td><td>MBR ← Memory; PC ← (PC) + 1</td><td>C5, C<sub>R</sub></td></tr>
<tr><td>t3</td><td>IR ← (MBR)</td><td>C4</td></tr>
<tr><td rowspan="3">Indirect</td><td>t1</td><td>MAR ← (IR(Address))</td><td>C8</td></tr>
<tr><td>t2</td><td>MBR ← Memory</td><td>C5, C<sub>R</sub></td></tr>
<tr><td>t3</td><td>IR(Address) ← (MBR(Address))</td><td>C4</td></tr>
<tr><td rowspan="3">Interrupt</td><td>t1</td><td>MBR ← (PC)</td><td>C1</td></tr>
<tr><td>t2</td><td>MAR ← Save-address; PC ← Routine-address</td><td>(blank on the slide)</td></tr>
<tr><td>t3</td><td>Memory ← (MBR)</td><td>C12, C<sub>W</sub></td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Two gaps in the table.</strong> Interrupt t2 lists <strong>no signals at all</strong> — the textbook leaves it open because Save-address and Routine-address depend on the machine; and PC ← (PC) + 1 in fetch t2 has no C signal (the increment is done inside the PC). Do not invent signals for those cells in an exam answer; say they are machine-specific.</div>
<p>The simulator below prints these exact pairs (micro-operation, signals) for every step it executes, and adds the execute-phase signals read from Figure 19.5.</p>`,
    `<p class="y-chinh">🎯 Cây cầu giữa hai thế giới: mỗi vi thao tác của nạp, gián tiếp và ngắt, cùng các tín hiệu điều khiển được bật. C<sub>R</sub> = tín hiệu đọc ra bus hệ thống, C<sub>W</sub> = tín hiệu ghi.</p>
<table>
<thead><tr><th>chu kỳ</th><th>t</th><th>vi thao tác</th><th>tín hiệu</th></tr></thead>
<tbody>
<tr><td rowspan="3">Nạp</td><td>t1</td><td>MAR ← (PC)</td><td>C2</td></tr>
<tr><td>t2</td><td>MBR ← Bộ nhớ; PC ← (PC) + 1</td><td>C5, C<sub>R</sub></td></tr>
<tr><td>t3</td><td>IR ← (MBR)</td><td>C4</td></tr>
<tr><td rowspan="3">Gián tiếp</td><td>t1</td><td>MAR ← (IR(Address))</td><td>C8</td></tr>
<tr><td>t2</td><td>MBR ← Bộ nhớ</td><td>C5, C<sub>R</sub></td></tr>
<tr><td>t3</td><td>IR(Address) ← (MBR(Address))</td><td>C4</td></tr>
<tr><td rowspan="3">Ngắt</td><td>t1</td><td>MBR ← (PC)</td><td>C1</td></tr>
<tr><td>t2</td><td>MAR ← Save-address; PC ← Routine-address</td><td>(slide để trống)</td></tr>
<tr><td>t3</td><td>Bộ nhớ ← (MBR)</td><td>C12, C<sub>W</sub></td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Hai chỗ trống trong bảng.</strong> Bước t2 của ngắt <strong>không ghi tín hiệu nào</strong> — giáo trình để ngỏ vì Save-address và Routine-address tuỳ máy; và PC ← (PC) + 1 ở bước t2 của nạp không có tín hiệu C (phép tăng làm bên trong PC). Đi thi đừng bịa tín hiệu cho các ô đó; hãy nói chúng tuỳ thuộc từng máy.</div>
<p>Bộ mô phỏng bên dưới in đúng các cặp (vi thao tác, tín hiệu) này cho mọi bước nó chạy, và bổ sung tín hiệu pha thực thi đọc từ Hình 19.5.</p>`],

  [14, 'Figure 19.6 CPU with Internal Bus',
    `<p class="y-chinh">🎯 Most CPUs connect registers through one or more <strong>internal buses</strong> instead of point-to-point paths. Here IR, PC, MAR, MBR, AC, a temporary register <strong>Y</strong> and an output register <strong>Z</strong> around the ALU all hang off one internal CPU bus.</p>
<p>A bus carries one value per time unit, but the ALU needs two inputs at once and produces an output. Hence Y (holds one input while the other arrives over the bus) and Z (holds the result until the bus is free). ADD X becomes five steps instead of three:</p>
<div class="formula">t1: MAR ← IR(address) · t2: MBR ← Memory · t3: Y ← (MBR) · t4: Z ← (AC) + (Y) · t5: AC ← (Z)</div>
<p>This is the classic design trade-off of the whole course in miniature: one shared bus is cheap in wires but costs time units; more paths cost silicon but save cycles.</p>`,
    `<p class="y-chinh">🎯 Đa số CPU nối các thanh ghi bằng một hoặc vài <strong>bus nội</strong> thay vì các đường riêng từng cặp. Ở đây IR, PC, MAR, MBR, AC, thanh ghi tạm <strong>Y</strong> và thanh ghi kết quả <strong>Z</strong> quanh ALU cùng treo trên một bus CPU nội.</p>
<p>Một bus chở được một giá trị mỗi đơn vị thời gian, nhưng ALU cần hai đầu vào cùng lúc và sinh ra một đầu ra. Vì thế có Y (giữ một đầu vào trong khi đầu vào kia tới qua bus) và Z (giữ kết quả tới khi bus rảnh). ADD X thành năm bước thay vì ba:</p>
<div class="formula">t1: MAR ← IR(address) · t2: MBR ← Bộ nhớ · t3: Y ← (MBR) · t4: Z ← (AC) + (Y) · t5: AC ← (Z)</div>
<p>Đây là sự đánh đổi thiết kế kinh điển của cả môn thu nhỏ lại: một bus dùng chung thì rẻ dây nhưng tốn đơn vị thời gian; nhiều đường hơn thì tốn silicon nhưng tiết kiệm chu kỳ.</p>`],

  [15, 'Figure 19.7 Intel 8085 CPU Block Diagram',
    `<p class="y-chinh">🎯 A real 8-bit processor (1976) with everything from the previous slides visible: an 8-bit internal data bus, accumulator, temporary register, flags, ALU, instruction register, <strong>instruction decoder and machine cycle encoding</strong>, a register array (B, C, D, E, H, L, stack pointer, program counter, incrementer/decrementer), and a <strong>timing and control</strong> block that drives the external control pins.</p>
<p>Map it onto the abstract model: the "instruction decoder and machine cycle encoding" plus "timing and control" <em>are</em> the control unit; the "temp reg" plays the role of Y on slide 14; the address buffer and address/data buffer are the CPU side of MAR and MBR; the interrupt control block handles INTR, RST 5.5/6.5/7.5 and TRAP — the inputs that trigger the interrupt cycle.</p>`,
    `<p class="y-chinh">🎯 Một bộ xử lý 8 bit thật (1976) có đủ mọi thứ của các slide trước: bus dữ liệu nội 8 bit, thanh ghi tích luỹ, thanh ghi tạm, cờ, ALU, thanh ghi lệnh, <strong>bộ giải mã lệnh và mã hoá chu kỳ máy</strong>, dãy thanh ghi (B, C, D, E, H, L, con trỏ ngăn xếp, bộ đếm chương trình, bộ tăng/giảm), và khối <strong>định thời và điều khiển</strong> lái các chân điều khiển ra ngoài.</p>
<p>Ánh xạ lên mô hình trừu tượng: "bộ giải mã lệnh và mã hoá chu kỳ máy" cộng "định thời và điều khiển" <em>chính là</em> khối điều khiển; "temp reg" đóng vai Y của slide 14; bộ đệm địa chỉ và bộ đệm địa chỉ/dữ liệu là phía CPU của MAR và MBR; khối điều khiển ngắt xử lý INTR, RST 5.5/6.5/7.5 và TRAP — các đầu vào kích hoạt chu kỳ ngắt.</p>`],

  [16, 'Table 19.2 Intel 8085 External Signals (1 of 2)',
    `<p class="y-chinh">🎯 Address and data signals plus timing and control signals of the 8085's pins.</p>
<ul>
<li><strong>A15–A8</strong>: high 8 bits of the 16-bit address. <strong>AD7–AD0</strong>: the low 8 address bits <em>or</em> 8 data bits — <strong>multiplexed</strong> to save pins.</li>
<li><strong>SID / SOD</strong>: one-bit serial input and output.</li>
<li><strong>CLK (OUT)</strong>, <strong>X1, X2</strong>: the clock (from an external crystal) and its copy for peripheral chips.</li>
<li><strong>ALE</strong> (Address Latch Enable): pulses in the first clock state of a machine cycle so external chips latch the address from AD7–AD0 before those pins switch to data.</li>
<li><strong>S0, S1</strong> (status), <strong>IO/M̄</strong> (I/O or memory), <strong>RD̄</strong> (read), <strong>WR̄</strong> (write).</li>
</ul>
<p>RD̄ and WR̄ are exactly the C<sub>R</sub> and C<sub>W</sub> of Table 19.1 — "control signals to the control bus" from the block diagram of slide 11, now as physical pins.</p>`,
    `<p class="y-chinh">🎯 Tín hiệu địa chỉ và dữ liệu cùng tín hiệu định thời và điều khiển của các chân 8085.</p>
<ul>
<li><strong>A15–A8</strong>: 8 bit cao của địa chỉ 16 bit. <strong>AD7–AD0</strong>: 8 bit địa chỉ thấp <em>hoặc</em> 8 bit dữ liệu — <strong>dồn kênh</strong> (multiplexed) để tiết kiệm chân.</li>
<li><strong>SID / SOD</strong>: vào và ra nối tiếp một bit.</li>
<li><strong>CLK (OUT)</strong>, <strong>X1, X2</strong>: đồng hồ (từ thạch anh bên ngoài) và bản sao của nó cho chip ngoại vi.</li>
<li><strong>ALE</strong> (Address Latch Enable — cho phép chốt địa chỉ): phát xung ở trạng thái đồng hồ đầu của một chu kỳ máy để chip bên ngoài chốt địa chỉ từ AD7–AD0 trước khi các chân này chuyển sang chở dữ liệu.</li>
<li><strong>S0, S1</strong> (trạng thái), <strong>IO/M̄</strong> (I/O hay bộ nhớ), <strong>RD̄</strong> (đọc), <strong>WR̄</strong> (ghi).</li>
</ul>
<p>RD̄ và WR̄ chính là C<sub>R</sub> và C<sub>W</sub> của Table 19.1 — "tín hiệu điều khiển ra bus điều khiển" của sơ đồ khối ở slide 11, giờ thành chân vật lý.</p>`],

  [17, 'Table 19.2 Intel 8085 External Signals (2 of 2)',
    `<p class="y-chinh">🎯 Signals started by memory and I/O, interrupt signals, initialisation and power.</p>
<ul>
<li><strong>HOLD / HLDA</strong>: a device (a DMA controller, Chapter 7) asks for the bus; the CPU finishes the current instruction, floats its bus pins and acknowledges.</li>
<li><strong>READY</strong>: a slow memory or I/O device holds the CPU in <strong>wait states</strong> until it is ready.</li>
<li><strong>TRAP, RST 7.5, RST 6.5, RST 5.5, INTR</strong>: five interrupt lines in descending priority; an interrupt is honoured only <strong>at the end of an instruction</strong> and not during HOLD or when disabled — the "check for interrupt after execute" of slide 7. <strong>INTA</strong> acknowledges.</li>
<li><strong>RESET IN</strong> sets PC to 0 (execution restarts at address 0); <strong>RESET OUT</strong> resets the rest of the system. <strong>VCC</strong> +5 V, <strong>VSS</strong> ground.</li>
</ul>
<p class="meo">💡 "PC ← 0 on reset" is why every computer starts by running the code at a fixed address — on a PC that code is the firmware (BIOS/UEFI).</p>`,
    `<p class="y-chinh">🎯 Tín hiệu do bộ nhớ và I/O khởi phát, tín hiệu ngắt, khởi tạo và nguồn.</p>
<ul>
<li><strong>HOLD / HLDA</strong>: một thiết bị (bộ điều khiển DMA, Chương 7) xin bus; CPU làm xong lệnh hiện tại, thả nổi các chân bus và xác nhận.</li>
<li><strong>READY</strong>: thiết bị nhớ hoặc I/O chậm giữ CPU ở các <strong>trạng thái chờ</strong> (wait state) tới khi nó sẵn sàng.</li>
<li><strong>TRAP, RST 7.5, RST 6.5, RST 5.5, INTR</strong>: năm đường ngắt theo độ ưu tiên giảm dần; ngắt chỉ được đáp ứng <strong>ở cuối một lệnh</strong> và không trong lúc HOLD hay khi bị cấm — đúng bước "kiểm ngắt sau thực thi" của slide 7. <strong>INTA</strong> để xác nhận.</li>
<li><strong>RESET IN</strong> đặt PC về 0 (chạy lại từ địa chỉ 0); <strong>RESET OUT</strong> khởi động lại phần còn lại của hệ thống. <strong>VCC</strong> +5 V, <strong>VSS</strong> đất.</li>
</ul>
<p class="meo">💡 "Reset thì PC ← 0" là lý do mọi máy tính khởi động bằng cách chạy mã ở một địa chỉ cố định — trên PC mã đó là firmware (BIOS/UEFI).</p>`],

  [18, 'Figure 19.8 Intel 8085 Pin Configuration',
    `<p class="y-chinh">🎯 All of Table 19.2 on a 40-pin package: X1/X2 (pins 1–2), RESET OUT, SOD, SID, then the interrupts TRAP … INTA on 6–11, AD0–AD7 on 12–19, VSS on 20, A8–A15 on 21–28, the control and status pins on 29–39, VCC on 40.</p>
<div class="pitfall co-tieu-de"><strong>Check the figure against a datasheet.</strong> The drawing labels pin 30 WR̄, pin 31 RD̄ and pin 32 "Vpp", and shows no ALE pin at all. Intel's 8085AH data sheet has <strong>30 = ALE, 31 = WR̄, 32 = RD̄</strong> (pins 29 = S0, 33 = S1, 34 = IO/M̄ as drawn). ALE is listed in Table 19.2 on slide 16, so it must have a pin; treat the right-hand labels of this figure as unreliable.</div>
<p>Why multiplex AD0–AD7? A 16-bit address plus an 8-bit data bus would need 24 pins on their own; with the low address byte and the data sharing 8 pins, the chip fits in 40 pins — at the cost of the ALE pulse and an external latch to split them again. Pins were expensive in 1976; this is the pin-count side of the cost/performance trade-offs in Chapter 3.</p>`,
    `<p class="y-chinh">🎯 Toàn bộ Table 19.2 trên một vỏ 40 chân: X1/X2 (chân 1–2), RESET OUT, SOD, SID, rồi các đường ngắt TRAP … INTA ở 6–11, AD0–AD7 ở 12–19, VSS ở chân 20, A8–A15 ở 21–28, các chân điều khiển và trạng thái ở 29–39, VCC ở chân 40.</p>
<div class="pitfall co-tieu-de"><strong>Đối chiếu hình với datasheet.</strong> Hình vẽ ghi chân 30 là WR̄, chân 31 là RD̄, chân 32 là "Vpp", và không có chân ALE nào. Datasheet 8085AH của Intel ghi <strong>30 = ALE, 31 = WR̄, 32 = RD̄</strong> (chân 29 = S0, 33 = S1, 34 = IO/M̄ thì đúng như hình). ALE có trong Table 19.2 ở slide 16 nên chắc chắn phải có chân; hãy coi các nhãn cạnh phải của hình này là không đáng tin.</div>
<p>Vì sao dồn kênh AD0–AD7? Địa chỉ 16 bit cộng bus dữ liệu 8 bit riêng đã cần 24 chân; cho byte địa chỉ thấp và dữ liệu dùng chung 8 chân thì chip vừa 40 chân — trả giá bằng xung ALE và một mạch chốt bên ngoài để tách chúng ra lại. Năm 1976 chân rất đắt; đây là mặt "số chân" của các đánh đổi chi phí/hiệu năng ở Chương 3.</p>`],

  [19, 'Figure 19.9 Timing Diagram for Intel 8085 OUT Instruction',
    `<p class="y-chinh">🎯 One instruction, <code>OUT byte</code>, takes three <strong>machine cycles</strong>: M1 opcode fetch (4 T-states), M2 memory read of the port number (3 T-states), M3 output write (3 T-states) — 10 clock states at 3 MHz ≈ 3.3 µs.</p>
<table>
<thead><tr><th>machine cycle</th><th>T-states</th><th>what the pins do</th></tr></thead>
<tbody>
<tr><td>M1 instruction fetch</td><td>T1–T4</td><td>PC<sub>H</sub> on A15–A8, PC<sub>L</sub> then INSTR on AD7–AD0; ALE pulse in T1; RD̄ low; then PC + 1 → PC, INSTR → IR, decode in T4</td></tr>
<tr><td>M2 memory read</td><td>T1–T3</td><td>PC out again; RD̄ low; the byte read is the port number (byte → Z, W)</td></tr>
<tr><td>M3 output write</td><td>T1–T3</td><td>port number (IO PORT) on the address lines; ACCUM on AD7–AD0; WR̄ low; IO/M̄ high (I/O, not memory)</td></tr>
</tbody>
</table>
<p>This is Table 19.1 seen from the outside. Every ALE pulse marks the start of a machine cycle; RD̄ going low is C<sub>R</sub>; WR̄ going low is C<sub>W</sub>. The bottom row of the figure names the micro-operations (PC out, PC + 1 → PC, INSTR → IR, A → Port) — exactly what a control unit sequences.</p>`,
    `<p class="y-chinh">🎯 Một lệnh, <code>OUT byte</code>, tốn ba <strong>chu kỳ máy</strong>: M1 nạp opcode (4 trạng thái T), M2 đọc bộ nhớ lấy số cổng (3 trạng thái T), M3 ghi ra (3 trạng thái T) — 10 trạng thái đồng hồ ở 3 MHz ≈ 3,3 µs.</p>
<table>
<thead><tr><th>chu kỳ máy</th><th>trạng thái T</th><th>các chân làm gì</th></tr></thead>
<tbody>
<tr><td>M1 nạp lệnh</td><td>T1–T4</td><td>PC<sub>H</sub> trên A15–A8, PC<sub>L</sub> rồi INSTR trên AD7–AD0; xung ALE ở T1; RD̄ xuống thấp; rồi PC + 1 → PC, INSTR → IR, giải mã ở T4</td></tr>
<tr><td>M2 đọc bộ nhớ</td><td>T1–T3</td><td>lại đưa PC ra; RD̄ thấp; byte đọc được là số hiệu cổng (byte → Z, W)</td></tr>
<tr><td>M3 ghi ra</td><td>T1–T3</td><td>số cổng (IO PORT) trên đường địa chỉ; ACCUM trên AD7–AD0; WR̄ thấp; IO/M̄ cao (I/O, không phải bộ nhớ)</td></tr>
</tbody>
</table>
<p>Đây là Table 19.1 nhìn từ bên ngoài. Mỗi xung ALE đánh dấu đầu một chu kỳ máy; RD̄ xuống thấp là C<sub>R</sub>; WR̄ xuống thấp là C<sub>W</sub>. Hàng dưới cùng của hình ghi tên các vi thao tác (PC out, PC + 1 → PC, INSTR → IR, A → Port) — đúng thứ một khối điều khiển tuần tự hoá.</p>`],

  [20, 'Control Unit Implementation',
    `<p class="y-chinh">🎯 Two families: <strong>hardwired</strong> — the control unit is a state machine circuit that turns input logic signals into output control signals; and <strong>microprogrammed</strong>.</p>
<p>The slide stops at the word "microprogrammed" without a definition, so here it is: a microprogrammed control unit stores, for every time step of every instruction, a <em>word</em> whose bits are the control signals; executing an instruction means reading those words one after another from a <strong>control memory</strong>. Slides 23–31 build it.</p>
<table>
<thead><tr><th></th><th>hardwired</th><th>microprogrammed</th></tr></thead>
<tbody>
<tr><td>made of</td><td>gates, flip-flops, a decoder, a timing generator</td><td>control memory + sequencing logic</td></tr>
<tr><td>speed</td><td>faster (signals come straight out of logic)</td><td>slower (a memory read per step)</td></tr>
<tr><td>changing the instruction set</td><td>redesign the circuit</td><td>rewrite the microprogram</td></tr>
<tr><td>typical use</td><td>RISC cores (ARM, RISC-V), simple CPUs</td><td>CISC (System/360, VAX, the complex part of x86)</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Gap in the deck.</strong> The second bullet has no explanation, and Figure 19.11 is missing — figure numbers jump from 19.10 (slide 22) to 19.12 (slide 25).</div>`,
    `<p class="y-chinh">🎯 Hai họ: <strong>điều khiển cứng</strong> (hardwired) — khối điều khiển là một mạch máy trạng thái biến tín hiệu logic đầu vào thành tín hiệu điều khiển đầu ra; và <strong>vi chương trình</strong> (microprogrammed).</p>
<p>Slide dừng ở chữ "microprogrammed" mà không định nghĩa, nên đây là định nghĩa: khối điều khiển vi chương trình lưu, cho mỗi bước thời gian của mỗi lệnh, một <em>từ</em> mà các bit của nó là các tín hiệu điều khiển; thực thi một lệnh nghĩa là đọc lần lượt các từ đó từ một <strong>bộ nhớ điều khiển</strong> (control memory). Slide 23–31 dựng nó.</p>
<table>
<thead><tr><th></th><th>điều khiển cứng</th><th>vi chương trình</th></tr></thead>
<tbody>
<tr><td>làm từ</td><td>cổng, flip-flop, bộ giải mã, bộ tạo nhịp</td><td>bộ nhớ điều khiển + logic tuần tự hoá</td></tr>
<tr><td>tốc độ</td><td>nhanh hơn (tín hiệu ra thẳng từ logic)</td><td>chậm hơn (mỗi bước một lần đọc bộ nhớ)</td></tr>
<tr><td>đổi tập lệnh</td><td>thiết kế lại mạch</td><td>viết lại vi chương trình</td></tr>
<tr><td>hay dùng ở</td><td>nhân RISC (ARM, RISC-V), CPU đơn giản</td><td>CISC (System/360, VAX, phần phức tạp của x86)</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Deck bị hổng.</strong> Gạch đầu dòng thứ hai không có lời giải thích, và thiếu Hình 19.11 — số hình nhảy từ 19.10 (slide 22) sang 19.12 (slide 25).</div>`],

  [21, 'Table 19.3 A Decoder With 4 Inputs and 16 Outputs',
    `<p class="y-chinh">🎯 A decoder turns an n-bit code into 2<sup>n</sup> separate lines, exactly one of which is 1. With 4 inputs I1–I4 there are 16 outputs O1–O16; each column of the table is one input pattern, and exactly one output row has a 1 in it.</p>
<p>Read the table carefully: input 0000 activates <strong>O16</strong> and input 1111 activates <strong>O1</strong> — the numbering runs backwards (output O<sub>k</sub> fires for input value 16 − k). For 0101 (value 5) the 1 is in row O11.</p>
<p>Why the control unit needs it: inside the control logic it is much easier to write "if the opcode is ADD" as a single wire I<sub>ADD</sub> than as a 4-bit comparison every time. The decoder turns the opcode in IR into one wire per instruction — the I<sub>0</sub> … I<sub>k</sub> of the next figure. Chapter 9 built this circuit from gates (lesson 9.0b).</p>`,
    `<p class="y-chinh">🎯 Bộ giải mã biến một mã n bit thành 2<sup>n</sup> đường riêng, đúng một đường bằng 1. Với 4 đầu vào I1–I4 có 16 đầu ra O1–O16; mỗi cột của bảng là một mẫu đầu vào, và đúng một hàng đầu ra có số 1 trong cột đó.</p>
<p>Đọc kỹ bảng: đầu vào 0000 bật <strong>O16</strong> còn 1111 bật <strong>O1</strong> — cách đánh số chạy ngược (đầu ra O<sub>k</sub> bật khi giá trị đầu vào là 16 − k). Với 0101 (giá trị 5) số 1 nằm ở hàng O11.</p>
<p>Vì sao khối điều khiển cần nó: trong logic điều khiển, viết "nếu opcode là ADD" thành một sợi dây I<sub>ADD</sub> dễ hơn nhiều so với mỗi lần lại so sánh 4 bit. Bộ giải mã biến opcode trong IR thành mỗi lệnh một sợi dây — chính là I<sub>0</sub> … I<sub>k</sub> của hình sau. Chương 9 đã dựng mạch này từ cổng (bài 9.0b).</p>`],

  [22, 'Figure 19.10 Control Unit with Decoded Inputs',
    `<p class="y-chinh">🎯 The hardwired control unit: the <strong>instruction register</strong> feeds a <strong>decoder</strong> (one line I<sub>0</sub> … I<sub>k</sub> per opcode); a <strong>timing generator</strong> driven by the clock produces one line per time step (T<sub>1</sub> … T<sub>n</sub>); flags come in from the right; the control signals C<sub>0</sub> … C<sub>m</sub> come out of the bottom.</p>
<p>Inside the box, each control signal is a Boolean expression of these inputs. With two flip-flops P, Q encoding the subcycle (PQ = 00 fetch, 01 indirect, 10 execute, 11 interrupt — the ICC of slide 9), Table 19.1 gives directly:</p>
<div class="formula">C5 = P̄·Q̄·T2 + P̄·Q·T2 &nbsp;&nbsp;(memory read into MBR in fetch t2 and indirect t2)</div>
<p>Adding the execute phase for instructions that read memory (LOAD and ADD in the simulator) gives one more term: + P·Q̄·T2·(I<sub>LOAD</sub> + I<sub>ADD</sub>). The simulator evaluates exactly this expression at every step and reports that it matches the microprogram's C5 in 28 of 28 steps — the two implementations produce the same signals.</p>
<p class="meo">💡 Simplify like Boolean algebra (Chapter 9): C4 = P̄·Q̄·T3 + P̄·Q·T3 = P̄·T3. Real control units have hundreds of such equations — which is why designers looked for something more systematic (next slide).</p>`,
    `<p class="y-chinh">🎯 Khối điều khiển cứng: <strong>thanh ghi lệnh</strong> đưa vào một <strong>bộ giải mã</strong> (mỗi opcode một đường I<sub>0</sub> … I<sub>k</sub>); một <strong>bộ tạo nhịp</strong> chạy theo đồng hồ sinh mỗi bước thời gian một đường (T<sub>1</sub> … T<sub>n</sub>); cờ đi vào từ bên phải; các tín hiệu điều khiển C<sub>0</sub> … C<sub>m</sub> đi ra ở đáy.</p>
<p>Bên trong hộp, mỗi tín hiệu điều khiển là một biểu thức Boole của các đầu vào này. Với hai flip-flop P, Q mã hoá chu kỳ con (PQ = 00 nạp, 01 gián tiếp, 10 thực thi, 11 ngắt — chính là ICC của slide 9), Table 19.1 cho ngay:</p>
<div class="formula">C5 = P̄·Q̄·T2 + P̄·Q·T2 &nbsp;&nbsp;(đọc bộ nhớ vào MBR ở nạp t2 và gián tiếp t2)</div>
<p>Thêm pha thực thi của các lệnh đọc bộ nhớ (LOAD và ADD trong bộ mô phỏng) được thêm một số hạng: + P·Q̄·T2·(I<sub>LOAD</sub> + I<sub>ADD</sub>). Bộ mô phỏng tính đúng biểu thức này ở mọi bước và báo nó khớp C5 của vi chương trình ở 28 trên 28 bước — hai cách hiện thực sinh ra cùng tín hiệu.</p>
<p class="meo">💡 Rút gọn như đại số Boole (Chương 9): C4 = P̄·Q̄·T3 + P̄·Q·T3 = P̄·T3. Khối điều khiển thật có hàng trăm phương trình như vậy — vì thế người thiết kế đi tìm một cách có hệ thống hơn (slide sau).</p>`],

  [23, 'Microprogrammed Control',
    `<p class="y-chinh">🎯 The term "microprogrammed" was coined by <strong>M. V. Wilkes in the early 1950s</strong>, as an organised, systematic alternative to the complexity of hardwired control. It looked unworkable because it needed a fast, cheap control memory — until <strong>IBM's System/360 (announced April 1964)</strong>, where all but the largest models were microprogrammed. It became the standard way to build CISC control units; it is used less today but remains a designer's tool.</p>
<p>System/360 is the reason microprogramming won its first battle: IBM wanted one <em>architecture</em> (Chapter 1) sold as many machines of different price and speed. With microprogramming, a cheap model could implement a complex instruction with many slow micro-steps, and an expensive one with fewer, wider ones — same instruction set, different organisation.</p>
<p class="meo">💡 "Less used in recent years" needs nuance: x86 processors still contain a microcode ROM (for complex or rare instructions and for fixing bugs after shipping), but the common instructions are decoded by hardwired logic into µops.</p>`,
    `<p class="y-chinh">🎯 Thuật ngữ "vi chương trình" do <strong>M. V. Wilkes đặt ra đầu thập niên 1950</strong>, như một lối thay thế có tổ chức, có hệ thống cho sự phức tạp của điều khiển cứng. Nó trông như bất khả thi vì cần một bộ nhớ điều khiển nhanh mà rẻ — cho tới <strong>IBM System/360 (công bố tháng 4/1964)</strong>, nơi mọi mẫu máy trừ các mẫu lớn nhất đều dùng vi chương trình. Nó thành cách chuẩn để dựng khối điều khiển CISC; ngày nay ít dùng hơn nhưng vẫn là một công cụ của người thiết kế.</p>
<p>System/360 là lý do vi chương trình thắng trận đầu: IBM muốn một <em>kiến trúc</em> (Chương 1) bán thành nhiều máy khác giá, khác tốc độ. Với vi chương trình, mẫu rẻ hiện thực một lệnh phức tạp bằng nhiều vi bước chậm, mẫu đắt dùng ít vi bước rộng hơn — cùng tập lệnh, khác tổ chức.</p>
<p class="meo">💡 "Gần đây ít dùng hơn" cần hiểu cho đúng: bộ xử lý x86 vẫn chứa ROM vi mã (cho lệnh phức tạp hoặc hiếm và để sửa lỗi sau khi bán ra), nhưng các lệnh thông dụng được giải mã bằng logic cứng thành µop.</p>`],

  [24, 'Table 19.4 Machine Instruction Set for Wilkes Example',
    `<p class="y-chinh">🎯 The tiny machine Wilkes used to demonstrate microprogramming: 12 orders on an accumulator Acc (with halves Acc1 and Acc2). A n = add C(n), S n = subtract, H n = load Acc2, V n = multiply, T n = store Acc1 and clear, U n = store Acc1, R n / L n = shift right / left, G n = jump if negative, I n = input, O n = output.</p>
<div class="pitfall co-tieu-de"><strong>Error on the slide — a lost minus sign.</strong> "R n: C(Acc) × 2<sup>(n+1)</sup> to Acc" must read <strong>C(Acc) × 2<sup>−(n+1)</sup></strong>. R is the <em>right</em> shift (divide by 2<sup>n+1</sup>), L the left shift (multiply by 2<sup>n+1</sup>). As printed, R and L look identical.</div>
<p>The notation: C(X) = contents of X; Acc1 = most significant half of the accumulator; Acc2 = least significant half. The next slides show how each of these orders is carried out not by dedicated logic but by a short sequence of microinstructions.</p>`,
    `<p class="y-chinh">🎯 Cỗ máy tí hon Wilkes dùng để trình diễn vi chương trình: 12 lệnh trên thanh ghi tích luỹ Acc (với hai nửa Acc1 và Acc2). A n = cộng C(n), S n = trừ, H n = nạp vào Acc2, V n = nhân, T n = cất Acc1 rồi xoá, U n = cất Acc1, R n / L n = dịch phải / trái, G n = nhảy nếu âm, I n = nhập, O n = xuất.</p>
<div class="pitfall co-tieu-de"><strong>Slide sai — rơi mất dấu trừ.</strong> "R n: C(Acc) × 2<sup>(n+1)</sup> to Acc" phải là <strong>C(Acc) × 2<sup>−(n+1)</sup></strong>. R là dịch <em>phải</em> (chia cho 2<sup>n+1</sup>), L là dịch trái (nhân 2<sup>n+1</sup>). Như slide in, R và L trông giống hệt nhau.</div>
<p>Ký hiệu: C(X) = nội dung của X; Acc1 = nửa có nghĩa lớn của thanh ghi tích luỹ; Acc2 = nửa có nghĩa nhỏ. Các slide sau cho thấy mỗi lệnh này được thực hiện không phải bằng logic riêng mà bằng một dãy vi lệnh ngắn.</p>`],

  [25, 'Figure 19.12 Typical Microinstruction Formats',
    `<p class="y-chinh">🎯 (a) <strong>Horizontal</strong> microinstruction: one bit for every internal CPU control signal and every system-bus control signal, plus a jump condition field and a microinstruction address. (b) <strong>Vertical</strong> microinstruction: the control signals are <strong>encoded</strong> into short function codes, plus jump condition and address.</p>
<table>
<thead><tr><th></th><th>horizontal</th><th>vertical</th></tr></thead>
<tbody>
<tr><td>control field</td><td>1 bit per signal</td><td>encoded function codes, decoded again</td></tr>
<tr><td>width</td><td>wide (tens to hundreds of bits)</td><td>narrow</td></tr>
<tr><td>parallelism</td><td>any combination of signals in one step</td><td>limited to what the codes express</td></tr>
<tr><td>speed</td><td>no decoding delay</td><td>needs a decoder after the control memory</td></tr>
</tbody>
</table>
<p>The jump condition field lists what the sequencer may test: unconditional, zero, overflow, the indirect bit. Example sizing: 16 control signals (C0–C13, C<sub>R</sub>, C<sub>W</sub>) + 2 bits for 4 jump conditions + 6 address bits for a 64-word control memory = a 24-bit horizontal microinstruction.</p>`,
    `<p class="y-chinh">🎯 (a) Vi lệnh <strong>ngang</strong> (horizontal): mỗi tín hiệu điều khiển nội CPU và mỗi tín hiệu bus hệ thống một bit, cộng một trường điều kiện nhảy và một địa chỉ vi lệnh. (b) Vi lệnh <strong>dọc</strong> (vertical): các tín hiệu điều khiển được <strong>mã hoá</strong> thành mã chức năng ngắn, cộng điều kiện nhảy và địa chỉ.</p>
<table>
<thead><tr><th></th><th>ngang</th><th>dọc</th></tr></thead>
<tbody>
<tr><td>trường điều khiển</td><td>mỗi tín hiệu 1 bit</td><td>mã chức năng đã mã hoá, phải giải mã lại</td></tr>
<tr><td>độ rộng</td><td>rộng (hàng chục tới hàng trăm bit)</td><td>hẹp</td></tr>
<tr><td>song song</td><td>tổ hợp tín hiệu bất kỳ trong một bước</td><td>giới hạn ở những gì mã diễn đạt được</td></tr>
<tr><td>tốc độ</td><td>không trễ giải mã</td><td>cần bộ giải mã sau bộ nhớ điều khiển</td></tr>
</tbody>
</table>
<p>Trường điều kiện nhảy liệt kê những gì bộ tuần tự được kiểm: vô điều kiện, zero, tràn, bit gián tiếp. Ví dụ tính kích thước: 16 tín hiệu điều khiển (C0–C13, C<sub>R</sub>, C<sub>W</sub>) + 2 bit cho 4 điều kiện nhảy + 6 bit địa chỉ cho bộ nhớ điều khiển 64 từ = vi lệnh ngang 24 bit.</p>`],

  [26, 'Figure 19.13 Organization of Control Memory',
    `<p class="y-chinh">🎯 The control memory is organised as <strong>routines</strong>, one per subcycle and one per opcode: fetch cycle routine (ends "jump to indirect or execute"), indirect cycle routine ("jump to execute"), interrupt cycle routine ("jump to fetch"), the execute cycle beginning ("jump to opcode routine"), then one routine per instruction — AND, ADD, …, IOF — each ending "jump to fetch or interrupt".</p>
<p>This figure is the blueprint of the simulator on this page. Its control memory <code>CM</code> has a fetch routine at addresses 0–2, indirect at 3–5, interrupt at 6–8, and routines LOAD (10–12), ADD (13–15), STORE (16–18), HALT (19). The table <code>MAP</code> is the "jump to opcode routine". The third column of each entry is the jump condition.</p>
<p class="meo">💡 Notice that only the <em>last</em> microinstruction of each routine makes a decision; the others just say "next". That is why most microinstructions need no address field at all in practice — the sequencer simply adds 1.</p>`,
    `<p class="y-chinh">🎯 Bộ nhớ điều khiển được tổ chức thành các <strong>thủ tục</strong> (routine), mỗi chu kỳ con một thủ tục và mỗi opcode một thủ tục: thủ tục chu kỳ nạp (kết thúc "nhảy tới gián tiếp hoặc thực thi"), thủ tục chu kỳ gián tiếp ("nhảy tới thực thi"), thủ tục chu kỳ ngắt ("nhảy tới nạp"), phần đầu chu kỳ thực thi ("nhảy tới thủ tục của opcode"), rồi mỗi lệnh một thủ tục — AND, ADD, …, IOF — mỗi thủ tục kết thúc bằng "nhảy tới nạp hoặc ngắt".</p>
<p>Hình này là bản thiết kế của bộ mô phỏng trên trang này. Bộ nhớ điều khiển <code>CM</code> của nó có thủ tục nạp ở địa chỉ 0–2, gián tiếp ở 3–5, ngắt ở 6–8, và các thủ tục LOAD (10–12), ADD (13–15), STORE (16–18), HALT (19). Bảng <code>MAP</code> chính là "nhảy tới thủ tục của opcode". Cột thứ ba của mỗi mục là điều kiện nhảy.</p>
<p class="meo">💡 Để ý chỉ vi lệnh <em>cuối</em> của mỗi thủ tục mới phải ra quyết định; các vi lệnh khác chỉ nói "tiếp". Vì thế trên thực tế đa số vi lệnh không cần trường địa chỉ — bộ tuần tự chỉ việc cộng 1.</p>`],

  [27, 'Figure 19.14 Control Unit Microarchitecture',
    `<p class="y-chinh">🎯 Four parts: the <strong>control address register (CAR)</strong> holds the address of the next microinstruction; the <strong>control memory</strong> holds the microprogram; the <strong>control buffer register (CBR)</strong> receives the microinstruction just read; the <strong>sequencing logic</strong> loads CAR and issues the read.</p>
<p>Compare with the CPU itself: CAR is to the control memory what PC + MAR are to main memory, CBR is what MBR + IR are. The control unit is a small computer inside the computer, executing a fixed program whose "instructions" are microinstructions — which is why the method is called <em>micro</em>programming.</p>`,
    `<p class="y-chinh">🎯 Bốn phần: <strong>thanh ghi địa chỉ điều khiển (CAR)</strong> giữ địa chỉ vi lệnh kế tiếp; <strong>bộ nhớ điều khiển</strong> giữ vi chương trình; <strong>thanh ghi đệm điều khiển (CBR)</strong> nhận vi lệnh vừa đọc; <strong>logic tuần tự hoá</strong> nạp CAR và phát lệnh đọc.</p>
<p>So với chính CPU: CAR với bộ nhớ điều khiển giống PC + MAR với bộ nhớ chính, CBR giống MBR + IR. Khối điều khiển là một máy tính nhỏ bên trong máy tính, chạy một chương trình cố định mà "lệnh" của nó là vi lệnh — vì thế phương pháp này mới gọi là <em>vi</em> chương trình.</p>`],

  [28, 'Figure 19.15 Functioning of Microprogrammed Control Unit',
    `<p class="y-chinh">🎯 One microinstruction per clock: (1) the sequencing logic issues READ to the control memory; (2) the word at CAR goes into CBR; (3) the control part of CBR becomes control signals (via a decoder, for vertical formats) — within the CPU and to the system bus — and its next-address part goes to the sequencing logic; (4) the sequencing logic loads CAR with the next address.</p>
<p>Three ways to choose the next address, decided by the jump-condition field together with the ALU flags:</p>
<ul>
<li><strong>Next in sequence</strong>: CAR ← CAR + 1.</li>
<li><strong>Jump</strong> to a new routine (fetch, indirect, interrupt) using the address field.</li>
<li><strong>Jump to a machine-instruction routine</strong>: map the opcode in IR (through the upper decoder) to the start of its routine.</li>
</ul>
<p>The simulator's loop is these four steps literally: read <code>CM[CAR]</code>, do the micro-operation, print the signals, then choose CAR by "tiep" (+1), "FETCH"/"INT"/"IND" (jump), or "opcode" (map).</p>`,
    `<p class="y-chinh">🎯 Mỗi nhịp đồng hồ một vi lệnh: (1) logic tuần tự phát lệnh ĐỌC tới bộ nhớ điều khiển; (2) từ ở địa chỉ CAR được đưa vào CBR; (3) phần điều khiển của CBR thành tín hiệu điều khiển (qua bộ giải mã, với khuôn dạng dọc) — bên trong CPU và ra bus hệ thống — còn phần địa chỉ kế đi tới logic tuần tự; (4) logic tuần tự nạp CAR bằng địa chỉ kế tiếp.</p>
<p>Ba cách chọn địa chỉ kế, quyết định bởi trường điều kiện nhảy cùng các cờ của ALU:</p>
<ul>
<li><strong>Kế tiếp tuần tự</strong>: CAR ← CAR + 1.</li>
<li><strong>Nhảy</strong> tới một thủ tục mới (nạp, gián tiếp, ngắt) theo trường địa chỉ.</li>
<li><strong>Nhảy tới thủ tục của lệnh máy</strong>: ánh xạ opcode trong IR (qua bộ giải mã phía trên) tới đầu thủ tục của nó.</li>
</ul>
<p>Vòng lặp của bộ mô phỏng làm đúng nguyên văn bốn bước này: đọc <code>CM[CAR]</code>, làm vi thao tác, in tín hiệu, rồi chọn CAR theo "tiep" (+1), "FETCH"/"INT"/"IND" (nhảy), hoặc "opcode" (ánh xạ).</p>`],

  [29, 'Figure 19.16 Wilkes\'s Microprogrammed Control Unit',
    `<p class="y-chinh">🎯 Wilkes's original design (1951): a matrix of horizontal and vertical wires with connections (diodes) at some crossings. Register I holds the current microinstruction address; an <strong>address decoder</strong> energises one horizontal row; the connections on that row produce the <strong>control signals</strong> (the left part of the matrix) and the <strong>address of the next microinstruction</strong> (the right part), which goes into register II and then to register I on the next clock.</p>
<p>Each row of the matrix is one microinstruction; the pattern of connections on the row <em>is</em> the microinstruction's bits — a horizontal format. The <strong>conditional signal</strong> at the bottom right switches some rows between two possible next addresses: that is how a branch (e.g. "if the accumulator is negative") is implemented in microcode.</p>
<p class="meo">💡 Two registers (I and II) because the next address is produced while the current row is still active; latching it into II first avoids changing the selected row in the middle of a clock period.</p>`,
    `<p class="y-chinh">🎯 Thiết kế gốc của Wilkes (1951): một ma trận dây ngang và dây dọc với các mối nối (đi-ốt) ở một số giao điểm. Thanh ghi I giữ địa chỉ vi lệnh hiện tại; một <strong>bộ giải mã địa chỉ</strong> cấp điện cho đúng một hàng ngang; các mối nối trên hàng đó sinh ra <strong>tín hiệu điều khiển</strong> (phần trái của ma trận) và <strong>địa chỉ vi lệnh kế tiếp</strong> (phần phải), đi vào thanh ghi II rồi sang thanh ghi I ở nhịp đồng hồ sau.</p>
<p>Mỗi hàng của ma trận là một vi lệnh; kiểu mối nối trên hàng <em>chính là</em> các bit của vi lệnh — một khuôn dạng ngang. <strong>Tín hiệu điều kiện</strong> ở góc dưới phải chuyển một số hàng giữa hai địa chỉ kế tiếp có thể: đó là cách hiện thực rẽ nhánh (vd "nếu thanh ghi tích luỹ âm") trong vi mã.</p>
<p class="meo">💡 Cần hai thanh ghi (I và II) vì địa chỉ kế tiếp được sinh ra trong khi hàng hiện tại vẫn đang được chọn; chốt nó vào II trước để tránh đổi hàng giữa chừng một chu kỳ đồng hồ.</p>`],

  [30, 'Table 19.5 Microinstructions for Wilkes Example (1 of 2)',
    `<p class="y-chinh">🎯 The actual microprogram. Each row: microinstruction number, the transfers in the arithmetical unit and in the control-register unit, the conditional flip-flop (set / use), and the next microinstruction (two columns when it depends on the flip-flop).</p>
<p>Rows 0–4 are the <strong>fetch</strong> routine of this machine: 0 "F to G and E", 1 "(G to '1') to F" (add 1 → the program counter F moves on), 2 "Store to G" (read the order from memory), 3 "G to E", 4 "E to decoder" — the decoder then jumps to the row of the order: A → 5, S → 6, H → 7, V → 8, T → 9, U → 10, R → 11, L → 12, G → 13, I → 14, O → 15.</p>
<p>Follow <strong>A n</strong> (add): row 5 "C to D", next 16; row 16 "(D + Store) to C", next 0. In words: copy the accumulator C into D, add the memory word to D and put the sum back in C, then go back to fetch. Three microinstructions for one machine instruction — the same pattern as LOAD/ADD/STORE in the simulator.</p>
<p class="meo">💡 Notation from the slide: "C to D" connects the output of register C to the input of D; "(D + A) to C" sends A and D through the adder into C; "n" in quotes is the constant n.</p>`,
    `<p class="y-chinh">🎯 Vi chương trình thật. Mỗi hàng: số hiệu vi lệnh, các phép chuyển trong khối số học và trong khối thanh ghi điều khiển, flip-flop điều kiện (đặt / dùng), và vi lệnh kế tiếp (hai cột khi nó phụ thuộc flip-flop).</p>
<p>Hàng 0–4 là thủ tục <strong>nạp</strong> của cỗ máy này: 0 "F to G and E", 1 "(G to '1') to F" (cộng 1 → bộ đếm chương trình F tiến lên), 2 "Store to G" (đọc lệnh từ bộ nhớ), 3 "G to E", 4 "E to decoder" — bộ giải mã sau đó nhảy tới hàng của lệnh: A → 5, S → 6, H → 7, V → 8, T → 9, U → 10, R → 11, L → 12, G → 13, I → 14, O → 15.</p>
<p>Lần theo <strong>A n</strong> (cộng): hàng 5 "C to D", kế 16; hàng 16 "(D + Store) to C", kế 0. Nói bằng lời: chép thanh ghi tích luỹ C sang D, cộng từ nhớ với D và đặt tổng lại vào C, rồi quay về nạp. Ba vi lệnh cho một lệnh máy — cùng khuôn với LOAD/ADD/STORE trong bộ mô phỏng.</p>
<p class="meo">💡 Ký hiệu của slide: "C to D" nối đầu ra thanh ghi C vào đầu vào của D; "(D + A) to C" đưa A và D qua bộ cộng vào C; "n" trong ngoặc kép là hằng số n.</p>`],

  [31, 'Table 19.5 Microinstructions for Wilkes Example (2 of 2)',
    `<p class="y-chinh">🎯 Rows 21–37: the longer routines — multiplication (V) and the shifts (R, L) are <strong>loops</strong> in microcode, controlled by a counter in register E and the conditional flip-flop.</p>
<p>Look at V (multiply), entered at row 8 → 27: row 27 "'0' to C, '18' to E" clears the accumulator and loads the loop counter with 18; rows 28–30 do one shift-and-add step and "(G − '1') to E" decrements the counter; the conditional flip-flop (set from the sign of a register, used to choose the next row) decides whether to add and whether the loop has finished. This is the unsigned shift-and-add multiplier of lesson CS.2 (Figure 11.9), written as a microprogram instead of hardware.</p>
<p>The footnotes explain the shifts: in a right shift the least significant digit of C moves into the most significant place of B and the sign digit of C is repeated (sign extension); a left shift passes the most significant digit of B into the least significant place of C.</p>
<p class="meo">💡 Big lesson: with microprogramming, adding an instruction like multiply needs no new circuit — just more rows in the control memory. That flexibility is what made rich CISC instruction sets affordable.</p>`,
    `<p class="y-chinh">🎯 Hàng 21–37: các thủ tục dài hơn — phép nhân (V) và các phép dịch (R, L) là những <strong>vòng lặp</strong> trong vi mã, điều khiển bằng một bộ đếm trong thanh ghi E và flip-flop điều kiện.</p>
<p>Xem V (nhân), vào ở hàng 8 → 27: hàng 27 "'0' to C, '18' to E" xoá thanh ghi tích luỹ và nạp bộ đếm vòng bằng 18; hàng 28–30 làm một bước dịch-và-cộng và "(G − '1') to E" giảm bộ đếm; flip-flop điều kiện (đặt theo dấu của một thanh ghi, dùng để chọn hàng kế) quyết định có cộng hay không và vòng lặp đã xong chưa. Đây chính là bộ nhân dịch-và-cộng không dấu của bài CS.2 (Hình 11.9), viết thành vi chương trình thay vì phần cứng.</p>
<p>Chú thích cuối bảng giải thích phép dịch: dịch phải thì chữ số có nghĩa nhỏ nhất của C chuyển vào vị trí có nghĩa lớn nhất của B và chữ số dấu của C được lặp lại (mở rộng dấu); dịch trái thì chữ số có nghĩa lớn nhất của B chuyển vào vị trí có nghĩa nhỏ nhất của C.</p>
<p class="meo">💡 Bài học lớn: với vi chương trình, thêm một lệnh như phép nhân không cần mạch mới — chỉ cần thêm hàng trong bộ nhớ điều khiển. Sự linh hoạt đó làm tập lệnh CISC phong phú trở nên vừa túi tiền.</p>`],

  [32, 'Summary — Chapter 19',
    `<p class="y-chinh">🎯 Two blocks. Control unit operation: micro-operations (fetch, indirect, interrupt, execute, the instruction cycle), control of the processor (functional requirements, control signals, internal organisation, the Intel 8085), hardwired implementation (inputs, logic). Microprogrammed control: microinstructions, the microprogrammed control unit, Wilkes control, advantages and disadvantages.</p>
<table>
<thead><tr><th>term</th><th>one-line definition</th></tr></thead>
<tbody>
<tr><td>machine instruction</td><td>what the programmer writes (ADD X) — Chapter 10</td></tr>
<tr><td>micro-operation</td><td>one register transfer or ALU step (MAR ← PC)</td></tr>
<tr><td>control signal</td><td>one wire that opens one path (C2)</td></tr>
<tr><td>microinstruction</td><td>one word of control memory: the signals of one step + next-address info</td></tr>
<tr><td>microprogram / firmware</td><td>the routines in control memory</td></tr>
</tbody>
</table>
<p class="meo">💡 Exam favourite: "hardwired vs microprogrammed — which is faster, which is easier to change, which suits RISC/CISC?" Answer: hardwired — faster, RISC; microprogrammed — easier to design and change, CISC.</p>`,
    `<p class="y-chinh">🎯 Hai khối. Hoạt động của khối điều khiển: vi thao tác (nạp, gián tiếp, ngắt, thực thi, chu trình lệnh), điều khiển bộ xử lý (yêu cầu chức năng, tín hiệu điều khiển, tổ chức bên trong, Intel 8085), hiện thực điều khiển cứng (đầu vào, logic). Điều khiển vi chương trình: vi lệnh, khối điều khiển vi chương trình, điều khiển Wilkes, ưu và nhược điểm.</p>
<table>
<thead><tr><th>thuật ngữ</th><th>định nghĩa một dòng</th></tr></thead>
<tbody>
<tr><td>lệnh máy</td><td>thứ lập trình viên viết (ADD X) — Chương 10</td></tr>
<tr><td>vi thao tác</td><td>một phép chuyển thanh ghi hay một bước ALU (MAR ← PC)</td></tr>
<tr><td>tín hiệu điều khiển</td><td>một sợi dây mở một đường (C2)</td></tr>
<tr><td>vi lệnh</td><td>một từ của bộ nhớ điều khiển: tín hiệu của một bước + thông tin địa chỉ kế</td></tr>
<tr><td>vi chương trình / firmware</td><td>các thủ tục trong bộ nhớ điều khiển</td></tr>
</tbody>
</table>
<p class="meo">💡 Câu thi hay gặp: "điều khiển cứng và vi chương trình — cái nào nhanh hơn, cái nào dễ sửa hơn, cái nào hợp RISC/CISC?" Đáp: điều khiển cứng — nhanh hơn, RISC; vi chương trình — dễ thiết kế và sửa hơn, CISC.</p>`],
]);

/* ───────────── Thực hành ───────────── */
const THUC_HANH = bi(`<h2>🔧 Hands-on: a microprogrammed control unit you can read line by line</h2>
<p>The program below is a complete (tiny) microprogrammed control unit in the shape of Figures 19.13–19.15: a control memory <code>CM</code> of microinstructions, a control address register <code>CAR</code>, a sequencing step that chooses the next address, and the registers PC, MAR, MBR, IR, AC of Figure 19.5. It runs a four-instruction program — <code>LOAD X</code>, <code>ADD @P</code> (indirect: P holds the address of Y), <code>STORE Z</code>, <code>HALT</code> — with X = 5 and Y = 7, and an interrupt request that arrives after the third instruction.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Machine program (main memory)</div><div class="lz-ld">0x100 LOAD 0x120 · 0x101 ADD @0x130 · 0x102 STORE 0x122 · 0x103 HALT · data: 0x120 = 5, 0x121 = 7, 0x130 = 0x121</div></div>
  <div class="lz-layer"><div class="lz-lt">Microprogram (control memory CM)</div><div class="lz-ld">fetch 0–2 · indirect 3–5 · interrupt 6–8 · LOAD 10–12 · ADD 13–15 · STORE 16–18 · HALT 19</div></div>
  <div class="lz-layer"><div class="lz-lt">Control signals (Table 19.1 + Figure 19.5)</div><div class="lz-ld">each microinstruction lists the C<sub>i</sub>, C<sub>R</sub>, C<sub>W</sub> it raises</div></div>
</div>
` + code('python', PY_VI) + out(O_VI) + `
<h3>How to read the trace</h3>
<ul>
<li><strong>Lines 1–3</strong> are fetch exactly as Table 19.1: C2, then C5 + C<sub>R</sub> with PC moving from 100 to 101, then C4. After t3 the sequencer decodes: LOAD.</li>
<li><strong>Lines 8–15</strong>: the ADD has its indirect bit set (IR = A130: bit 15 = 1, opcode 2), so CAR goes to the indirect routine (lines 10–12). After line 12 the address field is 121 — the IR now looks like a direct ADD, as slide 6 promised — and execute runs: AC = 5 + 7 = 12.</li>
<li><strong>Lines 22–24</strong>: the interrupt cycle. MBR ← PC (103), PC ← 200, and the old PC is stored at F00 — the last line confirms "PC cu cat o M[0xF00] = 103".</li>
<li><strong>The last line</strong>: at every one of the 28 steps, the hardwired equation C5 = P̄·Q̄·T2 + P̄·Q·T2 + P·Q̄·T2·(LOAD + ADD) of slide 22 gives the same value as the microprogram — two implementations, same signals.</li>
</ul>
<p>Count the cost: LOAD 6 micro-steps, indirect ADD 9, STORE 6, interrupt 3, HALT 4. Microprogrammed CISC machines spent cycles exactly like this; a hardwired RISC pipeline (Chapters 12–13) overlaps these steps across several instructions.</p>
`,
`<h2>🔧 Thực hành: một khối điều khiển vi chương trình đọc được từng dòng</h2>
<p>Chương trình dưới đây là một khối điều khiển vi chương trình hoàn chỉnh (tí hon) theo đúng dáng Hình 19.13–19.15: một bộ nhớ điều khiển <code>CM</code> chứa vi lệnh, một thanh ghi địa chỉ điều khiển <code>CAR</code>, một bước tuần tự hoá chọn địa chỉ kế, và các thanh ghi PC, MAR, MBR, IR, AC của Hình 19.5. Nó chạy một chương trình bốn lệnh — <code>LOAD X</code>, <code>ADD @P</code> (gián tiếp: P chứa địa chỉ của Y), <code>STORE Z</code>, <code>HALT</code> — với X = 5 và Y = 7, và một yêu cầu ngắt tới sau lệnh thứ ba.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Chương trình máy (bộ nhớ chính)</div><div class="lz-ld">0x100 LOAD 0x120 · 0x101 ADD @0x130 · 0x102 STORE 0x122 · 0x103 HALT · dữ liệu: 0x120 = 5, 0x121 = 7, 0x130 = 0x121</div></div>
  <div class="lz-layer"><div class="lz-lt">Vi chương trình (bộ nhớ điều khiển CM)</div><div class="lz-ld">nạp 0–2 · gián tiếp 3–5 · ngắt 6–8 · LOAD 10–12 · ADD 13–15 · STORE 16–18 · HALT 19</div></div>
  <div class="lz-layer"><div class="lz-lt">Tín hiệu điều khiển (Table 19.1 + Hình 19.5)</div><div class="lz-ld">mỗi vi lệnh ghi các C<sub>i</sub>, C<sub>R</sub>, C<sub>W</sub> nó bật</div></div>
</div>
` + code('python', PY_VI) + out(O_VI) + `
<h3>Đọc vết chạy thế nào</h3>
<ul>
<li><strong>Dòng 1–3</strong> là nạp đúng như Table 19.1: C2, rồi C5 + C<sub>R</sub> với PC tiến từ 100 lên 101, rồi C4. Sau t3 bộ tuần tự giải mã: LOAD.</li>
<li><strong>Dòng 8–15</strong>: lệnh ADD có bit gián tiếp (IR = A130: bit 15 = 1, opcode 2), nên CAR đi vào thủ tục gián tiếp (dòng 10–12). Sau dòng 12 trường địa chỉ là 121 — IR giờ trông như một ADD trực tiếp, đúng như slide 6 hứa — rồi pha thực thi chạy: AC = 5 + 7 = 12.</li>
<li><strong>Dòng 22–24</strong>: chu kỳ ngắt. MBR ← PC (103), PC ← 200, và PC cũ được cất ở F00 — dòng cuối xác nhận "PC cu cat o M[0xF00] = 103".</li>
<li><strong>Dòng cuối cùng</strong>: ở cả 28 bước, phương trình mạch cứng C5 = P̄·Q̄·T2 + P̄·Q·T2 + P·Q̄·T2·(LOAD + ADD) của slide 22 cho cùng giá trị với vi chương trình — hai cách hiện thực, cùng tín hiệu.</li>
</ul>
<p>Đếm cái giá: LOAD 6 vi bước, ADD gián tiếp 9, STORE 6, ngắt 3, HALT 4. Máy CISC vi chương trình tốn chu kỳ đúng như vậy; đường ống RISC điều khiển cứng (Chương 12–13) chồng các bước này lên nhau giữa nhiều lệnh.</p>
`);

const LAB = bi(thuNgay('en', 'cpu', 'add', 'The toy CPU of lesson N1.1, now watched at the level of this chapter: each fetch–decode–execute step and the bus transfer it causes.', [
  'Step through the first <b>Load</b> and name the micro-operation of each step (MAR ← PC, MBR ← memory, IR ← MBR, …).',
  'At the <b>Add</b>, find the step where the ALU works — which registers feed it, and which register receives the result?',
], { tour: 'fetch-decode' }) + thuNgay('en', 'cpu', 'sum', 'A loop on the same CPU, with the bus traffic visible.', [
  'Count how many memory reads one loop iteration needs. Which of them are instruction fetches and which are data?',
], { heading: false, tour: 'cpu-bus' }),
thuNgay('vi', 'cpu', 'add', 'CPU đồ chơi của bài N1.1, giờ nhìn ở tầng của chương này: mỗi bước nạp – giải mã – thực thi và phép chuyển trên bus mà nó gây ra.', [
  'Chạy từng bước lệnh <b>Load</b> đầu tiên và gọi tên vi thao tác của mỗi bước (MAR ← PC, MBR ← bộ nhớ, IR ← MBR, …).',
  'Tới lệnh <b>Add</b>, tìm bước ALU làm việc — thanh ghi nào đưa vào nó, thanh ghi nào nhận kết quả?',
], { tour: 'fetch-decode' }) + thuNgay('vi', 'cpu', 'sum', 'Một vòng lặp trên cùng CPU, thấy rõ lưu lượng trên bus.', [
  'Đếm một vòng lặp cần bao nhiêu lần đọc bộ nhớ. Lần nào là nạp lệnh, lần nào là dữ liệu?',
], { heading: false, tour: 'cpu-bus' }));

const BAY_BAI_TAP = bi(`<h3>⚠️ Common traps</h3>
<div class="pitfall"><b>Mixing up the three "instruction" words.</b> Machine instruction (ADD X) ≠ micro-operation (MAR ← PC) ≠ microinstruction (a control-memory word holding the signals of one step and the next-address info).</div>
<div class="pitfall"><b>Putting PC ← PC + 1 in t3.</b> It goes in t2 alongside the memory read (no conflict, saves a time unit). In t1 it would conflict with MAR ← PC reading PC.</div>
<div class="pitfall"><b>"Microprogrammed is faster."</b> It is slower — every step reads the control memory. Its advantages are regularity, ease of design and the ability to change or extend the instruction set.</div>
<div class="pitfall"><b>Inventing signals for blank cells.</b> Table 19.1 leaves interrupt t2 without signals on purpose: it is machine-specific.</div>
<h3>Exercises</h3>
<p><b>E1.</b> Write the execute micro-operations (t1, t2, …) for <code>SUB X</code> (AC ← AC − M[X]) and for <code>JUMP X</code> (PC ← X) on the machine of Figure 19.5.</p>
` + xem('Solution', `<p>SUB X: t1 MAR ← IR(address); t2 MBR ← Memory; t3 AC ← AC − MBR (same as ADD, with the ALU set to subtract — invert MBR and carry-in 1, lesson CS.2). JUMP X: t1 PC ← IR(address) — one step, no memory access for data.</p>`) + `
<p><b>E2.</b> ISZ X increments a memory word and skips the next instruction if the result is 0. Why does it need four time units while ADD needs three?</p>
` + xem('Solution', `<p>t1 MAR ← IR(address); t2 MBR ← Memory; t3 MBR ← MBR + 1; t4 Memory ← MBR, and if MBR = 0 then PC ← PC + I. The value must be read, changed <em>and written back</em>; the write cannot happen in t3 because MBR is being updated then (conflict rule).</p>`) + `
<p><b>E3.</b> A horizontal microinstruction must drive 14 internal control signals and 2 bus signals, choose among 4 jump conditions, and address a 64-word control memory. How wide is it, and how many bits is the whole control memory?</p>
` + xem('Solution', `<p>16 signal bits + 2 condition bits (4 = 2<sup>2</sup>) + 6 address bits (64 = 2<sup>6</sup>) = <b>24 bits</b>. Control memory: 64 × 24 = <b>1536 bits</b>.</p>`) + `
<p><b>E4.</b> In Table 19.3, which output is 1 for the input I1 I2 I3 I4 = 0101?</p>
` + xem('Solution', `<p><b>O11</b>. The input value is 5; this table numbers outputs backwards (0000 → O16, 1111 → O1), so the active output is O(16 − 5) = O11.</p>`) + `
<p><b>E5.</b> Simplify the hardwired equation for C4 (IR ← MBR in fetch t3 and in indirect t3).</p>
` + xem('Solution', `<p>C4 = P̄·Q̄·T3 + P̄·Q·T3 = P̄·(Q̄ + Q)·T3 = <b>P̄·T3</b>.</p>`) + `
<h3>Self-check</h3>
<ol>
<li>Which four registers take part in the fetch cycle, and which two connect to the buses?</li>
<li>What does ICC = 11 mean?</li>
<li>What are the two basic tasks of the control unit?</li>
<li>Horizontal or vertical microinstruction: which needs a decoder after the control memory?</li>
<li>Name one reason microprogramming made CISC instruction sets practical.</li>
</ol>
` + xem('Answers', `<ol><li>MAR, MBR, PC, IR; MAR (address bus) and MBR (data bus).</li><li>The next subcycle is the interrupt cycle.</li><li>Sequencing and execution.</li><li>Vertical (its control field is encoded).</li><li>A new or complex instruction is just more words in the control memory, not a new circuit — and one architecture can be implemented at several price/speed points (System/360).</li></ol>`) + `
<h3>Where this connects</h3>
<ul>
<li>Previous: ` + bai(COA, 'cea201-cs3-dau-phay-dong-ieee754', '⭐ CS.3 — floating point') + ` (subnormal arithmetic is often handled by microcode assists).</li>
<li>Within CEA201: the instruction cycle and interrupts in ` + bai(COA, 'cea201-3-0a-slides-chu-trinh-lenh-ngat', '3.0a') + ` · registers and the pipeline in ` + bai(COA, 'cea201-12-0a-slides-to-chuc-cpu-thanh-ghi-pipeline', '12.0a') + ` · decoders in ` + bai(COA, 'cea201-9-0b-slides-giai-ma-rom-cong-mach-tuan-tu', '9.0b') + ` · why RISC is hardwired in ` + bai(COA, 'cea201-13-0b-slides-dac-trung-risc-pipeline-tranh-luan', '13.0b') + ` · x86 µops in ` + bai(COA, 'cea201-14-0a-slides-superscalar-phu-thuoc-lenh-intel-core', '14.0a') + ` · microcode patches in ` + bai(COA, 'cea201-n3-1-spectre-meltdown', 'N3.1 — Spectre & Meltdown') + ` · run it yourself in ` + bai(COA, 'cea201-n1-1-marie', 'N1.1 — MARIE') + `.</li>
<li>Courses: what happens after the CPU traps into the kernel — ` + bai('operating-systems-for-developers', 'os-11-1-hanh-trinh', 'Operating Systems for Developers 11.1') + `.</li>
</ul>`,
`<h3>⚠️ Bẫy thường gặp</h3>
<div class="pitfall"><b>Lẫn ba chữ "lệnh".</b> Lệnh máy (ADD X) ≠ vi thao tác (MAR ← PC) ≠ vi lệnh (một từ của bộ nhớ điều khiển chứa tín hiệu của một bước và thông tin địa chỉ kế).</div>
<div class="pitfall"><b>Đặt PC ← PC + 1 vào t3.</b> Nó nằm ở t2 cùng lúc đọc bộ nhớ (không xung đột, tiết kiệm một đơn vị thời gian). Đặt ở t1 sẽ xung đột với MAR ← PC đang đọc PC.</div>
<div class="pitfall"><b>"Vi chương trình nhanh hơn."</b> Nó chậm hơn — bước nào cũng đọc bộ nhớ điều khiển. Ưu điểm của nó là tính đều đặn, dễ thiết kế và đổi/mở rộng được tập lệnh.</div>
<div class="pitfall"><b>Bịa tín hiệu cho ô trống.</b> Table 19.1 cố ý để trống tín hiệu ở bước t2 của ngắt: nó tuỳ từng máy.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> Viết vi thao tác pha thực thi (t1, t2, …) cho <code>SUB X</code> (AC ← AC − M[X]) và <code>JUMP X</code> (PC ← X) trên cỗ máy của Hình 19.5.</p>
` + xem('Lời giải', `<p>SUB X: t1 MAR ← IR(address); t2 MBR ← Bộ nhớ; t3 AC ← AC − MBR (giống ADD, với ALU đặt sang trừ — đảo MBR và nhớ vào 1, bài CS.2). JUMP X: t1 PC ← IR(address) — một bước, không truy cập bộ nhớ lấy dữ liệu.</p>`) + `
<p><b>E2.</b> ISZ X tăng một từ nhớ và bỏ qua lệnh kế nếu kết quả bằng 0. Vì sao nó cần bốn đơn vị thời gian trong khi ADD cần ba?</p>
` + xem('Lời giải', `<p>t1 MAR ← IR(address); t2 MBR ← Bộ nhớ; t3 MBR ← MBR + 1; t4 Bộ nhớ ← MBR, và nếu MBR = 0 thì PC ← PC + I. Giá trị phải được đọc, sửa <em>và ghi lại</em>; không ghi ở t3 được vì lúc đó MBR đang được cập nhật (luật không xung đột).</p>`) + `
<p><b>E3.</b> Một vi lệnh ngang phải lái 14 tín hiệu điều khiển nội và 2 tín hiệu bus, chọn trong 4 điều kiện nhảy, và đánh địa chỉ một bộ nhớ điều khiển 64 từ. Nó rộng bao nhiêu bit, cả bộ nhớ điều khiển bao nhiêu bit?</p>
` + xem('Lời giải', `<p>16 bit tín hiệu + 2 bit điều kiện (4 = 2<sup>2</sup>) + 6 bit địa chỉ (64 = 2<sup>6</sup>) = <b>24 bit</b>. Bộ nhớ điều khiển: 64 × 24 = <b>1536 bit</b>.</p>`) + `
<p><b>E4.</b> Trong Table 19.3, đầu ra nào bằng 1 với đầu vào I1 I2 I3 I4 = 0101?</p>
` + xem('Lời giải', `<p><b>O11</b>. Giá trị đầu vào là 5; bảng này đánh số đầu ra ngược (0000 → O16, 1111 → O1), nên đầu ra bật là O(16 − 5) = O11.</p>`) + `
<p><b>E5.</b> Rút gọn phương trình mạch cứng của C4 (IR ← MBR ở nạp t3 và gián tiếp t3).</p>
` + xem('Lời giải', `<p>C4 = P̄·Q̄·T3 + P̄·Q·T3 = P̄·(Q̄ + Q)·T3 = <b>P̄·T3</b>.</p>`) + `
<h3>Tự kiểm</h3>
<ol>
<li>Bốn thanh ghi nào tham gia chu kỳ nạp, hai thanh ghi nào nối với bus?</li>
<li>ICC = 11 nghĩa là gì?</li>
<li>Hai nhiệm vụ cơ bản của khối điều khiển là gì?</li>
<li>Vi lệnh ngang hay dọc: loại nào cần bộ giải mã sau bộ nhớ điều khiển?</li>
<li>Nêu một lý do vi chương trình làm tập lệnh CISC trở nên khả thi.</li>
</ol>
` + xem('Đáp án', `<ol><li>MAR, MBR, PC, IR; MAR (bus địa chỉ) và MBR (bus dữ liệu).</li><li>Chu kỳ con kế tiếp là chu kỳ ngắt.</li><li>Tuần tự hoá và thực thi.</li><li>Dọc (trường điều khiển đã bị mã hoá).</li><li>Một lệnh mới hay phức tạp chỉ là thêm từ trong bộ nhớ điều khiển, không phải mạch mới — và một kiến trúc hiện thực được ở nhiều mức giá/tốc độ (System/360).</li></ol>`) + `
<h3>Liên kết</h3>
<ul>
<li>Trước: ` + bai(COA, 'cea201-cs3-dau-phay-dong-ieee754', '⭐ CS.3 — dấu phẩy động') + ` (phép tính với số dưới chuẩn thường được vi mã hỗ trợ).</li>
<li>Trong CEA201: chu trình lệnh và ngắt ở ` + bai(COA, 'cea201-3-0a-slides-chu-trinh-lenh-ngat', '3.0a') + ` · thanh ghi và đường ống ở ` + bai(COA, 'cea201-12-0a-slides-to-chuc-cpu-thanh-ghi-pipeline', '12.0a') + ` · bộ giải mã ở ` + bai(COA, 'cea201-9-0b-slides-giai-ma-rom-cong-mach-tuan-tu', '9.0b') + ` · vì sao RISC dùng điều khiển cứng ở ` + bai(COA, 'cea201-13-0b-slides-dac-trung-risc-pipeline-tranh-luan', '13.0b') + ` · µop của x86 ở ` + bai(COA, 'cea201-14-0a-slides-superscalar-phu-thuoc-lenh-intel-core', '14.0a') + ` · bản vá vi mã ở ` + bai(COA, 'cea201-n3-1-spectre-meltdown', 'N3.1 — Spectre & Meltdown') + ` · tự chạy ở ` + bai(COA, 'cea201-n1-1-marie', 'N1.1 — MARIE') + `.</li>
<li>Courses: chuyện gì xảy ra sau khi CPU bẫy vào nhân hệ điều hành — ` + bai('operating-systems-for-developers', 'os-11-1-hanh-trinh', 'Operating Systems for Developers 11.1') + `.</li>
</ul>`);

export default {
  title: '⭐ CS.4 — Control unit: micro-operations, hardwired vs microprogrammed (CEA19)|||⭐ CS.4 — Khối điều khiển: vi thao tác, điều khiển cứng vs vi chương trình (CEA19)',
  slug: 'cea201-cs4-khoi-dieu-khien-vi-chuong-trinh',
  type: 'DOCUMENT',
  description: 'Phần ⭐ Chuyên sâu web bổ sung (deck chính hãng Chapter 19 "Control Unit Operation and Microprogrammed Control" — không nằm trong lịch học): giảng trọn 32 slide — vi thao tác của chu kỳ nạp/gián tiếp/ngắt/thực thi, lưu đồ ICC, yêu cầu chức năng, đường dữ liệu và tín hiệu C0–C13 (Table 19.1), bus nội với Y/Z, Intel 8085 (sơ đồ khối, chân, giản đồ thời gian lệnh OUT), điều khiển cứng (bộ giải mã, phương trình Boole của C5/C4), vi chương trình (Wilkes, System/360, khuôn dạng ngang/dọc, tổ chức bộ nhớ điều khiển, CAR/CBR, ma trận Wilkes, bảng vi lệnh); bộ mô phỏng khối điều khiển vi chương trình chạy thật (LOAD, ADD gián tiếp, STORE, ngắt) kèm kiểm phương trình mạch cứng khớp 28/28 bước; CPU lab nhúng; nêu lỗi slide (tMAR, intstruction, ô trống Table 19.1, thiếu Hình 19.11, R n mất dấu trừ).',
  content: [MO_DAU, walkHead(D, 1, 32,
    'This deck is in the official slide set but not in the session schedule — added here as a ⭐ lesson.',
    'Deck này có trong bộ slide chính hãng nhưng không có trong lịch học — web thêm vào thành bài ⭐.'),
  SLIDES, THUC_HANH, LAB, BAY_BAI_TAP].join('\n'),
};
