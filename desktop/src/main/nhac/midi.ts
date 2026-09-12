/**
 * ============================================================
 * VIẾT TỆP MIDI — mẫu vinahouse để bắt đầu
 * ============================================================
 *
 * Xưởng Remix KHÔNG sáng tác hộ. Thứ nó xuất ra là một khung sườn: trống bốn
 * nhịp, clap vào phách 2 và 4, hat lệch phách, và một đường bass chạy đúng tông
 * của bài. Kéo vào FL Studio là có ngay một vòng lặp chạy được, rồi thay tiếng,
 * đổi nốt, dựng tiếp.
 *
 * ─── Vì sao MIDI chứ không phải audio ───
 * Audio là tiếng của MỘT bộ nhạc cụ; MIDI là nốt, và người dùng gắn tiếng của
 * họ vào. Với bản remix thì tiếng chính là thứ họ muốn tự chọn — xuất audio
 * nghĩa là áp đặt bộ trống của tôi lên bài của họ.
 *
 * ─── Vì sao tự viết định dạng ───
 * SMF là một định dạng nhị phân ~60 dòng, cố định từ 1996, và phần Xưởng Remix
 * cần chỉ là note on/off + tempo. Một thư viện cho việc này là cõng thêm một
 * phụ thuộc để tiết kiệm 60 dòng.
 */

/** Tick mỗi nốt đen. 480 là giá trị mọi DAW đều đọc đúng. */
export const TICK_DEN = 480;

export interface NotMidi {
  /** 0..15. Kênh 9 là bộ gõ theo chuẩn General MIDI. */
  kenh: number;
  /** Cao độ MIDI. 60 = Đô4. */
  not: number;
  batDau: number;
  dai: number;
  /** 1..127. */
  luc: number;
}

/**
 * Số nguyên dạng độ-dài-thay-đổi — cách MIDI ghi thời gian chờ.
 *
 * Bảy bit mỗi byte, bit cao nhất báo "còn byte nữa". Ghi thẳng 4 byte thay vì
 * mã này thì tệp vẫn mở được ở vài phần mềm dễ tính rồi vỡ ở phần mềm khác —
 * kiểu lỗi tệ nhất vì nó trông như "FL Studio kén tệp".
 */
export function maVlq(gt: number): number[] {
  if (gt < 0) throw new Error('VLQ không nhận số âm');
  const ra = [gt & 0x7f];
  let v = Math.floor(gt / 128);
  while (v > 0) {
    ra.unshift((v & 0x7f) | 0x80);
    v = Math.floor(v / 128);
  }
  return ra;
}

