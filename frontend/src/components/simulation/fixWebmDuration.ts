/**
 * Ghi thời lượng thật vào header WebM do MediaRecorder tạo ra.
 *
 * VẤN ĐỀ
 * ------
 * MediaRecorder ghi theo kiểu luồng: lúc bắt đầu nó chưa biết bản ghi sẽ dài
 * bao nhiêu, nên phần tử `Duration` trong header bị bỏ trống và không bao giờ
 * được điền lại. Hậu quả: `video.duration` trả về Infinity, thanh thời gian
 * của trình phát vô nghĩa, và phần mềm dựng phim thường từ chối tua.
 *
 * VÌ SAO KHÔNG DÙNG MẸO TUA
 * -------------------------
 * Mẹo phổ biến là gán `video.currentTime = 1e101` để ép trình duyệt quét tới
 * cuối luồng rồi tự tính độ dài. Bản trước của trang này đã dùng đúng mẹo đó
 * và nó GÂY HẠI THẬT: với luồng không tua được, thẻ video kẹt ở trạng thái
 * hỏng — báo sai thời lượng (một bản ghi 72 giây hiện thành 5 giây), phát
 * nhanh bất thường và dừng giữa chừng. Mẹo đó đã bị gỡ bỏ.
 *
 * CÁCH LÀM ĐÚNG
 * -------------
 * Ta BIẾT thời lượng thật (đo bằng đồng hồ của phòng thu), nên chỉ việc ghi
 * nó vào đúng chỗ trong cấu trúc EBML của file. Sửa vào FILE thì mọi trình
 * phát, mọi phần mềm dựng và cả thẻ <video> đều đọc đúng — không cần ffmpeg,
 * không cần thư viện ngoài (CSP của site chặn CDN).
 *
 * Cấu trúc cần chạm tới:
 *   Segment (0x18538067)
 *     └─ Info (0x1549A966)
 *          ├─ TimecodeScale (0x2AD7B1)  — đơn vị, mặc định 1.000.000 ns = 1ms
 *          └─ Duration (0x4489)         — số thực, tính theo TimecodeScale
 *
 * Mọi lỗi bất ngờ đều trả về blob GỐC. Một file thiếu metadata vẫn tốt hơn
 * gấp nhiều lần một file bị vá hỏng.
 */

const ID_SEGMENT = 0x18538067;
const ID_INFO = 0x1549a966;
const ID_DURATION = 0x4489;
const ID_TIMECODE_SCALE = 0x2ad7b1;

interface Vint {
  value: number;
  length: number;
}

/**
 * Đọc một số nguyên biến độ dài (VINT) của EBML.
 *
 * Byte đầu cho biết tổng độ dài bằng vị trí bit 1 cao nhất: 1xxxxxxx = 1 byte,
 * 01xxxxxx = 2 byte, và cứ thế tới 8 byte.
 *
 * @param keepMarker true khi đọc ID phần tử (ID giữ nguyên cả bit đánh dấu),
 *                   false khi đọc kích thước (phải bỏ bit đánh dấu đi).
 */
function readVint(view: DataView, offset: number, keepMarker: boolean): Vint | null {
  if (offset >= view.byteLength) return null;
  const first = view.getUint8(offset);
  if (first === 0) return null;
  let length = 1;
  let mask = 0x80;
  while (length <= 8 && (first & mask) === 0) {
    mask >>= 1;
    length += 1;
  }
  if (length > 8 || offset + length > view.byteLength) return null;

  let value = keepMarker ? first : first & (mask - 1);
  for (let i = 1; i < length; i++) value = value * 256 + view.getUint8(offset + i);
  return { value, length };
}

interface Element {
  id: number;
  sizePos: number;
  sizeLen: number;
  sizeValue: number;
  /** Kích thước "không xác định" — Segment của MediaRecorder luôn như vậy. */
  unknown: boolean;
  dataPos: number;
  dataEnd: number;
}

/** Duyệt các phần tử con nằm trong khoảng [start, end). */
function* walk(view: DataView, start: number, end: number): Generator<Element> {
  let pos = start;
  while (pos < end) {
    const id = readVint(view, pos, true);
    if (!id) return;
    const sizePos = pos + id.length;
    const size = readVint(view, sizePos, false);
    if (!size) return;
    const dataPos = sizePos + size.length;
    // Toàn bit 1 = kích thước chưa biết → phần tử kéo dài tới hết vùng cha.
    const unknown = size.value === 2 ** (7 * size.length) - 1;
    const dataEnd = unknown ? end : Math.min(end, dataPos + size.value);
    if (dataEnd <= dataPos && !unknown) return;
    yield { id: id.value, sizePos, sizeLen: size.length, sizeValue: size.value, unknown, dataPos, dataEnd };
    pos = dataEnd;
  }
}

