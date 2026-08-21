import type { Socket } from 'socket.io-client';

// ════════════════════════════════════════════════════════════════
// GỌI THOẠI 1-1 — bản cho app desktop
//
// Cùng luật với bản web (`frontend/src/lib/webrtc/cuocGoi.ts`) nhưng KHÔNG
// chép nguyên: bản web bám vào `@/lib/socket` và `@/lib/api` của Next.js,
// hai thứ không tồn tại ở đây. Thay vì kéo cả hệ đó sang, lớp này nhận socket
// và hàm lấy máy chủ ICE từ ngoài vào.
//
// ⚠️ Sửa một bên thì phải xem lại bên kia. Hai bản này là ANH EM, và bốn ca
// hỏng dưới đây phải giống nhau ở cả hai — người dùng gọi giữa web và desktop
// nên một bên xử khác là hỏng đúng lúc hai bên không cùng loại máy.
// ════════════════════════════════════════════════════════════════

export type TrangThaiGoi = 'roi' | 'dang-goi' | 'do-chuong' | 'dang-noi';

export interface SuKienGoi {
  doiTrangThai: (t: TrangThaiGoi) => void;
  coTiengNoi: (luong: MediaStream) => void;
  loi: (chu: string) => void;
}

export interface IceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export class CuocGoi {
  private pc: RTCPeerConnection | null = null;
  private luongCuaToi: MediaStream | null = null;
  private callId: string | null = null;
  private sdpCho: RTCSessionDescriptionInit | null = null;
  private daDon = false;
  /** ICE có thể tới TRƯỚC `setRemoteDescription` — thêm sớm là ném lỗi.
   *  Ca này xảy ra THƯỜNG XUYÊN chứ không hiếm: mạng nhanh thì ứng viên của
   *  bên kia về trước cả lời chào. */
  private iceChoXuLy: RTCIceCandidateInit[] = [];
  private daCoMoTaXa = false;
  private thuNoiLai = false;

  constructor(
    private socket: Socket,
    private layIce: () => Promise<IceServer[]>,
    private su: SuKienGoi,
  ) {}

  private async dungPeer(): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection({ iceServers: await this.layIce() });

    pc.onicecandidate = (e) => {
      if (!e.candidate || !this.callId) return;
      this.socket.emit('call:ice', { callId: this.callId, candidate: e.candidate.toJSON() });
    };
    pc.ontrack = (e) => { if (e.streams[0]) this.su.coTiengNoi(e.streams[0]); };
    pc.oniceconnectionstatechange = () => {
      const t = pc.iceConnectionState;
      if (t === 'connected' || t === 'completed') {
        this.thuNoiLai = false;
        this.su.doiTrangThai('dang-noi');
      }
      if (t === 'failed') {
        // Thử nối lại MỘT lần: chuyển Wi-Fi↔dây mạng hay sóng chập một nhịp
        // là chuyện thường, cúp ngay là quá vội.
        if (!this.thuNoiLai) { this.thuNoiLai = true; pc.restartIce(); return; }
        this.su.loi('Mất kết nối với người kia.');
        this.cupMay();
      }
    };
    this.pc = pc;
    return pc;
  }

  private async xinMicro(): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false,
      });
    } catch (e) {
      const ten = (e as Error)?.name;
      throw new Error(
        ten === 'NotAllowedError' ? 'App chưa được phép dùng micro.'
        : ten === 'NotFoundError' ? 'Không tìm thấy micro nào trên máy này.'
        : 'Không mở được micro.',
      );
    }
  }

  async goi(threadId: number, toUserId: number): Promise<void> {
    try {
      this.daDon = false;
      this.luongCuaToi = await this.xinMicro();
      const pc = await this.dungPeer();
      this.luongCuaToi.getTracks().forEach((t) => pc.addTrack(t, this.luongCuaToi!));
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      this.socket.emit('call:offer', { threadId, toUserId, sdp: offer });
      this.su.doiTrangThai('dang-goi');
    } catch (e) {
      this.su.loi((e as Error).message);
      this.don();
    }
  }

  chuanBiNhan(callId: string, sdp: RTCSessionDescriptionInit): void {
    this.callId = callId;
    this.sdpCho = sdp;
    this.daDon = false;
    this.su.doiTrangThai('do-chuong');
  }

  async nhan(): Promise<void> {
    if (!this.sdpCho || !this.callId) return;
    try {
      this.luongCuaToi = await this.xinMicro();
      const pc = await this.dungPeer();
      this.luongCuaToi.getTracks().forEach((t) => pc.addTrack(t, this.luongCuaToi!));
      await pc.setRemoteDescription(new RTCSessionDescription(this.sdpCho));
      this.daCoMoTaXa = true;
      await this.doIceDangCho();
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      this.socket.emit('call:answer', { callId: this.callId, sdp: answer });
      this.su.doiTrangThai('dang-noi');
    } catch (e) {
      this.su.loi((e as Error).message);
      this.tuChoi();
    }
  }

  async benKiaDaNhan(sdp: RTCSessionDescriptionInit): Promise<void> {
    if (!this.pc) return;
    await this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
    this.daCoMoTaXa = true;
    await this.doIceDangCho();
  }

  async themIce(c: RTCIceCandidateInit): Promise<void> {
    if (!this.pc || !this.daCoMoTaXa) { this.iceChoXuLy.push(c); return; }
    try { await this.pc.addIceCandidate(new RTCIceCandidate(c)); } catch { /* ứng viên hỏng */ }
  }

  private async doIceDangCho(): Promise<void> {
    const ds = this.iceChoXuLy;
    this.iceChoXuLy = [];
    for (const c of ds) {
      try { await this.pc?.addIceCandidate(new RTCIceCandidate(c)); } catch { /* bỏ */ }
    }
  }

  datCallId(id: string): void { this.callId = id; }

  tuChoi(): void {
    if (this.callId) this.socket.emit('call:reject', { callId: this.callId });
    this.don();
  }

  cupMay(): void {
    if (this.callId) this.socket.emit('call:end', { callId: this.callId });
    this.don();
  }

  /** Dọn tài nguyên. Gọi được nhiều lần — bốn đường kết thúc đều qua đây, và
   *  quên `stop()` là đèn micro của máy sáng mãi sau khi cúp. */
  don(): void {
    if (this.daDon) return;
    this.daDon = true;
    this.luongCuaToi?.getTracks().forEach((t) => t.stop());
    this.luongCuaToi = null;
    try { this.pc?.close(); } catch { /* đã đóng */ }
    this.pc = null;
    this.callId = null;
    this.sdpCho = null;
    this.iceChoXuLy = [];
    this.daCoMoTaXa = false;
    this.thuNoiLai = false;
    this.su.doiTrangThai('roi');
  }

  tatMicro(tat: boolean): void {
    this.luongCuaToi?.getAudioTracks().forEach((t) => { t.enabled = !tat; });
  }
}
