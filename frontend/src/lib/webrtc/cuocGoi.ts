import { getSocket } from '@/lib/socket';
import { api } from '@/lib/api';

// ════════════════════════════════════════════════════════════════
// GỌI THOẠI 1-1 — lớp gói RTCPeerConnection
//
// Tiếng nói đi THẲNG máy-tới-máy; máy chủ chỉ chuyển hộ lời chào hỏi ban đầu
// (SDP) và các đường đi mạng có thể dùng (ICE). Khi hai bên không nối thẳng
// được — hay gặp trên 4G — thì đi vòng qua TURN.
//
// Lớp này KHÔNG biết gì về React: nó nhận vào các hàm gọi ngược và tự lo phần
// còn lại. Nhờ vậy màn hình gọi chỉ còn việc vẽ, và logic ở đây kiểm được
// riêng mà không cần dựng cả một cây component.
// ════════════════════════════════════════════════════════════════

export type TrangThaiGoi =
  | 'roi'          // chưa gọi
  | 'dang-goi'     // mình gọi đi, đang đổ chuông bên kia
  | 'do-chuong'    // người ta gọi mình
  | 'dang-noi'
  | 'ket-thuc';

export interface SuKienGoi {
  doiTrangThai: (t: TrangThaiGoi) => void;
  coTiengNoi: (luong: MediaStream) => void;
  ketThuc: (lyDo: string, giay: number) => void;
  loi: (chu: string) => void;
}

interface IceServer { urls: string | string[]; username?: string; credential?: string }

export class CuocGoi {
  private pc: RTCPeerConnection | null = null;
  private luongCuaToi: MediaStream | null = null;
  private callId: string | null = null;
  private threadId = 0;
  private benKia = 0;
  private daDon = false;
  /** ICE có thể tới TRƯỚC khi `setRemoteDescription` xong — thêm sớm là lỗi.
   *  Xếp hàng lại rồi đổ vào sau. */
  private iceChoXuLy: RTCIceCandidateInit[] = [];
  private daCoMoTaXa = false;
  private thuNoiLai = false;
  /** Ứng viên ICE của CHÍNH MÌNH, chờ có `callId` mới gửi được. */
  private iceGuiCho: RTCIceCandidateInit[] = [];

  constructor(private su: SuKienGoi) {}

  // ── Lấy danh sách máy chủ ─────────────────────────────────────
  private async layIceServers(): Promise<IceServer[]> {
    try {
      const r = await api.get<{ data: { iceServers: IceServer[]; turn: boolean } }>(
        '/messages/ice-servers',
      );
      const ds = r.data?.data?.iceServers ?? [];
      if (!r.data?.data?.turn) {
        // Không chặn cuộc gọi — mạng thường vẫn nối thẳng được. Chỉ ghi lại
        // để khi có người báo "gọi qua 4G không nghe được" thì biết ngay
        // nhìn vào đâu.
        console.warn('[gọi] TURN chưa cấu hình — gọi qua 4G nhiều khả năng hỏng');
      }
      return ds;
    } catch {
      // Mất mạng lúc hỏi thì vẫn thử bằng STUN công khai, còn hơn không gọi được.
      return [{ urls: 'stun:stun.l.google.com:19302' }];
    }
  }

  private async dungPeer(): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection({ iceServers: await this.layIceServers() });

    pc.onicecandidate = (e) => {
      if (!e.candidate) return;
      // ⚠️ Chưa có mã cuộc gọi thì XẾP HÀNG, KHÔNG vứt.
      //
      // Máy chủ sinh `callId` và báo về bằng `call:ringing`, nhưng ICE bắt
      // đầu bay ra ngay sau `createOffer` — sớm hơn vài trăm mili giây. Bản
      // trước `return` thẳng ở đây nên người gọi vứt sạch ứng viên của mình:
      // báo hiệu xong xuôi mà hai bên KHÔNG BAO GIỜ nghe được nhau.
      if (!this.callId) { this.iceGuiCho.push(e.candidate.toJSON()); return; }
      getSocket()?.emit('call:ice', { callId: this.callId, candidate: e.candidate.toJSON() });
    };

    // Tiếng của người kia về.
    pc.ontrack = (e) => {
      if (e.streams[0]) this.su.coTiengNoi(e.streams[0]);
    };

    pc.oniceconnectionstatechange = () => {
      const t = pc.iceConnectionState;
      if (t === 'connected' || t === 'completed') {
        this.thuNoiLai = false;
        this.su.doiTrangThai('dang-noi');
      }
      if (t === 'failed') {
        // Thử nối lại MỘT lần trước khi báo đứt: chuyển Wi-Fi↔4G hay sóng
        // chập một nhịp là chuyện thường, cúp máy ngay thì quá vội.
        if (!this.thuNoiLai) {
          this.thuNoiLai = true;
          console.warn('[gọi] đường mạng hỏng — thử nối lại');
          pc.restartIce();
          return;
        }
        this.su.loi('Mất kết nối với người kia.');
        this.cupMay();
      }
    };

