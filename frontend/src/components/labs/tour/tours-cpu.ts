/**
 * Kịch bản hướng dẫn từng bước cho phòng lab "Máy tính từ số 0" (/cpu-lab). Viết cho người CHƯA BIẾT GÌ:
 * mỗi bước một ý, nói rõ nhìn vào đâu, rồi cho người học tự bấm một việc nhỏ trước khi đi tiếp.
 * Bộ kiểm (tours.test.ts) dựng mô phỏng thật trong jsdom và chạy đúng `do`/`solve` ở đây — sai một tên vùng hay
 * một điều kiện không đạt được là đỏ ngay.
 */
import type { Tour } from './types';

const step = (n: number, delay = 650) => ({ a: 'player.step', delay, upTo: n });

export const CPU_TOURS: Tour[] = [
  /* ───────────────────────────── Bit ───────────────────────────── */
  {
    id: 'bits-basics', ns: 'cpu-lab', sim: 'bits', presets: ['intro', 'play'],
    title: ['From electricity to numbers', 'Từ dòng điện tới con số'],
    summary: ['Why computers use only 0 and 1, how one byte can mean six different things, counting in binary, hex and negative numbers.', 'Vì sao máy tính chỉ dùng 0 và 1, một byte mang sáu nghĩa ra sao, đếm nhị phân, hex và số âm.'],
    steps: [
      {
        target: 'head', do: [{ a: 'bits.tab', v: 'intro' }],
        title: ['Hello! This is the bit lab', 'Chào bạn! Đây là phòng lab bit'],
        body: ['Everything in a computer — text, photos, music, programs — ends up as long rows of 0s and 1s. In this tour I highlight exactly where to look at each step. Press Next whenever you are ready.', 'Mọi thứ trong máy tính — chữ, ảnh, nhạc, chương trình — cuối cùng đều là những dãy 0 và 1 rất dài. Ở mỗi bước tôi sẽ tô sáng đúng chỗ cần nhìn. Sẵn sàng thì bấm Tiếp.'],
      },
      {
        target: 'wire', do: [{ a: 'intro.noise', v: 0.3 }, { a: 'intro.volts', v: 3.1 }],
        title: ['One wire, two states', 'Một sợi dây, hai trạng thái'],
        body: ['A wire inside the chip is either near 0 volts or near 3.3 volts. Near 0 V the circuit reads 0, near 3.3 V it reads 1. The orange line is the voltage right now; the dots are small random wobbles (noise).', 'Một sợi dây trong chip hoặc gần 0 volt, hoặc gần 3,3 volt. Gần 0 V mạch đọc là 0, gần 3,3 V đọc là 1. Vạch cam là điện áp lúc này; các chấm là những dao động nhỏ ngẫu nhiên (nhiễu).'],
      },
      {
        target: 'volt-sliders',
        title: ['Your turn: make it a 0', 'Đến lượt bạn: biến nó thành 0'],
        body: ['Drag the Voltage slider to the left, below 0.8 V. The reading under the picture changes from 1 to 0.', 'Kéo thanh Điện áp sang trái, xuống dưới 0,8 V. Dòng chữ dưới hình sẽ đổi từ 1 sang 0.'],
        task: { text: ['Drag the voltage below 0.8 V.', 'Kéo điện áp xuống dưới 0,8 V.'], until: (s) => s.intro?.bit === 0, solve: [{ a: 'intro.volts', v: 0.4, delay: 300 }] },
      },
      {
        target: 'wire', do: [{ a: 'intro.volts', v: 2.3 }, { a: 'intro.noise', v: 1, delay: 500 }],
        title: ['Why only two levels?', 'Vì sao chỉ hai mức?'],
        body: ['Now the voltage is close to the forbidden middle band and the noise is large: red dots are samples that would be read wrongly. With only two levels far apart, a little noise never changes the answer — that is why computers count in 0 and 1.', 'Giờ điện áp sát vùng cấm ở giữa và nhiễu lớn: chấm đỏ là các mẫu sẽ bị đọc sai. Chỉ dùng hai mức cách xa nhau thì nhiễu nhỏ không bao giờ đổi được kết quả — vì thế máy tính đếm bằng 0 và 1.'],
      },
      {
        target: 'bulbs', do: [{ a: 'intro.noise', v: 0.3 }, { a: 'intro.volts', v: 3.1 }, { a: 'intro.pattern', v: 0 }],
        title: ['Eight wires = one byte', 'Tám sợi dây = một byte'],
        body: ['Each bulb is one bit (one wire). Eight bits together are a byte, which has 2⁸ = 256 possible patterns. Click a bulb to switch it on and off.', 'Mỗi bóng đèn là một bit (một sợi dây). Tám bit gộp lại là một byte, có 2⁸ = 256 kiểu bật tắt khác nhau. Bấm vào một bóng để bật hoặc tắt.'],
        task: {
          text: ['Switch on the 2nd bulb from the left and the last bulb on the right (pattern 01000001).', 'Bật bóng thứ 2 từ trái và bóng cuối cùng bên phải (mẫu 01000001).'],
          until: (s) => s.intro?.pattern === 65, solve: [{ a: 'intro.pattern', v: 64, delay: 400 }, { a: 'intro.pattern', v: 65, delay: 500 }],
        },
      },
      {
        target: 'readings',
        title: ['Same bits, six meanings', 'Cùng dãy bit, sáu nghĩa'],
        body: ['01000001 is the number 65 — or the letter A — or a dark grey pixel — or an instruction for the toy CPU. The bits never "mean" anything by themselves: the program that READS them decides.', '01000001 là số 65 — hoặc chữ A — hoặc một điểm ảnh xám đậm — hoặc một lệnh của CPU đồ chơi. Bản thân dãy bit không "mang nghĩa": chương trình ĐỌC nó quyết định nghĩa.'],
      },
      {
        target: 'bit-row', do: [{ a: 'bits.tab', v: 'play' }, { a: 'board.width', v: 8 }, { a: 'board.set', v: 0 }, { a: 'board.inc', delay: 700, upTo: 5 }],
        title: ['Counting in binary', 'Đếm nhị phân'],
        body: ['Watch it count 0, 1, 2, 3, 4, 5. The rightmost bit flips every time; when it goes from 1 back to 0 it carries into the next bit — exactly like 9 → 10 in decimal. The small numbers under the bits are their weights: 1, 2, 4, 8 … 128.', 'Xem nó đếm 0, 1, 2, 3, 4, 5. Bit phải nhất lật mỗi lần; khi nó từ 1 về 0 thì "nhớ" sang bit bên trái — y hệt 9 → 10 ở hệ thập phân. Số nhỏ dưới mỗi bit là trọng số của nó: 1, 2, 4, 8 … 128.'],
      },
      {
        target: 'bit-row',
        title: ['Your turn: make 200', 'Đến lượt bạn: tạo số 200'],
        body: ['Turn on bits until the value is exactly 200. Hint: 200 = 128 + 64 + 8. Each bit you switch on adds its weight.', 'Bật các bit cho tới khi giá trị đúng bằng 200. Gợi ý: 200 = 128 + 64 + 8. Mỗi bit bạn bật cộng thêm trọng số của nó.'],
        task: {
          text: ['Make the byte equal 200.', 'Làm cho byte bằng 200.'], until: (s) => s.board?.value === 200,
          solve: [{ a: 'board.set', v: 128, delay: 300 }, { a: 'board.set', v: 192, delay: 600 }, { a: 'board.set', v: 200, delay: 600 }],
          hint: ['Click the bits with weights 128, 64 and 8.', 'Bấm các bit có trọng số 128, 64 và 8.'],
        },
      },
      {
        target: 'hex',
        title: ['Hexadecimal: binary for humans', 'Hệ 16 (hex): nhị phân cho người đọc'],
        body: ['Group the bits by four from the right: 1100 1000. Each group is one hex digit (0–9, A–F): 1100 = C, 1000 = 8, so 200 = 0xC8. Programmers use hex because it is four times shorter than binary and converts in your head.', 'Nhóm bit thành từng 4 từ phải sang: 1100 1000. Mỗi nhóm là một chữ số hex (0–9, A–F): 1100 = C, 1000 = 8, nên 200 = 0xC8. Lập trình viên dùng hex vì ngắn gấp 4 lần nhị phân và đổi nhẩm được.'],
      },
      {
        target: 'column-add', do: [{ a: 'bits.tab', v: 'signed' }, { a: 'signed.load', v: [127, 1, '+', 8] }],
        title: ['Negative numbers', 'Số âm'],
        body: ['To store negative numbers, the top bit gets the weight −128 instead of +128 (two\'s complement). 127 + 1 gives 1000 0000: as a whole number that is 128, but read as signed it is −128. The sum "wrapped around".', 'Để lưu số âm, bit cao nhất mang trọng số −128 thay vì +128 (bù hai). 127 + 1 ra 1000 0000: đọc không dấu là 128, đọc có dấu lại là −128. Kết quả đã "quay vòng".'],
      },
      {
        target: 'flags',
        title: ['The CPU notices: flags', 'CPU biết điều đó: các cờ'],
        body: ['After every addition the ALU sets flags. V = 1 means signed overflow (the true answer does not fit in 8 bits), C is the carry out, N says "negative", Z says "zero". Programs check these flags to catch errors.', 'Sau mỗi phép cộng, ALU bật các cờ. V = 1 nghĩa là tràn số có dấu (đáp án thật không vừa 8 bit), C là bit nhớ ra ngoài, N báo "âm", Z báo "bằng 0". Chương trình kiểm các cờ này để bắt lỗi.'],
      },
    ],
    quiz: {
      q: ['What does the byte 0100 0001 mean?', 'Byte 0100 0001 có nghĩa là gì?'],
      options: [['Always the letter A', 'Luôn là chữ A'], ['65 — or A, or a grey pixel… depending on the program that reads it', 'Số 65 — hoặc chữ A, hoặc điểm ảnh xám… tuỳ chương trình đọc nó'], ['Nothing, computers only understand decimal', 'Không gì cả, máy tính chỉ hiểu hệ thập phân']],
      answer: 1, why: ['Bits have no meaning on their own; the reader (a font, an adder, a screen, the CPU decoder) gives them one.', 'Dãy bit không tự mang nghĩa; thứ đọc nó (font chữ, mạch cộng, màn hình, bộ giải mã của CPU) cho nó nghĩa.'],
    },
  },
  {
    id: 'bits-convert', ns: 'cpu-lab', sim: 'bits', presets: ['convert'],
    title: ['Decimal → binary by hand', 'Đổi thập phân → nhị phân bằng tay'],
    summary: ['The repeated-division method on 200, one division per step, then checked back with place values — and the hex shortcut.', 'Phương pháp chia liên tiếp với số 200, mỗi bước một phép chia, rồi kiểm ngược bằng trọng số — kèm mẹo hex.'],
    steps: [
      {
        target: 'division', do: [{ a: 'bits.tab', v: 'convert' }, { a: 'convert.base', v: 2 }, { a: 'convert.n', v: 200 }, { a: 'player.seek', v: 0 }],
        title: ['The method', 'Phương pháp'],
        body: ['To write 200 in binary: divide by 2, write down the remainder, and keep dividing the quotient until it reaches 0. This table will fill in one division per step.', 'Để viết 200 ở hệ 2: chia cho 2, ghi lại số dư, rồi tiếp tục chia thương cho tới khi thương bằng 0. Bảng này sẽ điền một phép chia mỗi bước.'],
      },
      {
        target: 'division', do: [{ a: 'player.seek', v: 1 }],
        title: ['First division', 'Phép chia đầu tiên'],
        body: ['200 ÷ 2 = 100, remainder 0. This first remainder is the LOWEST (rightmost) binary digit.', '200 ÷ 2 = 100, dư 0. Số dư đầu tiên này là chữ số nhị phân THẤP NHẤT (bên phải cùng).'],
      },
      {
        target: 'step',
        title: ['Your turn: keep dividing', 'Đến lượt bạn: chia tiếp'],
        body: ['Press Step (or the timeline) until the quotient reaches 0. Watch the remainders appear in blue.', 'Bấm Bước (hoặc kéo thanh thời gian) cho tới khi thương bằng 0. Xem các số dư màu xanh lần lượt hiện ra.'],
        task: { text: ['Press Step until the last division (quotient 0).', 'Bấm Bước tới phép chia cuối (thương bằng 0).'], until: (s) => typeof s.convert?.steps === 'number' && (s.player?.i as number) >= (s.convert.steps as number), solve: [step(8, 550)] },
      },
      {
        target: 'division', do: [{ a: 'player.seek', v: 9 }],
        title: ['Read from the bottom up', 'Đọc từ dưới lên'],
        body: ['The remainders read from the BOTTOM up give the answer: 200 = 11001000₂. Reading top-down is the most common mistake in exams.', 'Đọc các số dư từ DƯỚI lên là ra đáp án: 200 = 11001000₂. Đọc từ trên xuống là lỗi hay gặp nhất trong bài thi.'],
      },
      {
        target: 'places', do: [{ a: 'player.seek', v: 10 }],
        title: ['Check it', 'Kiểm lại'],
        body: ['Multiply each digit by its place value and add up: 1×128 + 1×64 + 1×8 = 200. Always check — it takes ten seconds.', 'Nhân mỗi chữ số với trọng số của nó rồi cộng: 1×128 + 1×64 + 1×8 = 200. Luôn kiểm lại — chỉ mất mười giây.'],
      },
      {
        target: 'base', do: [{ a: 'convert.base', v: 16 }, { a: 'player.end', delay: 300 }],
        title: ['The same for hex', 'Hệ 16 cũng vậy'],
        body: ['Divide by 16 instead: 200 ÷ 16 = 12 remainder 8, and 12 is written C. So 200 = C8₁₆ = 0xC8 — the same as grouping 1100 1000 by four.', 'Chia cho 16 thay vì 2: 200 ÷ 16 = 12 dư 8, và 12 viết là C. Vậy 200 = C8₁₆ = 0xC8 — trùng với cách nhóm 1100 1000 theo bốn bit.'],
      },
    ],
    quiz: {
      q: ['In repeated division, the first remainder you get is…', 'Khi chia liên tiếp, số dư đầu tiên bạn nhận được là…'],
      options: [['the highest (leftmost) digit', 'chữ số cao nhất (bên trái)'], ['the lowest (rightmost) digit', 'chữ số thấp nhất (bên phải)'], ['always 0', 'luôn bằng 0']],
      answer: 1, why: ['Each division peels off the last digit first, so you read the remainders from the bottom up.', 'Mỗi phép chia bóc chữ số cuối ra trước, nên phải đọc các số dư từ dưới lên.'],
    },
  },
  {
    id: 'bits-signed', ns: 'cpu-lab', sim: 'bits', presets: ['signed'],
    title: ['Negative numbers and overflow', 'Số âm và tràn số'],
    summary: ['Two\'s complement on a 4-bit wheel, column addition like the ALU, and why 127 + 1 = −128.', 'Bù hai trên vòng số 4 bit, cộng theo cột như ALU, và vì sao 127 + 1 = −128.'],
    steps: [
      {
        target: 'two-readings', do: [{ a: 'bits.tab', v: 'signed' }, { a: 'signed.load', v: [5, 4, '+', 4] }],
        title: ['The 4-bit wheel', 'Vòng số 4 bit'],
        body: ['Four bits give 16 patterns, arranged in a circle. The outer ring reads them unsigned (0…15), the inner ring signed (−8…7). Same bits, two readings — only the meaning of the top bit changes.', 'Bốn bit cho 16 mẫu, xếp thành vòng tròn. Vòng ngoài đọc không dấu (0…15), vòng trong đọc có dấu (−8…7). Cùng dãy bit, hai cách đọc — chỉ nghĩa của bit cao nhất thay đổi.'],
      },
      {
        target: 'column-add',
        title: ['5 + 4 in four bits', '5 + 4 trong bốn bit'],
        body: ['0101 + 0100 = 1001. Unsigned that is 9 — correct. Signed, 1001 means −7! The true answer 9 is bigger than 7, the largest signed 4-bit number, so it wrapped around the wheel. That is overflow.', '0101 + 0100 = 1001. Không dấu là 9 — đúng. Có dấu thì 1001 lại là −7! Đáp án thật là 9, lớn hơn 7 — số có dấu 4 bit lớn nhất — nên nó quay vòng. Đó là tràn số.'],
      },
      {
        target: 'column-add', do: [{ a: 'signed.load', v: [100, 50, '+', 8] }],
        title: ['Column addition, like the ALU', 'Cộng theo cột, đúng như ALU'],
        body: ['In 8 bits: 100 + 50. Add column by column from the right; 1 + 1 = 0 carry 1, and the carries are written on top. This is exactly what the adder circuit does, one column per full adder.', 'Trong 8 bit: 100 + 50. Cộng từng cột từ phải sang; 1 + 1 = 0 nhớ 1, các bit nhớ ghi ở hàng trên. Đúng là việc mạch cộng làm, mỗi cột một full adder.'],
      },
      {
        target: 'signed-presets',
        title: ['Your turn: the famous overflow', 'Đến lượt bạn: ca tràn số nổi tiếng'],
        body: ['Click the example button "127 + 1".', 'Bấm nút ví dụ "127 + 1".'],
        task: { text: ['Load the example 127 + 1.', 'Chọn ví dụ 127 + 1.'], until: (s) => s.signed?.a === 127 && s.signed?.b === 1 && s.signed?.op === '+' && s.signed?.width === 8, solve: [{ a: 'signed.load', v: [127, 1, '+', 8], delay: 300 }] },
      },
      {
        target: 'flags',
        title: ['−128 and the V flag', '−128 và cờ V'],
        body: ['127 + 1 = 1000 0000 = −128 signed. The CPU raises V = 1 (signed overflow). In Java an int silently wraps like this; in C it is undefined behaviour — a classic source of bugs.', '127 + 1 = 1000 0000 = −128 có dấu. CPU bật V = 1 (tràn có dấu). Trong Java int lặng lẽ quay vòng như vậy; trong C đó là hành vi không xác định — nguồn bug kinh điển.'],
      },
      {
        target: 'column-add', do: [{ a: 'signed.load', v: [5, 9, '-', 8] }],
        title: ['Subtraction is addition', 'Phép trừ là phép cộng'],
        body: ['5 − 9: the CPU flips every bit of 9 and adds 1 (−9 in two\'s complement), then ADDS. No separate subtractor is needed — the same circuit does both.', '5 − 9: CPU lật mọi bit của 9 rồi cộng 1 (ra −9 dạng bù hai), sau đó CỘNG. Không cần mạch trừ riêng — cùng một mạch làm cả hai.'],
      },
    ],
    quiz: {
      q: ['In 8-bit signed arithmetic, 127 + 1 equals…', 'Trong số có dấu 8 bit, 127 + 1 bằng…'],
      options: [['128', '128'], ['−128 (overflow, V = 1)', '−128 (tràn, V = 1)'], ['0', '0']],
      answer: 1, why: ['127 is the largest signed 8-bit value; one more wraps to the smallest, −128.', '127 là số có dấu 8 bit lớn nhất; thêm 1 là quay vòng về số nhỏ nhất, −128.'],
    },
  },
  {
    id: 'bits-ops', ns: 'cpu-lab', sim: 'bits', presets: ['ops'],
    title: ['Bit masks and shifts', 'Mặt nạ bit và dịch bit'],
    summary: ['AND keeps bits, OR sets them, XOR flips them; shifts multiply and divide by 2.', 'AND giữ bit, OR bật bit, XOR lật bit; dịch bit là nhân/chia 2.'],
    steps: [
      {
        target: 'ops-rows', do: [{ a: 'bits.tab', v: 'ops' }, { a: 'ops.example', v: 0 }],
        title: ['AND: keep only some bits', 'AND: chỉ giữ vài bit'],
        body: ['A AND B is 1 only where both are 1. With the mask 0000 1111 the top four bits are cleared and the low four are kept — like a stencil. Orange outlines show which bits changed.', 'A AND B ra 1 chỉ khi cả hai là 1. Với mặt nạ 0000 1111, bốn bit cao bị xoá và bốn bit thấp được giữ — như tấm giấy khoét lỗ. Viền cam cho thấy bit nào đã đổi.'],
      },
      {
        target: 'ops-rows', do: [{ a: 'ops.example', v: 1 }],
        title: ['OR: switch bits on', 'OR: bật bit'],
        body: ['A OR 0000 1000 forces bit 3 to 1 and leaves everything else alone. Settings and permissions (like Linux file modes) are stored this way.', 'A OR 0000 1000 ép bit 3 thành 1 và giữ nguyên mọi bit khác. Các cài đặt, quyền hạn (như quyền tệp trên Linux) được lưu theo kiểu này.'],
      },
      {
        target: 'ops-result', do: [{ a: 'ops.example', v: 2 }],
        title: ['XOR: flip bits', 'XOR: lật bit'],
        body: ['XOR with 0010 0000 flips bit 5. In ASCII that bit is the only difference between "a" and "A" — so XOR 0x20 switches upper and lower case.', 'XOR với 0010 0000 lật bit 5. Trong ASCII đó là khác biệt duy nhất giữa "a" và "A" — nên XOR 0x20 đổi chữ hoa ↔ thường.'],
      },
      {
        target: 'ops-pick',
        title: ['Your turn: a shift', 'Đến lượt bạn: dịch bit'],
        body: ['Pick the example "x × 4 = shift left 2" from the list (or press << and set n = 2).', 'Chọn ví dụ "x × 4 = dịch trái 2" trong danh sách (hoặc bấm << và đặt n = 2).'],
        task: { text: ['Choose a left shift.', 'Chọn phép dịch trái.'], until: (s) => s.ops?.op === 'shl', solve: [{ a: 'ops.example', v: 4, delay: 300 }] },
      },
      {
        target: 'ops-result',
        title: ['Shifting left = × 2', 'Dịch trái = × 2'],
        body: ['13 shifted left by 2 is 52 = 13 × 4. Every shift moves each bit to a weight twice as big. Compilers turn x * 4 into a shift because it is cheaper.', '13 dịch trái 2 bậc là 52 = 13 × 4. Mỗi lần dịch, mọi bit lên trọng số gấp đôi. Trình biên dịch đổi x * 4 thành phép dịch vì rẻ hơn.'],
      },
      {
        target: 'ops-result', do: [{ a: 'ops.example', v: 5 }],
        title: ['Shifting a negative number', 'Dịch một số âm'],
        body: ['Arithmetic shift right copies the sign bit in from the left, so −20 becomes −5 (÷ 4). A logical shift would put 0s in and turn it into a large positive number.', 'Dịch phải số học chép bit dấu vào từ bên trái, nên −20 thành −5 (÷ 4). Dịch logic sẽ đẩy 0 vào và biến nó thành một số dương lớn.'],
      },
    ],
    quiz: {
      q: ['How do you test whether x is odd with one bit operation?', 'Kiểm x có lẻ không bằng một phép toán bit?'],
      options: [['x AND 1', 'x AND 1'], ['x OR 1', 'x OR 1'], ['x XOR 0xFF', 'x XOR 0xFF']],
      answer: 0, why: ['Odd numbers have bit 0 set; AND 1 keeps only that bit.', 'Số lẻ có bit 0 bằng 1; AND 1 chỉ giữ lại đúng bit đó.'],
    },
  },
  /* ───────────────────────────── Dữ liệu ───────────────────────────── */
  {
    id: 'data-text', ns: 'cpu-lab', sim: 'data', presets: ['text'],
    title: ['How text becomes bytes', 'Chữ thành byte ra sao'],
    summary: ['Code points, UTF-8 templates, why "ệ" takes 3 bytes and an emoji 4.', 'Mã điểm, khuôn UTF-8, vì sao "ệ" tốn 3 byte còn emoji tốn 4.'],
    steps: [
      {
        target: 'char-table', do: [{ a: 'data.tab', v: 'text' }, { a: 'text.text', v: 'A' }],
        title: ['Every character is a number', 'Mỗi ký tự là một con số'],
        body: ['Unicode gives every character a number called a code point. "A" is U+0041 = 65. Below 128, UTF-8 stores it as ONE byte, identical to old ASCII.', 'Unicode gán cho mọi ký tự một con số gọi là mã điểm. "A" là U+0041 = 65. Dưới 128 thì UTF-8 lưu bằng MỘT byte, y hệt ASCII cũ.'],
      },
      {
        target: 'char-table', do: [{ a: 'text.text', v: 'ệ' }],
        title: ['A Vietnamese letter', 'Một chữ tiếng Việt'],
        body: ['"ệ" is U+1EC7 = 7879 — too big for one byte. UTF-8 uses a 3-byte template 1110xxxx 10xxxxxx 10xxxxxx and fills in the bits: E1 BB 87. Red bits say "3 bytes long", blue bits are the data.', '"ệ" là U+1EC7 = 7879 — quá lớn cho một byte. UTF-8 dùng khuôn 3 byte 1110xxxx 10xxxxxx 10xxxxxx rồi điền bit vào: E1 BB 87. Bit đỏ báo "dài 3 byte", bit xanh là dữ liệu.'],
      },
      {
        target: 'text-input',
        title: ['Your turn: an emoji', 'Đến lượt bạn: một emoji'],
        body: ['Clear the text box and type (or paste) one emoji, for example 😀.', 'Xoá ô chữ rồi gõ (hoặc dán) một emoji, ví dụ 😀.'],
        task: { text: ['Type an emoji.', 'Gõ một emoji.'], until: (s) => s.text?.nb === 4, solve: [{ a: 'text.text', v: '😀', delay: 300 }] },
      },
      {
        target: 'char-table',
        title: ['Four bytes', 'Bốn byte'],
        body: ['Emoji live above U+FFFF, so they need the 4-byte template. That is why a 140-character tweet full of emoji is much larger in bytes.', 'Emoji nằm trên U+FFFF nên cần khuôn 4 byte. Vì thế một dòng 140 ký tự toàn emoji nặng hơn nhiều tính theo byte.'],
      },
      {
        target: 'text-counts', do: [{ a: 'text.text', v: 'Việt Nam' }],
        title: ['Characters ≠ bytes', 'Ký tự ≠ byte'],
        body: ['"Việt Nam" is 8 characters but 10 UTF-8 bytes. A database column limited to 10 BYTES can cut a Vietnamese word in half — always know whether a limit counts characters or bytes.', '"Việt Nam" có 8 ký tự nhưng 10 byte UTF-8. Cột CSDL giới hạn 10 BYTE có thể cắt đôi một chữ tiếng Việt — luôn biết giới hạn đang đếm ký tự hay byte.'],
      },
    ],
    quiz: {
      q: ['Why does "ệ" take 3 bytes in UTF-8?', 'Vì sao "ệ" tốn 3 byte trong UTF-8?'],
      options: [['Vietnamese compresses badly', 'Tiếng Việt nén kém'], ['Its code point (7879) is too large for 1 or 2 bytes, so UTF-8 uses the 3-byte template', 'Mã điểm 7879 quá lớn cho 1–2 byte nên UTF-8 dùng khuôn 3 byte'], ['Each tone mark is one byte', 'Mỗi dấu thanh là một byte']],
      answer: 1, why: ['The 2-byte template carries only 11 data bits (up to 2047); 7879 needs 13 bits.', 'Khuôn 2 byte chỉ chở 11 bit dữ liệu (tới 2047); 7879 cần 13 bit.'],
    },
  },
  {
    id: 'data-float', ns: 'cpu-lab', sim: 'data', presets: ['float'],
    title: ['Why 0.1 + 0.2 ≠ 0.3', 'Vì sao 0.1 + 0.2 ≠ 0.3'],
    summary: ['IEEE-754 sign, exponent and fraction bits, the exact value really stored, and what that means for money.', 'Bit dấu, số mũ và định trị của IEEE-754, giá trị thực sự được lưu, và điều đó nghĩa gì với tiền.'],
    steps: [
      {
        target: 'float-bits', do: [{ a: 'data.tab', v: 'float' }, { a: 'float.fmt', v: 'f32' }, { a: 'float.pick', v: '0.5' }],
        title: ['Three parts', 'Ba phần'],
        body: ['A 32-bit float is: 1 sign bit (red), 8 exponent bits (green) and 23 fraction bits (blue) — scientific notation in binary. 0.5 = 1.0 × 2⁻¹ fits exactly.', 'Số float 32 bit gồm: 1 bit dấu (đỏ), 8 bit số mũ (xanh lá) và 23 bit định trị (xanh dương) — chính là dạng khoa học nhưng ở hệ 2. 0.5 = 1.0 × 2⁻¹ lưu vừa khít.'],
      },
      {
        target: 'float-exact', do: [{ a: 'float.pick', v: '0.1' }],
        title: ['0.1 cannot be stored', '0.1 không lưu được'],
        body: ['Type 0.1 and look at what is REALLY stored: 0.100000001490116… The computer keeps the nearest number it can represent, not 0.1 itself.', 'Với 0.1, hãy nhìn thứ THỰC SỰ được lưu: 0.100000001490116… Máy giữ số gần nhất nó biểu diễn được, chứ không phải chính 0.1.'],
      },
      {
        target: 'float-why',
        title: ['Why: it repeats forever', 'Vì sao: nó lặp mãi'],
        body: ['In binary, 0.1 = 0.000110011001100… — the orange part repeats forever, just like 1/3 = 0.333… in decimal. 23 bits must cut it somewhere, so it is rounded.', 'Ở hệ 2, 0.1 = 0.000110011001100… — phần màu cam lặp mãi, y như 1/3 = 0,333… ở hệ 10. 23 bit buộc phải cắt ở đâu đó nên bị làm tròn.'],
      },
      {
        target: 'float-sum',
        title: ['0.1 + 0.2', '0.1 + 0.2'],
        body: ['Two tiny rounding errors add up: in JavaScript, Java and Python 0.1 + 0.2 prints 0.30000000000000004 and == 0.3 is false. Never compare floats with ==; never store money in float.', 'Hai sai số làm tròn nhỏ cộng dồn: trong JavaScript, Java và Python 0.1 + 0.2 in ra 0.30000000000000004 và == 0.3 là false. Đừng so sánh số thực bằng ==; đừng lưu tiền bằng float.'],
      },
      {
        target: 'float-bits',
        title: ['Your turn: flip the sign', 'Đến lượt bạn: lật bit dấu'],
        body: ['Click the first (red) bit. Only one bit changes, and the number becomes negative.', 'Bấm bit đầu tiên (màu đỏ). Chỉ một bit đổi, và con số thành số âm.'],
        task: { text: ['Flip the sign bit.', 'Lật bit dấu.'], until: (s) => s.float?.flipped === true && String(s.float?.exact ?? '').startsWith('-'), solve: [{ a: 'float.flip', v: 0, delay: 300 }] },
      },
    ],
    quiz: {
      q: ['How should a shop store prices (VND, USD)?', 'Cửa hàng nên lưu giá tiền (VNĐ, USD) bằng kiểu nào?'],
      options: [['float or double', 'float hoặc double'], ['Whole numbers of the smallest unit, or DECIMAL / BigDecimal', 'Số nguyên theo đơn vị nhỏ nhất, hoặc DECIMAL / BigDecimal'], ['Text strings', 'Chuỗi ký tự']],
      answer: 1, why: ['Binary floats cannot represent most decimal fractions exactly; integers and decimal types can.', 'Số thực nhị phân không biểu diễn chính xác hầu hết phân số thập phân; số nguyên và kiểu decimal thì làm được.'],
    },
  },
  /* ───────────────────────────── Cổng logic ───────────────────────────── */
  {
    id: 'logic-gates', ns: 'cpu-lab', sim: 'logic', presets: ['gates'],
    title: ['Logic gates and glowing wires', 'Cổng logic và dây phát sáng'],
    summary: ['AND, XOR and NAND with live wires and truth tables.', 'AND, XOR và NAND với dây điện sống và bảng chân trị.'],
    steps: [
      {
        target: 'gate-circuit', do: [{ a: 'logic.tab', v: 'gates' }, { a: 'gates.gate', v: 'AND' }, { a: 'gates.a', v: 0 }, { a: 'gates.b', v: 0 }],
        title: ['A gate: wires in, one wire out', 'Một cổng: dây vào, một dây ra'],
        body: ['This is an AND gate. Two input wires A and B come in from the left, one output wire goes to the lamp. A wire that glows green carries a 1; a grey wire carries a 0.', 'Đây là cổng AND. Hai dây vào A và B đi từ bên trái, một dây ra nối tới bóng đèn. Dây sáng xanh đang mang 1; dây xám mang 0.'],
      },
      {
        target: 'gate-inputs',
        title: ['Your turn: light the lamp', 'Đến lượt bạn: thắp bóng đèn'],
        body: ['AND outputs 1 only if A AND B are both 1 — like two switches in a row. Switch on both inputs.', 'AND chỉ ra 1 khi A VÀ B đều bằng 1 — như hai công tắc mắc nối tiếp. Bật cả hai đầu vào.'],
        task: { text: ['Make the output 1.', 'Làm cho đầu ra bằng 1.'], until: (s) => s.gates?.gate === 'AND' && s.gates?.out === 1, solve: [{ a: 'gates.a', v: 1, delay: 300 }, { a: 'gates.b', v: 1, delay: 600 }] },
      },
      {
        target: 'truth',
        title: ['The truth table', 'Bảng chân trị'],
        body: ['A truth table lists every possible input and the output. The highlighted row is what the circuit is doing right now. Two inputs → 4 rows.', 'Bảng chân trị liệt kê mọi tổ hợp đầu vào và đầu ra tương ứng. Hàng tô sáng là điều mạch đang làm lúc này. Hai đầu vào → 4 hàng.'],
      },
      {
        target: 'gate-circuit', do: [{ a: 'gates.gate', v: 'XOR' }, { a: 'gates.a', v: 1 }, { a: 'gates.b', v: 1 }],
        title: ['XOR: 1 + 1 = 0, carry 1', 'XOR: 1 + 1 = 0, nhớ 1'],
        body: ['XOR outputs 1 when the inputs DIFFER. With 1 and 1 it gives 0 — exactly the sum bit of 1 + 1 in binary. Add an AND for the carry and you have an adder.', 'XOR ra 1 khi hai đầu vào KHÁC nhau. Với 1 và 1 nó ra 0 — đúng là bit tổng của 1 + 1 ở hệ 2. Thêm một cổng AND cho bit nhớ là có bộ cộng.'],
      },
      {
        target: 'gate-pick', do: [{ a: 'gates.gate', v: 'NAND' }],
        title: ['NAND builds everything', 'NAND dựng được mọi thứ'],
        body: ['NAND (NOT AND) costs only 4 transistors and can build every other gate — and from gates come adders, registers, RAM and a whole CPU. The "Everything from NAND" tab shows how.', 'NAND (NOT AND) chỉ tốn 4 transistor mà dựng được mọi cổng khác — và từ cổng ra bộ cộng, thanh ghi, RAM, cả một CPU. Thẻ "Mọi thứ từ NAND" cho thấy cách làm.'],
      },
    ],
    quiz: {
      q: ['Which gate outputs 1 when its two inputs are DIFFERENT?', 'Cổng nào ra 1 khi hai đầu vào KHÁC nhau?'],
      options: [['AND', 'AND'], ['OR', 'OR'], ['XOR', 'XOR']],
      answer: 2, why: ['XOR = "exclusive or": one or the other, not both.', 'XOR = "hoặc loại trừ": cái này hoặc cái kia, không phải cả hai.'],
    },
  },
  {
    id: 'logic-adder', ns: 'cpu-lab', sim: 'logic', presets: ['adder'],
    title: ['Adding two bits with gates', 'Cộng hai bit bằng cổng logic'],
    summary: ['Half adder = XOR + AND; full adder adds the carry from the column on the right.', 'Half adder = XOR + AND; full adder cộng thêm bit nhớ từ cột bên phải.'],
    steps: [
      {
        target: 'adder-circuit', do: [{ a: 'logic.tab', v: 'adder' }, { a: 'adder.full', v: false }, { a: 'adder.set', v: [1, 0, 0] }],
        title: ['The half adder', 'Half adder'],
        body: ['Two gates add two bits: the XOR gives the sum bit S, the AND gives the carry C. Follow the glowing wires from A and B into both gates.', 'Hai cổng cộng được hai bit: XOR cho bit tổng S, AND cho bit nhớ C. Lần theo các dây sáng từ A và B đi vào cả hai cổng.'],
      },
      {
        target: 'adder-inputs',
        title: ['Your turn: 1 + 1', 'Đến lượt bạn: 1 + 1'],
        body: ['Switch on both A and B. In binary 1 + 1 = 10: the sum lamp S goes OFF and the carry lamp C goes ON.', 'Bật cả A và B. Ở hệ 2, 1 + 1 = 10: đèn tổng S TẮT còn đèn nhớ C SÁNG.'],
        task: { text: ['Set A = 1 and B = 1.', 'Đặt A = 1 và B = 1.'], until: (s) => s.adder?.a === 1 && s.adder?.b === 1 && s.adder?.full === false, solve: [{ a: 'adder.set', v: [1, 1, 0], delay: 300 }] },
      },
      {
        target: 'adder-circuit', do: [{ a: 'adder.full', v: true }, { a: 'adder.set', v: [1, 1, 1] }],
        title: ['The full adder', 'Full adder'],
        body: ['A real column also receives a carry from the right (Cin). Two half adders plus an OR handle three bits: 1 + 1 + 1 = 11₂, so S = 1 and Cout = 1. Chain eight of these and you add whole bytes.', 'Một cột thật còn nhận bit nhớ từ bên phải (Cin). Hai half adder cộng một cổng OR xử lý được ba bit: 1 + 1 + 1 = 11₂, nên S = 1 và Cout = 1. Nối tám cái là cộng được cả byte.'],
      },
    ],
    quiz: {
      q: ['In binary, 1 + 1 equals…', 'Ở hệ 2, 1 + 1 bằng…'],
      options: [['2', '2'], ['10 (sum 0, carry 1)', '10 (tổng 0, nhớ 1)'], ['11', '11']],
      answer: 1, why: ['There is no digit "2" in binary, so the column becomes 0 and a 1 is carried left.', 'Hệ 2 không có chữ số "2", nên cột đó thành 0 và nhớ 1 sang trái.'],
    },
  },
  {
    id: 'logic-ripple', ns: 'cpu-lab', sim: 'logic', presets: ['ripple'],
    title: ['The 8-bit adder', 'Bộ cộng 8 bit'],
    summary: ['Eight full adders in a row and the carry rippling from right to left — why real CPUs need faster adders.', 'Tám full adder xếp hàng và bit nhớ lan từ phải sang trái — vì sao CPU thật cần bộ cộng nhanh hơn.'],
    steps: [
      {
        target: 'ripple-inputs', do: [{ a: 'logic.tab', v: 'ripple' }, { a: 'ripple.set', v: [107, 53] }],
        title: ['Two bytes', 'Hai byte'],
        body: ['A = 107 and B = 53, each 8 bits. You can click any bit to change the numbers later.', 'A = 107 và B = 53, mỗi số 8 bit. Lát nữa bạn có thể bấm bất kỳ bit nào để đổi số.'],
      },
      {
        target: 'ripple-chain',
        title: ['Eight full adders', 'Tám full adder'],
        body: ['FA0 on the right adds bit 0, FA7 on the left adds bit 7. "?" means that adder has not received its carry yet, so its answer is not final.', 'FA0 bên phải cộng bit 0, FA7 bên trái cộng bit 7. "?" nghĩa là bộ cộng đó chưa nhận được bit nhớ nên kết quả chưa chốt.'],
      },
      {
        target: 'play',
        title: ['Your turn: run it', 'Đến lượt bạn: chạy thử'],
        body: ['Press Play and watch the carry travel from FA0 to FA7, one stage per step.', 'Bấm Chạy và xem bit nhớ đi từ FA0 tới FA7, mỗi bước một tầng.'],
        task: { text: ['Press Play and let all 8 stages settle.', 'Bấm Chạy và chờ cả 8 tầng ổn định.'], until: (s) => s.ripple?.done === true, solve: [{ a: 'player.speed', v: 2 }, { a: 'player.play', delay: 200 }] },
      },
      {
        target: 'explain',
        title: ['The cost of waiting', 'Cái giá của việc chờ'],
        body: ['107 + 53 = 160. Each adder had to WAIT for its right neighbour: 8 stages ≈ 16 gate delays. A 64-bit ripple adder would wait 64 stages, so real CPUs use carry-lookahead adders that work out all carries at once.', '107 + 53 = 160. Mỗi bộ cộng phải CHỜ hàng xóm bên phải: 8 tầng ≈ 16 độ trễ cổng. Bộ cộng nối tiếp 64 bit sẽ chờ 64 tầng, nên CPU thật dùng bộ cộng nhìn trước số nhớ (carry-lookahead) tính mọi bit nhớ cùng lúc.'],
      },
    ],
    quiz: {
      q: ['Why is a ripple-carry adder slow for wide numbers?', 'Vì sao bộ cộng nối tiếp nhớ chậm khi số nhiều bit?'],
      options: [['Each full adder waits for the carry from the one on its right', 'Mỗi full adder phải chờ bit nhớ từ tầng bên phải'], ['XOR gates are slow', 'Cổng XOR chậm'], ['It reads RAM for every bit', 'Nó đọc RAM cho từng bit']],
      answer: 0, why: ['The delay grows with the number of bits because the carry passes through every stage in turn.', 'Độ trễ tăng theo số bit vì bit nhớ phải đi qua lần lượt từng tầng.'],
    },
  },
  /* ───────────────────────────── CPU ───────────────────────────── */
  {
    id: 'cpu-first', ns: 'cpu-lab', sim: 'cpu', presets: ['add'],
    title: ['Meet the computer', 'Làm quen chiếc máy tính'],
    summary: ['A guided look at the chip, the RAM and the bus, then run 5 + 7 to the end.', 'Đi một vòng quanh con chip, thanh RAM và bus, rồi chạy 5 + 7 tới cuối.'],
    steps: [
      {
        target: 'cpu-board', do: [{ a: 'cpu.load', v: 'add' }, { a: 'cpu.mode', v: 'micro' }, { a: 'player.seek', v: 0 }],
        title: ['A whole computer on one screen', 'Cả chiếc máy tính trên một màn hình'],
        body: ['On the left is the CPU chip (the grey package with gold pins). On the right is a stick of RAM. The copper lines between them are the bus — the road that every number travels on.', 'Bên trái là con chip CPU (vỏ xám, chân mạ vàng). Bên phải là một thanh RAM. Các đường đồng nối giữa chúng là bus — con đường mọi con số phải đi qua.'],
      },
      {
        target: 'ram',
        title: ['Memory: numbered boxes', 'Bộ nhớ: những ô có số nhà'],
        body: ['RAM is a long row of boxes, each with an address (000, 001, …) and 16 bits inside — the little lights. The program AND its data both live here. This is von Neumann\'s big idea.', 'RAM là một dãy ô rất dài, mỗi ô có địa chỉ (000, 001, …) và chứa 16 bit — các đèn nhỏ. Cả chương trình LẪN dữ liệu đều nằm ở đây. Đó là ý tưởng lớn của von Neumann.'],
      },
      {
        target: 'cpu-listing',
        title: ['The program, as machine code', 'Chương trình, dưới dạng mã máy'],
        body: ['Each assembly line was turned into one 16-bit word: the first 4 bits say WHAT to do (Load, Add…), the last 12 bits say WHERE (an address). "Load X" became 100D.', 'Mỗi dòng hợp ngữ thành một từ 16 bit: 4 bit đầu nói LÀM GÌ (Load, Add…), 12 bit sau nói Ở ĐÂU (một địa chỉ). "Load X" thành 100D.'],
      },
      {
        target: 'reg-PC',
        title: ['PC: where are we?', 'PC: đang ở đâu?'],
        body: ['Inside the chip, the registers are tiny fast memories. PC (program counter) holds the address of the next instruction. After power-on it is 000 — the first line of the program.', 'Trong chip, các thanh ghi là những bộ nhớ tí hon và rất nhanh. PC (bộ đếm chương trình) giữ địa chỉ lệnh kế tiếp. Vừa bật máy nó bằng 000 — dòng đầu của chương trình.'],
      },
      {
        target: 'reg-AC',
        title: ['AC and the ALU', 'AC và ALU'],
        body: ['AC (accumulator) is the CPU\'s scratch pad: numbers are loaded into it, and the ALU — the calculator below — adds to it. The display shows hex on the right and decimal on the left.', 'AC (thanh tích luỹ) là tờ nháp của CPU: số được nạp vào đây, và ALU — máy tính bỏ túi ở dưới — cộng vào nó. Màn hiển thị ghi hex bên phải, thập phân bên trái.'],
      },
      {
        target: 'step',
        title: ['Your turn: run one instruction', 'Đến lượt bạn: chạy một lệnh'],
        body: ['Press Step six times. Each press is one micro-step; the register that changes glows orange and a packet travels on the bus. After six steps "Load X" is done and AC = 5.', 'Bấm Bước sáu lần. Mỗi lần bấm là một vi bước; thanh ghi vừa đổi sáng cam và một gói dữ liệu chạy trên bus. Sau sáu bước lệnh "Load X" xong và AC = 5.'],
        task: { text: ['Step until the first instruction is finished (AC = 5).', 'Bấm Bước tới khi lệnh đầu chạy xong (AC = 5).'], until: (s) => (s.cpu?.done as number) >= 1 && s.cpu?.ac === 5, solve: [step(6, 700)] },
      },
      {
        target: 'cpu-end',
        title: ['Run to the end', 'Chạy tới cuối'],
        body: ['Press ⏭ End to jump to the moment the program halts.', 'Bấm ⏭ Cuối để nhảy tới lúc chương trình dừng.'],
        task: { text: ['Run the program to Halt.', 'Chạy chương trình tới Halt.'], until: (s) => s.cpu?.halted === true, solve: [{ a: 'player.end', delay: 300 }] },
      },
      {
        target: 'cpu-output',
        title: ['12!', '12!'],
        body: ['The output device shows 12 = 5 + 7, and the Z cell in RAM now holds 000C. You just watched a program run down to the last bit. Next tour: the fetch–decode–execute cycle in detail.', 'Thiết bị xuất hiện 12 = 5 + 7, và ô Z trong RAM giờ chứa 000C. Bạn vừa xem một chương trình chạy tới từng bit. Tour tiếp theo: chu trình nạp – giải mã – thực thi thật chi tiết.'],
      },
    ],
    quiz: {
      q: ['Where do the program and its data live in a von Neumann computer?', 'Trong máy von Neumann, chương trình và dữ liệu nằm ở đâu?'],
      options: [['The program in the CPU, the data in RAM', 'Chương trình trong CPU, dữ liệu trong RAM'], ['Both in the same memory', 'Cả hai trong cùng một bộ nhớ'], ['The program on disk, the data in cache', 'Chương trình trên đĩa, dữ liệu trong cache']],
      answer: 1, why: ['One memory holds both; the CPU fetches instructions from it just like data.', 'Một bộ nhớ chứa cả hai; CPU nạp lệnh từ đó y như nạp dữ liệu.'],
    },
  },
  {
    id: 'fetch-decode', ns: 'cpu-lab', sim: 'cpu', presets: ['sum'],
    title: ['Fetch → decode → execute', 'Nạp → giải mã → thực thi'],
    summary: ['"Sum 1..N" instruction by instruction: every register change in the instruction cycle, then the loop.', '"Tổng 1..N" từng lệnh một: mọi thay đổi thanh ghi trong chu trình lệnh, rồi tới vòng lặp.'],
    steps: [
      {
        target: 'cpu-listing', do: [{ a: 'cpu.load', v: 'sum' }, { a: 'cpu.mode', v: 'micro' }, { a: 'player.seek', v: 0 }],
        title: ['The program', 'Chương trình'],
        body: ['It adds 1 + 2 + … + N with N = 5, counting down: Sum = Sum + Count, Count = Count − 1, repeat until Count = 0. Every instruction runs through the same three phases.', 'Nó cộng 1 + 2 + … + N với N = 5, đếm lùi: Sum = Sum + Count, Count = Count − 1, lặp tới khi Count = 0. Mọi lệnh đều đi qua cùng ba pha.'],
      },
      {
        target: 'reg-PC',
        title: ['Power on', 'Bật máy'],
        body: ['PC = 000: the next instruction is at address 000, which is "Load N". The three lights F · D · E in the control unit will show the phase.', 'PC = 000: lệnh kế tiếp ở địa chỉ 000, tức "Load N". Ba đèn F · D · E trong khối điều khiển sẽ báo pha hiện tại.'],
      },
      {
        target: 'reg-MAR', do: [{ a: 'player.seek', v: 1 }],
        title: ['FETCH ① MAR ← PC', 'NẠP ① MAR ← PC'],
        body: ['The address in PC (000) is copied into MAR, the memory address register. MAR is the only way to tell RAM "which box?". The blue packet is an address on the address bus.', 'Địa chỉ trong PC (000) được chép vào MAR, thanh ghi địa chỉ bộ nhớ. MAR là cách duy nhất để nói với RAM "ô nào?". Gói xanh dương là một địa chỉ đi trên bus địa chỉ.'],
      },
      {
        target: 'reg-IR', do: [{ a: 'player.seek', v: 2 }],
        title: ['FETCH ② IR ← M[MAR]', 'NẠP ② IR ← M[MAR]'],
        body: ['RAM sends back the word at 000: 1 00D (binary 0001 0000 0000 1101). The green packet is data on the data bus. It lands in IR, the instruction register. It is just bits — they count as an instruction only because PC pointed here.', 'RAM gửi về từ ở ô 000: 1 00D (nhị phân 0001 0000 0000 1101). Gói xanh lá là dữ liệu trên bus dữ liệu. Nó vào IR, thanh ghi lệnh. Đó chỉ là bit — nó được coi là lệnh chỉ vì PC trỏ vào đây.'],
      },
      {
        target: 'reg-PC', do: [{ a: 'player.seek', v: 3 }],
        title: ['FETCH ③ PC ← PC + 1', 'NẠP ③ PC ← PC + 1'],
        body: ['PC moves on to 001 BEFORE the instruction even runs, so it already points at the next one. A jump simply writes a different number into PC.', 'PC tiến tới 001 TRƯỚC cả khi lệnh chạy, nên nó đã trỏ sẵn tới lệnh sau. Lệnh nhảy chỉ đơn giản là ghi một số khác vào PC.'],
      },
      {
        target: 'cu', do: [{ a: 'player.seek', v: 4 }],
        title: ['DECODE', 'GIẢI MÃ'],
        body: ['The control unit splits IR: the top 4 bits 0001 = opcode 1 = Load; the low 12 bits 00D go to MAR. 00D is where N lives. The D light is on.', 'Khối điều khiển tách IR: 4 bit cao 0001 = mã lệnh 1 = Load; 12 bit thấp 00D vào MAR. 00D là nơi N đang ở. Đèn D sáng.'],
      },
      {
        target: 'reg-MBR', do: [{ a: 'player.seek', v: 5 }],
        title: ['EXECUTE ① MBR ← M[MAR]', 'THỰC THI ① MBR ← M[MAR]'],
        body: ['RAM reads cell 00D and returns 5 into MBR, the memory buffer register — the waiting room for everything coming from or going to memory.', 'RAM đọc ô 00D và trả về 5 vào MBR, thanh ghi đệm bộ nhớ — phòng chờ cho mọi thứ đi ra hoặc đi vào bộ nhớ.'],
      },
      {
        target: 'reg-AC', do: [{ a: 'player.seek', v: 6 }],
        title: ['EXECUTE ② AC ← MBR', 'THỰC THI ② AC ← MBR'],
        body: ['AC = 5. One instruction took six micro-steps: three to fetch, one to decode, two to execute. A 3 GHz CPU does billions of these every second.', 'AC = 5. Một lệnh mất sáu vi bước: ba để nạp, một để giải mã, hai để thực thi. CPU 3 GHz làm hàng tỉ lần như thế mỗi giây.'],
      },
      {
        target: 'step',
        title: ['Your turn: the next instruction', 'Đến lượt bạn: lệnh tiếp theo'],
        body: ['Press Step until "Store Count" has finished. Watch for the red packet going INTO memory: the Count cell becomes 5.', 'Bấm Bước cho tới khi "Store Count" chạy xong. Để ý gói dữ liệu đi VÀO bộ nhớ: ô Count thành 5.'],
        task: { text: ['Step until Store Count is done (2 instructions).', 'Bấm Bước tới khi Store Count xong (2 lệnh).'], until: (s) => (s.cpu?.done as number) >= 2, solve: [step(6, 650)] },
      },
      {
        target: 'cpu-mode', do: [{ a: 'cpu.mode', v: 'instr' }],
        title: ['Faster: whole instructions', 'Nhanh hơn: từng lệnh trọn'],
        body: ['Switch to "whole instructions": now one step = one complete instruction. Good for following the loop without six clicks each time.', 'Chuyển sang "từng lệnh": giờ mỗi bước = một lệnh trọn vẹn. Hợp để theo dõi vòng lặp mà không phải bấm sáu lần mỗi lệnh.'],
      },
      {
        target: 'cpu-trace',
        title: ['Your turn: run the loop', 'Đến lượt bạn: chạy vòng lặp'],
        body: ['Press Play. In the trace, watch "Skipcond 400" skip the Jump only when Count reaches 0 — that is how the loop ends.', 'Bấm Chạy. Trong bảng vết, xem "Skipcond 400" chỉ nhảy qua lệnh Jump khi Count về 0 — đó là cách vòng lặp kết thúc.'],
        task: { text: ['Run the program until it halts.', 'Chạy chương trình tới khi dừng.'], until: (s) => s.cpu?.halted === true, solve: [{ a: 'player.speed', v: 4 }, { a: 'player.play', delay: 200 }] },
      },
      {
        target: 'cpu-output',
        title: ['15 = 5 · 6 / 2', '15 = 5 · 6 / 2'],
        body: ['Output 15 — the same as the formula N·(N+1)/2. The loop body ran five times; the CPU never "knew" it was in a loop, it just followed PC.', 'Output 15 — đúng bằng công thức N·(N+1)/2. Thân vòng lặp chạy năm lần; CPU chưa bao giờ "biết" mình đang lặp, nó chỉ đi theo PC.'],
      },
    ],
    quiz: {
      q: ['Right after the fetch phase, PC points to…', 'Ngay sau pha nạp lệnh, PC trỏ tới…'],
      options: [['the instruction just fetched', 'lệnh vừa được nạp'], ['the next instruction', 'lệnh kế tiếp'], ['the data cell N', 'ô dữ liệu N']],
      answer: 1, why: ['PC ← PC + 1 is the last fetch micro-step, before decode and execute.', 'PC ← PC + 1 là vi bước cuối của pha nạp, trước cả giải mã và thực thi.'],
    },
  },
  {
    id: 'cpu-bus', ns: 'cpu-lab', sim: 'cpu', presets: ['max'],
    title: ['The bus and pointers', 'Bus và con trỏ'],
    summary: ['Address bus vs data bus, transfer by transfer, and an indirect load through a pointer.', 'Bus địa chỉ và bus dữ liệu từng lượt truyền, và phép nạp gián tiếp qua con trỏ.'],
    steps: [
      {
        target: 'cpu-board', do: [{ a: 'cpu.load', v: 'max' }, { a: 'cpu.mode', v: 'micro' }, { a: 'player.seek', v: 0 }],
        title: ['Two kinds of traffic', 'Hai loại lưu lượng'],
        body: ['This program finds the largest number in an array. Every transfer on the bus is either an ADDRESS (blue packet: "which box?") or DATA (green packet: "what is inside").', 'Chương trình này tìm số lớn nhất trong một mảng. Mỗi lượt truyền trên bus hoặc là ĐỊA CHỈ (gói xanh dương: "ô nào?") hoặc là DỮ LIỆU (gói xanh lá: "bên trong có gì").'],
      },
      {
        target: 'cpu-board', do: [{ a: 'player.seek', v: 1 }],
        title: ['An address goes out', 'Một địa chỉ đi ra'],
        body: ['MAR ← PC: a blue packet. The CPU is telling memory which cell it wants.', 'MAR ← PC: một gói xanh dương. CPU đang nói với bộ nhớ nó muốn ô nào.'],
      },
      {
        target: 'cpu-board', do: [{ a: 'player.seek', v: 2 }],
        title: ['Data comes back', 'Dữ liệu quay về'],
        body: ['IR ← M[MAR]: a green packet from RAM. The cell that was read lights up green in the RAM stick.', 'IR ← M[MAR]: một gói xanh lá từ RAM. Ô vừa được đọc sáng xanh lá trên thanh RAM.'],
      },
      {
        target: 'step',
        title: ['Your turn: count the trips', 'Đến lượt bạn: đếm số chuyến'],
        body: ['Step to the end of the first instruction. How many packets travelled in total? (Answer: two addresses and two data words.)', 'Bấm Bước tới hết lệnh đầu tiên. Tổng cộng có bao nhiêu gói đã chạy? (Đáp án: hai địa chỉ và hai từ dữ liệu.)'],
        task: { text: ['Step until the first instruction is finished.', 'Bấm Bước tới khi lệnh đầu xong.'], until: (s) => (s.cpu?.done as number) >= 1, solve: [step(6, 650)] },
      },
      {
        target: 'cpu-memory',
        title: ['Memory table', 'Bảng bộ nhớ'],
        body: ['Below, every cell with its address, hex, bits and meaning. Blue row = instruction running, green = being read, red = being written. Ptr holds an ADDRESS (a pointer), not a value.', 'Bên dưới là từng ô với địa chỉ, hex, bit và ý nghĩa. Hàng xanh dương = lệnh đang chạy, xanh lá = đang đọc, đỏ = đang ghi. Ptr giữ một ĐỊA CHỈ (con trỏ), không phải giá trị.'],
      },
      {
        target: 'cpu-listing',
        title: ['LoadI: follow the pointer', 'LoadI: đi theo con trỏ'],
        body: ['"LoadI Ptr" reads Ptr to get an address, then reads the cell AT that address. Two memory reads for one value — exactly what *p does in C.', '"LoadI Ptr" đọc Ptr để lấy một địa chỉ, rồi đọc ô TẠI địa chỉ đó. Hai lần đọc bộ nhớ cho một giá trị — đúng như *p trong C.'],
      },
      {
        target: 'cpu-end',
        title: ['Your turn: finish', 'Đến lượt bạn: chạy hết'],
        body: ['Press ⏭ End. The largest of 3, 9, 4, 7 is printed.', 'Bấm ⏭ Cuối. Số lớn nhất trong 3, 9, 4, 7 được in ra.'],
        task: { text: ['Run to Halt.', 'Chạy tới Halt.'], until: (s) => s.cpu?.halted === true && s.cpu?.out === 9, solve: [{ a: 'player.end', delay: 300 }] },
      },
    ],
    quiz: {
      q: ['What travels on the address bus?', 'Thứ gì chạy trên bus địa chỉ?'],
      options: [['The value read from memory', 'Giá trị đọc từ bộ nhớ'], ['The number of the memory cell the CPU wants', 'Số hiệu ô nhớ mà CPU cần'], ['The output of the program', 'Kết quả của chương trình']],
      answer: 1, why: ['Addresses go out on the address bus (from MAR); the contents come back on the data bus (into MBR/IR).', 'Địa chỉ đi ra trên bus địa chỉ (từ MAR); nội dung quay về trên bus dữ liệu (vào MBR/IR).'],
    },
  },
  /* ───────────────────────────── Pipeline ───────────────────────────── */
  {
    id: 'pipeline-stages', ns: 'cpu-lab', sim: 'pipeline', presets: ['add', 'sum', 'max'],
    title: ['From C to a running program', 'Từ mã C tới chương trình chạy'],
    summary: ['The six stages with real gcc output, and x86-64 vs ARM64 instruction lengths.', 'Sáu chặng với output thật của gcc, và độ dài lệnh x86-64 so với ARM64.'],
    steps: [
      {
        target: 'pipe-stages', do: [{ a: 'pipeline.arch', v: 'x86_64' }, { a: 'pipeline.opt', v: 'O0' }, { a: 'player.seek', v: 0 }],
        title: ['Six stages', 'Sáu chặng'],
        body: ['A C file has to go through six stages before a CPU can run it. These buttons are the stages; the panel below changes with each one. Everything shown was produced by the real gcc.', 'Một tệp C phải đi qua sáu chặng trước khi CPU chạy được. Các nút này là các chặng; khung bên dưới đổi theo từng chặng. Mọi thứ hiện ra đều do gcc thật sinh.'],
      },
      {
        target: 'pipe-source',
        title: ['① C source', '① Mã C'],
        body: ['Text written for humans. The CPU cannot read a single character of it.', 'Chữ viết cho con người. CPU không đọc được một ký tự nào trong đó.'],
      },
      {
        target: 'pipe-view', do: [{ a: 'player.seek', v: 1 }],
        title: ['② Assembly', '② Hợp ngữ'],
        body: ['gcc -S translates C into assembly for one CPU family — here x86-64. Each line is one machine instruction written with words.', 'gcc -S dịch C sang hợp ngữ cho một dòng CPU — ở đây là x86-64. Mỗi dòng là một lệnh máy viết bằng chữ.'],
      },
      {
        target: 'pipe-view', do: [{ a: 'player.seek', v: 2 }],
        title: ['③ Machine code', '③ Mã máy'],
        body: ['The assembler turns each line into bytes. These bytes are what the CPU actually fetches — the same idea as the toy CPU\'s 16-bit words.', 'Trình hợp dịch biến mỗi dòng thành byte. Những byte này là thứ CPU thật sự nạp về — cùng ý tưởng với các từ 16 bit của CPU đồ chơi.'],
      },
      {
        target: 'pipe-view', do: [{ a: 'player.seek', v: 3 }],
        title: ['④ Executable file', '④ Tệp thực thi'],
        body: ['The linker writes an ELF file: code in .text, variables in .data and .bss, starting with the magic bytes 7F 45 4C 46.', 'Trình liên kết ghi ra tệp ELF: mã trong .text, biến trong .data và .bss, mở đầu bằng các byte "thần chú" 7F 45 4C 46.'],
      },
      {
        target: 'pipe-view', do: [{ a: 'player.seek', v: 4 }],
        title: ['⑤ Loaded into memory', '⑤ Nạp vào bộ nhớ'],
        body: ['When you run ./prog, the OS maps the file into memory: code read-and-execute, data read-and-write.', 'Khi bạn chạy ./prog, hệ điều hành ánh xạ tệp vào bộ nhớ: mã được đọc-và-chạy, dữ liệu được đọc-và-ghi.'],
      },
      {
        target: 'pipe-view', do: [{ a: 'player.seek', v: 5 }],
        title: ['⑥ The CPU runs it', '⑥ CPU chạy'],
        body: ['The program counter is set to the entry point and the same fetch → decode → execute cycle you stepped through on the toy CPU begins. The value main returns becomes the exit code (echo $?).', 'Bộ đếm chương trình được đặt vào điểm vào và chu trình nạp → giải mã → thực thi — y như bạn đã đi từng bước trên CPU đồ chơi — bắt đầu. Giá trị main trả về thành mã thoát (echo $?).'],
      },
      {
        target: 'pipe-config',
        title: ['Your turn: another CPU', 'Đến lượt bạn: một CPU khác'],
        body: ['Switch the CPU to ARM64 (the chip in phones and Apple M-series), then look at the machine code: every ARM64 instruction is exactly 4 bytes, while x86 ones vary.', 'Đổi CPU sang ARM64 (chip trong điện thoại và Apple M), rồi nhìn mã máy: mọi lệnh ARM64 dài đúng 4 byte, còn lệnh x86 dài ngắn khác nhau.'],
        task: { text: ['Switch to ARM64.', 'Đổi sang ARM64.'], until: (s) => s.pipeline?.arch === 'aarch64', solve: [{ a: 'pipeline.arch', v: 'aarch64', delay: 300 }, { a: 'player.seek', v: 2, delay: 300 }] },
      },
    ],
    quiz: {
      q: ['How long is one ARM64 instruction?', 'Một lệnh ARM64 dài bao nhiêu?'],
      options: [['1 to 15 bytes, depending on the instruction', '1 tới 15 byte tuỳ lệnh'], ['Always 4 bytes', 'Luôn 4 byte'], ['Always 16 bits, like MARIE', 'Luôn 16 bit như MARIE']],
      answer: 1, why: ['ARM64 is a RISC design with fixed 32-bit instructions; x86-64 (CISC) uses variable lengths.', 'ARM64 là thiết kế RISC với lệnh cố định 32 bit; x86-64 (CISC) dùng độ dài thay đổi.'],
    },
  },
  /* ───────────────────────────── Cache ───────────────────────────── */
  {
    id: 'cache-basics', ns: 'cpu-lab', sim: 'cache', presets: ['sequential'],
    title: ['Hits, misses and blocks', 'Trúng, trượt và khối'],
    summary: ['How an address is split into tag | index | offset, why one miss brings in neighbours, and hit rate.', 'Địa chỉ tách thành tag | index | offset ra sao, vì sao một lần trượt kéo về cả hàng xóm, và tỉ lệ trúng.'],
    steps: [
      {
        target: 'cache-split', do: [{ a: 'cache.load', v: 'sequential' }, { a: 'player.seek', v: 0 }],
        title: ['Three parts of an address', 'Ba phần của một địa chỉ'],
        body: ['The cache cuts every address into three coloured parts: offset (which byte inside a block), index (which row of the cache to look in) and tag (which of the many blocks that share that row).', 'Cache cắt mỗi địa chỉ thành ba phần màu: offset (byte nào trong khối), index (xem ở hàng nào của cache) và tag (khối nào trong số rất nhiều khối dùng chung hàng đó).'],
      },
      {
        target: 'cache-table', do: [{ a: 'player.seek', v: 1 }],
        title: ['The first access misses', 'Lần đầu thì trượt'],
        body: ['The cache is empty, so the first access is a miss: the whole 16-byte block (four ints) is copied from RAM into one cache line. Listen: a low "bonk".', 'Cache đang trống nên lần đầu trượt: cả khối 16 byte (bốn số int) được chép từ RAM vào một dòng cache. Nghe nhé: tiếng "bộp" trầm.'],
      },
      {
        target: 'step',
        title: ['Your turn: the neighbours', 'Đến lượt bạn: hàng xóm'],
        body: ['Press Step three times. The next three ints were brought in with the block, so they HIT — a bright "ding".', 'Bấm Bước ba lần. Ba số int tiếp theo đã được kéo về cùng khối, nên chúng TRÚNG — tiếng "ting" trong trẻo.'],
        task: { text: ['Step to the 4th access.', 'Bấm Bước tới lần truy cập thứ 4.'], until: (s) => (s.cache?.i as number) >= 4, solve: [step(3, 700)] },
      },
      {
        target: 'cache-kpis',
        title: ['Hit rate and AMAT', 'Tỉ lệ trúng và AMAT'],
        body: ['3 hits out of 4 = 75%. AMAT (average memory access time) = 1 ns + miss rate × 100 ns. Fewer misses → a faster program, with the same CPU.', '3 trúng trên 4 = 75%. AMAT (thời gian truy cập trung bình) = 1 ns + tỉ lệ trượt × 100 ns. Ít trượt hơn → chương trình nhanh hơn, cùng một CPU.'],
      },
      {
        target: 'play',
        title: ['Your turn: the whole array', 'Đến lượt bạn: cả mảng'],
        body: ['Press Play and listen to the rhythm: bonk, ding, ding, ding… That rhythm IS spatial locality.', 'Bấm Chạy và nghe nhịp: bộp, ting, ting, ting… Nhịp đó CHÍNH LÀ cục bộ không gian.'],
        task: { text: ['Run all 32 accesses.', 'Chạy hết 32 lần truy cập.'], until: (s) => s.player?.atEnd === true && (s.cache?.i as number) > 4, solve: [{ a: 'player.speed', v: 4 }, { a: 'player.play', delay: 200 }] },
      },
      {
        target: 'cache-history',
        title: ['The pattern', 'Hình mẫu'],
        body: ['M H H H, M H H H … Walking an array in order is cache-friendly. Jumping around memory (linked lists, column order in a matrix) is not — try the "matrix" scenario later.', 'M H H H, M H H H … Duyệt mảng theo thứ tự rất hợp với cache. Nhảy lung tung trong bộ nhớ (danh sách liên kết, duyệt ma trận theo cột) thì không — lát nữa thử kịch bản "ma trận".'],
      },
    ],
    quiz: {
      q: ['After a miss, what is copied into the cache?', 'Sau một lần trượt, thứ gì được chép vào cache?'],
      options: [['Exactly the one byte requested', 'Đúng một byte được hỏi'], ['The whole block containing it (and its neighbours)', 'Cả khối chứa nó (cùng các hàng xóm)'], ['The whole of RAM', 'Toàn bộ RAM']],
      answer: 1, why: ['Caches move whole blocks (lines), betting that nearby data will be needed soon.', 'Cache di chuyển cả khối (dòng), đặt cược rằng dữ liệu gần đó sắp được cần tới.'],
    },
  },
  {
    id: 'cache-mapping', ns: 'cpu-lab', sim: 'cache', presets: ['textbook', 'conflict'],
    title: ['Conflict misses and associativity', 'Trượt xung đột và độ kết hợp'],
    summary: ['Two arrays that keep evicting each other in a direct-mapped cache — and how 2-way associativity fixes it.', 'Hai mảng liên tục đẩy nhau ra trong cache ánh xạ trực tiếp — và cách 2-way sửa điều đó.'],
    steps: [
      {
        target: 'cache-config', do: [{ a: 'cache.load', v: 'conflict' }, { a: 'player.seek', v: 0 }],
        title: ['c[i] = a[i] + b[i]', 'c[i] = a[i] + b[i]'],
        body: ['Arrays a and b are exactly 128 bytes apart — the size of this cache. The cache is direct-mapped: each block has exactly ONE place it can go (1 way per set).', 'Mảng a và b cách nhau đúng 128 byte — bằng dung lượng cache này. Cache ánh xạ trực tiếp: mỗi khối chỉ có đúng MỘT chỗ để vào (1 đường mỗi tập).'],
      },
      {
        target: 'cache-history', do: [{ a: 'player.end' }],
        title: ['Every access misses', 'Lần nào cũng trượt'],
        body: ['a[i] and b[i] map to the same set, so loading one throws out the other — even though each block holds four ints. 0% hits. These are conflict misses.', 'a[i] và b[i] rơi vào cùng một tập, nên nạp cái này là đẩy cái kia ra — dù mỗi khối chứa bốn số int. 0% trúng. Đây là trượt xung đột.'],
      },
      {
        target: 'cache-config',
        title: ['Your turn: two ways', 'Đến lượt bạn: hai đường'],
        body: ['Set "Ways" to 2. Now every set has two places, so a block of a and a block of b can live side by side.', 'Đặt "Đường/tập" thành 2. Giờ mỗi tập có hai chỗ, nên một khối của a và một khối của b ở cạnh nhau được.'],
        task: { text: ['Set Ways to 2.', 'Đặt Đường/tập = 2.'], until: (s) => s.cache?.ways === 2, solve: [{ a: 'cache.ways', v: 2, delay: 300 }] },
      },
      {
        target: 'cache-kpis', do: [{ a: 'player.end', delay: 200 }],
        title: ['12 of 16 hit', '12 trên 16 lần trúng'],
        body: ['Same cache size, same program — just a smarter placement rule. Real L1 caches are 8- or 12-way set associative for exactly this reason.', 'Cùng dung lượng cache, cùng chương trình — chỉ đổi luật đặt khối thông minh hơn. Cache L1 thật là 8 hoặc 12 đường cũng vì lý do này.'],
      },
    ],
    quiz: {
      q: ['A conflict miss happens when…', 'Trượt xung đột xảy ra khi…'],
      options: [['the cache is completely full', 'cache đầy hoàn toàn'], ['blocks used together map to the same set and evict each other', 'các khối hay dùng cùng lúc rơi vào cùng tập và đẩy nhau ra'], ['a block is touched for the first time', 'một khối được đụng lần đầu']],
      answer: 1, why: ['Free space elsewhere does not help a direct-mapped cache: each block has only one allowed slot.', 'Chỗ trống ở nơi khác không giúp được cache ánh xạ trực tiếp: mỗi khối chỉ có một chỗ được phép.'],
    },
  },
];
