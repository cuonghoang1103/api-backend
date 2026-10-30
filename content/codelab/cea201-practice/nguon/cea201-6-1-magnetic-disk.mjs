/** CEA201 · 6.1 — Magnetic disk: capacity, seek, rotational latency, transfer. Số do S.diskAccess tính. */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, r2, dat } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Disk 1 — Platters, tracks, sectors and access time',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on how a hard disk stores and finds data.</p>', '<p>Câu hỏi khái niệm về cách đĩa cứng lưu và tìm dữ liệu.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['The access time of a disk is the sum of …', 'Thời gian truy cập của đĩa là tổng của …'], ['seek time, rotational latency and transfer time', 'seek time, cache lookup time and bus arbitration time', 'rotational latency, bus time and controller time', 'seek time only, because rotation is negligible'], ['Move the head, wait for the sector, read it.', 'Dời đầu từ, chờ sector, đọc nó.']),
    q('c2', ['Average rotational latency of a 7200 rpm disk is about …', 'Độ trễ quay trung bình của đĩa 7200 vòng/phút khoảng …'], ['4.17 ms (half a revolution)', '8.33 ms (a full revolution)', '0.5 ms', '16.7 ms'], ['One revolution takes 60000/7200 = 8.33 ms; on average we wait half of it.', 'Một vòng mất 60000/7200 = 8,33 ms; trung bình phải chờ nửa vòng.']),
    q('c3', ['Why are sequential reads much faster than random reads on a hard disk?', 'Vì sao đọc tuần tự nhanh hơn nhiều so với đọc ngẫu nhiên trên đĩa cứng?'], ['They pay the seek and rotation once instead of per block', 'The platters spin faster when data are sequential', 'The disk cache is bigger during sequential reads', 'Random reads need more CPU time for each block'], ['Mechanical positioning dominates; transfer is cheap once positioned.', 'Việc định vị cơ khí chiếm ưu thế; truyền thì rẻ khi đã vào đúng chỗ.']),
    q('c4', ['Zoned bit recording stores …', 'Ghi vùng (zoned bit recording) lưu …'], ['more sectors on the longer outer tracks', 'the same number of sectors on every track', 'data only on the inner tracks', 'parity on the outer tracks'], ['The outer tracks are longer, so they hold more sectors at the same density.', 'Rãnh ngoài dài hơn nên chứa nhiều sector hơn ở cùng mật độ.']),
    q('c5', ['A cylinder is …', 'Cylinder là …'], ['the set of tracks at one arm position on all surfaces', 'one track of one surface, divided into sectors', 'a group of neighbouring sectors on one track of a platter', 'one platter with the two surfaces it carries'], ['Reading a cylinder needs no head movement, only head switching.', 'Đọc một cylinder không cần dời cần đọc, chỉ đổi đầu đọc.']),
  ],
  goiY: ['Mechanical delays (ms) dwarf electronic ones (µs).', 'Half a revolution on average.'],
  loiHayGap: ['Using a full rotation as the average latency.', 'Ignoring the seek time when comparing two disks.'],
  thuatNgu: [tn('seek time', 'thời gian dời đầu từ'), tn('rotational latency', 'độ trễ quay')],
  khaiNiem: ['disk access time'],
});

