/**
 * Bàn DJ — hai mâm, crossfader, lọc, echo, và dàn đèn chạy theo NHẠC THẬT.
 *
 * ─── Vì sao ở đây có phổ tần THẬT còn trang Nhạc thì không ───
 * Trang Nhạc phát bằng thẻ <audio> trỏ vào URL của máy chủ. Đưa một thẻ như vậy
 * qua `createMediaElementSource` là dính luật khác-nguồn-gốc: đồ thị nhận toàn
 * số 0, và tệ hơn, ở vài trường hợp cả bài phát ra IM LẶNG. Nên ở đó dải nhịp
 * chỉ là trang trí — nói thẳng trong mã, không giả vờ.
 *
 * Bàn DJ này nạp nhạc theo đường HOÀN TOÀN khác: tải nguyên file về bộ nhớ
 * (`fetch` có kèm token) rồi `decodeAudioData`. Đã là AudioBuffer thì không còn
 * khái niệm nguồn gốc nữa — phân tích phổ, đổi tốc độ, lọc, vang… đều thật.
 *
 * ─── Ba chỗ dễ làm sai với AudioBufferSourceNode ───
 *  1. Nó dùng MỘT LẦN. `stop()` rồi thì không `start()` lại được — phải tạo cái
 *     mới và tự nhớ đang ở giây thứ mấy. Đó là lý do có `viTri`/`mocThoiGian`.
 *  2. `playbackRate` đổi thì cách quy đổi thời gian trôi cũng đổi theo. Cộng dồn
 *     bằng `(ctx.currentTime - mocThoiGian) * tocDo` chứ không phải trừ trần.
 *  3. AudioContext bị trình duyệt treo ở trạng thái 'suspended' cho tới khi có
 *     thao tác người dùng. Phải `resume()` trong chính cú bấm, không thì mâm
 *     quay mà không ra tiếng.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Disc3, Headphones, Loader2, Pause, Play, RotateCcw } from 'lucide-react';
import { useSession } from '../../auth/session';
import { clock, laBaiYouTube, type Track } from './player';

interface MamState {
  track: Track | null;
  dangNap: boolean;
  dangPhat: boolean;
  viTri: number;
  tocDo: number;
  loc: number;    // -1 = lọc trầm (bịt cao) · 0 = thẳng · +1 = lọc bổng (bịt trầm)
  echo: number;   // 0..1
  /** Đang làm gì ở mâm này — hiện ngay trên mâm, không đẩy ra ô lỗi chung. */
  ghiChu: string | null;
}

const MAM_MOI: MamState = {
  track: null, dangNap: false, dangPhat: false, viTri: 0, tocDo: 1, loc: 0, echo: 0, ghiChu: null,
};

/** Một mâm: nguồn phát + chuỗi hiệu ứng riêng, đổ vào crossfader chung. */
interface MamNode {
  buffer: AudioBuffer | null;
  source: AudioBufferSourceNode | null;
  gain: GainNode;
  filter: BiquadFilterNode;
  delay: DelayNode;
  phanHoi: GainNode;
  echoGain: GainNode;
  analyser: AnalyserNode;
  mocThoiGian: number;
}

