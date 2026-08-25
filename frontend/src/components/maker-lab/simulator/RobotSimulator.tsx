'use client';

/**
 * ============================================================
 * MÔ PHỎNG ROBOT — hai mắt, màn ngực, bánh xích, mic, loa
 * ============================================================
 *
 * Trình duyệt giả làm bo ESP32 và nối vào ĐÚNG cổng thiết bị thật. Máy
 * chủ không biết đây là mô phỏng: cùng LLM, cùng TTS, cùng gác từ đánh
 * thức, cùng hàng đợi lệnh. Không có nhánh "nếu là mô phỏng thì…" nào ở
 * phía máy chủ — đó là điều làm nó đáng tin.
 *
 * Hai màn vẽ bằng bản port nguyên văn của `face.cpp` và `eyes.cpp`, nên
 * thứ thấy ở đây là thứ sẽ thấy trên kính. Sửa khuôn mặt ở trình duyệt
 * rồi chép số ngược sang C là việc chép, không phải dịch.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Hand, Loader2, Mic, MicOff, Play, Power, Send, Square } from 'lucide-react';

import { xinVeMoPhong } from '@/lib/maker-lab-api';
import { ManNguc } from './manNguc';
import { HaiMat, TEN_EXPR } from './haiMat';
import { ThietBiAo, type LenhRobot, type TrangThaiNoi } from './thietBiAo';
import { BA_TAY, TEN_TAY, TroOanTuTi, type Tay } from './oanTuTi';

interface DongNhatKy {
  luc: string;
  huong: 'vao' | 'ra' | 'he';
  chu: string;
}

/** Trạng thái vật lý mô phỏng của thân robot. */
interface ThanRobot {
  x: number; y: number; goc: number; // goc theo radian
  tocTrai: number; tocPhai: number;
  denToi: number; // millis, 0 = đứng yên mãi
  led: string | null;
}

const TRUC = 0.13;      // khoảng cách hai bánh xích, mét — đo trên vỏ thật
const MET_MOI_DV = 0.0016; // 1 đơn vị tốc độ ≈ 1,6 mm/s, ước lượng thô

