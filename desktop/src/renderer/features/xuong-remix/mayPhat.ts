/**
 * ============================================================
 * MÁY PHÁT NHIỀU STEM — bốn đường chạy như một
 * ============================================================
 *
 * Bàn làm việc phải nghe được: bấm phát, bốn stem chạy cùng lúc, tắt tiếng
 * giọng hát thì còn lại beat. Không nghe được thì nó chỉ là một bức ảnh chụp
 * bàn làm việc.
 *
 * ─── ⚠️ MỖI `AudioBufferSourceNode` CHỈ DÙNG MỘT LẦN ───
 * `stop()` rồi thì không `start()` lại được. Mỗi lần phát phải tạo nguồn mới
 * cho CẢ BỐN stem — và phải tạo rồi hẹn giờ chúng ở CÙNG một mốc, nếu không
 * chúng lệch nhau đúng bằng thời gian tạo node. Vài mili giây lệch giữa trống
 * và bass là nghe ra ngay (`RemixDeck` đã ghi bài học này cho một mâm; ở đây
 * là bốn đường phải khớp nhau nên nó gắt hơn).
 *
 * ─── ⚠️ TẮT TIẾNG KHÔNG ĐƯỢC DỪNG NGUỒN ───
 * Cám dỗ là `stop()` cái stem bị tắt cho đỡ tốn. Nhưng bật lại thì phải tạo
 * nguồn mới và hẹn nó vào đúng vị trí đang chạy — sai một nhịp là lệch pha
 * vĩnh viễn với ba stem kia. Nên tắt tiếng chỉ hạ `gain` về 0; nguồn vẫn chạy.
 *
 * ─── Vì sao đo vị trí bằng `ctx.currentTime` chứ không bằng bộ đếm ───
 * Đồng hồ của AudioContext là đồng hồ của chính phần cứng âm thanh. Một bộ đếm
 * chạy theo `requestAnimationFrame` sẽ trôi dần so với tiếng thật, và sau vài
 * phút thì con trỏ trên dạng sóng chỉ sai chỗ.
 */

export type TenDuong = string;

export interface CaiDuong {
  /** 0…1. */
  mucAmLuong: number;
  tat: boolean;
}

/** Trạng thái người gọi cần để vẽ. */
export interface TrangThaiPhat {
  dangPhat: boolean;
  /** Giây, tính từ đầu bài. */
  viTri: number;
  giay: number;
}

interface Duong {
  buffer: AudioBuffer;
  gain: GainNode;
  nguon: AudioBufferSourceNode | null;
}

/**
 * Một máy phát cho nhiều đường tiếng cùng độ dài.
 *
 * Không phải React component và không biết gì về React: nó là một cái máy có
 * trạng thái, và trạng thái âm thanh sống theo đồng hồ phần cứng chứ không
 * theo vòng vẽ. Giao diện hỏi `trangThai()` mỗi khung hình.
 */
export class MayPhatStem {
  private ctx: AudioContext | null = null;
  private duong = new Map<TenDuong, Duong>();
  /** Mốc `ctx.currentTime` lúc bắt đầu phát, và vị trí bài lúc đó. */
  private mocCtx = 0;
  private mocBai = 0;
  private chay = false;
  private dai = 0;

  /** Có đường nào đã nạp chưa. */
  get coTieng(): boolean { return this.duong.size > 0; }
  get giay(): number { return this.dai; }

  /**
   * Nạp một đường từ dữ liệu WAV.
   *
   * `decodeAudioData` nuốt luôn ArrayBuffer được truyền vào (detach), nên
   * người gọi không dùng lại nó được — đó là lý do hàm này nhận `Uint8Array`
   * và tự cắt ra bản riêng.
   */
  async nap(ten: TenDuong, wav: Uint8Array): Promise<void> {
    const ctx = this.moCtx();
    const buffer = await ctx.decodeAudioData(wav.slice().buffer);
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    this.duong.set(ten, { buffer, gain, nguon: null });
    this.dai = Math.max(this.dai, buffer.duration);
  }

  /** Đóng mọi thứ và trả lại bộ nhớ. Bốn stem 5 phút là ~424 MB. */
  async dong(): Promise<void> {
    this.dungHet();
    this.duong.clear();
    this.dai = 0;
    const ctx = this.ctx;
    this.ctx = null;
    if (ctx) await ctx.close().catch(() => undefined);
  }

  /**
   * Đặt mức và trạng thái tắt cho từng đường.
   *
   * `solo` bật thì mọi đường KHÔNG được solo đều câm, bất kể `tat` của chúng.
   */
  datMuc(cai: Record<TenDuong, CaiDuong>, solo: TenDuong | null): void {
    for (const [ten, d] of this.duong) {
      const c = cai[ten];
      const cam = solo !== null ? ten !== solo : (c?.tat ?? false);
      /* Đổi dốc trong 15 ms thay vì nhảy: gain nhảy tức thì là một bước gián
         đoạn trong dạng sóng, và tai nghe ra tiếng "tách" mỗi lần bấm. */
      const dich = cam ? 0 : (c?.mucAmLuong ?? 1);
      const t = this.ctx?.currentTime ?? 0;
      d.gain.gain.cancelScheduledValues(t);
      d.gain.gain.setValueAtTime(d.gain.gain.value, t);
      d.gain.gain.linearRampToValueAtTime(dich, t + 0.015);
    }
  }

  /** Phát từ `tu` giây. Đang phát thì dừng rồi phát lại từ chỗ mới. */
  async phat(tu?: number): Promise<void> {
    const ctx = this.moCtx();
    /* Trình duyệt treo AudioContext cho tới khi có thao tác người dùng. Phải
       `resume()` trong chính cú bấm, không thì mọi thứ chạy mà không ra tiếng. */
    if (ctx.state === 'suspended') await ctx.resume();

    const bd = Math.max(0, Math.min(tu ?? this.viTriHienTai(), this.dai));
    this.dungHet();

    /* MỘT mốc cho cả bốn: tạo node mất thời gian, và hẹn từng cái theo
       `currentTime` đọc lại mỗi vòng lặp là chúng lệch nhau đúng bằng đó. */
    const khi = ctx.currentTime + 0.05;
    for (const d of this.duong.values()) {
      const n = ctx.createBufferSource();
      n.buffer = d.buffer;
      n.connect(d.gain);
      n.start(khi, bd);
      d.nguon = n;
    }
    this.mocCtx = khi;
    this.mocBai = bd;
    this.chay = true;
  }

  /** Dừng, giữ nguyên vị trí. */
  dung(): void {
    const v = this.viTriHienTai();
    this.dungHet();
    this.mocBai = v;
    this.chay = false;
  }

  trangThai(): TrangThaiPhat {
    return { dangPhat: this.chay, viTri: this.viTriHienTai(), giay: this.dai };
  }

  private viTriHienTai(): number {
    if (!this.chay || !this.ctx) return this.mocBai;
    const troi = this.ctx.currentTime - this.mocCtx;
    /* Trước mốc (còn trong 50 ms chờ) thì `troi` âm — kẹp lại, không thì con
       trỏ nhảy giật về sau mỗi lần bấm phát. */
    return Math.min(this.dai, this.mocBai + Math.max(0, troi));
  }

  private dungHet(): void {
    for (const d of this.duong.values()) {
      if (!d.nguon) continue;
      try { d.nguon.stop(); } catch { /* chưa start thì stop ném — không sao */ }
      d.nguon.disconnect();
      d.nguon = null;
    }
  }

  private moCtx(): AudioContext {
    this.ctx ??= new AudioContext();
    return this.ctx;
  }
}
