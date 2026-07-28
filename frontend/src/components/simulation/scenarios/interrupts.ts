/**
 * Máy tính · CEA201 / OSG202 — ngắt và DMA.
 *
 * Câu hỏi: CPU chạy nhanh gấp hàng triệu lần ổ đĩa và bàn phím. Vậy nó làm gì
 * trong lúc chờ dữ liệu về? Có đúng hai câu trả lời, và cả hai đều được dùng
 * trong máy thật:
 *
 *   Hỏi vòng (polling)  — CPU liên tục hỏi "xong chưa?". Đơn giản, đáp ứng cực
 *                         nhanh, nhưng đốt sạch một lõi để chờ.
 *   Ngắt (interrupt)    — thiết bị TỰ gọi CPU khi xong. CPU đi làm việc khác
 *                         trong lúc chờ. Đây là cách gần như mọi thứ hoạt động.
 *
 * Và khi dữ liệu lớn, ngay cả ngắt cũng chưa đủ: nếu CPU phải tự chép từng
 * byte từ thiết bị vào RAM thì nó lại bận cả thời gian truyền. DMA giải quyết
 * nốt phần đó — một khối phần cứng riêng chép dữ liệu thẳng vào RAM, chỉ báo
 * CPU đúng một lần khi xong.
 *
 * Đây cũng chính là nền tảng phần cứng của "I/O bất đồng bộ" mà bạn dùng hàng
 * ngày: `await fs.readFile()` không phải phép màu của ngôn ngữ — nó là ngắt.
 */

import { Timer } from 'lucide-react';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const nodes = [
  { id: 'cpu', label: 'CPU', kind: 'server' as const, x: 180, y: 300, sublabel: { vi: '3 GHz · 0,33ns/chu kỳ', en: '3 GHz · 0.33ns/cycle' } },
  { id: 'pic', label: 'Bộ điều khiển ngắt', kind: 'gateway' as const, x: 470, y: 150, sublabel: { vi: 'xếp hàng, đánh số ưu tiên', en: 'queues and prioritises' } },
  { id: 'disk', label: 'Ổ SSD', kind: 'storage' as const, x: 760, y: 300, sublabel: { vi: '~100µs · chậm hơn 300.000 lần', en: '~100µs · 300,000× slower' } },
  { id: 'ram', label: 'RAM', kind: 'db' as const, x: 470, y: 470, sublabel: { vi: 'nơi dữ liệu phải tới', en: 'where the data must land' } },
  { id: 'dma', label: 'DMA', kind: 'worker' as const, x: 760, y: 470, sublabel: { vi: 'chép hộ CPU', en: 'copies on the CPU’s behalf' } },
];

const edges = [
  { id: 'e_cpu_disk', from: 'cpu', to: 'disk' },
  { id: 'e_disk_pic', from: 'disk', to: 'pic' },
  { id: 'e_pic_cpu', from: 'pic', to: 'cpu' },
  { id: 'e_disk_dma', from: 'disk', to: 'dma' },
  { id: 'e_dma_ram', from: 'dma', to: 'ram' },
  { id: 'e_cpu_ram', from: 'cpu', to: 'ram', ghost: true },
];

type Push = (step: Partial<SimStep> & { id: string; title: I18nText; detail: I18nText; duration: number }) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (s) => {
    steps.push({ kind: 'INTERNAL', ...s } as SimStep);
  };
  return { steps, push };
}

/* ── A — HỎI VÒNG SO VỚI NGẮT ────────────────────────────────── */