const CAP = [[2, 4, 100000, 500, 512], [4, 8, 200000, 800, 4096], [1, 2, 50000, 256, 512]];
const capB = ([p, s, c, spt, b]) => p * 2 * c * spt * b;
const E2 = tinh({
  tieuDe: 'Disk 2 — Capacity from the geometry',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>A disk has <b>P</b> platters (2 surfaces each, one head per surface), <b>C</b> cylinders (tracks per surface), <b>S</b> sectors per track and <b>B</b>-byte sectors. Give the total capacity in <b>GB</b> (10⁹ bytes, 2 decimals) and the capacity of one <b>cylinder</b> in KiB.</p>', '<p>Đĩa có <b>P</b> mâm (mỗi mâm 2 mặt, mỗi mặt một đầu đọc), <b>C</b> cylinder (số rãnh mỗi mặt), <b>S</b> sector mỗi rãnh và sector <b>B</b> byte. Cho tổng dung lượng theo <b>GB</b> (10⁹ byte, 2 chữ số) và dung lượng một <b>cylinder</b> theo KiB.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Capacity', 'Dung lượng'], [{ ma: 'g', ten: 'Geometry' }, { ma: 't', ten: 'Total (GB)' }, { ma: 'c', ten: 'Cylinder (KiB)' }],
    CAP.map((x) => ({ o: { g: `P = ${x[0]}, C = ${x[2]}, S = ${x[3]}, B = ${x[4]} bytes` }, a: { t: r2(capB(x) / 1e9, 2), c: [String(x[0] * 2 * x[3] * x[4] / 1024)] } })),
    [CAP.map((x) => `${x[0]}×2×${x[2]}×${x[3]}×${x[4]} = ${capB(x)} B = ${(capB(x) / 1e9).toFixed(2)} GB; cylinder ${x[0] * 2 * x[3] * x[4] / 1024} KiB`).join('; ') + '.', CAP.map((x) => `${(capB(x) / 1e9).toFixed(2)} GB; cylinder ${x[0] * 2 * x[3] * x[4] / 1024} KiB`).join('; ') + '.'])],
  goiY: ['surfaces = 2 × platters; capacity = surfaces × cylinders × sectors × bytes.', 'A cylinder holds surfaces × sectors × bytes.'],
  loiHayGap: ['Counting one surface per platter.', 'Mixing 10⁹ and 2³⁰.'],
  thuatNgu: [tn('cylinder', 'cylinder (các rãnh cùng vị trí cần)')],
  khaiNiem: ['disk geometry'],
});

const DK = [[4, 7200, 512, 512 * 400], [9, 5400, 4096, 4096 * 200], [3, 15000, 512, 512 * 600], [12, 7200, 65536, 512 * 1000]];
const rotation = (rpm) => 60000 / rpm;
const E3 = tinh({
  tieuDe: 'Disk 3 — Access time of one request',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Average rotational latency = ½ revolution; transfer time = (bytes / bytes-per-track) × revolution time; access time = seek + latency + transfer. Fill in the rotation time of one revolution, the latency, and the total access time (ms, 3 decimals).</p>', '<p>Độ trễ quay trung bình = ½ vòng; thời gian truyền = (số byte / byte mỗi rãnh) × thời gian một vòng; thời gian truy cập = seek + độ trễ + truyền. Điền thời gian một vòng, độ trễ và tổng thời gian truy cập (ms, 3 chữ số).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Access time', 'Thời gian truy cập'], [{ ma: 'd', ten: 'Disk and request' }, { ma: 'r', ten: 'Revolution (ms)' }, { ma: 'l', ten: 'Latency (ms)' }, { ma: 't', ten: 'Access (ms)' }],
    DK.map(([s, rpm, b, bpt]) => ({ o: { d: `seek ${s} ms, ${rpm} rpm, read ${b} B, track = ${bpt} B` }, a: { r: r2(rotation(rpm), 3), l: r2(rotation(rpm) / 2, 3), t: r2(S.diskAccess(s, rpm, b, bpt), 3) } })),
    [DK.map(([s, rpm, b, bpt]) => `${s} + ${(rotation(rpm) / 2).toFixed(3)} + ${(b / bpt * rotation(rpm)).toFixed(3)} = ${S.diskAccess(s, rpm, b, bpt).toFixed(3)} ms`).join('; ') + '. Seek and latency dominate small reads.', DK.map(([s, rpm, b, bpt]) => `${s} + ${(rotation(rpm) / 2).toFixed(3)} + ${(b / bpt * rotation(rpm)).toFixed(3)} = ${S.diskAccess(s, rpm, b, bpt).toFixed(3)} ms`).join('; ') + '.'])],
  goiY: ['60000 / rpm gives milliseconds per revolution.', 'Transfer time = fraction of the track read × revolution time.'],
  loiHayGap: ['Using seconds for rpm and milliseconds for seek.', 'Using a full revolution as latency.'],
  thuatNgu: [tn('revolution', 'một vòng quay')],
  khaiNiem: ['seek', 'rotational latency', 'transfer time'],
});