/** Tìm phần tử con đầu tiên có ID cho trước. */
function find(view: DataView, start: number, end: number, id: number): Element | null {
  for (const el of walk(view, start, end)) if (el.id === id) return el;
  return null;
}

/**
 * Ghi đè một VINT kích thước GIỮ NGUYÊN số byte cũ.
 *
 * EBML cho phép mã hoá không tối giản (đệm thêm byte 0), nên ta tăng được giá
 * trị mà không phải dịch chuyển toàn bộ phần còn lại của file — điều đó sẽ
 * làm sai mọi offset đã ghi trong SeekHead.
 */
function writeSizeInPlace(bytes: Uint8Array, pos: number, length: number, value: number): boolean {
  const max = 2 ** (7 * length) - 2; // trừ 1 nữa vì toàn-bit-1 nghĩa là "chưa biết"
  if (value > max || value < 0) return false;
  let rest = value;
  for (let i = length - 1; i >= 1; i--) {
    bytes[pos + i] = rest % 256;
    rest = Math.floor(rest / 256);
  }
  // Byte đầu: bit đánh dấu độ dài + phần cao của giá trị.
  bytes[pos] = (0x80 >> (length - 1)) | rest;
  return true;
}

/**
 * Trả về blob mới có Duration đúng, hoặc chính blob cũ nếu không vá được.
 *
 * @param durationMs thời lượng thật đo bằng đồng hồ tường của phòng thu.
 */
export async function withWebmDuration(blob: Blob, durationMs: number): Promise<Blob> {
  if (!Number.isFinite(durationMs) || durationMs <= 0) return blob;
  try {
    const buffer = await blob.arrayBuffer();
    const patched = patchDuration(new Uint8Array(buffer), durationMs);
    // `.buffer` để TypeScript thấy đúng ArrayBuffer (Uint8Array<ArrayBufferLike>
    // không khớp BlobPart trong lib DOM mới).
    return patched ? new Blob([patched.slice().buffer as ArrayBuffer], { type: blob.type }) : blob;
  } catch {
    // Vá hỏng thì thà giữ nguyên file gốc.
    return blob;
  }
}

function patchDuration(bytes: Uint8Array, durationMs: number): Uint8Array | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  const segment = find(view, 0, bytes.length, ID_SEGMENT);
  if (!segment) return null;
  const info = find(view, segment.dataPos, segment.dataEnd, ID_INFO);
  if (!info) return null;

  // Duration tính theo đơn vị TimecodeScale (nano-giây trên một đơn vị).
  // Mặc định 1.000.000 ns nghĩa là Duration được tính bằng mili-giây.
  let timecodeScale = 1_000_000;
  let duration: Element | null = null;
  for (const el of walk(view, info.dataPos, info.dataEnd)) {
    if (el.id === ID_TIMECODE_SCALE) {
      let raw = 0;
      for (let i = el.dataPos; i < el.dataEnd; i++) raw = raw * 256 + view.getUint8(i);
      if (raw > 0) timecodeScale = raw;
    } else if (el.id === ID_DURATION) {
      duration = el;
    }
  }

  const value = (durationMs * 1_000_000) / timecodeScale;

  // Trường hợp dễ: đã có sẵn phần tử Duration → ghi đè tại chỗ, không đổi
  // kích thước gì cả, không phần tử nào bị dịch.
  if (duration) {
    const width = duration.dataEnd - duration.dataPos;
    if (width === 4) view.setFloat32(duration.dataPos, value);
    else if (width === 8) view.setFloat64(duration.dataPos, value);
    else return null;
    return bytes;
  }

  // Trường hợp phải chèn: dựng phần tử Duration 11 byte
  //   0x4489 (ID) + 0x88 (kích thước = 8) + 8 byte số thực 64-bit
  const element = new Uint8Array(11);
  element[0] = 0x44;
  element[1] = 0x89;
  element[2] = 0x88;
  new DataView(element.buffer).setFloat64(3, value);

  const out = new Uint8Array(bytes.length + element.length);
  out.set(bytes.subarray(0, info.dataPos), 0);
  out.set(element, info.dataPos);
  out.set(bytes.subarray(info.dataPos), info.dataPos + element.length);

  // Info dài thêm 11 byte → phải cập nhật kích thước của chính nó...
  if (!writeSizeInPlace(out, info.sizePos, info.sizeLen, info.sizeValue + element.length)) return null;
  // ...và của Segment, trừ khi Segment khai kích thước "chưa biết" (trường
  // hợp thường gặp với MediaRecorder) thì không cần đụng tới.
  if (!segment.unknown && !writeSizeInPlace(out, segment.sizePos, segment.sizeLen, segment.sizeValue + element.length)) {
    return null;
  }
  return out;
}