function buildInterrupt(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'ask',
    title: { vi: 'CPU yêu cầu đọc một khối dữ liệu từ đĩa', en: 'The CPU asks the disk for a block' },
    detail: {
      vi: 'Lệnh được gửi đi trong vài nano giây. Nhưng SSD cần khoảng 100 micro giây để trả lời — với CPU 3 GHz thì đó là ba trăm nghìn chu kỳ. Câu hỏi duy nhất đáng quan tâm là: ba trăm nghìn chu kỳ ấy dùng để làm gì?',
      en: 'The command goes out in nanoseconds. But the SSD needs around 100 microseconds to answer — three hundred thousand cycles for a 3 GHz CPU. The only question that matters is: what are those three hundred thousand cycles spent on?',
    },
    duration: 2600,
    edge: 'e_cpu_disk',
    kind: 'QUERY',
    nodeStates: { cpu: 'active', disk: 'processing' },
    packetLabel: 'đọc khối 4KB',
    sfx: 'click',
    log: { vi: 'đọc sector 12480 · SSD cần ~100µs', en: 'read sector 12480 · SSD needs ~100µs' },
  });

  push({
    id: 'poll',
    title: { vi: 'Cách thứ nhất: hỏi vòng — và đốt sạch một lõi', en: 'Option one: polling — and burning a whole core' },
    detail: {
      vi: 'CPU lặp `while (!disk.ready()) {}`. Đơn giản tới mức không thể sai, và đáp ứng nhanh nhất có thể vì biết ngay khoảnh khắc dữ liệu sẵn sàng. Cái giá là ba trăm nghìn chu kỳ bị đốt để hỏi một câu mà câu trả lời là "chưa". Trên máy nhiều tác vụ thì đây là lãng phí không thể chấp nhận — nhưng trong vi điều khiển hoặc driver mạng siêu tốc, người ta vẫn cố tình dùng.',
      en: 'The CPU loops `while (!disk.ready()) {}`. So simple it cannot be wrong, and as responsive as physically possible since it learns the instant data is ready. The price is three hundred thousand cycles burned asking a question whose answer is "not yet". On a multitasking machine that is unacceptable waste — yet in microcontrollers and ultra-low-latency network drivers people still choose it deliberately.',
    },
    duration: 3100,
    at: 'cpu',
    kind: 'ERROR',
    nodeStates: { cpu: 'error' },
    sfx: 'buzz',
    log: { vi: 'while(!ready){} · 300.000 chu kỳ để hỏi "xong chưa?"', en: 'while(!ready){} · 300,000 cycles asking "done yet?"' },
    teachingNote: {
      vi: 'Hỏi lớp: hỏi vòng có bao giờ ĐÚNG không? Có — khi độ trễ quan trọng hơn cả một lõi CPU.',
      en: 'Ask the class: is polling ever right? Yes — when latency matters more than an entire core.',
    },
  });

  push({
    id: 'switch',
    title: { vi: 'Cách thứ hai: CPU bỏ đi làm việc khác', en: 'Option two: the CPU goes and does something else' },
    detail: {
      vi: 'Hệ điều hành ghi lại trạng thái tiến trình đang chờ, đánh dấu nó là "chờ I/O", rồi cho một tiến trình khác chạy. CPU không hề nhàn rỗi — nó chỉ đơn giản là không chờ. Đây chính là chuyển ngữ cảnh, và nó là lý do máy bạn mở được hai chục ứng dụng cùng lúc trên vài lõi.',
      en: 'The operating system saves the waiting process’s state, marks it "blocked on I/O", and schedules a different process. The CPU is not idle — it simply is not waiting. This is a context switch, and it is why your machine runs twenty applications on a handful of cores.',
    },
    duration: 2900,
    at: 'cpu',
    kind: 'INTERNAL',
    nodeStates: { cpu: 'success' },
    sfx: 'swoosh',
    log: { vi: 'tiến trình A → chờ I/O · CPU chạy tiến trình B', en: 'process A → blocked · CPU runs process B' },
  });

  push({
    id: 'raise',
    title: { vi: 'Đĩa xong việc và TỰ gọi CPU', en: 'The disk finishes and calls the CPU itself' },
    detail: {
      vi: 'Đây là chỗ đảo ngược chiều điều khiển. Thiết bị kéo một đường tín hiệu vật lý; bộ điều khiển ngắt nhận, gán số ưu tiên rồi báo lên CPU. CPU đang giữa chừng làm việc khác vẫn bị buộc phải dừng lại — ngắt không phải lời mời, nó là lệnh.',
      en: 'This is where control inverts. The device raises a physical signal line; the interrupt controller receives it, assigns a priority and notifies the CPU. The CPU, mid-way through unrelated work, is forced to stop — an interrupt is not an invitation, it is a command.',
    },
    duration: 2900,
    edge: 'e_disk_pic',
    kind: 'EVENT',
    nodeStates: { disk: 'success', pic: 'processing' },
    packetLabel: 'IRQ 14',
    sfx: 'ping',
    log: { vi: 'đĩa kéo đường IRQ 14 · bộ điều khiển xếp hàng', en: 'disk raises IRQ 14 · controller queues it' },
  });

  push({
    id: 'handler',
    title: { vi: 'CPU nhảy vào trình xử lý ngắt, rồi quay lại y chỗ cũ', en: 'The CPU jumps to a handler, then returns exactly where it was' },
    detail: {
      vi: 'Phần cứng cất trạng thái hiện tại, tra bảng vector ngắt để tìm địa chỉ trình xử lý, rồi nhảy tới đó. Xử lý xong thì khôi phục trạng thái và chạy tiếp đúng lệnh dang dở. Tiến trình bị ngắt không hề biết chuyện gì vừa xảy ra — và đây là lý do trình xử lý ngắt phải RẤT NGẮN: mọi thứ khác đang bị đóng băng chờ nó.',
      en: 'The hardware saves the current state, looks up the handler address in the interrupt vector table, and jumps there. When done it restores the state and resumes the exact interrupted instruction. The interrupted process never knows anything happened — and this is why interrupt handlers must be VERY short: everything else is frozen while one runs.',
    },
    duration: 3100,
    edge: 'e_pic_cpu',
    kind: 'INTERNAL',
    nodeStates: { pic: 'success', cpu: 'processing' },
    packetLabel: 'vector → handler',
    sfx: 'blip',
    log: { vi: 'lưu trạng thái → handler → khôi phục → chạy tiếp', en: 'save state → handler → restore → resume' },
  });

  push({
    id: 'async',
    title: { vi: 'Và đây chính là thứ nằm dưới await', en: 'And this is what sits underneath await' },
    detail: {
      vi: '`await fs.readFile()` trong Node.js không phải phép màu của ngôn ngữ. Nó là: gửi yêu cầu xuống kernel, đăng ký một hàm gọi lại, trả luồng về cho event loop chạy việc khác, và khi ngắt của đĩa tới thì hàm gọi lại được xếp vào hàng đợi. Toàn bộ mô hình bất đồng bộ mà bạn viết hàng ngày là lớp trừu tượng đặt trên cơ chế ngắt của phần cứng.',
      en: '`await fs.readFile()` in Node.js is not language magic. It is: send the request to the kernel, register a callback, hand the thread back to the event loop for other work, and when the disk’s interrupt arrives, queue that callback. The entire async model you write daily is an abstraction over the hardware interrupt.',
    },
    duration: 3100,
    at: 'cpu',
    nodeStates: { cpu: 'success' },
    sfx: 'lock',
    log: { vi: 'await = đăng ký callback + chờ ngắt', en: 'await = register callback + wait for the interrupt' },
  });

  return steps;
}

