/**
 * ============================================================
 * THIẾT BỊ ẢO — trình duyệt giả làm bo ESP32
 * ============================================================
 *
 * Nói đúng giao thức trong `src/socket/device.gateway.ts`, không thêm
 * bớt gì. Server KHÔNG biết đây là mô phỏng, và đó là cả điểm của nó:
 * không có nhánh "nếu là mô phỏng thì…" nào ở phía server, nên thứ
 * chạy được ở đây thì chạy được trên bo thật.
 *
 * ── ĐỊA CHỈ ──
 *
 * `/api/v1` đi qua route handler của Next, mà route handler KHÔNG proxy
 * được WebSocket — nên `/device-ws` phải đi thẳng qua nginx, đúng đường
 * bo ESP32 đang dùng (`wss://cuongthai.com/device-ws`).
 *
 * Chạy local thì Next ở cổng 3000 còn backend ở 3001, không có nginx ở
 * giữa, nên phải chỉ đích danh bằng `NEXT_PUBLIC_DEVICE_WS_URL`.
 *
 * ── TIẾNG ──
 *
 * Vào (mic):  PCM16 little-endian, 16 kHz, một kênh, gửi dạng khung nhị
 *             phân giữa `audio_start` và `audio_end`. `handleAudioEnd`
 *             BỎ QUA gói dưới 4000 byte (~0,12 s) vì đó là tiếng lách
 *             cách chứ không phải lời nói.
 * Ra  (loa):  server báo `say_start` kèm `mime`, đẩy khối 8 KB, rồi
 *             `say_end`. Mặc định là MP3.
 */

export type LenhRobot = {
  id?: number;
  type: string;
  payload?: Record<string, unknown>;
};

export interface SuKien {
  onTrangThai?: (s: TrangThaiNoi) => void;
  onLenh?: (l: LenhRobot) => void;
  onLoiThoai?: (role: string, text: string) => void;
  onNoiBatDau?: (mime: string) => void;
  onNoiXong?: (am: Blob) => void;
  onNhatKy?: (dong: string) => void;
  onLoi?: (msg: string) => void;
}

export type TrangThaiNoi = 'tat' | 'dang-noi' | 'da-noi' | 'loi';

/** 16 kHz — đúng `streamBytesPerSec: 32_000` (16k × 16 bit × 1 kênh). */
const TAN_SO_MIC = 16000;

/** Ngưỡng `handleAudioEnd` bỏ qua. Dưới mức này gửi đi cũng vô ích. */
const TOI_THIEU_BYTE = 4000;