export function RemixDeck({ baiRemix, baiThuong }: { baiRemix: Track[]; baiThuong: Track[] }) {
  const tracks = [...baiRemix, ...baiThuong];
  const { api } = useSession();
  const ctxRef = useRef<AudioContext | null>(null);
  const mamRef = useRef<Record<'A' | 'B', MamNode | null>>({ A: null, B: null });
  const masterRef = useRef<{ analyser: AnalyserNode; gain: GainNode } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [mamA, setMamA] = useState<MamState>(MAM_MOI);
  const [mamB, setMamB] = useState<MamState>(MAM_MOI);
  const [crossfade, setCrossfade] = useState(0.5);
  const [loi, setLoi] = useState<string | null>(null);
  const [mucTinHieu, setMucTinHieu] = useState<{ A: number; B: number }>({ A: 0, B: 0 });

  const dat = (ten: 'A' | 'B') => (ten === 'A' ? setMamA : setMamB);
  const doc = (ten: 'A' | 'B') => (ten === 'A' ? mamA : mamB);

  /** Dựng đồ thị âm thanh một lần, khi có thao tác đầu tiên của người dùng. */
  const bemDoThi = useCallback((): AudioContext => {
    if (ctxRef.current) return ctxRef.current;
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const masterGain = ctx.createGain();
    const masterAnalyser = ctx.createAnalyser();
    masterAnalyser.fftSize = 256;
    masterAnalyser.smoothingTimeConstant = 0.78;
    masterGain.connect(masterAnalyser);
    masterAnalyser.connect(ctx.destination);
    masterRef.current = { analyser: masterAnalyser, gain: masterGain };

    for (const ten of ['A', 'B'] as const) {
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'allpass';
      const delay = ctx.createDelay(1.2);
      delay.delayTime.value = 0.32;
      const phanHoi = ctx.createGain();
      phanHoi.gain.value = 0.35;
      const echoGain = ctx.createGain();
      echoGain.gain.value = 0;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;

      // khô: filter → gain → master
      filter.connect(gain);
      gain.connect(analyser);
      gain.connect(masterGain);
      // ướt: filter → delay ⇄ phản hồi → echoGain → master
      filter.connect(delay);
      delay.connect(phanHoi);
      phanHoi.connect(delay);
      delay.connect(echoGain);
      echoGain.connect(masterGain);

      gain.gain.value = ten === 'A' ? 0.5 : 0.5;
      mamRef.current[ten] = {
        buffer: null, source: null, gain, filter, delay, phanHoi, echoGain, analyser, mocThoiGian: 0,
      };
    }
    return ctx;
  }, []);

  // ─── Dàn đèn: vẽ theo dữ liệu phổ THẬT ───────────────────
  useEffect(() => {
    let nhip = 0;
    const ve = () => {
      rafRef.current = requestAnimationFrame(ve);
      const canvas = canvasRef.current;
      const master = masterRef.current;
      if (!canvas || !master) return;
      const ctx2d = canvas.getContext('2d');
      if (!ctx2d) return;

      const rong = canvas.clientWidth;
      const cao = canvas.clientHeight;
      // Vẽ theo pixel THẬT của màn hình, không thì trên màn Retina nét vẽ nhoè.
      const ty = window.devicePixelRatio || 1;
      if (canvas.width !== Math.round(rong * ty)) { canvas.width = Math.round(rong * ty); canvas.height = Math.round(cao * ty); }
      ctx2d.setTransform(ty, 0, 0, ty, 0, 0);
      ctx2d.clearRect(0, 0, rong, cao);

      const n = master.analyser.frequencyBinCount;
      const du = new Uint8Array(n);
      master.analyser.getByteFrequencyData(du);

      /* Sàn gương: cột vẽ ở nửa trên, bóng lộn ngược mờ dần ở nửa dưới. Đây là
       * thứ làm nó ra "dàn đèn sân khấu" thay vì một biểu đồ cột — và rẻ hơn
       * hẳn so với đổ bóng thật. */
      const day = Math.round(cao * 0.62);

      // Lưới mờ phía sau, để lúc im lặng khung không trống trơn.
      ctx2d.strokeStyle = 'rgba(255,255,255,0.045)';
      ctx2d.lineWidth = 1;
      for (let y = day; y > 0; y -= Math.max(12, day / 5)) {
        ctx2d.beginPath(); ctx2d.moveTo(0, y); ctx2d.lineTo(rong, y); ctx2d.stroke();
      }

      nhip += 0.045;
      const soCot = 44;
      const buoc = Math.max(1, Math.floor(n / soCot));
      const rongCot = rong / soCot;
      for (let i = 0; i < soCot; i++) {
        let tong = 0;
        for (let j = 0; j < buoc; j++) tong += du[i * buoc + j] ?? 0;
        let muc = (tong / buoc) / 255;
        // Im lặng thì thở nhẹ — dàn đèn tắt ngóm trông như hỏng.
        if (muc < 0.02) muc = 0.03 + 0.022 * Math.abs(Math.sin(nhip + i * 0.4));
        const h = Math.max(2, muc * day);
        const x = i * rongCot;
        const w = Math.max(1, rongCot - 3);

        const grad = ctx2d.createLinearGradient(0, day, 0, day - h);
        grad.addColorStop(0, 'rgba(56,189,248,0.95)');
        grad.addColorStop(0.5, 'rgba(129,90,246,0.95)');
        grad.addColorStop(1, 'rgba(236,72,153,0.95)');
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(x + 1, day - h, w, h);

        if (muc > 0.08) {
          ctx2d.fillStyle = 'rgba(255,255,255,0.9)';
          ctx2d.fillRect(x + 1, day - h - 2, w, 2);
        }

        // Bóng phản chiếu
        const bong = ctx2d.createLinearGradient(0, day, 0, day + h * 0.75);
        bong.addColorStop(0, 'rgba(129,90,246,0.30)');
        bong.addColorStop(1, 'rgba(129,90,246,0)');
        ctx2d.fillStyle = bong;
        ctx2d.fillRect(x + 1, day, w, h * 0.75);
      }
    };
    rafRef.current = requestAnimationFrame(ve);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);

  /* Mức tín hiệu từng mâm, 20 lần/giây.
   * Không đọc trong vòng vẽ canvas (60fps) vì mỗi lần đọc là một lần `setState`
   * — 60 lần dựng lại React mỗi giây cho hai cái cột thì không đáng. */
  useEffect(() => {
    const id = setInterval(() => {
      const ra = { A: 0, B: 0 };
      for (const ten of ['A', 'B'] as const) {
        const node = mamRef.current[ten];
        if (!node) continue;
        const n = node.analyser.frequencyBinCount;
        const du = new Uint8Array(n);
        node.analyser.getByteFrequencyData(du);
        let tong = 0;
        for (let i = 0; i < n; i++) tong += du[i] ?? 0;
        ra[ten] = Math.min(1, (tong / n) / 140);
      }
      setMucTinHieu((cu) => (cu.A === ra.A && cu.B === ra.B ? cu : ra));
    }, 50);
    return () => clearInterval(id);
  }, []);

  // Đồng hồ vị trí — đọc từ AudioContext, nguồn thời gian duy nhất đáng tin.
  useEffect(() => {
    const id = setInterval(() => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      for (const ten of ['A', 'B'] as const) {
        const node = mamRef.current[ten];
        const st = ten === 'A' ? mamA : mamB;
        if (!node || !st.dangPhat) continue;
        const troi = (ctx.currentTime - node.mocThoiGian) * st.tocDo;
        dat(ten)((cu) => ({ ...cu, viTri: Math.min(cu.viTri + troi, node.buffer?.duration ?? 0) }));
        node.mocThoiGian = ctx.currentTime;
      }
    }, 250);
    return () => clearInterval(id);
  }, [mamA.dangPhat, mamB.dangPhat, mamA.tocDo, mamB.tocDo]);

  // Dọn khi rời trang: AudioContext không tự chết, để lại là còn tiếng.
  useEffect(() => () => {
    for (const ten of ['A', 'B'] as const) { try { mamRef.current[ten]?.source?.stop(); } catch { /* đã dừng */ } }
    void ctxRef.current?.close();
    ctxRef.current = null;
  }, []);

  // ─── Nạp một bài vào mâm ────────────────────────────────
  const nap = async (ten: 'A' | 'B', track: Track) => {
    if (!api) return;
    const ctx = bemDoThi();
    const node = mamRef.current[ten];
    if (!node) return;

    dat(ten)((cu) => ({ ...cu, track, dangNap: true, dangPhat: false, viTri: 0 }));
    setLoi(null);
    try { node.source?.stop(); } catch { /* chưa chạy */ }
    node.source = null;

    const layNhac = () => fetch(`${api.baseUrlForForms()}/api/v1/music/stream/${track.id}`, {
      headers: api.authHeaders(), credentials: 'omit', redirect: 'follow',
    });

    try {
      dat(ten)((cu) => ({ ...cu, ghiChu: 'Đang tải nhạc…' }));
      let res = await layNhac();

      /* ⚠️ CẢ KHO REMIX ĐỀU LÀ LINK YOUTUBE — đo thật 18/08/2026: cả 7 bài
       * `category=REMIX` đều có `audioUrl` trỏ vào youtube.com, và
       * `GET /music/stream/:id` của chúng trả **400** (bài thường trả 200).
       * Web phát được vì nó dùng khung nhúng YouTube; bàn DJ thì cần mẫu âm
       * thanh thật để phân tích phổ và đổi tốc độ, khung nhúng không cho.
       *
       * Nên gặp đúng loại đó thì bảo máy chủ rút âm thanh về R2 rồi tải lại —
       * chính là việc người dùng vẫn làm bằng tay ở trang Nhạc, chỉ là ở đây
       * bàn DJ tự làm. Sau lần đầu thì bài đã có file thật, nạp là tức thì. */
      if (!res.ok && laBaiYouTube(track)) {
        dat(ten)((cu) => ({ ...cu, ghiChu: 'Bài lấy từ YouTube — đang rút âm thanh về máy chủ (10-60 giây)…' }));
        const rut = await fetch(
          `${api.baseUrlForForms()}/api/v1/music/tracks/${track.id}/download-audio`,
          { method: 'POST', headers: { ...api.authHeaders(), 'Content-Type': 'application/json' }, body: '{}' },
        );
        if (!rut.ok) {
          const chiTiet = await rut.json().catch(() => null) as { message?: string } | null;
          throw new Error(
            rut.status === 403
              ? 'Bài này lấy từ YouTube và chỉ tài khoản quản trị mới rút được âm thanh về máy chủ.'
              : chiTiet?.message ?? `Rút âm thanh thất bại (${rut.status})`,
          );
        }
        dat(ten)((cu) => ({ ...cu, ghiChu: 'Đang tải nhạc…' }));
        res = await layNhac();
      }

      if (!res.ok) throw new Error(`Máy chủ trả về ${res.status}`);
      const buf = await res.arrayBuffer();
      dat(ten)((cu) => ({ ...cu, ghiChu: 'Đang giải mã…' }));
      node.buffer = await ctx.decodeAudioData(buf);
      dat(ten)((cu) => ({ ...cu, dangNap: false, ghiChu: null }));
    } catch (e) {
      dat(ten)((cu) => ({ ...cu, dangNap: false, track: null, ghiChu: null }));
      setLoi(`Không nạp được "${track.title}": ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const phat = async (ten: 'A' | 'B') => {
    const ctx = bemDoThi();
    // Trình duyệt treo context tới khi có thao tác người dùng — mở khoá NGAY
    // trong cú bấm này, không thì mâm quay mà im tiếng.
    if (ctx.state === 'suspended') await ctx.resume();
    const node = mamRef.current[ten];
    const st = doc(ten);
    if (!node?.buffer) return;

    if (st.dangPhat) {
      try { node.source?.stop(); } catch { /* đã dừng */ }
      node.source = null;
      dat(ten)((cu) => ({ ...cu, dangPhat: false }));
      return;
    }

    const src = ctx.createBufferSource();
    src.buffer = node.buffer;
    src.playbackRate.value = st.tocDo;
    src.connect(node.filter);
    src.onended = () => { dat(ten)((cu) => (cu.dangPhat ? { ...cu, dangPhat: false } : cu)); };
    src.start(0, Math.min(st.viTri, node.buffer.duration - 0.05));
    node.source = src;
    node.mocThoiGian = ctx.currentTime;
    dat(ten)((cu) => ({ ...cu, dangPhat: true }));
  };

  const veDau = (ten: 'A' | 'B') => {
    const node = mamRef.current[ten];
    if (!node) return;
    try { node.source?.stop(); } catch { /* đã dừng */ }
    node.source = null;
    dat(ten)((cu) => ({ ...cu, viTri: 0, dangPhat: false }));
  };

  const doiTocDo = (ten: 'A' | 'B', v: number) => {
    dat(ten)((cu) => ({ ...cu, tocDo: v }));
    const node = mamRef.current[ten];
    if (node?.source) node.source.playbackRate.value = v;
  };

  /**
   * Một núm cho CẢ HAI kiểu lọc.
   *
   * Trái = lọc thông thấp (bịt dần tiếng cao), phải = lọc thông cao (bịt dần
   * tiếng trầm), giữa = tắt hẳn bằng `allpass`. Đây đúng là cách núm FILTER của
   * mixer thật hoạt động, và nó tránh được việc bày ra hai núm mà lúc nào cũng
   * có một cái vô nghĩa.
   */
  const doiLoc = (ten: 'A' | 'B', v: number) => {
    dat(ten)((cu) => ({ ...cu, loc: v }));
    const node = mamRef.current[ten];
    if (!node) return;
    if (Math.abs(v) < 0.04) { node.filter.type = 'allpass'; return; }
    if (v < 0) {
      node.filter.type = 'lowpass';
      // Thang loga: tai người nghe theo bội, không theo hiệu.
      node.filter.frequency.value = 20000 * Math.pow(0.0035, -v);
    } else {
      node.filter.type = 'highpass';
      node.filter.frequency.value = 20 * Math.pow(500, v);
    }
  };

  const doiEcho = (ten: 'A' | 'B', v: number) => {
    dat(ten)((cu) => ({ ...cu, echo: v }));
    const node = mamRef.current[ten];
    if (node) node.echoGain.gain.value = v * 0.8;
  };

  const doiCross = (v: number) => {
    setCrossfade(v);
    const a = mamRef.current.A;
    const b = mamRef.current.B;
    // Đường cong căn bậc hai: đứng giữa thì tổng năng lượng không bị hụt — đây
    // là chỗ crossfader tuyến tính nghe "tụt tiếng" ở khoảng giữa.
    if (a) a.gain.gain.value = Math.sqrt(1 - v);
    if (b) b.gain.gain.value = Math.sqrt(v);
  };

  const mam = (ten: 'A' | 'B') => {
    const st = doc(ten);
    const muc = mucTinHieu[ten];
    const dai = mamRef.current[ten]?.buffer?.duration ?? st.track?.durationSeconds ?? 0;
    return (
      <div className="ct-dj-mam" data-ten={ten}>
        <div className="ct-dj-mam-top">
          <span className="ct-dj-nhan">MÂM {ten}</span>
          <span className="ct-dj-thoigian">{clock(st.viTri)} / {clock(dai)}</span>
        </div>

        <div className="ct-dj-dia-hang">
          {/* Cột mức tín hiệu — đọc từ analyser RIÊNG của mâm này, nên nó cho
              biết mâm nào đang ra tiếng kể cả khi crossfader đã kéo hẳn sang
              bên kia. */}
          <span className="ct-dj-vu" aria-hidden><i style={{ height: `${Math.round(muc * 100)}%` }} /></span>
          <div className={`ct-dj-dia${st.dangPhat ? ' is-quay' : ''}`}>
            {st.track?.coverImage
              ? <img src={st.track.coverImage} alt="" />
              : <span className="ct-dj-dia-trong"><Disc3 size={30} /></span>}
            <span className="ct-dj-dia-truc" />
          </div>
          <div className="ct-dj-mam-tin">
            <p className="ct-dj-ten">{st.track?.title ?? 'Chưa nạp bài nào'}</p>
            <p className="ct-dj-si">{st.track?.artist ?? '—'}</p>
            {st.ghiChu && <p className="ct-dj-ghi">{st.ghiChu}</p>}
            <div className="ct-dj-nut">
              <button
                type="button"
                className="ct-pbtn ct-pbtn-main"
                onClick={() => void phat(ten)}
                disabled={!st.track || st.dangNap}
                aria-label={st.dangPhat ? `Dừng mâm ${ten}` : `Phát mâm ${ten}`}
              >
                {st.dangNap ? <Loader2 size={18} className="ct-spin" aria-hidden />
                  : st.dangPhat ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
              </button>
              <button
                type="button"
                className="ct-pbtn"
                onClick={() => veDau(ten)}
                disabled={!st.track}
                aria-label={`Về đầu bài mâm ${ten}`}
                title="Về đầu bài"
              >
                <RotateCcw size={16} aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <label className="ct-dj-num">
          <span>TỐC ĐỘ <b>{st.tocDo === 1 ? '0.0%' : `${st.tocDo > 1 ? '+' : ''}${((st.tocDo - 1) * 100).toFixed(1)}%`}</b></span>
          <input type="range" min={0.7} max={1.3} step={0.01} value={st.tocDo}
            style={{ ['--ct-progress' as string]: `${((st.tocDo - 0.7) / 0.6) * 100}%` }}
            onChange={(e) => doiTocDo(ten, Number(e.target.value))} />
        </label>

        <label className="ct-dj-num">
          <span>LỌC <b>{st.loc === 0 ? 'thẳng' : st.loc < 0 ? 'trầm' : 'bổng'}</b></span>
          <input type="range" min={-1} max={1} step={0.02} value={st.loc}
            style={{ ['--ct-progress' as string]: `${((st.loc + 1) / 2) * 100}%` }}
            onChange={(e) => doiLoc(ten, Number(e.target.value))} />
        </label>

        <label className="ct-dj-num">
          <span>VANG <b>{Math.round(st.echo * 100)}%</b></span>
          <input type="range" min={0} max={1} step={0.02} value={st.echo}
            style={{ ['--ct-progress' as string]: `${st.echo * 100}%` }}
            onChange={(e) => doiEcho(ten, Number(e.target.value))} />
        </label>

        <div className="ct-dj-chon">
          <select
            value={st.track?.id ?? ''}
            onChange={(e) => {
              const t = tracks.find((x) => String(x.id) === e.target.value);
              if (t) void nap(ten, t);
            }}
            aria-label={`Chọn bài cho mâm ${ten}`}
          >
            <option value="">— chọn bài —</option>
            {baiRemix.length > 0 && (
              <optgroup label="Kho Remix">
                {baiRemix.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
              </optgroup>
            )}
            {baiThuong.length > 0 && (
              <optgroup label="Thư viện">
                {baiThuong.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
              </optgroup>
            )}
          </select>
        </div>
      </div>
    );
  };

  return (
    <section className="ct-dj" aria-label="Bàn DJ">
      <div className="ct-dj-den">
        <canvas ref={canvasRef} className="ct-dj-canvas" />
        <span className="ct-dj-den-nhan"><Headphones size={13} aria-hidden /> ĐÈN CHẠY THEO NHẠC THẬT</span>
      </div>

      <div className="ct-dj-ban">
        {mam('A')}

        <div className="ct-dj-giua">
          <span className="ct-dj-nhan">CROSSFADER</span>
          <input
            type="range" min={0} max={1} step={0.01} value={crossfade}
            className="ct-dj-cross"
            style={{ ['--ct-progress' as string]: `${crossfade * 100}%` }}
            onChange={(e) => doiCross(Number(e.target.value))}
            aria-label="Crossfader giữa mâm A và mâm B"
          />
          <div className="ct-dj-cross-nhan"><span>A</span><span>B</span></div>
        </div>

        {mam('B')}
      </div>

      {loi && <div className="ct-notice" data-tone="err"><span>{loi}</span></div>}
      <p className="ct-muted ct-dj-ghichu">
        Nhạc ở bàn DJ được tải nguyên bài về bộ nhớ rồi mới phát, nên đổi tốc độ và lọc không
        làm méo tiếng. Bài dài có thể mất vài giây để nạp.
      </p>
    </section>
  );
}