/* ── B — DMA ─────────────────────────────────────────────────── */

function buildDma(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'big',
    title: { vi: 'Lần này đọc 100MB, không phải 4KB', en: 'This time it is 100MB, not 4KB' },
    detail: {
      vi: 'Ngắt đã giải quyết chuyện CHỜ. Nhưng còn chuyện CHÉP: dữ liệu phải đi từ thiết bị vào RAM, và nếu CPU tự làm việc đó thì nó lại bận suốt thời gian truyền — chỉ khác là bận chép thay vì bận chờ.',
      en: 'Interrupts solved WAITING. But there is still COPYING: the data must travel from the device into RAM, and if the CPU does that itself it is busy for the entire transfer — just busy copying instead of busy waiting.',
    },
    duration: 2600,
    edge: 'e_cpu_disk',
    kind: 'QUERY',
    nodeStates: { cpu: 'active', disk: 'processing' },
    packetLabel: 'đọc 100MB',
    sfx: 'click',
  });

  push({
    id: 'byte',
    title: { vi: 'Nếu CPU tự chép: hàng triệu lệnh chỉ để chuyển byte', en: 'If the CPU copies: millions of instructions just moving bytes' },
    detail: {
      vi: 'Mỗi vòng lặp là đọc một từ từ thiết bị rồi ghi vào RAM. Với 100MB thì đó là hàng chục triệu lần lặp — CPU chạy hết công suất mà không tính toán gì cả, chỉ làm băng chuyền. Và trong suốt thời gian đó, chẳng ứng dụng nào khác được chạy tử tế.',
      en: 'Each iteration reads a word from the device and writes it into RAM. For 100MB that is tens of millions of iterations — the CPU at full tilt computing nothing, acting as a conveyor belt. And throughout, no other application gets a fair share.',
    },
    duration: 2900,
    edge: 'e_cpu_ram',
    kind: 'ERROR',
    nodeStates: { cpu: 'error' },
    packetLabel: 'chép từng từ',
    sfx: 'buzz',
    log: { vi: 'CPU bận 100% · không tính toán gì, chỉ chép', en: 'CPU at 100% · computing nothing, only copying' },
  });

  push({
    id: 'dma',
    title: { vi: 'DMA — giao việc chép cho một khối phần cứng riêng', en: 'DMA — hand the copying to dedicated hardware' },
    detail: {
      vi: 'CPU chỉ nói đúng ba điều: lấy từ đâu, đặt vào đâu, bao nhiêu byte. Rồi nó đi làm việc khác thật sự. Bộ điều khiển DMA tự lấy quyền dùng bus và chuyển dữ liệu thẳng từ thiết bị vào RAM, không qua CPU một byte nào.',
      en: 'The CPU states exactly three things: source, destination, byte count. Then it genuinely goes elsewhere. The DMA controller takes control of the bus and moves data straight from the device into RAM, with not a single byte passing through the CPU.',
    },
    duration: 3000,
    edge: 'e_disk_dma',
    kind: 'INTERNAL',
    nodeStates: { cpu: 'success', dma: 'processing' },
    packetLabel: 'nguồn · đích · độ dài',
    sfx: 'swoosh',
    log: { vi: 'DMA: src=đĩa · dst=0x8000 · len=100MB', en: 'DMA: src=disk · dst=0x8000 · len=100MB' },
  });

  push({
    id: 'transfer',
    title: { vi: 'Dữ liệu chảy thẳng vào RAM trong lúc CPU tính việc khác', en: 'Data flows into RAM while the CPU computes something else' },
    detail: {
      vi: 'Hai việc chạy song song thật sự, vì chúng dùng hai khối phần cứng khác nhau. Điểm chạm duy nhất là bus bộ nhớ — DMA có lúc phải giành quyền dùng bus với CPU, và đó là lý do một lần truyền lớn vẫn làm chậm máy đôi chút dù CPU rảnh.',
      en: 'Two genuinely parallel activities, because they use different hardware blocks. Their only contact point is the memory bus — DMA must occasionally contend with the CPU for it, which is why a large transfer still slows the machine slightly even with a free CPU.',
    },
    duration: 3000,
    edge: 'e_dma_ram',
    kind: 'RESPONSE',
    nodeStates: { dma: 'processing', ram: 'processing', cpu: 'success' },
    packetLabel: '100MB',
    sfx: 'stream',
    log: { vi: 'DMA đang chép · CPU chạy ứng dụng bình thường', en: 'DMA copying · CPU running apps normally' },
  });

  push({
    id: 'done',
    title: { vi: 'Xong thì báo CPU đúng MỘT lần', en: 'When finished, interrupt the CPU exactly ONCE' },
    detail: {
      vi: 'Thay vì hàng chục triệu lần chạm, cả lần truyền 100MB chỉ tốn của CPU đúng một lần ngắt. Đây là lý do bạn chép được file lớn, phát video 4K hay tải mạng tốc độ cao mà máy vẫn mượt — CPU gần như không tham gia vào việc vận chuyển dữ liệu.',
      en: 'Instead of tens of millions of touches, the entire 100MB transfer costs the CPU exactly one interrupt. This is why you can copy huge files, play 4K video or saturate a network link while the machine stays smooth — the CPU barely participates in moving data at all.',
    },
    duration: 3000,
    edge: 'e_pic_cpu',
    kind: 'ACK',
    nodeStates: { dma: 'success', ram: 'success', cpu: 'active' },
    packetLabel: 'xong · 1 ngắt',
    sfx: 'success',
    log: { vi: '100MB xong · CPU bị làm phiền đúng 1 lần', en: '100MB done · CPU disturbed exactly once' },
  });

  push({
    id: 'chain',
    title: { vi: 'Ba tầng, mỗi tầng gỡ một nút thắt', en: 'Three levels, each removing one bottleneck' },
    detail: {
      vi: 'Hỏi vòng lãng phí thời gian CHỜ; ngắt gỡ nút đó. Chép thủ công lãng phí thời gian TRUYỀN; DMA gỡ nốt. Còn lại một nút cuối là chuyển ngữ cảnh giữa các tiến trình — và đó chính là chỗ mà mô hình I/O bất đồng bộ trong một luồng, kiểu Node.js, kiếm được phần lợi của nó.',
      en: 'Polling wastes WAITING time; interrupts remove that. Manual copying wastes TRANSFER time; DMA removes that too. One bottleneck remains — context switching between processes — and that is precisely where single-threaded async I/O models like Node.js find their advantage.',
    },
    duration: 3100,
    at: 'cpu',
    nodeStates: { cpu: 'active' },
    sfx: 'lock',
  });

  return steps;
}