const E4 = tinh({
  tieuDe: 'Disk 4 — Sequential versus random: the same 1 MiB',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Disk: seek 8 ms, 7200 rpm, 500 sectors × 512 B per track (track = 256,000 B). Read 1 MiB (1,048,576 B) either as <b>one sequential run</b> (one seek + one latency + transfer of the whole amount, ignoring track switches) or as <b>256 random 4 KiB reads</b> (each pays seek + latency + its transfer). Fill in both times (ms, 1 decimal), the ratio random / sequential (1 decimal) and the throughput of each (MB/s with 10⁶ bytes, 1 decimal).</p>', '<p>Đĩa: seek 8 ms, 7200 vòng/phút, 500 sector × 512 B mỗi rãnh (rãnh = 256.000 B). Đọc 1 MiB (1.048.576 B) hoặc <b>một lượt tuần tự</b> (một seek + một độ trễ + truyền toàn bộ, bỏ qua đổi rãnh) hoặc <b>256 lần đọc ngẫu nhiên 4 KiB</b> (mỗi lần trả seek + độ trễ + truyền). Điền cả hai thời gian (ms, 1 chữ số), tỉ số ngẫu nhiên / tuần tự (1 chữ số) và thông lượng mỗi kiểu (MB/s theo 10⁶ byte, 1 chữ số).</p>'),
  loai: 'table',
  bang: (() => {
    const seq = S.diskAccess(8, 7200, 1048576, 256000), rnd = 256 * S.diskAccess(8, 7200, 4096, 256000), mb = (t) => 1.048576 / (t / 1000);
    return [bang1('b1', ['Sequential vs random', 'Tuần tự và ngẫu nhiên'], [{ ma: 'k', ten: 'Pattern' }, { ma: 't', ten: 'Time (ms)' }, { ma: 'm', ten: 'Throughput (MB/s)' }],
      [{ o: { k: 'One sequential run' }, a: { t: r2(seq, 1), m: r2(mb(seq), 1) } }, { o: { k: '256 random 4 KiB reads' }, a: { t: r2(rnd, 1), m: r2(mb(rnd), 1) } }],
      [`Sequential ${seq.toFixed(1)} ms (${mb(seq).toFixed(1)} MB/s); random 256 × ${S.diskAccess(8, 7200, 4096, 256000).toFixed(3)} = ${rnd.toFixed(1)} ms (${mb(rnd).toFixed(1)} MB/s).`, `Tuần tự ${seq.toFixed(1)} ms (${mb(seq).toFixed(1)} MB/s); ngẫu nhiên 256 × ${S.diskAccess(8, 7200, 4096, 256000).toFixed(3)} = ${rnd.toFixed(1)} ms (${mb(rnd).toFixed(1)} MB/s).`]),
    bang1('b2', ['Ratio', 'Tỉ số'], [{ ma: 'k', ten: 'Quantity' }, { ma: 'v', ten: 'Value' }], [{ o: { k: 'random time / sequential time' }, a: { v: r2(rnd / seq, 1) } }], [`${rnd.toFixed(1)} / ${seq.toFixed(1)} = ${(rnd / seq).toFixed(1)}×: the cost of positioning 256 times.`, `${rnd.toFixed(1)} / ${seq.toFixed(1)} = ${(rnd / seq).toFixed(1)} lần: cái giá của việc định vị 256 lần.`])];
  })(),
  goiY: ['Random: 256 × (seek + latency + 4096-byte transfer).', 'Throughput = 1.048576 MB ÷ time in seconds.'],
  loiHayGap: ['Paying the seek only once for the random case.', 'Dividing MiB by milliseconds.'],
  thuatNgu: [tn('throughput', 'thông lượng')],
  khaiNiem: ['sequential vs random access'],
});