function khoi(ten: string, than: number[]): number[] {
  const n = than.length;
  return [
    ...[...ten].map((c) => c.charCodeAt(0)),
    (n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff,
    ...than,
  ];
}

/**
 * Dựng tệp MIDI một rãnh (định dạng 0).
 *
 * Một rãnh cho cả trống lẫn bass: chúng nằm ở hai KÊNH khác nhau, và mọi DAW
 * đều tách được theo kênh. Nhiều rãnh thì phải viết định dạng 1 và thêm một
 * rãnh tempo riêng — không đáng cho một tệp mẫu.
 */
export function vietMidi(not: readonly NotMidi[], bpm: number, ten = 'Xuong Remix'): Buffer {
  if (!(bpm > 0)) throw new Error('BPM phải dương');

  /* Sự kiện thô: gom cả bật lẫn tắt rồi xếp theo thời điểm. Ghi từng nốt trọn
     vẹn (bật rồi tắt ngay) thì nốt sau không chồng được lên nốt trước — mà
     chồng nốt chính là hợp âm. */
  interface Tho { luc: number; uu: number; byte: number[] }
  const tho: Tho[] = [];

  // Tempo: số micro-giây mỗi nốt đen.
  const mps = Math.round(60_000_000 / bpm);
  tho.push({ luc: 0, uu: 0, byte: [0xff, 0x51, 0x03, (mps >>> 16) & 0xff, (mps >>> 8) & 0xff, mps & 0xff] });
  // Nhịp 4/4.
  tho.push({ luc: 0, uu: 0, byte: [0xff, 0x58, 0x04, 4, 2, 24, 8] });
  const tenByte = [...ten].map((c) => c.charCodeAt(0) & 0x7f);
  tho.push({ luc: 0, uu: 0, byte: [0xff, 0x03, tenByte.length, ...tenByte] });

  for (const n of not) {
    const k = n.kenh & 0x0f;
    const cao = Math.max(0, Math.min(127, Math.round(n.not)));
    const luc = Math.max(1, Math.min(127, Math.round(n.luc)));
    tho.push({ luc: n.batDau, uu: 2, byte: [0x90 | k, cao, luc] });
    // Ưu tiên 1: tắt đi TRƯỚC khi bật ở cùng thời điểm, nếu không một nốt lặp
    // lại đúng lúc nốt cũ hết sẽ bị lệnh tắt của nốt cũ giết ngay khi vừa bật.
    tho.push({ luc: n.batDau + n.dai, uu: 1, byte: [0x80 | k, cao, 0] });
  }

  tho.sort((a, b) => (a.luc - b.luc) || (a.uu - b.uu));

  const than: number[] = [];
  let truoc = 0;
  for (const e of tho) {
    than.push(...maVlq(e.luc - truoc), ...e.byte);
    truoc = e.luc;
  }
  than.push(...maVlq(0), 0xff, 0x2f, 0x00); // hết rãnh

  /* Sáu byte: định dạng (0 = một rãnh) · SỐ RÃNH · tick mỗi nốt đen.
     Số rãnh phải là 1, không phải 0. Bản nháp ở đây ghi 0 và phép kiểm bắt
     được: tệp vẫn mở ở phần mềm dễ tính, còn phần mềm đọc đúng chuẩn thì thấy
     một tệp RỖNG — và người dùng sẽ đổ cho FL Studio kén tệp. */
  const dau = khoi('MThd', [0, 0, 0, 1, (TICK_DEN >> 8) & 0xff, TICK_DEN & 0xff]);
  return Buffer.from([...dau, ...khoi('MTrk', than)]);
}

/* ── Mẫu vinahouse ─────────────────────────────────────────── */

/** Nốt bộ gõ theo chuẩn General MIDI. */
const GO = { kick: 36, clap: 39, hatDong: 42, hatMo: 46 };
const KENH_GO = 9;
const KENH_BASS = 0;

/**
 * Bốn ô nhịp mẫu: trống bốn nhịp + hat lệch phách + bass lệch phách.
 *
 * Đây là bộ khung của gần như mọi bản vinahouse, và cũng là chỗ người mới hay
 * mất nhiều buổi nhất chỉ để gõ lại cho đúng. Nó KHÔNG phải bài hoàn chỉnh —
 * nó là điểm bắt đầu, và tên tệp nói thẳng điều đó.
 *
 * `chuAm` là cao độ MIDI của nốt chủ âm bài đang mở, nên bass ra đúng tông chứ
 * không phải mặc định Đô.
 */
export function mauVinahouse(chuAm: number, soO = 4): NotMidi[] {
  const ra: NotMidi[] = [];
  const oNhip = TICK_DEN * 4;
  const nua = TICK_DEN / 2;

  // Bass xuống hai quãng tám cho về vùng trầm thật (MIDI 36 ≈ 65 Hz).
  let bass = chuAm;
  while (bass > 47) bass -= 12;
  while (bass < 28) bass += 12;

  for (let o = 0; o < soO; o++) {
    const goc = o * oNhip;
    for (let p = 0; p < 4; p++) {
      const phach = goc + p * TICK_DEN;

      // Kick mọi phách — nền của cả thể loại.
      ra.push({ kenh: KENH_GO, not: GO.kick, batDau: phach, dai: nua, luc: 118 });

      // Clap phách 2 và 4.
      if (p % 2 === 1) ra.push({ kenh: KENH_GO, not: GO.clap, batDau: phach, dai: nua, luc: 104 });

      // Hat mở lệch phách — thứ tạo ra cảm giác "lắc" của nhạc sàn.
      ra.push({ kenh: KENH_GO, not: GO.hatMo, batDau: phach + nua, dai: nua, luc: 88 });
      ra.push({ kenh: KENH_GO, not: GO.hatDong, batDau: phach, dai: nua / 2, luc: 64 });

      /* Bass lệch phách, KHÔNG trùng kick. Trùng kick thì hai thứ cùng dồn vào
         một khoảnh khắc và cả hai đều mất lực — lỗi kinh điển của người mới,
         và là lý do ô nhịp này cố ý đặt bass vào khe giữa. */
      ra.push({ kenh: KENH_BASS, not: bass, batDau: phach + nua, dai: nua * 0.9, luc: 110 });
    }
  }
  return ra;
}

/** Tên nốt → cao độ MIDI ở quãng tám 4. Trả `null` nếu không đọc được. */
export function caoDoTuTen(ten: string): number | null {
  const khop = /^([A-G])([#b]?)/.exec(ten.trim());
  if (!khop) return null;
  const goc: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const c = goc[khop[1]!];
  if (c === undefined) return null;
  const dau = khop[2] === '#' ? 1 : khop[2] === 'b' ? -1 : 0;
  return 60 + ((c + dau + 12) % 12);
}
