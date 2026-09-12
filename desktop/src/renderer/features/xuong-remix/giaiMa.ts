/**
 * Giải mã nhạc và lấy mẫu lại về 44,1 kHz — làm ở RENDERER.
 *
 * ─── Vì sao ở đây chứ không ở main ───
 * Renderer LÀ Chromium: nó đã có sẵn bộ giải mã cho mp3, m4a, flac, ogg, opus,
 * và `OfflineAudioContext` lấy mẫu lại đúng chuẩn. Main process thì không có
 * gì cả — muốn làm được chừng ấy phải cõng ffmpeg, tức +70MB cho mỗi nền, cho
 * một việc đã có sẵn cách làm miễn phí.
 *
 * Cùng cách phân vai `ipc/music.ts` đã ghi: renderer làm phần nó làm được,
 * main chỉ làm phần renderer không được phép làm.
 *
 * ⚠️ htdemucs đòi ĐÚNG 44,1 kHz. Nhiều tệp nhạc là 48 kHz (mọi thứ xuất từ
 * video), và đưa 48 kHz vào model 44,1 kHz KHÔNG ra lỗi — nó ra bốn stem nghe
 * chậm hơn và trầm hơn 8,8%, đủ sai để hỏng bài mà vẫn đủ giống để người ta
 * tưởng model kém.
 */

/** Tần số mẫu duy nhất mà bộ máy tách stem nhận. */
export const TAN_SO_DICH = 44_100;

export interface BaiGiaiMa {
  /** PCM float32 little-endian, xen kẽ theo mẫu (L,R,L,R…). */
  mau: Uint8Array;
  soKenh: number;
  tanSoMau: number;
  giay: number;
}

/**
 * Xếp các kênh rời thành một dải xen kẽ.
 *
 * Xen kẽ chứ không nối đuôi: đây là bố cục mà `napBai` ở main đọc lại, và hai
 * bên phải khớp nhau. Nối đuôi mà đọc kiểu xen kẽ thì ra tiếng rè đều — nghe
 * như tệp hỏng chứ không như đọc sai bố cục.
 */
export function xenKe(kenh: readonly Float32Array[], soMau: number): Float32Array {
  const soKenh = kenh.length;
  const ra = new Float32Array(soMau * soKenh);
  for (let c = 0; c < soKenh; c++) {
    const k = kenh[c]!;
    for (let i = 0; i < soMau; i++) ra[i * soKenh + c] = k[i]!;
  }
  return ra;
}

/** Rút các kênh của một AudioBuffer ra mảng thường. */
function tachKenh(buf: AudioBuffer): Float32Array[] {
  const ra: Float32Array[] = [];
  for (let c = 0; c < buf.numberOfChannels; c++) ra.push(buf.getChannelData(c));
  return ra;
}

/**
 * Giải mã một tệp nhạc và trả PCM đã ở 44,1 kHz.
 *
 * Tệp đã đúng tần số thì bỏ qua bước lấy mẫu lại — dựng một
 * `OfflineAudioContext` cho cả bài tốn thêm một bản sao đầy đủ trong RAM.
 */
export async function giaiMaBai(tep: File | ArrayBuffer): Promise<BaiGiaiMa> {
  const bytes = tep instanceof ArrayBuffer ? tep : await tep.arrayBuffer();

  /* `decodeAudioData` NUỐT bộ đệm đưa vào (nó bị tách rời sau lời gọi). Truyền
     thẳng `bytes` thì không dùng lại được nữa — ở đây không cần, nhưng cắt một
     bản sao để chỗ gọi không phải đoán là rẻ hơn là một lỗi khó tìm. */
  const ctx = new AudioContext();
  let goc: AudioBuffer;
  try {
    goc = await ctx.decodeAudioData(bytes.slice(0));
  } finally {
    void ctx.close();
  }

  if (goc.sampleRate === TAN_SO_DICH) {
    return {
      mau: new Uint8Array(xenKe(tachKenh(goc), goc.length).buffer),
      soKenh: goc.numberOfChannels,
      tanSoMau: TAN_SO_DICH,
      giay: goc.duration,
    };
  }

  const soMauMoi = Math.ceil(goc.duration * TAN_SO_DICH);
  const off = new OfflineAudioContext(goc.numberOfChannels, soMauMoi, TAN_SO_DICH);
  const nguon = off.createBufferSource();
  nguon.buffer = goc;
  nguon.connect(off.destination);
  nguon.start();
  const moi = await off.startRendering();

  return {
    mau: new Uint8Array(xenKe(tachKenh(moi), moi.length).buffer),
    soKenh: moi.numberOfChannels,
    tanSoMau: TAN_SO_DICH,
    giay: moi.duration,
  };
}

/** Đuôi tệp mà Chromium giải mã được. Dùng cho ô chọn tệp và phép kiểm kéo-thả. */
export const DUOI_NHAN = ['mp3', 'm4a', 'aac', 'wav', 'flac', 'ogg', 'opus', 'webm'] as const;

export function laTepNhac(ten: string): boolean {
  const duoi = ten.slice(ten.lastIndexOf('.') + 1).toLowerCase();
  return (DUOI_NHAN as readonly string[]).includes(duoi);
}