const diskReport = function diskReport(cfg, files) {
  var rot = 60000 / cfg.rpm, times = [], total = 0;
  for (var i = 0; i < files.length; i++) {
    var t = files[i].fragments * (cfg.seekMs + rot / 2) + (files[i].bytes / cfg.bytesPerTrack) * rot;
    t = Math.round(t * 1000) / 1000;
    times.push(t); total += t;
  }
  return { times: times, total: Math.round(total * 1000) / 1000 };
};
const CFG = { seekMs: 8, rpm: 7200, bytesPerTrack: 256000 };
const E5 = jsDe({
  tieuDe: 'Disk 5 — What does fragmentation cost?',
  doKho: 'HARD', phut: 18,
  moTa: bi('<p>Write <code>diskReport(cfg, files)</code>. <code>cfg = { seekMs, rpm, bytesPerTrack }</code>; each file is <code>{ bytes, fragments }</code>: the file is stored in <code>fragments</code> separate pieces, and every piece costs one seek plus an average rotational latency (half a revolution); the data transfer time of the whole file is <code>bytes / bytesPerTrack</code> revolutions. Return <code>{ times, total }</code>: the read time of every file in ms, each rounded to 3 decimals (<code>Math.round(t * 1000) / 1000</code>), and the sum of those rounded values rounded again to 3 decimals.</p>', '<p>Viết <code>diskReport(cfg, files)</code>. <code>cfg = { seekMs, rpm, bytesPerTrack }</code>; mỗi tệp là <code>{ bytes, fragments }</code>: tệp nằm ở <code>fragments</code> mảnh rời nhau, mỗi mảnh tốn một seek cộng độ trễ quay trung bình (nửa vòng); thời gian truyền dữ liệu cả tệp là <code>bytes / bytesPerTrack</code> vòng. Trả <code>{ times, total }</code>: thời gian đọc từng tệp theo ms, mỗi giá trị làm tròn 3 chữ số (<code>Math.round(t * 1000) / 1000</code>), và tổng các giá trị đã làm tròn đó cũng làm tròn 3 chữ số.</p>'),
  yeuCau: [bi('<code>fragments ≥ 1</code>.', '<code>fragments ≥ 1</code>.')],
  viDu: [{ input: 'diskReport({ seekMs: 8, rpm: 7200, bytesPerTrack: 256000 }, [{ bytes: 256000, fragments: 1 }])', output: JSON.stringify(diskReport(CFG, [{ bytes: 256000, fragments: 1 }])), explanation: '8 + 4.167 (half a revolution) + 8.333 (one full track) = 20.5 ms.|||8 + 4,167 (nửa vòng) + 8,333 (cả một rãnh) = 20,5 ms.' }],
  goiY: ['One revolution = 60000 / rpm ms.', 'time = fragments × (seek + rev / 2) + bytes / bytesPerTrack × rev.', 'Round each file, then add and round the total.'],
  loiHayGap: ['Charging one seek per file regardless of fragments.', 'Summing the unrounded times.'],
  giaiThich: '<p>Splitting a file into F pieces multiplies the positioning cost by F while the transfer time is unchanged — the reason defragmentation helps hard disks and not SSDs.</p>',
  khaiNiem: ['fragmentation', 'seek', 'latency'],
  fn: 'diskReport',
  dau: 'function diskReport(cfg, files) {\n  return { times: [], total: 0 };\n}\n',
  giaiMa: dat(diskReport, 'diskReport'),
  ref: diskReport,
  cases: [{ args: [CFG, [{ bytes: 256000, fragments: 1 }, { bytes: 1048576, fragments: 4 }]] }, { args: [{ seekMs: 4, rpm: 15000, bytesPerTrack: 300000 }, [{ bytes: 4096, fragments: 1 }, { bytes: 4096, fragments: 8 }]] }, { args: [CFG, []] }, { args: [{ seekMs: 12, rpm: 5400, bytesPerTrack: 200000 }, [{ bytes: 10000000, fragments: 25 }, { bytes: 512, fragments: 1 }, { bytes: 99999, fragments: 3 }]], an: true }, { args: [CFG, [{ bytes: 123456, fragments: 2 }]], an: true }],
});

export default doiDau({
  slug: 'cea201-6-1-magnetic-disk',
  ten: '6.1 Magnetic disk & how it stores data',
  khoa: KHOA,
  baiHoc: 'cea201-6-1-magnetic-disk',
  de: [E1, E2, E3, E4, E5],
});
void hai; void giai; void mc;