export function RobotSimulator({ deviceId }: { deviceId: number }) {
  const refMatT = useRef<HTMLCanvasElement>(null);
  const refMatP = useRef<HTMLCanvasElement>(null);
  const refNguc = useRef<HTMLCanvasElement>(null);
  const refSan = useRef<HTMLCanvasElement>(null);

  const ngucRef = useRef<ManNguc | null>(null);
  const matRef = useRef<HaiMat | null>(null);
  const tbRef = useRef<ThietBiAo | null>(null);
  const thanRef = useRef<ThanRobot>({
    x: 0, y: 0, goc: -Math.PI / 2, tocTrai: 0, tocPhai: 0, denToi: 0, led: null,
  });
  const vetRef = useRef<Array<[number, number]>>([]);
  const amRef = useRef<HTMLAudioElement | null>(null);
  const phanTichRef = useRef<AnalyserNode | null>(null);
  /**
   * MỘT `AudioContext` dùng chung, mở bằng CỬ CHỈ NGƯỜI DÙNG.
   *
   * ⚠️ Bản đầu dựng context MỚI cho mỗi câu nói. Trình duyệt tạo context
   * ở trạng thái `suspended` và chỉ cho `resume()` trong một cử chỉ của
   * người dùng — mà `say_end` đến từ WebSocket, không phải từ cú bấm
   * nào. Kết quả: `play()` bị từ chối, robot im, và log chỉ có một dòng
   * "trình duyệt chặn tự phát" nghe như lỗi vặt.
   *
   * Mở một lần ngay trong nút "Nối vào máy chủ" thì mọi câu sau đó phát
   * được, vì context đã ở trạng thái `running` từ trước.
   */
  const ctxRef = useRef<AudioContext | null>(null);

  const troRef = useRef<TroOanTuTi | null>(null);

  /**
   * Màn ngực là bề mặt HÀNH ĐỘNG, không phải khuôn mặt thứ ba.
   *
   * Hai màn tròn đã lo cảm xúc; màn ngực lo thứ robot đang LÀM. `mat`
   * giữ lại chỉ để đối chiếu với firmware hiện tại — bo đang chạy vẫn
   * vẽ mặt ở đó, và sẽ còn vẽ cho tới khi phần này chép sang C.
   */
  const [cheDoNguc, setCheDoNguc] = useState<'tro' | 'mat'>('tro');
  const cheDoRef = useRef(cheDoNguc);
  cheDoRef.current = cheDoNguc;

  const [trangThai, setTrangThai] = useState<TrangThaiNoi>('tat');
  const [dangXin, setDangXin] = useState(false);
  const [micBat, setMicBat] = useState(false);
  const [chu, setChu] = useState('');
  const [nhatKy, setNhatKy] = useState<DongNhatKy[]>([]);
  const [loiThoai, setLoiThoai] = useState<Array<{ role: string; text: string }>>([]);

  const ghi = useCallback((huong: DongNhatKy['huong'], chuNoiDung: string) => {
    const luc = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    setNhatKy((cu) => [{ luc, huong, chu: chuNoiDung }, ...cu].slice(0, 200));
  }, []);

  // ─── Dựng hai bộ vẽ + vòng khung hình ──────────────────
  useEffect(() => {
    const cT = refMatT.current?.getContext('2d');
    const cP = refMatP.current?.getContext('2d');
    const cN = refNguc.current?.getContext('2d');
    if (!cT || !cP || !cN) return;

    ngucRef.current = new ManNguc(cN, 480, 320);
    matRef.current = new HaiMat(cT, cP);
    const tro = new TroOanTuTi();
    // Kết quả ván đổi luôn biểu cảm hai mắt — không có nó thì robot
    // thắng thua gì mặt cũng trơ, mà đó chính là thứ làm trò trở nên
    // đáng chơi.
    tro.onKetQua = (k) => {
      matRef.current?.setByName(k === 'thua' ? 'excited' : k === 'thang' ? 'sad' : 'confused', 2600);
    };
    troRef.current = tro;

    let huy = 0;
    let truoc = performance.now();
    const khung = (now: number) => {
      const dt = Math.min(0.1, (now - truoc) / 1000);
      truoc = now;

      // Biên độ tiếng đang phát → đồng tử nảy theo, đúng như firmware
      // lấy từ `audio::level()`.
      const pt = phanTichRef.current;
      if (pt) {
        const buf = new Uint8Array(pt.fftSize);
        pt.getByteTimeDomainData(buf);
        let dinh = 0;
        for (const v of buf) dinh = Math.max(dinh, Math.abs(v - 128));
        // Quy về thang thô của firmware (0..~30000) để dùng chung phép
        // nén log trong `HaiMat.setLevel`, khỏi có hai công thức.
        matRef.current?.setLevel((dinh / 128) * 30000);
      } else {
        matRef.current?.setLevel(0);
      }

      capNhatThan(dt);
      const nguc = ngucRef.current;
      if (nguc) {
        if (cheDoRef.current === 'tro') troRef.current?.loop(nguc.g, now);
        else nguc.loop(now);
      }
      matRef.current?.loop(now);
      veSan();
      huy = requestAnimationFrame(khung);
    };
    huy = requestAnimationFrame(khung);
    return () => cancelAnimationFrame(huy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Mô hình chuyển động vi sai ────────────────────────
  const capNhatThan = (dt: number) => {
    const t = thanRef.current;
    if (t.denToi && performance.now() > t.denToi) {
      t.tocTrai = 0;
      t.tocPhai = 0;
      t.denToi = 0;
    }
    if (t.tocTrai === 0 && t.tocPhai === 0) return;
    // Xích vi sai: vận tốc thẳng là trung bình hai bên, vận tốc góc là
    // hiệu chia cho khoảng cách trục. Đây là mô hình đúng cho xe xích
    // trên mặt phẳng, bỏ qua trượt — mà xích thì trượt nhiều khi quay,
    // nên góc ở đây LẠC QUAN hơn ngoài đời.
    const v = ((t.tocTrai + t.tocPhai) / 2) * MET_MOI_DV;
    const w = ((t.tocPhai - t.tocTrai) * MET_MOI_DV) / TRUC;
    t.goc += w * dt;
    t.x += Math.cos(t.goc) * v * dt;
    t.y += Math.sin(t.goc) * v * dt;
    const vet = vetRef.current;
    const cuoi = vet[vet.length - 1];
    if (!cuoi || Math.hypot(cuoi[0] - t.x, cuoi[1] - t.y) > 0.01) {
      vet.push([t.x, t.y]);
      if (vet.length > 600) vet.shift();
    }
  };

  const veSan = () => {
    const c = refSan.current?.getContext('2d');
    if (!c) return;
    const { width: w, height: h } = c.canvas;
    const t = thanRef.current;
    const PX = 260; // pixel mỗi mét

    c.fillStyle = '#0b0f14';
    c.fillRect(0, 0, w, h);

    // Lưới 10 cm, trôi theo robot để thấy được là nó ĐANG đi
    c.strokeStyle = 'rgba(120,180,255,0.13)';
    c.lineWidth = 1;
    const buoc = 0.1 * PX;
    const oX = ((-t.x * PX) % buoc + buoc) % buoc;
    const oY = ((-t.y * PX) % buoc + buoc) % buoc;
    for (let x = oX; x < w; x += buoc) {
      c.beginPath(); c.moveTo(x + 0.5, 0); c.lineTo(x + 0.5, h); c.stroke();
    }
    for (let y = oY; y < h; y += buoc) {
      c.beginPath(); c.moveTo(0, y + 0.5); c.lineTo(w, y + 0.5); c.stroke();
    }

    const cx = w / 2, cy = h / 2;
    // Vệt đã đi
    const vet = vetRef.current;
    if (vet.length > 1) {
      c.strokeStyle = 'rgba(0,220,255,0.5)';
      c.lineWidth = 2;
      c.beginPath();
      vet.forEach(([vx, vy], i) => {
        const px = cx + (vx - t.x) * PX, py = cy + (vy - t.y) * PX;
        if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
      });
      c.stroke();
    }

    // Thân robot: mũi tên chỉ hướng
    c.save();
    c.translate(cx, cy);
    c.rotate(t.goc);
    c.fillStyle = t.led ?? '#22d3ee';
    c.beginPath();
    c.moveTo(16, 0); c.lineTo(-11, 10); c.lineTo(-6, 0); c.lineTo(-11, -10);
    c.closePath(); c.fill();
    c.restore();
  };

  // ─── Lệnh từ máy chủ ───────────────────────────────────
  const chayLenh = useCallback((l: LenhRobot) => {
    const p = l.payload ?? {};
    const so = (k: string, md = 0) => (typeof p[k] === 'number' ? (p[k] as number) : md);
    const t = thanRef.current;

    switch (l.type) {
      case 'face': {
        const ten = String(p.emotion ?? 'neutral');
        const ms = so('ms', 3000);
        // Màn ngực chỉ biết 10 tên; hai mắt biết 28. Tên lạ vẫn phải
        // xuống mắt — đúng như `face::setByName()` làm.
        ngucRef.current?.setByName(ten, ms);
        matRef.current?.setByName(ten, ms);
        ghi('vao', `face · ${ten} · ${ms}ms`);
        break;
      }
      case 'look':
        ngucRef.current?.look(so('x'), so('y'));
        matRef.current?.look(so('x'), so('y'));
        ghi('vao', `look · x=${so('x')} y=${so('y')}`);
        break;
      case 'move': {
        const l2 = so('left'), r2 = so('right'), ms = so('ms');
        t.tocTrai = l2; t.tocPhai = r2;
        t.denToi = ms ? performance.now() + ms : 0;
        ghi('vao', `move · ${l2}/${r2} · ${ms || '∞'}ms`);
        break;
      }
      case 'stop':
        t.tocTrai = 0; t.tocPhai = 0; t.denToi = 0;
        ghi('vao', 'stop');
        break;
      case 'turn': {
        // Quay tại chỗ: hai bánh ngược chiều. Thời gian suy ra từ góc,
        // để mô phỏng dừng đúng lúc thay vì quay mãi.
        const deg = so('deg'), toc = so('speed', 160);
        const w = (2 * toc * MET_MOI_DV) / TRUC; // rad/s
        const ms = w > 0 ? Math.abs((deg * Math.PI) / 180) / w * 1000 : 0;
        const dau = deg >= 0 ? 1 : -1;
        t.tocTrai = -dau * toc; t.tocPhai = dau * toc;
        t.denToi = performance.now() + ms;
        ghi('vao', `turn · ${deg}° · ${toc}`);
        break;
      }
      case 'led': {
        const mau = typeof p.color === 'string' ? (p.color as string) : null;
        t.led = mau;
        ghi('vao', `led · ${mau ?? '—'} · ${String(p.effect ?? '')}`);
        break;
      }
      default:
        ghi('vao', `${l.type} · ${JSON.stringify(p)}`);
    }
  }, [ghi]);

  // ─── Nối / ngắt ────────────────────────────────────────
  const noi = useCallback(async () => {
    setDangXin(true);
    // Mở loa NGAY TRONG cú bấm — đây là cử chỉ người dùng duy nhất chắc
    // chắn có, và trình duyệt chỉ cho mở âm thanh từ trong một cử chỉ.
    try {
      if (!ctxRef.current) ctxRef.current = new AudioContext();
      if (ctxRef.current.state === 'suspended') await ctxRef.current.resume();
    } catch {
      /* không mở được thì vẫn nối, chỉ là không nghe được tiếng */
    }
    try {
      const ve = await xinVeMoPhong(deviceId);
      if (ve.dangOnline) {
        const ok = window.confirm(
          'Bo THẬT đang nối vào thiết bị này.\n\n' +
            'Cổng chỉ giữ một kết nối cho mỗi thiết bị, nên mở mô phỏng sẽ ' +
            'ĐÁ BO RA (nó sẽ tự nối lại khi bạn ngắt mô phỏng).\n\nTiếp tục?',
        );
        if (!ok) { setDangXin(false); return; }
      }
      const tb = new ThietBiAo({
        onTrangThai: setTrangThai,
        onLenh: chayLenh,
        onLoiThoai: (role, text) => {
          setLoiThoai((cu) => [...cu, { role, text }].slice(-40));
          ghi('vao', `${role}: ${text}`);
        },
        onNoiBatDau: (mime) => {
          ngucRef.current?.setByName('speaking');
          matRef.current?.setByName('speaking');
          ghi('vao', `say_start · ${mime}`);
        },
        onNoiXong: (am) => {
          ghi('vao', `say_end · ${(am.size / 1024).toFixed(1)} KB`);
          phat(am);
        },
        onNhatKy: (d) => ghi('vao', d),
        onLoi: (m) => ghi('he', `⚠ ${m}`),
      });
      tbRef.current = tb;
      tb.noi(ve.ticket);
      ngucRef.current?.setStatus(true, true);
      matRef.current?.setStatus(true, true);
      ghi('he', `xin vé xong, đang nối · thiết bị #${ve.deviceId}`);
    } catch (e) {
      ghi('he', `⚠ xin vé thất bại: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setDangXin(false);
    }
  }, [deviceId, chayLenh, ghi]);

  const ngat = useCallback(() => {
    tbRef.current?.ngat();
    tbRef.current = null;
    setMicBat(false);
    ngucRef.current?.setStatus(false, false);
    matRef.current?.setStatus(false, false);
    ghi('he', 'đã ngắt');
  }, [ghi]);

  useEffect(() => () => tbRef.current?.ngat(), []);

  // ─── Loa ───────────────────────────────────────────────
  const phat = (am: Blob) => {
    // Máy chủ gửi 0 byte = TTS không sinh được tiếng. Gần như luôn là
    // dự án chưa chọn giọng đọc. Nói thẳng ra thay vì để người dùng ngồi
    // đoán tại sao robot im — chữ vẫn hiện nên nó rất giống lỗi loa.
    if (am.size === 0) {
      ghi('he', '⚠ máy chủ gửi 0 byte tiếng — dự án của thiết bị này CHƯA CHỌN GIỌNG ĐỌC (tab Tính cách)');
      ngucRef.current?.setByName('neutral');
      matRef.current?.setByName('confused', 1800);
      return;
    }
    const url = URL.createObjectURL(am);
    const a = new Audio(url);
    amRef.current = a;
    // Nối qua AnalyserNode để đo biên độ THẬT của tiếng đang phát, thay
    // vì đoán theo độ dài chuỗi. Đây đúng là thứ firmware làm với
    // `audio::level()`, nên đồng tử nảy giống hệt.
    try {
      const ctx = ctxRef.current;
      if (ctx) {
        const src = ctx.createMediaElementSource(a);
        const pt = ctx.createAnalyser();
        pt.fftSize = 512;
        src.connect(pt);
        pt.connect(ctx.destination);
        phanTichRef.current = pt;
      }
    } catch {
      /* không đo được thì vẫn phát, chỉ là mắt không nảy */
    }
    a.onended = () => {
      phanTichRef.current = null;
      URL.revokeObjectURL(url);
      ngucRef.current?.setByName('neutral');
      matRef.current?.setByName('neutral');
    };
    void a.play().catch(() => ghi('he', '⚠ trình duyệt chặn tự phát — bấm vào trang rồi thử lại'));
  };

  // ─── Gửi lượt ──────────────────────────────────────────
  const guiChu = () => {
    const s = chu.trim();
    if (!s || !tbRef.current) return;
    tbRef.current.guiChu(s);
    setLoiThoai((cu) => [...cu, { role: 'user', text: s }].slice(-40));
    ghi('ra', `text: ${s}`);
    setChu('');
    ngucRef.current?.setByName('thinking');
    matRef.current?.setByName('thinking');
  };

  const doiMic = async () => {
    const tb = tbRef.current;
    if (!tb) return;
    if (micBat) {
      const byte = tb.dungMic();
      setMicBat(false);
      ghi('ra', `audio_end · ${byte} byte`);
      if (byte < ThietBiAo.NGUONG_BYTE) {
        ghi('he', `⚠ dưới ${ThietBiAo.NGUONG_BYTE} byte — máy chủ BỎ QUA lượt này (quá ngắn)`);
      } else {
        ngucRef.current?.setByName('thinking');
        matRef.current?.setByName('thinking');
      }
    } else {
      try {
        await tb.batMic();
        setMicBat(true);
        ghi('ra', 'audio_start');
        ngucRef.current?.setByName('listening');
        matRef.current?.setByName('listening');
      } catch (e) {
        ghi('he', `⚠ không mở được mic: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  };

  const daNoi = trangThai === 'da-noi';

  return (
    <div className="space-y-4">
      {/* Thanh nối */}
      <div
        className="flex flex-wrap items-center gap-3 rounded-xl border p-3"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
      >
        <button
          onClick={daNoi ? ngat : noi}
          disabled={dangXin}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: daNoi ? '#dc2626' : '#0ea5e9' }}
        >
          {dangXin ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} />}
          {daNoi ? 'Ngắt' : 'Nối vào máy chủ'}
        </button>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span
            className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
            style={{ background: daNoi ? '#22c55e' : '#6b7280' }}
          />
          {daNoi ? `đang nối · thiết bị #${deviceId}` : 'chưa nối'}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* ─── Thân robot ─── */}
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: 'var(--border-color)', background: '#05070a' }}
        >
          <div className="flex justify-center gap-6">
            <canvas ref={refMatT} width={240} height={240}
              className="rounded-full" style={{ width: 150, height: 150 }} />
            <canvas ref={refMatP} width={240} height={240}
              className="rounded-full" style={{ width: 150, height: 150 }} />
          </div>
          <div className="mt-4 flex justify-center">
            <canvas ref={refNguc} width={480} height={320}
              className="rounded-lg" style={{ width: 384, height: 256 }} />
          </div>
          <div className="mt-4 flex justify-center">
            <canvas ref={refSan} width={480} height={200}
              className="rounded-lg" style={{ width: 384, height: 160 }} />
          </div>
          <p className="mt-2 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
            Hai mắt GC9A01 240×240 · màn ngực ILI9488 480×320 · nhìn từ trên xuống
          </p>
        </div>

        {/* ─── Điều khiển ─── */}
        <div className="space-y-4">
          <div
            className="rounded-xl border p-3"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          >
            <div className="flex gap-2">
              <input
                value={chu}
                onChange={(e) => setChu(e.target.value)}
                onKeyDown={(e) => {
                  // Nhường phím cho bộ gõ tiếng Việt: Enter lúc đang ghép
                  // chữ là chọn từ, không phải gửi.
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) guiChu();
                }}
                placeholder="Nói gì đó với robot…"
                disabled={!daNoi}
                className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: 'var(--border-color)',
                  background: 'var(--bg-input, transparent)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                onClick={guiChu}
                disabled={!daNoi || !chu.trim()}
                className="rounded-lg px-3 py-2 text-white disabled:opacity-40"
                style={{ background: '#0ea5e9' }}
                aria-label="Gửi"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={doiMic}
                disabled={!daNoi}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
                style={{ background: micBat ? '#dc2626' : '#334155' }}
              >
                {micBat ? <MicOff size={16} /> : <Mic size={16} />}
                {micBat ? 'Dừng ghi' : 'Nói bằng mic'}
              </button>
              <button
                onClick={() => tbRef.current?.catLoi()}
                disabled={!daNoi}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-40"
                style={{ background: '#475569' }}
              >
                <Square size={14} /> Cắt lời
              </button>
            </div>
            <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Gõ chữ đi thẳng vào não robot, bỏ qua khâu nhận dạng tiếng nói — nhanh
              hơn và lặp lại được y hệt, hợp cho việc dạy tính cách. Mic để kiểm
              chính khâu nhận dạng.
            </p>
          </div>

          {/* Màn ngực: chọn vai */}
          <div
            className="rounded-xl border p-3"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: 'var(--text-primary)' }}>
                <Hand size={14} /> Màn ngực
              </div>
              <div className="flex gap-1">
                {(['tro', 'mat'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setCheDoNguc(m)}
                    className="rounded px-2 py-1 text-xs"
                    style={{
                      background: cheDoNguc === m ? '#0ea5e9' : 'transparent',
                      color: cheDoNguc === m ? '#fff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {m === 'tro' ? 'Oẳn tù tì' : 'Khuôn mặt (bản cũ)'}
                  </button>
                ))}
              </div>
            </div>

            {cheDoNguc === 'tro' ? (
              <>
                <div className="flex gap-2">
                  {BA_TAY.map((t: Tay) => (
                    <button
                      key={t}
                      onClick={() => troRef.current?.chon(t)}
                      className="flex-1 rounded-lg px-3 py-2 text-sm font-semibold text-white"
                      style={{ background: '#334155' }}
                    >
                      {TEN_TAY[t]}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Bấm một tay là vào ván ngay. Odin bốc <strong>ngẫu nhiên thuần</strong> — cho
                  nó đoán thói quen thì nó thắng mãi, cho nó chọn sau khi biết tay bạn thì đó
                  là gian lận, và người chơi nhận ra sau vài ván dù không chứng minh được.
                </p>
              </>
            ) : (
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Đây là thứ firmware ĐANG chạy: một khuôn mặt đầy đủ trên màn ngực, trong khi
                hai màn tròn cũng là mắt — ba con mắt trên một con robot. Di sản từ hồi robot
                chỉ có một màn.
              </p>
            )}
          </div>

          {/* Thử biểu cảm không cần máy chủ */}
          <div
            className="rounded-xl border p-3"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"
              style={{ color: 'var(--text-primary)' }}>
              <Play size={14} /> Thử 28 biểu cảm
            </div>
            <div className="flex flex-wrap gap-1">
              {TEN_EXPR.map((ten) => (
                <button
                  key={ten}
                  onClick={() => {
                    ngucRef.current?.setByName(ten);
                    matRef.current?.setByName(ten);
                  }}
                  className="rounded border px-2 py-1 text-xs"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  {ten}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Chạy thẳng trên bản vẽ, không cần nối máy chủ. Màn ngực chỉ biết 10
              tên đầu; 18 tên còn lại chỉ hai mắt hiện được — đúng như trên bo.
            </p>
          </div>

          {/* Lời thoại */}
          {loiThoai.length > 0 && (
            <div
              className="max-h-52 space-y-2 overflow-y-auto rounded-xl border p-3"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
            >
              {loiThoai.map((d, i) => (
                <div key={i} className="text-sm">
                  <span className="font-semibold" style={{ color: d.role === 'user' ? '#0ea5e9' : '#22c55e' }}>
                    {d.role === 'user' ? 'Bạn' : 'Robot'}:
                  </span>{' '}
                  <span style={{ color: 'var(--text-primary)' }}>{d.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Nhật ký giao thức */}
          <div
            className="max-h-72 overflow-y-auto rounded-xl border p-3 font-mono text-xs"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          >
            {nhatKy.length === 0 ? (
              <span style={{ color: 'var(--text-secondary)' }}>Chưa có gì.</span>
            ) : (
              nhatKy.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <span style={{ color: 'var(--text-secondary)' }}>{d.luc}</span>
                  <span style={{ color: d.huong === 'ra' ? '#0ea5e9' : d.huong === 'he' ? '#f59e0b' : '#22c55e' }}>
                    {d.huong === 'ra' ? '↑' : d.huong === 'he' ? '·' : '↓'}
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>{d.chu}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