    this.pc = pc;
    return pc;
  }

  /** Xin micro. Tách riêng vì đây là chỗ hay bị từ chối, và lời báo lỗi phải
   *  nói rõ cách bật lại chứ không chỉ "không truy cập được". */
  private async xinMicro(): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false,
      });
    } catch (e) {
      const ten = (e as Error)?.name;
      throw new Error(
        ten === 'NotAllowedError'
          ? 'Bạn chưa cho phép dùng micro. Bấm vào biểu tượng khoá trên thanh địa chỉ để bật lại.'
          : ten === 'NotFoundError'
            ? 'Không tìm thấy micro nào trên máy này.'
            : 'Không mở được micro.',
      );
    }
  }

  // ── Gọi đi ───────────────────────────────────────────────────
  async goi(threadId: number, toUserId: number): Promise<void> {
    this.threadId = threadId;
    this.benKia = toUserId;
    this.daDon = false;
    try {
      this.luongCuaToi = await this.xinMicro();
      const pc = await this.dungPeer();
      this.luongCuaToi.getTracks().forEach((t) => pc.addTrack(t, this.luongCuaToi!));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      getSocket()?.emit('call:offer', { threadId, toUserId, sdp: offer });
      this.su.doiTrangThai('dang-goi');
    } catch (e) {
      this.su.loi((e as Error).message);
      this.don();
    }
  }

  // ── Có người gọi tới ─────────────────────────────────────────
  chuanBiNhan(callId: string, threadId: number, fromUserId: number, sdp: RTCSessionDescriptionInit): void {
    this.callId = callId;
    this.threadId = threadId;
    this.benKia = fromUserId;
    this.sdpCho = sdp;
    this.daDon = false;
    this.su.doiTrangThai('do-chuong');
  }
  private sdpCho: RTCSessionDescriptionInit | null = null;

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
      getSocket()?.emit('call:answer', { callId: this.callId, sdp: answer });
      // KHÔNG báo 'dang-noi' ở đây. Gửi lời đáp xong không có nghĩa là đã
      // nghe được nhau — ICE còn phải bắt cặp xong. Báo sớm thì đồng hồ chạy
      // trong khi hai bên im lặng, đúng thứ người dùng gặp: một bên đếm 0:38
      // còn bên kia vẫn "Đang gọi…". `oniceconnectionstatechange` mới là chỗ
      // biết thật, và nó đã lo việc này.
    } catch (e) {
      this.su.loi((e as Error).message);
      this.tuChoi();
    }
  }

  // ── Bên kia bắt máy ──────────────────────────────────────────
  async benKiaDaNhan(sdp: RTCSessionDescriptionInit): Promise<void> {
    if (!this.pc) return;
    await this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
    this.daCoMoTaXa = true;
    await this.doIceDangCho();
  }

  async themIce(c: RTCIceCandidateInit): Promise<void> {
    // ⚠️ Thêm ICE trước khi có mô tả xa là ném lỗi. Xếp hàng, đổ sau.
    if (!this.pc || !this.daCoMoTaXa) { this.iceChoXuLy.push(c); return; }
    try { await this.pc.addIceCandidate(new RTCIceCandidate(c)); } catch { /* ứng viên hỏng — bỏ */ }
  }

  private async doIceDangCho(): Promise<void> {
    const ds = this.iceChoXuLy;
    this.iceChoXuLy = [];
    for (const c of ds) {
      try { await this.pc?.addIceCandidate(new RTCIceCandidate(c)); } catch { /* bỏ */ }
    }
  }

  /** Máy chủ vừa cho biết mã cuộc gọi — đổ hết ứng viên đang xếp hàng đi. */
  datCallId(id: string): void {
    this.callId = id;
    const ds = this.iceGuiCho;
    this.iceGuiCho = [];
    for (const c of ds) getSocket()?.emit('call:ice', { callId: id, candidate: c });
  }

  // ── Kết thúc ─────────────────────────────────────────────────
  tuChoi(): void {
    if (this.callId) getSocket()?.emit('call:reject', { callId: this.callId });
    this.don();
  }

  cupMay(): void {
    if (this.callId) getSocket()?.emit('call:end', { callId: this.callId });
    this.don();
  }

  /** Dọn tài nguyên. Gọi được nhiều lần — bốn đường kết thúc đều đi qua đây,
   *  và quên tắt micro là đèn micro của trình duyệt sáng mãi sau khi cúp. */
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
    this.iceGuiCho = [];
    this.daCoMoTaXa = false;
    this.thuNoiLai = false;
    this.su.doiTrangThai('roi');
  }

  tatMicro(tat: boolean): void {
    this.luongCuaToi?.getAudioTracks().forEach((t) => { t.enabled = !tat; });
  }
}