function diaChiGoc(): string {
  const ep = process.env.NEXT_PUBLIC_DEVICE_WS_URL;
  if (ep) return ep.replace(/\/$/, '');
  if (typeof window === 'undefined') return '';
  return `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
}

export class ThietBiAo {
  private ws: WebSocket | null = null;
  private sk: SuKien;
  private nhipTelemetry: ReturnType<typeof setInterval> | null = null;

  // Tiếng ra
  private khoiTiengRa: BlobPart[] = [];
  private mimeRa = 'audio/mpeg';

  // Tiếng vào
  private mic: MediaStream | null = null;
  private ctxMic: AudioContext | null = null;
  private nutMic: ScriptProcessorNode | null = null;
  private byteDaGui = 0;

  trangThai: TrangThaiNoi = 'tat';

  constructor(sk: SuKien = {}) {
    this.sk = sk;
  }

  private doiTrangThai(s: TrangThaiNoi): void {
    this.trangThai = s;
    this.sk.onTrangThai?.(s);
  }

  private guiJson(o: Record<string, unknown>): void {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(o));
  }

  // ─── Kết nối ─────────────────────────────────────────────

  /**
   * Nối bằng VÉ, không phải key + secret.
   *
   * `WebSocket` của trình duyệt không đặt được header, mà nhét secret
   * vĩnh viễn vào query string thì nó nằm lại trong log nginx hàng
   * tháng. Vé sống 60 giây và dùng một lần — xem `simTicket.ts`.
   */
  noi(ticket: string): void {
    this.ngat();
    this.doiTrangThai('dang-noi');
    const ws = new WebSocket(`${diaChiGoc()}/device-ws?ticket=${encodeURIComponent(ticket)}`);
    ws.binaryType = 'arraybuffer';
    this.ws = ws;

    ws.onopen = () => {
      this.doiTrangThai('da-noi');
      // `hello` đúng hình dạng bo thật gửi. `fw` ghi rõ là mô phỏng để
      // nhật ký thiết bị không lẫn với bo thật — nhìn log là biết ngay
      // lượt nào chạy trên phần cứng, lượt nào chạy trên trình duyệt.
      this.guiJson({
        t: 'hello',
        fw: 'mo-phong-web',
        ip: 'browser',
        rssi: -40,
        battery: 100,
      });
      // Bo thật đẩy telemetry mỗi 10 giây; giữ đúng nhịp để biểu đồ
      // bên `DeviceConsole` không thấy khoảng trống lạ.
      this.nhipTelemetry = setInterval(() => {
        this.guiJson({ t: 'telemetry', rssi: -40, heapKb: 165, uptime: Math.floor(performance.now() / 1000) });
      }, 10_000);
    };

    ws.onmessage = (ev) => {
      if (typeof ev.data !== 'string') {
        this.khoiTiengRa.push(ev.data as ArrayBuffer);
        return;
      }
      let m: Record<string, unknown>;
      try {
        m = JSON.parse(ev.data);
      } catch {
        return; // khung hỏng: bỏ qua, đừng giết đường truyền
      }
      this.nhan(m);
    };

    ws.onerror = () => this.sk.onLoi?.('WebSocket lỗi — xem tab Network');
    ws.onclose = (e) => {
      this.donNhip();
      this.doiTrangThai('tat');
      // 4409 là mã `acceptDevice` dùng khi có kết nối MỚI cho cùng thiết
      // bị. Nói rõ ra, vì nếu không thì người dùng chỉ thấy mô phỏng tự
      // rụng mà không hiểu là bo thật vừa cắm điện.
      if (e.code === 4409) this.sk.onLoi?.('Bị thay bởi kết nối mới — bo thật vừa nối vào cùng thiết bị này');
      else if (e.code === 1006) this.sk.onLoi?.('Mất kết nối. Vé chỉ dùng được một lần — bấm Nối lại để xin vé mới');
    };
  }

  private nhan(m: Record<string, unknown>): void {
    switch (m.t) {
      case 'welcome':
        this.sk.onNhatKy?.(`welcome · thiết bị #${String(m.deviceId)}`);
        break;
      case 'ping':
        this.guiJson({ t: 'pong' });
        break;
      case 'cmd': {
        const l: LenhRobot = {
          id: typeof m.id === 'number' ? m.id : undefined,
          type: String(m.type ?? ''),
          payload: (m.payload as Record<string, unknown>) ?? {},
        };
        this.sk.onLenh?.(l);
        // Bo thật báo nhận từng lệnh; thiếu `ack` thì hàng đợi lệnh bên
        // server nằm mãi ở PENDING và giao diện hiện sai.
        if (l.id !== undefined) this.guiJson({ t: 'ack', id: l.id, ok: true });
        break;
      }
      case 'transcript':
        this.sk.onLoiThoai?.(String(m.role ?? 'bot'), String(m.text ?? ''));
        break;
      case 'say_start':
        this.khoiTiengRa = [];
        this.mimeRa = String(m.mime ?? 'audio/mpeg');
        this.sk.onNoiBatDau?.(this.mimeRa);
        break;
      case 'say_end': {
        const am = new Blob(this.khoiTiengRa, { type: this.mimeRa });
        this.khoiTiengRa = [];
        this.sk.onNoiXong?.(am);
        break;
      }
      case 'error':
        this.sk.onLoi?.(`${String(m.scope ?? '')}: ${String(m.msg ?? '')}`);
        break;
      default:
        this.sk.onNhatKy?.(JSON.stringify(m));
    }
  }

  private donNhip(): void {
    if (this.nhipTelemetry) clearInterval(this.nhipTelemetry);
    this.nhipTelemetry = null;
  }

  ngat(): void {
    this.dungMic();
    this.donNhip();
    try {
      this.ws?.close(1000, 'người dùng ngắt');
    } catch {
      /* bỏ qua */
    }
    this.ws = null;
    this.doiTrangThai('tat');
  }

  // ─── Gửi lượt ────────────────────────────────────────────

  /**
   * Gửi một lượt bằng CHỮ, bỏ qua hẳn khâu nhận dạng tiếng nói.
   *
   * Đây là đường chính để huấn luyện tính cách: gõ nhanh hơn nói, lặp
   * lại được y hệt từng chữ, và không phụ thuộc chất lượng mic. Đường
   * `mic` bên dưới để kiểm chính khâu nhận dạng.
   */
  guiChu(text: string): void {
    const s = text.trim();
    if (s) this.guiJson({ t: 'text', text: s });
  }

  /** Cắt lời: bảo server ngừng bơm tiếng NGAY. */
  catLoi(): void {
    this.guiJson({ t: 'stop' });
  }

  // ─── Mic ─────────────────────────────────────────────────

  async batMic(): Promise<void> {
    if (this.ctxMic) return;
    this.mic = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
    });
    // Xin thẳng 16 kHz thay vì lấy 48 kHz rồi tự hạ mẫu: trình duyệt
    // hạ mẫu bằng bộ lọc tử tế, còn code tự viết thường chỉ lấy mỗi
    // mẫu thứ ba — thứ đó gây răng cưa và làm bộ nhận dạng đọc sai.
    this.ctxMic = new AudioContext({ sampleRate: TAN_SO_MIC });
    const nguon = this.ctxMic.createMediaStreamSource(this.mic);

    // `ScriptProcessorNode` đã bị đánh dấu cũ, nhưng nó chạy ở MỌI
    // trình duyệt và không cần file worklet riêng. Đổi sang
    // `AudioWorklet` khi nào có lý do thật, đừng đổi vì cái nhãn.
    this.nutMic = this.ctxMic.createScriptProcessor(2048, 1, 1);
    this.byteDaGui = 0;
    this.guiJson({ t: 'audio_start' });

    this.nutMic.onaudioprocess = (ev) => {
      if (this.ws?.readyState !== WebSocket.OPEN) return;
      const f32 = ev.inputBuffer.getChannelData(0);
      const i16 = new Int16Array(f32.length);
      for (let i = 0; i < f32.length; i++) {
        const v = Math.max(-1, Math.min(1, f32[i]));
        // Nhân 0x7FFF chứ không 0x8000: 1.0 × 0x8000 tràn thành -32768,
        // nghe thành tiếng nổ lách tách ở mỗi đỉnh sóng.
        i16[i] = Math.round(v * 0x7fff);
      }
      this.ws.send(i16.buffer);
      this.byteDaGui += i16.byteLength;
    };
    nguon.connect(this.nutMic);
    // Phải nối tới đích thì `onaudioprocess` mới chạy. Nối vào
    // `destination` sẽ vọng tiếng ra loa, nên nối vào một nút câm.
    const cam = this.ctxMic.createGain();
    cam.gain.value = 0;
    this.nutMic.connect(cam);
    cam.connect(this.ctxMic.destination);
  }

  /** @returns số byte đã gửi — dưới 4000 thì server sẽ bỏ qua lượt này. */
  dungMic(): number {
    const daGui = this.byteDaGui;
    if (this.nutMic) {
      this.nutMic.onaudioprocess = null;
      this.nutMic.disconnect();
      this.nutMic = null;
    }
    if (this.ctxMic) {
      void this.ctxMic.close();
      this.ctxMic = null;
    }
    if (this.mic) {
      this.mic.getTracks().forEach((t) => t.stop());
      this.mic = null;
    }
    if (daGui > 0) {
      this.guiJson({ t: 'audio_end' });
      this.byteDaGui = 0;
    }
    return daGui;
  }

  static get NGUONG_BYTE(): number {
    return TOI_THIEU_BYTE;
  }
}