export const interruptsScenario: Scenario = {
  id: 'interrupts',
  name: { vi: 'Ngắt và DMA — CPU làm gì trong lúc chờ', en: 'Interrupts and DMA — what the CPU does while waiting' },
  tagline: {
    vi: 'SSD chậm hơn CPU ba trăm nghìn chu kỳ mỗi lần đọc. Hỏi vòng thì đốt sạch một lõi để chờ; ngắt thì thiết bị tự gọi CPU khi xong. Và `await` mà bạn viết hàng ngày chính là lớp bọc quanh cơ chế đó.',
    en: 'An SSD read costs the CPU three hundred thousand cycles of waiting. Polling burns a whole core; an interrupt lets the device call the CPU when it is ready. And the `await` you write daily is a wrapper around exactly that.',
  },
  icon: Timer,
  accent: '#38bdf8',
  group: 'computer',
  nodes,
  edges,
  options: [
    {
      id: 'view',
      label: { vi: 'Vấn đề nào', en: 'Which problem' },
      defaultValue: 'interrupt',
      choices: [
        {
          value: 'interrupt',
          label: 'Chờ — hỏi vòng hay ngắt',
          fullLabel: 'Ba trăm nghìn chu kỳ dùng làm gì',
          color: '#38bdf8',
          hint: { vi: 'thứ nằm dưới await', en: 'what sits under await' },
        },
        {
          value: 'dma',
          label: 'Chép — DMA',
          fullLabel: '100MB mà CPU chỉ bị làm phiền 1 lần',
          color: '#34d399',
          hint: { vi: 'vì sao phát 4K vẫn mượt', en: 'why 4K playback stays smooth' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'dma' ? buildDma() : buildInterrupt()),
};
